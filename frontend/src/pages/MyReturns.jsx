import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ListCardSkeleton, TimelineSkeleton, SkeletonBox } from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';

export default function MyReturns() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasReturns] = useState(true); // set to false to see empty state

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left sidebar skeleton */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <SkeletonBox className="h-7 w-36" />
                {Array.from({length:3}).map((_,i)=><ListCardSkeleton key={i}/>)}
              </div>
              {/* Right panel skeleton */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <SkeletonBox className="h-6 w-48 mb-2" />
                  <SkeletonBox className="h-4 w-64 mb-8" />
                  <TimelineSkeleton />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!hasReturns) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <EmptyState
            icon="assignment_return"
            title="You have no returns yet"
            description="Start a return from any of your delivered orders and track it here in real time."
            action={{ label: 'Return an Item', to: '/return-flow' }}
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
          <div className="max-w-container-max mx-auto px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

<section className="lg:col-span-4 flex flex-col gap-6">
<div className="flex justify-between items-end mb-2">
<h1 className="text-2xl font-bold">My Returns</h1>
<span className="text-sm font-bold text-[#565959]">3 ACTIVE</span>
</div>

<div className="bg-white border-2 border-[#008296] rounded-lg shadow-sm p-4 cursor-pointer transition-transform active:scale-[0.98]">
<div className="flex gap-4">
<div className="w-16 h-16 bg-[#f0f2f2] rounded overflow-hidden flex-shrink-0">
<img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFGirbZJW46PBxGRy3HBNENopXo5rzSo5cPq4aiYiTUKR_U373Jt-p4ySMvgCmLKY0hu8zvxYomotyKS2kMofBNhgbwQltERFFo13k3g_C8o2Q8OWdrKy_3XvHwf3MoUoW_tpDue7cyJxYs8WWPsRayRLagZ_ptgdoo83Didy8gA_uCbk-_h4bE61qiBuVUc_wRzvoh3-UN9Mr0Htyl8BZQDYltj7mqCpGGFZQv9-8O6ogztGx3lld-tOU7MQejYVaJIcikWzDl2g"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<span className="text-[11px] uppercase tracking-wider font-bold text-[#565959]">ID: RL-88291</span>
<span className="text-[11px] uppercase font-bold text-[#2DC071]">IN TRANSIT</span>
</div>
<h3 className="text-[14px] font-bold mt-1">Vortex Pro Running Shoes</h3>
<p className="text-[13px] text-[#565959]">Return initiated: Oct 12</p>
</div>
</div>
<div className="mt-4 pt-3 border-t border-[#D5D9D9] flex items-center justify-between">
<div className="flex items-center gap-1 text-[#2DC071]">
<span className="material-symbols-outlined text-[16px]">eco</span>
<span className="text-[13px] font-bold">1.2kg CO2 saved</span>
</div>
<span className="material-symbols-outlined text-[#565959]">chevron_right</span>
</div>
</div>

<div className="bg-white border border-[#D5D9D9] rounded-lg p-4 hover:border-[#008296] transition-colors cursor-pointer">
<div className="flex gap-4">
<div className="w-16 h-16 bg-[#f0f2f2] rounded overflow-hidden flex-shrink-0">
<img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgeShRAhiKeTlrxkc4QXpMEyiIyiUctjjGvXFpIaVDpQnZuCOzNHMhySUz5T5dmH4gzmMPSEo7Pkro2JvGeBV_FqffX6QdoYCjK0n7TTwSB2LdBN6UK7q5W_TD8ORurYNq94x_z7tmT_Fx1H7znzYHHKj4y3GqzwgwnIdCW2Z5jKhawnCDHLMJI1lF8As2hb8oP6UKp0BlUvONdCfojsa-udGWiEQHK79pRYwpWcq89Gnezeq6ckAS-JfVB0IsSd6ND3dmzrJhB54"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<span className="text-[11px] uppercase tracking-wider font-bold text-[#565959]">ID: RL-77210</span>
<span className="text-[11px] uppercase font-bold text-[#0f1111]">GRADING...</span>
</div>
<h3 className="text-[14px] font-bold mt-1">Minimalist Quartz Watch</h3>
<p className="text-[13px] text-[#565959]">Return initiated: Oct 14</p>
</div>
</div>
<div className="mt-4 pt-3 border-t border-[#D5D9D9] flex items-center justify-between">
<div className="flex items-center gap-1 text-[#2DC071] opacity-60">
<span className="material-symbols-outlined text-[16px]">eco</span>
<span className="text-[13px] font-bold">Est. 0.8kg CO2 saved</span>
</div>
<span className="material-symbols-outlined text-[#565959]">chevron_right</span>
</div>
</div>

<h2 className="text-lg font-bold mt-2 mb-1 px-2 border-l-4 border-[#eeba37]">Past Returns</h2>

<div className="bg-[#f7f8f8] border border-[#D5D9D9] rounded-lg p-4 opacity-80">
<div className="flex gap-4 grayscale">
<div className="w-16 h-16 bg-[#f0f2f2] rounded overflow-hidden flex-shrink-0">
<img alt="Product" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDzB_KOFhQcU1x4CaXXBe6c91gck89GfBlm9wI50hfo4B90TAMGtw8N2j7pBpJvSBv_p_bLJBP437fbkD7HSxzMBK1pbokaRAmAhBk53UeuODhVMu-p7SX_xkSnF4RHeVaJM5_BoEzE_6OPUhhm1_fclzIh0beY_MCbFUaG3bqpvo-qrHN2vaLO6Lr6bCRA7WncHn3aejUojQUCOy6sovJHg73e6X2i7x89RK_qrW_cq7co7ZeEBtUe1SERORSnUqxDQLAJuDXt-E"/>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<span className="text-[11px] uppercase tracking-wider font-bold text-[#565959]">ID: RL-44129</span>
<span className="text-[11px] uppercase font-bold text-[#565959]">COMPLETED</span>
</div>
<h3 className="text-[14px] font-bold mt-1">Noise-Cancelling Studio Pro</h3>
<p className="text-[13px] text-[#565959]">Resolved: Sept 28</p>
</div>
</div>
</div>
</section>

<section className="lg:col-span-8 flex flex-col gap-gutter">

<div className="bg-white border border-border-subtle rounded p-6 shadow-sm relative overflow-hidden">

<div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
<span className="material-symbols-outlined text-[200px]" >recycling</span>
</div>
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
<div>
<div className="flex items-center gap-2 mb-1">
<h2 className="text-headline-md font-headline-md">Tracking Return RL-88291</h2>
<span className="bg-secondary-container text-on-secondary-container text-label-bold font-label-bold px-2 py-0.5 rounded">Standard ReLoop Flow</span>
</div>
<p className="text-body-md text-secondary">Vortex Pro Running Shoes • Size 10 • Red/Black</p>
</div>
<div className="flex gap-3">
<button className="bg-white border border-border-subtle text-amazon-dark text-label-bold font-label-bold px-4 py-2 rounded hover:bg-surface-container transition-colors">View Original Order</button>
<button className="bg-gradient-to-b from-[#f8e3ad] to-[#eeba37] border border-[#a88734] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] text-[#111] text-label-bold font-label-bold px-4 py-2 rounded hover:bg-gradient-to-b hover:from-[#f5d78e] hover:to-[#eeb127] transition-colors">Get Support</button>
</div>
</div>

<div className="pl-8 md:pl-12 flex flex-col gap-10">

{/* Step 1: Return Initiated */}
<div className="relative flex items-start gap-6">
{/* Connecting line to next step */}
<div className="absolute -left-[21px] md:-left-[25px] top-5 md:top-7 -bottom-10 w-0.5 bg-[#2DC071] z-0"></div>
<div className="absolute -left-[30px] md:-left-[38px] w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#2DC071] flex items-center justify-center text-white z-10">
<span className="material-symbols-outlined text-[14px] md:text-[18px]">check</span>
</div>
<div className="flex-1">
<div className="flex justify-between">
<h4 className="text-[14px] font-bold text-[#2DC071]">Return Initiated</h4>
<span className="text-[13px] text-[#565959] font-medium">Oct 12, 09:42 AM</span>
</div>
<p className="text-[13px] text-[#565959] mt-1">Item picked up from your doorstep in Jaipur. Carbon-neutral fleet utilized.</p>
</div>
</div>

{/* Step 2: AI Graded */}
<div className="relative flex items-start gap-6">
{/* Connecting line to next step */}
<div className="absolute -left-[21px] md:-left-[25px] top-5 md:top-7 -bottom-10 w-0.5 bg-[#2DC071] z-0"></div>
<div className="absolute -left-[30px] md:-left-[38px] w-5 h-5 md:w-7 md:h-7 rounded-full bg-[#2DC071] flex items-center justify-center text-white z-10">
<span className="material-symbols-outlined text-[14px] md:text-[18px]">check</span>
</div>
<div className="flex-1">
<div className="flex justify-between">
<h4 className="text-[14px] font-bold text-[#2DC071]">AI Graded: Like New</h4>
<span className="text-[13px] text-[#565959] font-medium">Oct 13, 02:15 PM</span>
</div>
<p className="text-[13px] text-[#565959] mt-1">Automated visual inspection completed at Regional Hub 4. Item certified for direct resale.</p>

<div className="mt-3 bg-[#f7f8f8] p-3 rounded border border-[#d5d9d9] inline-flex gap-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#007185] text-[18px]">verified</span>
<span className="text-[13px] font-bold text-[#0f1111]">98% Grade Score</span>
</div>
<div className="w-px bg-[#d5d9d9] h-4 self-center"></div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#2DC071] text-[18px]">savings</span>
<span className="text-[13px] font-bold text-[#0f1111]">₹1,200 Restock Credit Earned</span>
</div>
</div>
</div>
</div>

{/* Step 3: Routed to New Buyer (in progress) */}
<div className="relative flex items-start gap-6">
{/* Connecting line to next step */}
<div className="absolute -left-[21px] md:-left-[25px] top-5 md:top-7 -bottom-10 w-0.5 bg-[#e0e0e0] z-0"></div>
<div className="absolute -left-[30px] md:-left-[38px] w-5 h-5 md:w-7 md:h-7 rounded-full bg-white border-2 border-[#2DC071] flex items-center justify-center z-10">
<div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#2DC071] animate-pulse"></div>
</div>
<div className="flex-1">
<div className="flex justify-between">
<h4 className="text-[14px] font-bold text-[#0f1111]">Routed to New Buyer</h4>
<span className="text-[13px] text-[#0f1111] font-bold">IN PROGRESS</span>
</div>
<p className="text-[13px] text-[#565959] mt-1">Item matched with a buyer in Delhi. Direct peer-to-peer shipping bypasses main warehouse to save 400g CO2.</p>
<div className="mt-4 flex gap-2 overflow-x-auto pb-1">
<div className="px-3 py-1 bg-[#232f3e] text-white text-[10px] font-bold tracking-wider rounded-full whitespace-nowrap">DELHI HUB: ARRIVED</div>
<div className="px-3 py-1 bg-[#f0f2f2] text-[#565959] text-[10px] font-bold tracking-wider rounded-full whitespace-nowrap">LOCAL DELIVERY: PENDING</div>
</div>
</div>
</div>

{/* Step 4: Delivered (future, dimmed) */}
<div className="relative flex items-start gap-6 opacity-50">
<div className="absolute -left-[30px] md:-left-[38px] w-5 h-5 md:w-7 md:h-7 rounded-full bg-white border-2 border-[#d5d9d9] flex items-center justify-center z-10">
</div>
<div className="flex-1">
<div className="flex justify-between">
<h4 className="text-[14px] font-bold text-[#565959]">Delivered & Impact Verified</h4>
<span className="text-[13px] text-[#565959] font-medium">Estimated Oct 16</span>
</div>
<p className="text-[13px] text-[#565959] mt-1">Final lifecycle credit will be applied once the new buyer confirms receipt.</p>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">

<div className="bg-white border border-border-subtle rounded p-stack-md flex flex-col items-center text-center">
<span className="material-symbols-outlined text-reloop-green text-[32px] mb-2" >cloud_done</span>
<span className="text-display-lg font-display-lg text-amazon-dark">1.2<span className="text-title-lg">kg</span></span>
<span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">CO2 Emissions Saved</span>
<p className="text-body-sm text-secondary mt-2">Equivalent to planting 1 young tree for a month.</p>
</div>

<div className="bg-white border border-border-subtle rounded p-stack-md flex flex-col items-center text-center">
<span className="material-symbols-outlined text-tertiary text-[32px] mb-2">route</span>
<span className="text-display-lg font-display-lg text-amazon-dark">840<span className="text-title-lg">km</span></span>
<span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Travel Optimized</span>
<p className="text-body-sm text-secondary mt-2">Bypassed regional sorting to reduce logistics lag.</p>
</div>

<div className="bg-white border border-border-subtle rounded p-stack-md flex flex-col items-center text-center">
<span className="material-symbols-outlined text-primary-container text-[32px] mb-2" >payments</span>
<span className="text-display-lg font-display-lg text-amazon-dark">₹450</span>
<span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Green Credits</span>
<p className="text-body-sm text-secondary mt-2">Added to your wallet for choosing ReLoop flow.</p>
</div>
</div>

<div className="bg-[#232f3e] rounded-lg p-6 flex flex-col md:flex-row justify-between items-center gap-6">
<div className="flex gap-4 items-center">
<div className="w-12 h-12 rounded-lg bg-[#2DC071] flex items-center justify-center flex-shrink-0">
<span className="material-symbols-outlined text-white text-[28px]">redeem</span>
</div>
<div>
<h3 className="text-[16px] font-bold text-white">Unlock Next-Level Impact</h3>
<p className="text-[13px] text-[#a0a0a0] mt-1">Complete 2 more ReLoop returns to earn the "Circular Hero" badge and free priority shipping.</p>
</div>
</div>
<button className="w-full md:w-auto bg-gradient-to-b from-[#f8e3ad] to-[#eeba37] border border-[#a88734] shadow-[0_1px_0_rgba(255,255,255,0.4)_inset] text-[#111] text-[13px] font-bold px-8 py-3 rounded uppercase tracking-widest hover:from-[#f5d78e] hover:to-[#eeb127] transition-colors">
  View Achievement Path
</button>
</div>
</section>
</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
