import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { StatCardSkeleton, SkeletonBox } from '../components/ui/SkeletonCard';
import { useUser } from '../context/UserContext';
import api from '../lib/api';

export default function SellerDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [batchResults, setBatchResults] = useState(null);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const { currentUser } = useUser();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    api.get(`/seller/returns?seller_id=${currentUser.id}`)
      .then(setData)
      .catch((err) => console.error('Failed to load seller data:', err))
      .finally(() => setIsLoading(false));
  }, [currentUser?.id]);

  const handleBatchGrade = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setBatchProcessing(true);
    try {
      const formData = new FormData();
      formData.append('sellerId', currentUser.id);
      files.forEach(file => formData.append('images', file));

      const result = await api.postFormData('/seller/batch-grade', formData);
      setBatchResults(result);
    } catch (err) {
      alert('Batch grading failed: ' + err.message);
    } finally {
      setBatchProcessing(false);
    }
  };

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

  const analytics = data?.analytics || {};
  const returns = data?.returns || [];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="w-full p-4 bg-[#f3f3f3]">
            <div className="max-w-[1440px] mx-auto space-y-4">

              <div className="flex justify-between items-end mb-2">
                <div>
                  <h1 className="text-[24px] font-bold text-[#0f1111] leading-tight">Seller Dashboard</h1>
                  <p className="text-[14px] text-[#565959]">Manage returns, grade inventory, and track recovery metrics.</p>
                </div>
              </div>

              {/* Quick Metrics from API */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#d5d9d9] rounded-[8px] p-4">
                  <p className="text-[12px] text-[#565959] uppercase font-bold tracking-wider">Total Returns</p>
                  <p className="text-[28px] font-light text-[#0f1111]">{analytics.totalReturns || 0}</p>
                </div>
                <div className="bg-white border border-[#d5d9d9] rounded-[8px] p-4">
                  <p className="text-[12px] text-[#565959] uppercase font-bold tracking-wider">Resellable</p>
                  <p className="text-[28px] font-light text-[#007185]">{analytics.resellableCount || 0}</p>
                </div>
                <div className="bg-white border border-[#d5d9d9] rounded-[8px] p-4">
                  <p className="text-[12px] text-[#565959] uppercase font-bold tracking-wider">Recovery Rate</p>
                  <p className="text-[28px] font-light text-[#c45500]">{analytics.recoveryRate || 0}%</p>
                </div>
                <div className="bg-white border border-[#d5d9d9] rounded-[8px] p-4">
                  <p className="text-[12px] text-[#565959] uppercase font-bold tracking-wider">Total Recovery</p>
                  <p className="text-[28px] font-light text-[#2DC071]">₹{(analytics.totalRecovery || 0).toLocaleString()}</p>
                </div>
              </section>

              {/* Batch Upload Section */}
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-white border border-[#d5d9d9] rounded-[8px] p-4 flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-[#d5d9d9] pb-2">
                    <h2 className="text-[18px] font-bold text-[#0f1111]">Batch Upload Return Photos</h2>
                    <span className="text-[12px] text-[#565959]">Up to 200 images per batch</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleBatchGrade}
                  />
                  <div
                    onClick={() => !batchProcessing && fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-[#d5d9d9] rounded-[8px] bg-[#f7fafa] flex flex-col items-center justify-center py-8 transition-colors group cursor-pointer hover:bg-white hover:border-[#007185]"
                  >
                    {batchProcessing ? (
                      <>
                        <div className="w-10 h-10 border-4 border-[#007185] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-[14px] font-bold text-[#0f1111]">Processing batch...</p>
                        <p className="text-[12px] text-[#565959]">Our AI is grading your items</p>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[32px] text-[#565959] group-hover:text-[#007185] transition-colors">cloud_upload</span>
                        <p className="text-[14px] mt-2 text-[#0f1111]">Click to select files for batch grading</p>
                        <p className="text-[12px] text-[#565959]">Supports JPG, PNG, HEIC (Max 5MB each)</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Metrics Sidebar */}
                <div className="bg-white border border-[#d5d9d9] rounded-[8px] p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#0f1111] border-b border-[#d5d9d9] pb-2">Analytics</h3>
                    <div className="mt-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-[14px] text-[#0f1111]">Total Graded</span>
                        <span className="text-[24px] font-light text-[#0f1111]">{analytics.totalGraded || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[14px] text-[#0f1111]">Time Saved</span>
                        <span className="text-[24px] font-light text-[#007185]">{analytics.timeSavedHours || 0}h</span>
                      </div>
                    </div>
                  </div>
                  {/* Grade Distribution */}
                  {analytics.gradeDistribution && analytics.gradeDistribution.length > 0 && (
                    <div className="pt-3 border-t border-[#d5d9d9] mt-3">
                      <p className="text-[12px] font-bold text-[#565959] mb-2">Grade Distribution</p>
                      {analytics.gradeDistribution.map((g, i) => (
                        <div key={i} className="flex items-center justify-between text-[13px] mb-1">
                          <span>Grade {g.grade}</span>
                          <span className="font-bold">{g.count} ({g.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>

              {/* Batch Results */}
              {batchResults && (
                <section className="bg-white border border-[#d5d9d9] rounded-[8px] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#d5d9d9] bg-[#f7fafa] flex justify-between items-center">
                    <h2 className="text-[18px] font-bold text-[#0f1111]">Batch Grading Results</h2>
                    <div className="flex gap-4 text-[13px]">
                      <span>Graded: <strong>{batchResults.summary?.totalGraded}</strong></span>
                      <span>Resellable: <strong className="text-[#2DC071]">{batchResults.summary?.resellable}</strong></span>
                      <span>Recovery: <strong className="text-[#007185]">₹{batchResults.summary?.totalRecovery?.toLocaleString()}</strong></span>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[13px]">
                      <thead>
                        <tr className="bg-white border-b border-[#d5d9d9]">
                          <th className="px-4 py-2 font-bold text-[#0f1111]">File</th>
                          <th className="px-4 py-2 font-bold text-[#0f1111]">Grade</th>
                          <th className="px-4 py-2 font-bold text-[#0f1111] text-right">Score</th>
                          <th className="px-4 py-2 font-bold text-[#0f1111]">Route</th>
                          <th className="px-4 py-2 font-bold text-[#0f1111] text-right">Suggested Price</th>
                          <th className="px-4 py-2 font-bold text-[#0f1111] text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-[#0f1111] divide-y divide-[#d5d9d9]">
                        {batchResults.results?.map((r, i) => (
                          <tr key={i} className="hover:bg-[#f7fafa] transition-colors">
                            <td className="px-4 py-3">{r.filename}</td>
                            <td className="px-4 py-3">
                              <span className={`font-bold ${
                                r.grade === 'A' ? 'text-[#2DC071]' :
                                r.grade === 'B' ? 'text-[#c45500]' :
                                'text-[#565959]'
                              }`}>Grade {r.grade}</span>
                            </td>
                            <td className="px-4 py-3 text-right">{r.score}</td>
                            <td className="px-4 py-3">{r.route}</td>
                            <td className="px-4 py-3 text-right text-[#007185]">₹{r.suggestedPrice?.toLocaleString()}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                r.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}>{r.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Returns Table */}
              <section className="bg-white border border-[#d5d9d9] rounded-[8px] overflow-hidden">
                <div className="px-4 py-3 border-b border-[#d5d9d9] bg-[#f7fafa]">
                  <h2 className="text-[18px] font-bold text-[#0f1111]">Your Returns</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[13px]">
                    <thead>
                      <tr className="bg-white border-b border-[#d5d9d9]">
                        <th className="px-4 py-2 font-bold text-[#0f1111]">Return ID</th>
                        <th className="px-4 py-2 font-bold text-[#0f1111]">Reason</th>
                        <th className="px-4 py-2 font-bold text-[#0f1111]">Status</th>
                        <th className="px-4 py-2 font-bold text-[#0f1111]">Grade</th>
                        <th className="px-4 py-2 font-bold text-[#0f1111]">Route</th>
                        <th className="px-4 py-2 font-bold text-[#0f1111] text-right">Est. Resale Value</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#0f1111] divide-y divide-[#d5d9d9]">
                      {returns.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-[#565959]">No returns found</td>
                        </tr>
                      ) : (
                        returns.map((ret) => (
                          <tr key={ret.id} className="hover:bg-[#f7fafa] transition-colors">
                            <td className="px-4 py-3 font-medium">{ret.id}</td>
                            <td className="px-4 py-3">{ret.reason?.replace('_', ' ')}</td>
                            <td className="px-4 py-3">
                              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{ret.status}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`font-bold ${
                                ret.grading?.grade === 'A' ? 'text-[#2DC071]' : 'text-[#0f1111]'
                              }`}>
                                {ret.grading?.grade || '—'}
                              </span>
                            </td>
                            <td className="px-4 py-3">{ret.grading?.routeDecision || '—'}</td>
                            <td className="px-4 py-3 text-right text-[#007185]">
                              {ret.grading?.estimatedResaleValue ? `₹${parseFloat(ret.grading.estimatedResaleValue).toLocaleString()}` : '—'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Return Reasons Breakdown */}
              {analytics.returnReasonsBreakdown && analytics.returnReasonsBreakdown.length > 0 && (
                <section className="bg-white border border-[#d5d9d9] border-l-4 border-l-[#007185] rounded-[8px] p-4 flex items-start gap-4">
                  <div className="text-[#007185] shrink-0 pt-0.5">
                    <span className="material-symbols-outlined text-[20px]">info</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] text-[#0f1111] leading-tight mb-2">
                      <span className="font-bold">Top Return Reasons:</span>{' '}
                      {analytics.returnReasonsBreakdown.map((r, i) => (
                        <span key={i}>
                          {r.reason?.replace('_', ' ')} ({r.percentage}%)
                          {i < analytics.returnReasonsBreakdown.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
