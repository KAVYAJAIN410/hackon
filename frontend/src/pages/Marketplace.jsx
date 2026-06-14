import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import MarketplaceHeader from '../components/marketplace/MarketplaceHeader';
import FiltersSidebar from '../components/marketplace/FiltersSidebar';
import ProductGrid from '../components/marketplace/ProductGrid';

export default function Marketplace() {
  const [filters, setFilters] = useState({ grades: ['A+', 'A', 'B'], priceRange: null });
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="min-h-screen font-body-md text-on-surface bg-[#EAEDED] flex flex-col">
      <Header />
      <MarketplaceHeader />
      <main className="flex-grow max-w-[1500px] w-full mx-auto px-5 py-6 flex flex-col md:flex-row gap-6">
        <div className="md:hidden">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 bg-white border border-[#D5D9D9] px-4 py-2 rounded text-sm font-bold mb-2">
            <span className="material-symbols-outlined text-base">tune</span>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        <FiltersSidebar filters={filters} onChange={setFilters} showMobile={showFilters} />
        <ProductGrid filters={filters} />
      </main>
      <Footer />
    </div>
  );
}
