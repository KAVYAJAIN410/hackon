import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../ui/SkeletonCard';
import EmptyState from '../ui/EmptyState';
import api from '../../lib/api';
import { useUser } from '../../context/UserContext';

export default function ProductGrid({ filters }) {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { currentUser } = useUser();

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    setError(null);
    api.get('/marketplace')
      .then((data) => setProducts(data))
      .catch((err) => { console.error('Failed to load marketplace:', err); setError(err.message); })
      .finally(() => setIsLoading(false));
  }, [currentUser?.id]);

  if (isLoading) {
    return (
      <section className="flex-grow">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex-grow">
        <EmptyState
          icon="error"
          title="Could not load products"
          description={`Error: ${error}. Make sure the backend is running on port 5000.`}
          action={{ label: 'Try Again', to: '/marketplace' }}
        />
      </section>
    );
  }

  // Filter products — check if any of their available grades match the filter
  const filtered = (products || []).filter(item => {
    // Grade filter: product passes if at least one of its grades is in the filter
    const gradeOk = !filters?.grades?.length || item.availableGrades.some(g => filters.grades.includes(g.grade));
    // Price filter: use the default selling price
    const price = item.defaultSellingPrice || 0;
    const [min, max] = filters?.priceRange || [0, Infinity];
    const priceOk = !filters?.priceRange || (price >= min && price <= max);
    return gradeOk && priceOk;
  });

  if (!isLoading && (!filtered || filtered.length === 0)) {
    return (
      <section className="flex-grow">
        <EmptyState
          icon="inventory_2"
          title="No products available in your area right now"
          description="Check back soon — new certified refurbished products are listed daily from Amazon returns near you."
          action={{ label: 'Browse All Categories', to: '/marketplace' }}
        />
      </section>
    );
  }

  return (
    <section className="flex-grow">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
        {filtered.map(item => (
          <ProductCard
            key={item.productId}
            id={item.productId}
            title={item.product?.name || 'Unknown Product'}
            price={item.defaultSellingPrice || 0}
            grade={`Grade ${item.defaultGrade}`}
            image={item.product?.imageUrl || ''}
            baseValue={item.mrp || 0}
            logisticsCost={item.defaultShipping?.totalShipping || 0}
            savesCO2={item.discountPct ? (item.discountPct * 0.1).toFixed(1) : '0.5'}
            isNearYou={item.isNearYou}
            estimatedDays={item.defaultShipping?.estimatedDays}
            availableGrades={item.availableGrades}
            totalQuantity={item.totalQuantity}
          />
        ))}
      </div>
    </section>
  );
}
