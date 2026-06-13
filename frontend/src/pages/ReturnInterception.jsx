import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function ReturnInterception() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="max-w-[800px] mx-auto px-4 mt-8">

<div className="bg-white border border-border-subtle p-6 mb-8 text-center rounded-lg shadow-sm">
<div className="flex flex-col items-center gap-2">
<span className="text-amazon-dark font-black text-display-lg-mobile md:text-display-lg uppercase tracking-tight">Wait — You Have Better Options!</span>
<div className="flex flex-col md:flex-row items-center gap-stack-md mt-2">
<img alt="Bata Walking Shoes" className="w-24 h-24 object-cover rounded border border-border-subtle" data-alt="A studio photograph of a pair of high-quality Bata walking shoes, captured with professional product lighting. The shoes are displayed against a clean, neutral background, emphasizing their texture and design. The lighting is bright and even, reflecting a modern light-mode aesthetic, with a soft focus on the details of the footwear." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMcL82psKIthQ03JA-OZHMJrDLMS38BlRLD4h_KPE5ojDyfP8HJ87LRbwvfoZ-9YQYDsh5vQQ5abjwTTrVbVjwq-MYCzL7Bd-NdrG4Ta7KlLnd1G-Dt4Op68liMxFk0slwVz1Ki5L7bqb3YAtX8X93MGorrUR0TLd95Mo6zVMlnaufl9IwiAjFNOjXCtx2TnDrSMBSICkVrGbVjeeebZj6XSdOY_T-m940fDAPDEPoCpbiY-nFXSZhRmkERh8M-dKf7SFPZs1oYG0"/>
<div className="text-center md:text-left">
<p className="text-headline-md font-headline-md text-amazon-dark">Bata Walking Shoes</p>
<p className="text-price-lg font-price-lg text-primary">Rs. 499</p>
</div>
</div>
</div>
</div>

<div className="flex flex-col gap-4">

<div className="relative bg-white border-2 border-primary-container p-6 rounded-xl shadow-md transition-all duration-300 scale-[1.02]">
<div className="absolute -top-3 left-6 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-bold font-label-bold">
                    RECOMMENDED &amp; MOST SUSTAINABLE
                </div>
<div className="flex justify-between items-start">
<div className="flex gap-4">
<div className="bg-primary-container/10 p-3 rounded-full h-fit">
<span className="material-symbols-outlined text-primary-container scale-125" >storefront</span>
</div>
<div>
<h3 className="text-title-lg font-title-lg text-amazon-dark mb-1">Sell on ReLoop</h3>
<p className="text-body-md font-body-md text-secondary mb-4 leading-relaxed">
<span className="font-bold text-reloop-green">3 buyers near Jaipur</span> want these! Avoid logistics waste and get instant cash plus environmental rewards.
                            </p>
<div className="flex flex-wrap gap-4 mb-6">
<div className="bg-surface-container px-3 py-2 rounded">
<p className="text-label-caps text-secondary uppercase">Payout</p>
<p className="text-title-lg font-bold text-amazon-dark">Rs. 350</p>
</div>
<div className="bg-reloop-green/10 px-3 py-2 rounded border border-reloop-green/20">
<p className="text-label-caps text-reloop-green uppercase">Bonus Credits</p>
<p className="text-title-lg font-bold text-reloop-green">+50 Credits</p>
</div>
</div>
<button className="bg-gradient-to-b from-[#FFC400] to-[#FF9900] text-black border border-[#a88734] font-label-bold text-label-bold py-3 px-8 rounded shadow-sm hover:opacity-90 active:scale-95 transition-all w-full md:w-auto uppercase tracking-wide">
                                List and Sell Instantly
                            </button>
</div>
</div>
</div>
</div>

<div className="bg-white border border-border-subtle p-6 rounded-lg option-card-hover transition-all duration-200 cursor-pointer">
<div className="flex justify-between items-start">
<div className="flex gap-4">
<div className="bg-reloop-green/10 p-3 rounded-full h-fit">
<span className="material-symbols-outlined text-reloop-green scale-125">volunteer_activism</span>
</div>
<div>
<h3 className="text-title-lg font-title-lg text-amazon-dark mb-1">Donate &amp; Earn Credits</h3>
<p className="text-body-md font-body-md text-secondary mb-3 leading-relaxed">
                                Give to a local NGO in Jaipur. We'll handle the verification and give you a full refund plus a massive sustainability boost.
                            </p>
<div className="flex items-center gap-4">
<span className="text-price-lg font-bold text-amazon-dark">Refund Rs. 499</span>
<span className="text-reloop-green font-label-bold text-label-bold bg-reloop-green/10 px-2 py-1 rounded">+100 Credits</span>
</div>
</div>
</div>
<span className="material-symbols-outlined text-outline">chevron_right</span>
</div>
</div>

<div className="bg-white border border-border-subtle p-6 rounded-lg option-card-hover transition-all duration-200 cursor-pointer opacity-70 hover:opacity-100">
<div className="flex justify-between items-start">
<div className="flex gap-4">
<div className="bg-surface-container-high p-3 rounded-full h-fit">
<span className="material-symbols-outlined text-secondary scale-125">local_shipping</span>
</div>
<div>
<h3 className="text-title-lg font-title-lg text-amazon-dark mb-1">Standard Return</h3>
<p className="text-body-md font-body-md text-secondary mb-3">
                                Traditional courier pickup. High carbon footprint from shipping back to the warehouse.
                            </p>
<div className="flex items-center gap-4">
<span className="text-price-lg font-bold text-amazon-dark">Refund Rs. 499</span>
<span className="text-secondary text-body-sm font-body-sm italic">No Credits earned</span>
</div>
</div>
</div>
<span className="material-symbols-outlined text-outline">chevron_right</span>
</div>
</div>
</div>

<div className="mt-8 p-4 bg-surface-container rounded-lg border border-border-subtle">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-reloop-green" >energy_savings_leaf</span>
<p className="text-body-sm font-body-sm text-on-surface-variant">
                    Choosing <span className="font-bold">Sell</span> or <span className="font-bold">Donate</span> saves approximately <span className="text-reloop-green font-bold">1.2kg of CO2 emissions</span> for this specific logistics route.
                </p>
</div>
</div>
<button className="mt-12 w-full text-secondary font-label-bold text-label-bold hover:underline">
            Need help? Contact ReLoop Support
        </button>
</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
