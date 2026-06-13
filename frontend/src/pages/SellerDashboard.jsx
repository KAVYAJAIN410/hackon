import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StatCardSkeleton, TableRowSkeleton, SkeletonBox } from '../components/ui/SkeletonCard';

export default function SellerDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({length:4}).map((_,i)=><StatCardSkeleton key={i}/>)}
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <SkeletonBox className="h-6 w-48 mb-6" />
              <div className="space-y-4">
                {Array.from({length:3}).map((_,i)=>(
                  <div key={i} className="flex items-center gap-4 border border-gray-100 rounded-lg p-4">
                    <SkeletonBox className="w-16 h-16 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBox className="h-4 w-32" />
                      <SkeletonBox className="h-4 w-48" />
                    </div>
                    <SkeletonBox className="h-8 w-20 rounded-full" />
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
          <div className="ml-56 w-full p-4 bg-[#f3f3f3]">
<div className="max-w-[1440px] mx-auto space-y-4">

<div className="flex justify-between items-end mb-2">
<div>
<h1 className="text-[24px] font-bold text-[#0f1111] leading-tight">Seller Dashboard</h1>
<p className="text-[14px] text-[#565959]">Manage returns, grade inventory, and track recovery metrics.</p>
</div>
<div className="flex gap-2">
<button className="px-3 py-1 bg-white border border-[#d5d9d9] shadow-[0_2px_5px_rgba(213,217,217,0.5)] text-[13px] font-bold text-[#0f1111] rounded-[8px] flex items-center gap-2 hover:bg-[#f7fafa]">
<span className="material-symbols-outlined text-[16px]">download</span> Export Report
                        </button>
</div>
</div>

<section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
<div className="lg:col-span-2 bg-white border border-[#d5d9d9] rounded-[8px] p-4 flex flex-col gap-4">
<div className="flex justify-between items-center border-b border-[#d5d9d9] pb-2">
<h2 className="text-[18px] font-bold text-[#0f1111]">Batch Upload Return Photos</h2>
<span className="text-[12px] text-[#565959]">Up to 500 images per batch</span>
</div>
<div className="flex-1 border-2 border-dashed border-[#d5d9d9] rounded-[8px] bg-[#f7fafa] flex flex-col items-center justify-center py-8 transition-colors group" id="drop-zone">
<span className="material-symbols-outlined text-[32px] text-[#565959] group-hover:text-[#007185] transition-colors">cloud_upload</span>
<p className="text-[14px] mt-2 text-[#0f1111]">Drag and drop folder or <span className="text-[#007185] hover:underline hover:text-[#c45500] cursor-pointer">browse files</span></p>
<p className="text-[12px] text-[#565959]">Supports JPG, PNG, HEIC (Max 5MB each)</p>
</div>
<div className="flex justify-end">
<button className="px-6 py-1.5 bg-[#ffd814] border border-[#fcd200] shadow-[0_2px_5px_rgba(213,217,217,0.5)] text-[#0f1111] text-[13px] rounded-[8px] hover:bg-[#f7ca00] active:bg-[#f0b800] transition-colors">
                                Start AI Batch Grading
                            </button>
</div>
</div>
<div className="bg-white border border-[#d5d9d9] rounded-[8px] p-4 flex flex-col justify-between">
<div>
<h3 className="text-[16px] font-bold text-[#0f1111] border-b border-[#d5d9d9] pb-2">Quick Metrics</h3>
<div className="mt-4 space-y-3">
<div className="flex justify-between items-center">
<span className="text-[14px] text-[#0f1111]">Pending Grades</span>
<span className="text-[24px] font-light text-[#0f1111]">124</span>
</div>
<div className="flex justify-between items-center">
<span className="text-[14px] text-[#0f1111]">AI Confidence</span>
<span className="text-[24px] font-light text-[#007185]">98.2%</span>
</div>
<div className="flex justify-between items-center">
<span className="text-[14px] text-[#0f1111]">Net Recovery Rate</span>
<span className="text-[24px] font-light text-[#c45500]">74.5%</span>
</div>
</div>
</div>
<div className="pt-3 border-t border-[#d5d9d9] mt-3">
<div className="flex items-center gap-1 text-[#007185]">
<span className="material-symbols-outlined text-[16px]">trending_up</span>
<span className="text-[12px]">+12% vs last month</span>
</div>
</div>
</div>
</section>

<section className="bg-white border border-[#d5d9d9] rounded-[8px] p-4">
<div className="flex items-center justify-between mb-2">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-[#e77600] animate-pulse"></div>
<span className="text-[14px] font-bold text-[#0f1111]">AI Grading Engine Active</span>
</div>
<span className="text-[12px] text-[#565959]">Estimated processing: ~45 seconds</span>
</div>
<div className="w-full bg-[#f3f3f3] rounded-full h-2 overflow-hidden border border-[#d5d9d9]">
<div className="bg-[#007185] h-full w-[65%] transition-all duration-1000 ease-in-out" id="progress-bar"></div>
</div>
<div className="flex justify-between mt-1">
<span className="text-[12px] text-[#565959]">Analyzing Batch #8842... (245/450)</span>
<span className="text-[12px] font-bold text-[#007185]">65% Complete</span>
</div>
</section>

<section className="bg-white border border-[#d5d9d9] rounded-[8px] overflow-hidden">
<div className="px-4 py-3 border-b border-[#d5d9d9] bg-[#f7fafa] flex justify-between items-center">
<h2 className="text-[18px] font-bold text-[#0f1111]">Inventory Disposition Matrix</h2>
<div className="flex gap-2">
<select className="text-[13px] border-[#d5d9d9] rounded-[8px] shadow-[0_2px_5px_rgba(213,217,217,0.5)] focus:ring-[#007185] focus:border-[#007185] py-1 pl-2 pr-8">
<option>Sort by Grade</option>
<option>Sort by Value</option>
</select>
</div>
</div>
<div className="overflow-x-auto custom-scrollbar">
<table className="w-full text-left border-collapse text-[13px]">
<thead>
<tr className="bg-white border-b border-[#d5d9d9]">
<th className="px-4 py-2 font-bold text-[#0f1111]">Grade</th>
<th className="px-4 py-2 font-bold text-[#0f1111]">SKU Category</th>
<th className="px-4 py-2 font-bold text-[#0f1111] text-right">Count</th>
<th className="px-4 py-2 font-bold text-[#0f1111]">Optimized Route</th>
<th className="px-4 py-2 font-bold text-[#0f1111] text-right">Est. Recovery</th>
<th className="px-4 py-2 font-bold text-[#0f1111] text-center">Action</th>
</tr>
</thead>
<tbody className="text-[#0f1111] divide-y divide-[#d5d9d9]">
<tr className="hover:bg-[#f7fafa] transition-colors">
<td className="px-4 py-3">
<span className="text-[#007185] font-bold">GRADE A (Like New)</span>
</td>
<td className="px-4 py-3">Electronics - Wearables</td>
<td className="px-4 py-3 text-right">42</td>
<td className="px-4 py-3">Relist on ReLoop</td>
<td className="px-4 py-3 text-right text-[#007185]">$1,840.00</td>
<td className="px-4 py-3 text-center">
<button className="text-[#007185] hover:text-[#c45500] hover:underline">View List</button>
</td>
</tr>
<tr className="hover:bg-[#f7fafa] transition-colors">
<td className="px-4 py-3">
<span className="text-[#0f1111]">GRADE B (Minor Scuffs)</span>
</td>
<td className="px-4 py-3">Home &amp; Kitchen</td>
<td className="px-4 py-3 text-right">18</td>
<td className="px-4 py-3">Liquidate: Warehouse</td>
<td className="px-4 py-3 text-right">$425.50</td>
<td className="px-4 py-3 text-center">
<button className="text-[#007185] hover:text-[#c45500] hover:underline">View List</button>
</td>
</tr>
<tr className="hover:bg-[#f7fafa] transition-colors">
<td className="px-4 py-3">
<span className="text-[#565959]">GRADE C (Functional)</span>
</td>
<td className="px-4 py-3">Apparel - Kurtis</td>
<td className="px-4 py-3 text-right">86</td>
<td className="px-4 py-3">Bulk Outlet Salvage</td>
<td className="px-4 py-3 text-right">$312.00</td>
<td className="px-4 py-3 text-center">
<button className="text-[#007185] hover:text-[#c45500] hover:underline">View List</button>
</td>
</tr>
<tr className="hover:bg-[#f7fafa] transition-colors">
<td className="px-4 py-3">
<span className="text-[#cc0c39]">UNSALVAGEABLE</span>
</td>
<td className="px-4 py-3">Personal Care</td>
<td className="px-4 py-3 text-right">12</td>
<td className="px-4 py-3">Material Recycling</td>
<td className="px-4 py-3 text-right text-[#cc0c39]">-$24.00</td>
<td className="px-4 py-3 text-center">
<button className="text-[#007185] hover:text-[#c45500] hover:underline">View List</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="bg-white border border-[#d5d9d9] border-l-4 border-l-[#007185] rounded-[8px] p-4 flex items-start gap-4">
<div className="text-[#007185] shrink-0 pt-0.5">
<span className="material-symbols-outlined text-[20px]">info</span>
</div>
<div className="flex-1">
<p className="text-[14px] text-[#0f1111] leading-tight mb-2">
<span className="font-bold">Suggestion:</span> Improve size chart for <span className="font-bold">Kurtis</span>. Data shows that 45% of returns in this category are size issues. Updating your guide could save you an estimated <span className="text-[#007185] font-bold">$1,200/mo</span> in return logistics.
                        </p>
<button className="px-3 py-1 bg-white border border-[#d5d9d9] shadow-[0_2px_5px_rgba(213,217,217,0.5)] text-[#0f1111] text-[13px] rounded-[8px] hover:bg-[#f7fafa]">Review Size Chart</button>
</div>
</section>
</div>
</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
