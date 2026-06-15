import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { SkeletonBox } from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import { useUser } from '../context/UserContext';
import api from '../lib/api';

export default function OutgrownIt() {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [listingOrder, setListingOrder] = useState(null);
  const [listingResult, setListingResult] = useState(null);
  const [listingError, setListingError] = useState(null);
  const { currentUser } = useUser();

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    api.get('/orders')
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [currentUser?.id]);

  const handleListOutgrown = async (order) => {
    if (!currentUser) return;
    setListingOrder(order.id);
    setListingError(null);
    try {
      const result = await api.post('/outgrown', { orderId: order.id });
      setListingResult(result);
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, hasActiveOutgrown: true } : o));
    } catch (err) {
      setListingError(err.message || 'Failed to list item');
    } finally {
      setListingOrder(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <span className="material-symbols-outlined text-5xl text-[#565959] block mb-3">account_circle</span>
            <h2 className="text-xl font-bold text-[#0F1111] mb-2">Sign in to view your orders</h2>
            <p className="text-[#565959]">You need to be signed in to use Trade-In.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-[1000px] mx-auto px-4 md:px-8 py-8 space-y-4">
            <SkeletonBox className="h-8 w-48 mb-4" />
            {Array.from({length:3}).map((_,i) => (
              <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex gap-4 items-start">
                  <SkeletonBox className="w-24 h-24 flex-shrink-0 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <SkeletonBox className="h-3 w-32" />
                    <SkeletonBox className="h-5 w-48" />
                    <SkeletonBox className="h-3 w-24" />
                    <SkeletonBox className="h-3 w-20" />
                  </div>
                  <SkeletonBox className="h-9 w-28 rounded-lg flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <EmptyState
            icon="shopping_bag"
            title="No past orders found"
            description="Once you receive and use an Amazon order, you can list it here for other buyers to purchase — giving it a second life."
            action={{ label: 'Browse Certified Refurbished', to: '/marketplace' }}
            color="text-[#2DC071]"
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="max-w-[1000px] mx-auto px-gutter py-8">

            <div className="flex flex-col gap-2 mb-6">
              <nav className="flex text-body-sm font-body-sm text-secondary">
                <span>Your Account</span>
                <span className="mx-2">›</span>
                <span className="text-on-primary-container font-medium">Your Orders</span>
              </nav>
              <h1 className="text-display-lg font-display-lg text-on-background">Your Orders</h1>
            </div>

            <div className="flex border-b border-border-subtle mb-6 gap-8">
              <button className="pb-3 border-b-2 border-primary-container text-label-bold font-label-bold text-on-background">Orders</button>
              <button className="pb-3 text-label-bold font-label-bold text-secondary hover:text-on-background">Buy Again</button>
              <button className="pb-3 text-label-bold font-label-bold text-secondary hover:text-on-background">Not Yet Shipped</button>
              <button className="pb-3 text-label-bold font-label-bold text-secondary hover:text-on-background">Cancelled</button>
            </div>

            {/* Listing Success Banner */}
            {listingError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded p-3 text-sm text-red-700 flex justify-between items-center">
                <span>Failed to list item: {listingError}</span>
                <button onClick={() => setListingError(null)} className="text-red-500 hover:text-red-700 ml-4">✕</button>
              </div>
            )}
            {listingResult && (
              <div className="mb-6 bg-[#F0FDF4] border border-[#2DC071]/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#2DC071] text-[28px]">check_circle</span>
                  <div>
                    <h3 className="font-bold text-[#0F1111] mb-1">{listingResult.message}</h3>
                    <div className="flex gap-4 text-sm text-[#565959]">
                      <span>Selling Price: <strong className="text-[#0F1111]">₹{listingResult.inventoryItem?.sellingPrice?.toLocaleString()}</strong></span>
                      <span>Green Credits: <strong className="text-[#2DC071]">+{listingResult.creditsAwarded}</strong></span>
                      <span>Demand: <strong className="text-[#FF9900]">{listingResult.demandSignal} interested buyers</strong></span>
                    </div>
                  </div>
                  <button onClick={() => setListingResult(null)} className="ml-auto text-[#565959] hover:text-[#0F1111]">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-6">
              {orders.map((order) => {
                const orderDate = new Date(order.orderedAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'long', year: 'numeric'
                });
                const product = order.product || {};
                const isEligible = order.outgrownEligible && !order.hasActiveOutgrown && !order.hasActiveReturn;
                const isListing = listingOrder === order.id;

                return (
                  <div key={order.id} className={`border border-border-subtle rounded-lg bg-white overflow-hidden shadow-sm ${!isEligible && order.source !== 'REFURBISHED' ? 'opacity-60' : ''}`}>
                    {/* Order header */}
                    <div className="bg-surface-container py-3 px-6 flex flex-wrap justify-between items-center text-body-sm font-body-sm text-secondary">
                      <div className="flex gap-10">
                        <div className="flex flex-col">
                          <span className="uppercase font-semibold text-[10px]">Order Placed</span>
                          <span className="text-on-background">{orderDate}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="uppercase font-semibold text-[10px]">Total</span>
                          <span className="text-on-background">
                            ₹{parseFloat(order.totalPrice ?? product.mrp ?? 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="uppercase font-semibold text-[10px]">Status</span>
                          <span className={`font-bold ${
                            order.status === 'ONGOING' ? 'text-[#FF9900]' :
                            order.status === 'DELIVERED' ? 'text-[#067D62]' : 'text-on-background'
                          }`}>
                            {order.status === 'ONGOING' ? '🔄 Ongoing' : order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="uppercase font-semibold text-[10px]">Order # {order.orderNumber || order.id}</span>
                        {order.source === 'REFURBISHED' && (
                          <span className="mt-1 text-[10px] font-bold px-2 py-0.5 bg-[#F0FDF4] text-reloop-green rounded">
                            ♻️ Certified Refurbished{order.grade ? ` · Grade ${order.grade}` : ''}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order content */}
                    <div className="p-6">
                      <div className="flex gap-6">
                        <div className="w-24 h-24 flex-shrink-0">
                          {product.imageUrl ? (
                            <img alt={product.name} className="w-full h-full object-contain mix-blend-multiply" src={product.imageUrl} />
                          ) : (
                            <div className="w-full h-full bg-surface-container-low flex items-center justify-center rounded">
                              <span className="material-symbols-outlined text-secondary text-[40px]">inventory_2</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-grow flex justify-between">
                          <div className="flex flex-col gap-1">
                            <h3 className="text-title-lg font-title-lg text-primary hover:text-primary-container cursor-pointer">{product.name}</h3>
                            <p className="text-body-sm font-body-sm text-secondary">
                              {order.source === 'REFURBISHED'
                                ? (order.status === 'ONGOING' ? 'Your refurbished order is being processed' : `Status: ${order.status}`)
                                : order.status === 'DELIVERED' ? `Delivered ${orderDate}` : `Status: ${order.status}`}
                            </p>
                            {order.monthsSinceOrder && (
                              <p className="text-body-sm text-secondary">Owned for {Math.round(order.monthsSinceOrder)} months</p>
                            )}
                            {order.source !== 'REFURBISHED' && (
                              <div className="mt-4 flex flex-wrap gap-2">
                                <Link to={`/return-flow`}>
                                  <button className="bg-white border border-border-subtle px-4 py-1.5 rounded-full text-label-bold font-label-bold shadow-sm hover:bg-surface-container-low active:scale-95 transition-all">
                                    Return or replace
                                  </button>
                                </Link>
                              </div>
                            )}
                          </div>
                          {order.source !== 'REFURBISHED' && (
                            <div className="hidden md:flex flex-col gap-2 w-48">
                              <Link to={`/return-flow`}>
                                <button className="w-full bg-white border border-border-subtle py-1.5 rounded-lg text-body-sm font-medium hover:bg-surface-container-low">
                                  Return or replace items
                                </button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Outgrown It CTA */}
                      {isEligible && (
                        <div className="mt-8 border border-reloop-green/30 rounded-lg reloop-card-gradient p-5 flex items-center justify-between group transition-all hover:border-reloop-green/60">
                          <div className="flex gap-4 items-start">
                            <div className="bg-reloop-green/10 p-2 rounded-lg">
                              <span className="material-symbols-outlined text-reloop-green text-[32px]">recycling</span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-headline-md font-headline-md text-on-background">Outgrown It?</span>
                                <span className="bg-reloop-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded">ECO-RENEW</span>
                              </div>
                              <p className="text-body-md font-body-md text-secondary mt-1">
                                List this item on ReLoop marketplace and earn Green Credits!
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <button
                              onClick={() => handleListOutgrown(order)}
                              disabled={isListing}
                              className="bg-[#FF9900] text-amazon-dark px-8 py-2.5 rounded-lg text-label-bold font-label-bold shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[18px]">bolt</span>
                              {isListing ? 'Listing...' : 'List in 1 Click'}
                            </button>
                            <span className="text-body-sm font-body-sm text-secondary italic">We'll handle the pickup.</span>
                          </div>
                        </div>
                      )}

                      {order.hasActiveOutgrown && (
                        <div className="mt-4 bg-[#F0FDF4] border border-[#2DC071]/30 rounded-lg p-3 text-center">
                          <span className="text-[#2DC071] font-bold text-sm">✓ Already listed on ReLoop marketplace</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
