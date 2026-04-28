import React from 'react';
import HeroCarousel from '../components/home/HeroCarousel';
import CategoryGrid from '../components/home/CategoryGrid';
import BestSellers from '../components/home/BestSellers';
import RecentProducts from '../components/home/RecentProducts';
import PromoStrip from '../components/home/PromoStrip';

const Home = () => {
  return (
    <>
      <HeroCarousel />
      <PromoStrip />
      <CategoryGrid />
      <BestSellers />
      <RecentProducts />
    </>
  );
};

export default Home;
