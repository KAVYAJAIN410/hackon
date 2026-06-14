import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StatCardSkeleton, TableRowSkeleton, SkeletonBox } from '../components/ui/SkeletonCard';
import api from '../lib/api';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    api.get('/admin/overview')
      .then(setData)
      .catch((err) => console.error('Failed to load admin data:', err))
      .finally(() => setIsLoading(false));
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

  if (!data) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-[#565959]">Failed to load admin dashboard data. Make sure the backend is running.</p>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate route distribution percentages
  const routeTotal = Object.values(data.returnsByRoute || {}).reduce((s, v) => s + v, 0) || 1;
  const routePcts = {};
  Object.entries(data.returnsByRoute || {}).forEach(([k, v]) => {
    routePcts[k] = Math.round((v / routeTotal) * 100);
  });

  // Calculate donut chart segments
  const routeColors = { RESELL: '#16A34A', REFURBISH: '#007185', DONATE: '#ff9900', RECYCLE: '#535f70' };
  const circumference = 2 * Math.PI * 40; // r=40
  let offset = 0;
  const segments = Object.entries(data.returnsByRoute || {}).map(([route, count]) => {
    const pct = count / routeTotal;
    const dashLen = pct * circumference;
    const seg = { route, count, pct: Math.round(pct * 100), color: routeColors[route] || '#ccc', dashLen, offset: -offset };
    offset += dashLen;
    return seg;
  });

  // Inventory grade data for bar chart
  const gradeEntries = Object.entries(data.inventoryByGrade || {});
  const maxGradeCount = Math.max(...gradeEntries.map(([,v]) => v), 1);
  const gradeColors = { 'A+': '#16A34A', 'A': '#ff9900', 'B': '#007185', 'C': '#cc0c39' };

  const costSavings = data.costSavingsVsOldSystem || {};

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="flex-1 min-h-screen">

            <div className="p-gutter max-w-container-max mx-auto">

              <h1 className="text-[24px] font-bold text-[#0f1111] mb-6">Admin Dashboard</h1>

              {/* Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">

                <div className="bg-white p-5 border border-border-subtle rounded shadow-sm hover:border-tertiary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Total Returns</span>
                    <span className="material-symbols-outlined text-primary text-[20px]">assignment_return</span>
                  </div>
                  <h2 className="text-display-lg font-display-lg">{data.totalReturns?.toLocaleString()}</h2>
                  <p className="text-body-sm font-body-sm text-secondary mt-1">Processed on platform</p>
                </div>

                <div className="bg-white p-5 border border-border-subtle rounded shadow-sm hover:border-tertiary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Marketplace Orders</span>
                    <span className="material-symbols-outlined text-tertiary text-[20px]">shopping_cart</span>
                  </div>
                  <h2 className="text-display-lg font-display-lg">{data.totalMarketplaceOrders?.toLocaleString()}</h2>
                  <p className="text-body-sm font-body-sm text-secondary mt-1">Items sold on ReLoop</p>
                </div>

                <div className="bg-white p-5 border border-border-subtle rounded shadow-sm hover:border-tertiary transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">CO2 Saved</span>
                    <span className="material-symbols-outlined text-reloop-green text-[20px]">cloud_done</span>
                  </div>
                  <h2 className="text-display-lg font-display-lg">{data.co2SavedKg?.toLocaleString()} kg</h2>
                  <p className="text-body-sm font-body-sm text-secondary mt-1">Total carbon offset</p>
                </div>

                <div className="bg-white p-5 border border-border-subtle rounded shadow-sm border-l-4 border-reloop-green">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Green Credits</span>
                    <span className="material-symbols-outlined text-reloop-green text-[20px]">eco</span>
                  </div>
                  <h2 className="text-display-lg font-display-lg">{data.totalGreenCredits?.toLocaleString()}</h2>
                  <p className="text-body-sm font-body-sm text-secondary mt-1">Total credits issued</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter mb-gutter">

                {/* Route Distribution Donut */}
                <div className="bg-white p-6 border border-border-subtle rounded shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-headline-md font-headline-md">Route Distribution</h3>
                  </div>
                  <div className="flex items-center justify-between h-64">
                    <div className="relative w-48 h-48 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        {segments.map((seg, i) => (
                          <circle
                            key={i}
                            cx="50" cy="50" r="40"
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth="20"
                            strokeDasharray={`${seg.dashLen} ${circumference - seg.dashLen}`}
                            strokeDashoffset={seg.offset}
                          />
                        ))}
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-title-lg font-black text-amazon-dark">{routeTotal}</span>
                        <span className="text-body-sm text-secondary">Total</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      {segments.map((seg, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></div>
                          <span className="text-label-bold font-label-bold w-20">{seg.route}</span>
                          <span className="text-body-md text-secondary">{seg.pct}% ({seg.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Inventory Grade Distribution */}
                <div className="bg-white p-6 border border-border-subtle rounded shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-headline-md font-headline-md">Inventory by Grade</h3>
                  </div>
                  <div className="flex flex-col h-64 justify-end gap-1 px-4">
                    <div className="flex items-end justify-around h-full gap-8">
                      {gradeEntries.map(([grade, count]) => {
                        const heightPct = (count / maxGradeCount) * 100;
                        return (
                          <div key={grade} className="flex flex-col items-center w-full gap-2">
                            <span className="text-xs font-bold text-[#0f1111]">{count}</span>
                            <div
                              className="w-full rounded-t transition-all duration-500"
                              style={{
                                height: `${Math.max(heightPct, 5)}%`,
                                backgroundColor: gradeColors[grade] || '#007185'
                              }}
                            ></div>
                            <span className="text-label-bold font-label-bold">{grade}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="w-full h-px bg-border-subtle mt-1"></div>
                  </div>
                </div>
              </div>

              {/* Cost Savings */}
              {costSavings.totalSavings && (
                <div className="bg-[#F0FDF4] border border-[#2DC071]/30 rounded-lg p-6 mb-gutter flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined text-[#2DC071] text-[40px]">savings</span>
                    <div>
                      <h3 className="text-lg font-bold text-[#0f1111]">Cost Savings vs Traditional System</h3>
                      <p className="text-sm text-[#565959]">
                        Old system: ₹{costSavings.oldSystemCostPerItem}/item → ReLoop: ₹{costSavings.reloopAvgCostPerItem}/item
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#2DC071]">₹{costSavings.totalSavings?.toLocaleString()}</p>
                    <p className="text-sm text-[#565959]">saved across {costSavings.totalItemsProcessed} items</p>
                  </div>
                </div>
              )}

              {/* Returns by Status */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-gutter">
                {Object.entries(data.returnsByStatus || {}).map(([status, count]) => (
                  <div key={status} className="bg-white border border-border-subtle rounded p-4 text-center">
                    <p className="text-xs font-bold text-[#565959] uppercase tracking-wider mb-1">{status.replace('_', ' ')}</p>
                    <p className="text-2xl font-bold text-[#0f1111]">{count}</p>
                  </div>
                ))}
              </div>

              {/* DC Inventory Table */}
              <div className="bg-white border border-border-subtle rounded shadow-sm overflow-hidden mb-gutter">
                <div className="px-6 py-4 border-b border-border-subtle flex justify-between items-center">
                  <div>
                    <h3 className="text-headline-md font-headline-md">Delivery Center Inventory</h3>
                    <p className="text-body-sm font-body-sm text-secondary">Live inventory across distribution centers</p>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-secondary text-label-caps font-label-caps">
                      <tr>
                        <th className="px-6 py-3">DC Name</th>
                        <th className="px-6 py-3">City</th>
                        <th className="px-6 py-3">Available</th>
                        <th className="px-6 py-3">Sold</th>
                        <th className="px-6 py-3">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {(data.dcInventory || []).map((dc) => {
                        const available = dc.inventory?.AVAILABLE || 0;
                        const sold = dc.inventory?.SOLD || 0;
                        return (
                          <tr key={dc.id} className="hover:bg-surface-bright transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-label-bold">{dc.name}</div>
                              <div className="text-body-sm text-secondary">{dc.id}</div>
                            </td>
                            <td className="px-6 py-4">{dc.city}</td>
                            <td className="px-6 py-4">
                              <span className="text-reloop-green font-bold">{available}</span>
                            </td>
                            <td className="px-6 py-4">{sold}</td>
                            <td className="px-6 py-4 font-bold">{available + sold}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Returns Feed */}
              {data.recentReturns && data.recentReturns.length > 0 && (
                <div className="bg-white border border-border-subtle rounded shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-border-subtle">
                    <h3 className="text-headline-md font-headline-md">Recent Returns</h3>
                  </div>
                  <div className="divide-y divide-border-subtle">
                    {data.recentReturns.map((ret) => (
                      <div key={ret.id} className="px-6 py-3 flex items-center justify-between hover:bg-surface-bright transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`w-2 h-2 rounded-full ${
                            ret.status === 'ROUTED' ? 'bg-[#007185]' :
                            ret.status === 'LISTED' ? 'bg-[#ff9900]' :
                            'bg-[#2DC071]'
                          }`}></span>
                          <span className="text-sm font-medium">{ret.id}</span>
                          <span className="text-sm text-[#565959]">by {ret.user?.name || 'Unknown'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-surface-container">{ret.status}</span>
                          {ret.routeDecision && (
                            <span className="text-xs text-[#007185]">→ {ret.routeDecision}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
