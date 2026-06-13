import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StatCardSkeleton, SkeletonBox } from '../components/ui/SkeletonCard';

export default function GreenProfile() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

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
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({length:4}).map((_,i)=><StatCardSkeleton key={i}/>)}
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

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="flex-grow w-full max-w-container-max-width mx-auto px-margin-mobile md:px-margin-desktop py-6 md:py-8 space-y-6">

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Your Green Profile</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Track your environmental impact and earn rewards.</p>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

<div className="lg:col-span-1 space-y-6">

<div className="card p-6 relative overflow-hidden">
<div className="absolute -right-4 -top-4 opacity-10">
<span className="material-symbols-outlined text-[120px] text-reloop-green" data-icon="eco">eco</span>
</div>
<div className="relative z-10">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-reloop-green fill" data-icon="verified">verified</span>
<span className="font-label-bold text-label-bold text-on-surface-variant uppercase tracking-wider">Current Status</span>
</div>
<h2 className="font-price-lg text-price-lg text-on-surface mb-2">1,250 <span className="font-headline-sm text-headline-sm text-on-surface-variant">Credits</span></h2>
<div className="inline-flex items-center gap-1.5 bg-green-50 px-3 py-1 rounded-full border border-green-200 mb-6">
<span className="material-symbols-outlined text-reloop-green text-sm" data-icon="psychiatry">psychiatry</span>
<span className="font-label-bold text-label-bold text-reloop-green">Tier: Seedling</span>
</div>

<div className="space-y-2">
<div className="flex justify-between font-label-medium text-label-medium text-on-surface-variant">
<span>Progress to Sapling</span>
<span>1,250 / 2,000</span>
</div>
<div className="w-full bg-surface-variant rounded-full h-2.5">
<div className="bg-reloop-green h-2.5 rounded-full" ></div>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-2 text-right">750 credits remaining</p>
</div>
</div>
</div>

<div className="card p-6 space-y-4">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Ways to Earn</h3>
<button className="w-full btn-secondary font-label-bold text-label-bold py-2 px-4 flex items-center justify-center gap-2 hover:bg-green-700 transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="recycling">recycling</span> Start a Trade-In
                    </button>
<button className="w-full bg-surface border border-border-standard font-label-bold text-label-bold py-2 px-4 text-on-surface flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors rounded">
<span className="material-symbols-outlined text-sm" data-icon="local_mall">local_mall</span> Shop Certified Refurbished
                    </button>
</div>
</div>

<div className="lg:col-span-2 space-y-6">

<div className="card p-6">
<div className="flex items-center justify-between mb-4">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Unlocked Badges</h3>
<Link className="font-label-medium text-label-medium text-link-blue hover:underline" to="#">View All</Link>
</div>
<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
<div className="flex flex-col items-center justify-center p-4 bg-surface rounded border border-border-standard">
<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-reloop-green fill" data-icon="energy_savings_leaf">energy_savings_leaf</span>
</div>
<span className="font-label-bold text-label-bold text-center">First Recycle</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">May 2023</span>
</div>
<div className="flex flex-col items-center justify-center p-4 bg-surface rounded border border-border-standard">
<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-blue-600 fill" data-icon="devices">devices</span>
</div>
<span className="font-label-bold text-label-bold text-center">Tech Saver</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Aug 2023</span>
</div>
<div className="flex flex-col items-center justify-center p-4 bg-surface rounded border border-border-standard">
<div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-orange-600 fill" data-icon="local_shipping">local_shipping</span>
</div>
<span className="font-label-bold text-label-bold text-center">Zero Emissions</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Nov 2023</span>
</div>
<div className="flex flex-col items-center justify-center p-4 border border-dashed border-outline-variant rounded opacity-50 bg-surface-dim">
<div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="lock">lock</span>
</div>
<span className="font-label-bold text-label-bold text-center">Next Badge</span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Locked</span>
</div>
</div>
</div>

<div className="card overflow-hidden">
<div className="p-4 md:p-6 border-b border-border-standard flex items-center justify-between bg-surface-bright">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Activity</h3>
<button className="font-label-medium text-label-medium text-on-surface-variant hover:text-on-surface flex items-center gap-1">
<span className="material-symbols-outlined text-sm" data-icon="filter_list">filter_list</span> Filter
                        </button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface border-b border-border-standard font-label-bold text-label-bold text-on-surface-variant uppercase text-[11px] tracking-wider">
<th className="p-4 w-1/2">Transaction Details</th>
<th className="p-4 w-1/4">Date</th>
<th className="p-4 w-1/4 text-right">Credits Earned</th>
</tr>
</thead>
<tbody className="font-body-sm text-body-sm divide-y divide-border-standard bg-white">
<tr className="hover:bg-surface-bright transition-colors">
<td className="p-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface flex items-center justify-center border border-border-standard shrink-0">
<span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="smartphone">smartphone</span>
</div>
<div>
<p className="font-label-bold text-label-bold text-on-surface">iPhone 12 Trade-In</p>
<p className="text-on-surface-variant">Device Evaluation Completed</p>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Oct 24, 2023</td>
<td className="p-4 text-right font-label-bold text-label-bold text-reloop-green">+450</td>
</tr>
<tr className="hover:bg-surface-bright transition-colors">
<td className="p-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface flex items-center justify-center border border-border-standard shrink-0">
<span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="inventory_2">inventory_2</span>
</div>
<div>
<p className="font-label-bold text-label-bold text-on-surface">Purchased Refurbished Kindle</p>
<p className="text-on-surface-variant">Order #114-883920-112</p>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Sep 12, 2023</td>
<td className="p-4 text-right font-label-bold text-label-bold text-reloop-green">+200</td>
</tr>
<tr className="hover:bg-surface-bright transition-colors">
<td className="p-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface flex items-center justify-center border border-border-standard shrink-0">
<span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="local_shipping">local_shipping</span>
</div>
<div>
<p className="font-label-bold text-label-bold text-on-surface">Consolidated Shipping</p>
<p className="text-on-surface-variant">Amazon Delivery Day chosen</p>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Sep 05, 2023</td>
<td className="p-4 text-right font-label-bold text-label-bold text-reloop-green">+50</td>
</tr>
<tr className="hover:bg-surface-bright transition-colors">
<td className="p-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface flex items-center justify-center border border-border-standard shrink-0">
<span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="recycling">recycling</span>
</div>
<div>
<p className="font-label-bold text-label-bold text-on-surface">Recycled Electronics</p>
<p className="text-on-surface-variant">Dropped at Whole Foods Kiosk</p>
</div>
</div>
</td>
<td className="p-4 text-on-surface-variant">Aug 20, 2023</td>
<td className="p-4 text-right font-label-bold text-label-bold text-reloop-green">+550</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 border-t border-border-standard bg-surface-bright text-center">
<button className="font-label-medium text-label-medium text-link-blue hover:underline">View All History</button>
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
