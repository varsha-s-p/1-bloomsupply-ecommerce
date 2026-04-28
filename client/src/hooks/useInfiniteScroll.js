import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (fetchFn, options = {}) => {
  const { threshold = 300, enabled = true } = options;
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const initialLoad = useRef(true);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setError(null);
    setTotal(0);
    initialLoad.current = true;
  }, []);

  const loadMore = useCallback(async (pageNum) => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFn(pageNum);
      setItems(prev => pageNum === 1 ? result.products : [...prev, ...result.products]);
      setHasMore(result.hasMore);
      setTotal(result.total);
      setPage(pageNum + 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, loading, hasMore]);

  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      if (loading || !hasMore) return;

      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollTop + clientHeight >= scrollHeight - threshold) {
        loadMore(page);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, page, threshold, enabled, loadMore]);

  useEffect(() => {
    if (initialLoad.current && enabled) {
      initialLoad.current = false;
      loadMore(1);
    }
  }, [enabled]);

  return { items, loading, hasMore, error, total, reset, loadMore: () => loadMore(page) };
};

export default useInfiniteScroll;
