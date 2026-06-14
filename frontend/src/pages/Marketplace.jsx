import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MarketplaceHeader from '../components/marketplace/MarketplaceHeader';
import FiltersSidebar from '../components/marketplace/FiltersSidebar';
import ProductGrid from '../components/marketplace/ProductGrid';

export default function Marketplace() {
  const [filters, setFilters] = useState({ grades: ['A+', 'A', 'B'], priceRange: null });

  return (
    <div className="min-h-screen font-body-md text-on-surface bg-[#EAEDED] flex flex-col">
      <Header />
      <MarketplaceHeader />
      <main className="flex-grow max-w-[1500px] w-full mx-auto px-5 py-6 flex flex-col md:flex-row gap-6">
        <FiltersSidebar filters={filters} onChange={setFilters} />
        <ProductGrid filters={filters} />
      </main>
      <Footer />
    </div>
  );
}
