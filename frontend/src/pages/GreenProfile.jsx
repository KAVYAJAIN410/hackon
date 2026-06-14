import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StatCardSkeleton, SkeletonBox } from '../components/ui/SkeletonCard';
import { useUser } from '../context/UserContext';
import api from '../lib/api';

export default function GreenProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { currentUser } = useUser();

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <span className="material-symbols-outlined text-5xl text-[#565959] block mb-3">account_circle</span>
            <h2 className="text-xl font-bold text-[#0F1111] mb-2">Sign in to view your Green Profile</h2>
            <p className="text-[#565959]">Track your environmental impact and green credits.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    api.get(`/green-credits?user_id=${currentUser.id}`)
      .then(setProfile)
      .catch((err) => console.error('Failed to load green profile:', err))
      .finally(() => setIsLoading(false));
  }, [currentUser?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-8">
            <SkeletonBox className="h-8 w-52 mb-2" />
            <SkeletonBox className="h-4 w-72 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
                  <SkeletonBox className="h-16 w-16 rounded-full mx-auto" />
                  <SkeletonBox className="h-10 w-32 mx-auto" />
                  <SkeletonBox className="h-4 w-full" />
                  <SkeletonBox className="h-3 w-full rounded-full" />
                </div>
              </div>
              <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm space-y-4">
                <SkeletonBox className="h-6 w-40 mb-4" />
                {Array.from({length:5}).map((_,i)=>(
                  <div key={i} className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <SkeletonBox className="h-4 w-40" />
                    <SkeletonBox className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const data = profile || { balance: 0, tier: 'SEEDLING', nextTier: 'SAPLING', nextTierAt: 1000, creditsNeeded: 1000, history: [], impact: { productsSecondLife: 0, co2SavedKg: 0 } };
  const progressPct = data.nextTierAt > 0 ? Math.min(((data.balance) / data.nextTierAt) * 100, 100) : 0;

  const tierIcons = {
    'SEEDLING': 'psychiatry',
    'SAPLING': 'park',
    'FOREST': 'forest',
    'GUARDIAN': 'shield',
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="flex-grow w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-8 space-y-6">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Your Green Profile</h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Welcome, {currentUser?.name}! Track your environmental impact and earn rewards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">

                {/* Credits Card */}
                <div className="card p-6 relative overflow-hidden bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="absolute -right-4 -top-4 opacity-10">
                    <span className="material-symbols-outlined text-[120px] text-reloop-green">eco</span>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-reloop-green">verified</span>
                      <span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Current Status</span>
                    </div>
                    <h2 className="font-price-lg text-price-lg text-on-surface mb-2">
                      {data.balance.toLocaleString()} <span className="font-headline-sm text-headline-sm text-on-surface-variant">Credits</span>
                    </h2>
                    <div className="inline-flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-200 mb-6">
                      <span className="material-symbols-outlined text-reloop-green text-sm">
                        {tierIcons[data.tier] || 'psychiatry'}
                      </span>
                      <span className="font-label-bold text-label-bold text-reloop-green">Tier: {data.tier}</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between font-label-medium text-label-medium text-on-surface-variant">
                        <span>Progress to {data.nextTier || 'Next Tier'}</span>
                        <span>{data.balance.toLocaleString()} / {data.nextTierAt?.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-surface-variant rounded-full h-2.5">
                        <div className="bg-reloop-green h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }}></div>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-right">
                        {data.creditsNeeded?.toLocaleString()} credits remaining
                      </p>
                    </div>
                  </div>
                </div>

                {/* Impact Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Your Impact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <span className="material-symbols-outlined text-reloop-green text-[28px]">recycling</span>
                      <p className="font-bold text-lg text-on-surface">{data.impact?.productsSecondLife || 0}</p>
                      <p className="text-xs text-on-surface-variant">Products Rehomed</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <span className="material-symbols-outlined text-blue-600 text-[28px]">cloud_done</span>
                      <p className="font-bold text-lg text-on-surface">{data.impact?.co2SavedKg || 0}kg</p>
                      <p className="text-xs text-on-surface-variant">CO2 Saved</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Ways to Earn</h3>
                  <Link to="/outgrown-it" className="w-full bg-reloop-green text-white font-label-bold text-label-bold py-2 px-4 flex items-center justify-center gap-2 hover:bg-green-700 transition-colors rounded mb-2">
                    <span className="material-symbols-outlined text-sm">recycling</span> Start a Trade-In
                  </Link>
                  <Link to="/marketplace" className="w-full bg-surface border border-border-standard font-label-bold text-label-bold py-2 px-4 text-on-surface flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors rounded">
                    <span className="material-symbols-outlined text-sm">local_mall</span> Shop Certified Refurbished
                  </Link>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">

                {/* Activity History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-4 md:p-6 border-b border-border-standard flex items-center justify-between bg-surface-bright">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">Credit History</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface border-b border-border-standard font-label-bold text-label-bold text-on-surface-variant uppercase text-[11px] tracking-wider">
                          <th className="p-4 w-1/2">Transaction Details</th>
                          <th className="p-4 w-1/4">Date</th>
                          <th className="p-4 w-1/4 text-right">Credits</th>
                        </tr>
                      </thead>
                      <tbody className="font-body-sm text-body-sm divide-y divide-border-standard bg-white">
                        {(data.history || []).length === 0 ? (
                          <tr>
                            <td colSpan={3} className="p-8 text-center text-on-surface-variant">
                              No credit history yet. Start earning by trading in or purchasing refurbished items!
                            </td>
                          </tr>
                        ) : (
                          data.history.map((entry) => (
                            <tr key={entry.id} className="hover:bg-surface-bright transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded bg-surface flex items-center justify-center border border-border-standard shrink-0">
                                    <span className="material-symbols-outlined text-on-surface-variant text-sm">
                                      {entry.action === 'PURCHASE_RELOOP' ? 'shopping_cart' :
                                       entry.action === 'RETURN_GRADE' ? 'recycling' :
                                       entry.action === 'OUTGROWN_LIST' ? 'storefront' : 'eco'}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="font-label-bold text-label-bold text-on-surface">{entry.description}</p>
                                    <p className="text-on-surface-variant text-xs">{entry.action?.replace('_', ' ')}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 text-on-surface-variant">
                                {new Date(entry.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="p-4 text-right font-label-bold text-label-bold text-reloop-green">
                                +{entry.amount}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
