import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StatCardSkeleton, TableRowSkeleton, SkeletonBox } from '../components/ui/SkeletonCard';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
            <div className="max-w-container-max mx-auto space-y-6">
              <SkeletonBox className="h-7 w-56 mb-2" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({length:4}).map((_,i)=><StatCardSkeleton key={i}/>)}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-6 shadow-sm"><SkeletonBox className="h-64 w-full" /></div>
                <div className="bg-white rounded-lg p-6 shadow-sm"><SkeletonBox className="h-64 w-full" /></div>
              </div>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100"><SkeletonBox className="h-6 w-40" /></div>
                <table className="w-full"><tbody>
                  {Array.from({length:5}).map((_,i)=><TableRowSkeleton key={i} cols={6}/>)}
                </tbody></table>
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
          <div className="flex-1 ml-60 min-h-screen">



<div className="p-gutter max-w-container-max mx-auto">

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">

<div className="bg-white p-5 border border-border-subtle rounded shadow-sm hover:border-tertiary transition-colors">
<div className="flex justify-between items-start mb-2">
<span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Total Returns</span>
<span className="material-symbols-outlined text-primary text-[20px]">assignment_return</span>
</div>
<div className="flex items-end gap-2">
<h2 className="text-display-lg font-display-lg">24,502</h2>
<span className="text-reloop-green text-label-bold font-label-bold flex items-center mb-1">
<span className="material-symbols-outlined text-[14px]">arrow_upward</span> 12%
                        </span>
</div>
<p className="text-body-sm font-body-sm text-secondary mt-1">Processed in last 30 days</p>
</div>

<div className="bg-white p-5 border border-border-subtle rounded shadow-sm hover:border-tertiary transition-colors">
<div className="flex justify-between items-start mb-2">
<span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Route Optimization</span>
<span className="material-symbols-outlined text-tertiary text-[20px]">route</span>
</div>
<div className="flex items-end gap-2">
<h2 className="text-display-lg font-display-lg">$142k</h2>
<span className="text-reloop-green text-label-bold font-label-bold flex items-center mb-1">
<span className="material-symbols-outlined text-[14px]">trending_up</span> 8.4%
                        </span>
</div>
<p className="text-body-sm font-body-sm text-secondary mt-1">Savings from smart routing</p>
</div>

<div className="bg-white p-5 border border-border-subtle rounded shadow-sm hover:border-tertiary transition-colors">
<div className="flex justify-between items-start mb-2">
<span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Active DCs</span>
<span className="material-symbols-outlined text-secondary text-[20px]">warehouse</span>
</div>
<div className="flex items-end gap-2">
<h2 className="text-display-lg font-display-lg">18</h2>
<span className="text-primary-container text-label-bold font-label-bold flex items-center mb-1 ml-2">Operational</span>
</div>
<p className="text-body-sm font-body-sm text-secondary mt-1">Delivery Centers monitoring</p>
</div>

<div className="bg-white p-5 border border-border-subtle rounded shadow-sm border-l-4 border-reloop-green">
<div className="flex justify-between items-start mb-2">
<span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Green Credits</span>
<span className="material-symbols-outlined text-reloop-green text-[20px]" >eco</span>
</div>
<div className="flex items-end gap-2">
<h2 className="text-display-lg font-display-lg">892,400</h2>
<span className="text-reloop-green text-label-bold font-label-bold flex items-center mb-1">
<span className="material-symbols-outlined text-[14px]">verified</span>
</span>
</div>
<p className="text-body-sm font-body-sm text-secondary mt-1">Total CO2 offset credits</p>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-gutter">

<div className="bg-white p-6 border border-border-subtle rounded shadow-sm">
<div className="flex justify-between items-center mb-6">
<h3 className="text-headline-md font-headline-md">Route Distribution</h3>
<button className="text-secondary hover:text-primary"><span className="material-symbols-outlined">more_horiz</span></button>
</div>
<div className="flex items-center justify-between h-64">
<div className="relative w-48 h-48 flex items-center justify-center">

<svg className="w-full h-full transform -rotate-90" viewbox="0 0 100 100">
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#16A34A" strokeDasharray="125.6 251.2" strokeWidth="20"></circle> 
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#007185" strokeDasharray="62.8 251.2" strokeDashoffset="-125.6" strokeWidth="20"></circle> 
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#ff9900" strokeDasharray="37.6 251.2" strokeDashoffset="-188.4" strokeWidth="20"></circle> 
<circle cx="50" cy="50" fill="transparent" r="40" stroke="#535f70" strokeDasharray="25.2 251.2" strokeDashoffset="-226" strokeWidth="20"></circle> 
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
<span className="text-title-lg font-black text-amazon-dark">Rerouted</span>
<span className="text-body-sm text-secondary">Global</span>
</div>
</div>
<div className="flex flex-col gap-3">
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-reloop-green"></div>
<span className="text-label-bold font-label-bold w-20">Resell</span>
<span className="text-body-md text-secondary">50%</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-[#007185]"></div>
<span className="text-label-bold font-label-bold w-20">Refurbish</span>
<span className="text-body-md text-secondary">25%</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-[#ff9900]"></div>
<span className="text-label-bold font-label-bold w-20">Donate</span>
<span className="text-body-md text-secondary">15%</span>
</div>
<div className="flex items-center gap-2">
<div className="w-3 h-3 rounded-full bg-secondary"></div>
<span className="text-label-bold font-label-bold w-20">Recycle</span>
<span className="text-body-md text-secondary">10%</span>
</div>
</div>
</div>
</div>

<div className="bg-white p-6 border border-border-subtle rounded shadow-sm">
<div className="flex justify-between items-center mb-6">
<h3 className="text-headline-md font-headline-md">Inventory Grade Distribution</h3>
<div className="flex gap-2">
<span className="px-2 py-1 bg-surface-container rounded text-label-caps font-label-caps text-secondary">Weekly</span>
</div>
</div>
<div className="flex flex-col h-64 justify-end gap-1 px-4">
<div className="flex items-end justify-around h-full gap-8">
<div className="flex flex-col items-center w-full gap-2">
<div className="bg-reloop-green w-full rounded-t" ></div>
<span className="text-label-bold font-label-bold">A+</span>
</div>
<div className="flex flex-col items-center w-full gap-2">
<div className="bg-tertiary w-full rounded-t" ></div>
<span className="text-label-bold font-label-bold">A</span>
</div>
<div className="flex flex-col items-center w-full gap-2">
<div className="bg-primary-container w-full rounded-t" ></div>
<span className="text-label-bold font-label-bold">B</span>
</div>
<div className="flex flex-col items-center w-full gap-2">
<div className="bg-error w-full rounded-t" ></div>
<span className="text-label-bold font-label-bold">C</span>
</div>
</div>
<div className="w-full h-px bg-border-subtle mt-1"></div>
</div>
</div>
</div>

<div className="bg-white border border-border-subtle rounded shadow-sm overflow-hidden">
<div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center">
<div>
<h3 className="text-headline-md font-headline-md">Global Returns &amp; DC Status</h3>
<p className="text-body-sm font-body-sm text-secondary">Live stream of logistics center performance</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 border border-border-subtle px-3 py-1.5 rounded text-label-bold font-label-bold hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">filter_alt</span> Filter
                        </button>
<button className="flex items-center gap-2 border border-border-subtle px-3 py-1.5 rounded text-label-bold font-label-bold hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">download</span> Export CSV
                        </button>
</div>
</div>
<div className="overflow-x-auto custom-scrollbar">
<table className="w-full text-left">
<thead className="bg-surface-container-low text-secondary text-label-caps font-label-caps">
<tr>
<th className="px-6 py-3">Location / ID</th>
<th className="px-6 py-3">Return Volume</th>
<th className="px-6 py-3">Real-time Load</th>
<th className="px-6 py-3">Grade Quality</th>
<th className="px-6 py-3">CO2 Saved</th>
<th className="px-6 py-3">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-border-subtle">

<tr className="hover:bg-surface-bright transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="font-label-bold">Mumbai DC (IN-MUM-02)</div>
<div className="text-body-sm text-secondary">Region: Maharashtra</div>
</td>
<td className="px-6 py-4 text-body-md font-medium">1,240 units</td>
<td className="px-6 py-4">
<div className="w-32 bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-reloop-green h-full" ></div>
</div>
<span className="text-body-sm text-secondary">82% Capacity</span>
</td>
<td className="px-6 py-4">
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-caps font-label-caps">A+ Avg</span>
</td>
<td className="px-6 py-4 font-label-bold text-reloop-green">42.8 kg</td>
<td className="px-6 py-4">
<span className="flex items-center gap-1.5 text-reloop-green text-label-bold font-label-bold">
<span className="w-2 h-2 rounded-full bg-reloop-green animate-pulse"></span> Optimal
                                    </span>
</td>
</tr>

<tr className="hover:bg-surface-bright transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="font-label-bold">Bangalore Hub (IN-BLR-01)</div>
<div className="text-body-sm text-secondary">Region: Karnataka</div>
</td>
<td className="px-6 py-4 text-body-md font-medium">984 units</td>
<td className="px-6 py-4">
<div className="w-32 bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-primary-container h-full" ></div>
</div>
<span className="text-body-sm text-secondary">95% Capacity</span>
</td>
<td className="px-6 py-4">
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-caps font-label-caps">A Avg</span>
</td>
<td className="px-6 py-4 font-label-bold text-reloop-green">31.2 kg</td>
<td className="px-6 py-4">
<span className="flex items-center gap-1.5 text-primary-container text-label-bold font-label-bold">
<span className="w-2 h-2 rounded-full bg-primary-container"></span> High Load
                                    </span>
</td>
</tr>

<tr className="hover:bg-surface-bright transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="font-label-bold">New Delhi Main (IN-DEL-04)</div>
<div className="text-body-sm text-secondary">Region: NCR</div>
</td>
<td className="px-6 py-4 text-body-md font-medium">2,502 units</td>
<td className="px-6 py-4">
<div className="w-32 bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-reloop-green h-full" ></div>
</div>
<span className="text-body-sm text-secondary">45% Capacity</span>
</td>
<td className="px-6 py-4">
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-caps font-label-caps">B+ Avg</span>
</td>
<td className="px-6 py-4 font-label-bold text-reloop-green">68.5 kg</td>
<td className="px-6 py-4">
<span className="flex items-center gap-1.5 text-reloop-green text-label-bold font-label-bold">
<span className="w-2 h-2 rounded-full bg-reloop-green"></span> Optimal
                                    </span>
</td>
</tr>

<tr className="hover:bg-surface-bright transition-colors cursor-pointer">
<td className="px-6 py-4">
<div className="font-label-bold">Chennai Terminal (IN-CHN-02)</div>
<div className="text-body-sm text-secondary">Region: Tamil Nadu</div>
</td>
<td className="px-6 py-4 text-body-md font-medium">412 units</td>
<td className="px-6 py-4">
<div className="w-32 bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-error h-full" ></div>
</div>
<span className="text-body-sm text-secondary">12% Capacity</span>
</td>
<td className="px-6 py-4">
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-label-caps font-label-caps">C Avg</span>
</td>
<td className="px-6 py-4 font-label-bold text-reloop-green">14.0 kg</td>
<td className="px-6 py-4">
<span className="flex items-center gap-1.5 text-secondary text-label-bold font-label-bold">
<span className="w-2 h-2 rounded-full bg-secondary"></span> Maintenance
                                    </span>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-6 py-4 bg-surface-container-lowest flex items-center justify-between">
<span className="text-body-sm text-secondary">Showing 4 of 18 delivery centers</span>
<div className="flex gap-1">
<button className="p-2 hover:bg-surface-container rounded text-secondary transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
<button className="px-3 py-1 bg-amazon-dark text-white rounded text-label-bold">1</button>
<button className="px-3 py-1 hover:bg-surface-container rounded text-label-bold">2</button>
<button className="px-3 py-1 hover:bg-surface-container rounded text-label-bold">3</button>
<button className="p-2 hover:bg-surface-container rounded text-secondary transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
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
