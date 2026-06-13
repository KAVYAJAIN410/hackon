import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ListCardSkeleton, SkeletonBox } from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';

export default function OutgrownIt() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasOrders] = useState(true); // set to false to see empty state

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

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

  if (!hasOrders) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <EmptyState
            icon="shopping_bag"
            title="No past orders eligible for resale"
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

<div className="flex flex-col gap-6">

<div className="border border-border-subtle rounded-lg bg-white overflow-hidden shadow-sm">

<div className="bg-surface-container py-3 px-6 flex flex-wrap justify-between items-center text-body-sm font-body-sm text-secondary">
<div className="flex gap-10">
<div className="flex flex-col">
<span className="uppercase font-semibold text-[10px]">Order Placed</span>
<span className="text-on-background">14 August 2023</span>
</div>
<div className="flex flex-col">
<span className="uppercase font-semibold text-[10px]">Total</span>
<span className="text-on-background">Rs. 3,299.00</span>
</div>
<div className="flex flex-col">
<span className="uppercase font-semibold text-[10px]">Ship To</span>
<span className="text-primary flex items-center gap-1 cursor-pointer">Arjun Sharma <span className="material-symbols-outlined text-[14px]">expand_more</span></span>
</div>
</div>
<div className="flex flex-col items-end">
<span className="uppercase font-semibold text-[10px]">Order # 405-1928374-1234567</span>
<div className="flex gap-3 text-primary mt-1">
<Link className="hover:underline" to="#">View order details</Link>
<span>|</span>
<Link className="hover:underline" to="#">Invoice</Link>
</div>
</div>
</div>

<div className="p-6">
<div className="flex gap-6">

<div className="w-24 h-24 flex-shrink-0">
<img alt="Mi 360 Security Camera" className="w-full h-full object-contain mix-blend-multiply" data-alt="A professional product shot of a sleek, white Mi 360 Security Camera against a clean, minimal white background. The camera has a spherical head with a black lens area and a sturdy white base. The lighting is soft and even, highlighting the smooth plastic texture and modern design of the device. High-density commercial photography style for an e-commerce catalog." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxnky5EU2n4V1FPEfMP9G7scY_Aaq34jBa3hQ-C-qKqcDGMszeYYOJHcAbGiD344NlZj33dDAKdbdxLIdSYSGIQBCJxWLGhJKRGUBDzDd3PL0uHQ1S2YSCOyBAfE374hEAIKTSrr_mk-dOj8NXqWwf2HdiEQJMqzeZeEPJEaB04yiC1VAIc5PslNqCUwXiigBGLTPxY0D7u3JZtpM9KgrdZVjycpT9GvCVZ-8ErK2haomUVkELR-VvZhdvOuYrIYFkOEO5BLsKDOs"/>
</div>

<div className="flex-grow flex justify-between">
<div className="flex flex-col gap-1">
<h3 className="text-title-lg font-title-lg text-primary hover:text-primary-container cursor-pointer">Mi 360 Home Security Camera 2K Pro (White) | 3MP | Dual-Band Wi-Fi | AI Human Detection</h3>
<p className="text-body-sm font-body-sm text-secondary">Return window closed on 24 Aug 2023</p>
<div className="mt-4 flex flex-wrap gap-2">
<button className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-full text-label-bold font-label-bold shadow-sm hover:opacity-90 active:scale-95 transition-all">Buy it again</button>
<button className="bg-white border border-border-subtle px-4 py-1.5 rounded-full text-label-bold font-label-bold shadow-sm hover:bg-surface-container-low active:scale-95 transition-all">View your item</button>
</div>
</div>
<div className="hidden md:flex flex-col gap-2 w-48">
<button className="w-full bg-white border border-border-subtle py-1.5 rounded-lg text-body-sm font-medium hover:bg-surface-container-low">Track package</button>
<button className="w-full bg-white border border-border-subtle py-1.5 rounded-lg text-body-sm font-medium hover:bg-surface-container-low">Return or replace items</button>
<button className="w-full bg-white border border-border-subtle py-1.5 rounded-lg text-body-sm font-medium hover:bg-surface-container-low">Share gift receipt</button>
<button className="w-full bg-white border border-border-subtle py-1.5 rounded-lg text-body-sm font-medium hover:bg-surface-container-low">Write a product review</button>
</div>
</div>
</div>

<div className="mt-8 border border-reloop-green/30 rounded-lg reloop-card-gradient p-5 flex items-center justify-between group transition-all hover:border-reloop-green/60">
<div className="flex gap-4 items-start">
<div className="bg-reloop-green/10 p-2 rounded-lg">
<span className="material-symbols-outlined text-reloop-green text-[32px]" >recycling</span>
</div>
<div className="flex flex-col">
<div className="flex items-center gap-2">
<span className="text-headline-md font-headline-md text-on-background">Outgrown It?</span>
<span className="bg-reloop-green text-white text-[10px] font-bold px-1.5 py-0.5 rounded">ECO-RENEW</span>
</div>
<p className="text-body-md font-body-md text-secondary mt-1">
<span className="font-bold text-on-background">47 parents</span> in Pune want a baby monitor right now. 
                                    Your camera is a perfect match.
                                </p>
<div className="flex items-center gap-4 mt-2">
<div className="flex items-center gap-1 text-reloop-green font-bold text-label-bold">
<span className="material-symbols-outlined text-[16px]">payments</span>
<span>AI Price Est: Rs. 1,200 - 1,500</span>
</div>
<div className="flex items-center gap-1 text-tertiary font-bold text-label-bold">
<span className="material-symbols-outlined text-[16px]">eco</span>
<span>Save 4.2kg CO2</span>
</div>
</div>
</div>
</div>
<div className="flex flex-col items-end gap-2">
<button className="bg-[#FF9900] text-amazon-dark px-8 py-2.5 rounded-lg text-label-bold font-label-bold shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">bolt</span>
                                List in 1 Click
                            </button>
<span className="text-body-sm font-body-sm text-secondary italic">We'll handle the pickup.</span>
</div>
</div>
</div>
</div>

<div className="border border-border-subtle rounded-lg bg-white overflow-hidden shadow-sm opacity-60">
<div className="bg-surface-container py-3 px-6 flex justify-between items-center text-body-sm font-body-sm text-secondary">
<div className="flex gap-10">
<div className="flex flex-col">
<span className="uppercase font-semibold text-[10px]">Order Placed</span>
<span className="text-on-background">02 July 2023</span>
</div>
<div className="flex flex-col">
<span className="uppercase font-semibold text-[10px]">Total</span>
<span className="text-on-background">Rs. 899.00</span>
</div>
</div>
<span className="uppercase font-semibold text-[10px]">Order # 405-8827364-1122334</span>
</div>
<div className="p-6 flex gap-6">
<div className="w-24 h-24 bg-surface-container-low flex items-center justify-center rounded">
<span className="material-symbols-outlined text-secondary text-[40px]">inventory_2</span>
</div>
<div className="flex-grow">
<h3 className="text-title-lg font-title-lg text-primary">Solid Cotton T-Shirt - Navy Blue (M)</h3>
<p className="text-body-sm font-body-sm text-secondary mt-1">Delivered 05 July</p>
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
