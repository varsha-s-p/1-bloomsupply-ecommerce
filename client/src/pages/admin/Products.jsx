import React, { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct, getCategories } from '../../utils/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';

const emptyForm = { name: '', description: '', category: '', price: '', mrp: '', stock: '', unit: 'per piece', badge: '', images: [''], isAvailable: true };

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProducts = (p = 1) => {
    setLoading(true);
    getAllProducts({ page: p, limit: 20 })
      .then(({ data }) => {
        setProducts(data.products);
        setTotalPages(data.totalPages);
        setPage(data.page);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
    getCategories().then(({ data }) => setCategories(data)).catch(() => {});
  }, []);

  const openNew = () => {
    setEditId(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      description: p.description,
      category: p.category?._id || p.category,
      price: p.price,
      mrp: p.mrp || '',
      stock: p.stock,
      unit: p.unit,
      badge: p.badge || '',
      images: p.images?.length ? p.images : [''],
      isAvailable: p.isAvailable
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        mrp: form.mrp ? Number(form.mrp) : undefined,
        stock: Number(form.stock),
        images: form.images.filter(Boolean)
      };
      if (editId) {
        await updateProduct(editId, payload);
      } else {
        await createProduct(payload);
      }
      setModalOpen(false);
      fetchProducts(page);
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      fetchProducts(page);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-serif font-bold text-primary">Products</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-light transition-colors">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-border-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-surface text-text-muted text-xs uppercase tracking-wider">
                <th className="text-left p-4 font-medium">Product</th>
                <th className="text-left p-4 font-medium">Category</th>
                <th className="text-left p-4 font-medium">Price</th>
                <th className="text-left p-4 font-medium">Stock</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}><td colSpan={5} className="p-4"><div className="skeleton h-10 rounded-lg" /></td></tr>
                ))
              ) : (
                products.map(p => (
                  <tr key={p._id} className="border-b border-border-light last:border-0 hover:bg-surface/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <span className="font-medium text-primary truncate max-w-[200px]">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary">{p.category?.name || '-'}</td>
                    <td className="p-4 font-medium">{formatCurrency(p.price)}</td>
                    <td className="p-4">{p.stock}</td>
                    <td className="p-4 text-right">
                      <button onClick={() => openEdit(p)} className="text-text-muted hover:text-accent mr-2"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(p._id)} className="text-text-muted hover:text-error"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 border-t border-border-light">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => fetchProducts(i + 1)} className={`w-8 h-8 rounded-lg text-sm font-medium ${page === i + 1 ? 'bg-primary text-white' : 'text-text-secondary hover:bg-surface'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModalOpen(false)} />
          <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-primary">{editId ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-primary"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <InputField label="Name" value={form.name} onChange={(v) => setForm({...form, name: v})} />
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <SelectField label="Category" value={form.category} onChange={(v) => setForm({...form, category: v})} options={[{value:'',label:'Select'},...categories.map(c=>({value:c._id,label:c.name}))]} />
                <SelectField label="Unit" value={form.unit} onChange={(v) => setForm({...form, unit: v})} options={[{value:'per piece',label:'Per Piece'},{value:'per bunch',label:'Per Bunch'},{value:'per bouquet',label:'Per Bouquet'},{value:'per box',label:'Per Box'}]} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <InputField label="Price (₹)" type="number" value={form.price} onChange={(v) => setForm({...form, price: v})} />
                <InputField label="MRP (₹)" type="number" value={form.mrp} onChange={(v) => setForm({...form, mrp: v})} />
                <InputField label="Stock" type="number" value={form.stock} onChange={(v) => setForm({...form, stock: v})} />
              </div>
              <SelectField label="Badge" value={form.badge} onChange={(v) => setForm({...form, badge: v})} options={[{value:'',label:'None'},{value:'bestseller',label:'Bestseller'},{value:'new',label:'New'},{value:'sale',label:'Sale'},{value:'limited',label:'Limited'}]} />
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Image URLs</label>
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input value={img} onChange={(e) => { const imgs = [...form.images]; imgs[i] = e.target.value; setForm({...form, images: imgs}); }} placeholder="https://..." className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30" />
                    {form.images.length > 1 && <button onClick={() => setForm({...form, images: form.images.filter((_,idx) => idx !== i)})} className="text-error"><X size={16} /></button>}
                  </div>
                ))}
                <button type="button" onClick={() => setForm({...form, images: [...form.images, '']})} className="text-xs text-accent font-medium">+ Add image</button>
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-full font-semibold text-sm disabled:opacity-50">
                <Save size={16} />{saving ? 'Saving...' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div>
    <label className="block text-xs font-medium text-text-muted mb-1">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent" />
  </div>
);

const SelectField = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-xs font-medium text-text-muted mb-1">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

export default AdminProducts;
