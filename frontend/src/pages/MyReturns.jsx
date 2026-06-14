import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { ListCardSkeleton, TimelineSkeleton, SkeletonBox } from '../components/ui/SkeletonCard';
import EmptyState from '../components/ui/EmptyState';
import { useUser } from '../context/UserContext';
import api from '../lib/api';

export default function MyReturns() {
  const [isLoading, setIsLoading] = useState(true);
  const [returns, setReturns] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const { currentUser } = useUser();

  useEffect(() => {
    if (!currentUser) return;
    setIsLoading(true);
    api.get(`/returns?user_id=${currentUser.id}`)
      .then((data) => {
        setReturns(data);
        if (data.length > 0) setSelectedReturn(data[0]);
      })
      .catch((err) => console.error('Failed to load returns:', err))
      .finally(() => setIsLoading(false));
  }, [currentUser?.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 flex flex-col gap-4">
                <SkeletonBox className="h-7 w-36" />
                {Array.from({length:3}).map((_,i)=><ListCardSkeleton key={i}/>)}
              </div>
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

  if (!returns || returns.length === 0) {
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

  const activeReturns = returns.filter(r => !['SOLD', 'COMPLETED', 'CANCELLED'].includes(r.status));
  const pastReturns = returns.filter(r => ['SOLD', 'COMPLETED', 'CANCELLED'].includes(r.status));

  const getStatusColor = (status) => {
    switch(status) {
      case 'INITIATED': return 'text-[#007185]';
      case 'GRADED': return 'text-[#2DC071]';
      case 'LISTED': return 'text-[#FF9900]';
      case 'ROUTED': return 'text-[#007185]';
      case 'SOLD': return 'text-[#565959]';
      default: return 'text-[#0f1111]';
    }
  };

  const getTimelineSteps = (ret) => {
    const steps = [
      { label: 'Return Initiated', done: true, date: new Date(ret.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) },
    ];
    if (ret.grading) {
      steps.push({
        label: `AI Graded: ${ret.grading.grade}`,
        done: true,
        detail: `Score: ${ret.grading.score}/100`,
      });
    }
    if (ret.routeDecision) {
      steps.push({
        label: `Routed: ${ret.routeDecision}`,
        done: ['LISTED', 'ROUTED', 'SOLD'].includes(ret.status),
        inProgress: ret.status === 'GRADED',
      });
    }
    steps.push({
      label: 'Completed',
      done: ret.status === 'SOLD' || ret.status === 'COMPLETED',
      inProgress: false,
    });
    return steps;
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="max-w-container-max mx-auto px-margin-desktop py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Sidebar: Return List */}
            <section className="lg:col-span-4 flex flex-col gap-6">
              <div className="flex justify-between items-end mb-2">
                <h1 className="text-2xl font-bold">My Returns</h1>
                <span className="text-sm font-bold text-[#565959]">{activeReturns.length} ACTIVE</span>
              </div>

              {activeReturns.map((ret) => (
                <div
                  key={ret.id}
                  onClick={() => setSelectedReturn(ret)}
                  className={`bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-transform active:scale-[0.98] ${
                    selectedReturn?.id === ret.id ? 'border-2 border-[#008296]' : 'border border-[#D5D9D9] hover:border-[#008296]'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-[#f0f2f2] rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#565959] text-[28px]">inventory_2</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="text-[11px] uppercase tracking-wider font-bold text-[#565959]">ID: {ret.id}</span>
                        <span className={`text-[11px] uppercase font-bold ${getStatusColor(ret.status)}`}>{ret.status}</span>
                      </div>
                      <h3 className="text-[14px] font-bold mt-1">{ret.product?.name || 'Product'}</h3>
                      <p className="text-[13px] text-[#565959]">Reason: {ret.reason?.replace('_', ' ')}</p>
                    </div>
                  </div>
                  {ret.grading && (
                    <div className="mt-4 pt-3 border-t border-[#D5D9D9] flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[#2DC071]">
                        <span className="material-symbols-outlined text-[16px]">eco</span>
                        <span className="text-[13px] font-bold">Grade {ret.grading.grade} • Score {ret.grading.score}</span>
                      </div>
                      <span className="material-symbols-outlined text-[#565959]">chevron_right</span>
                    </div>
                  )}
                </div>
              ))}

              {pastReturns.length > 0 && (
                <>
                  <h2 className="text-lg font-bold mt-2 mb-1 px-2 border-l-4 border-[#eeba37]">Past Returns</h2>
                  {pastReturns.map((ret) => (
                    <div
                      key={ret.id}
                      onClick={() => setSelectedReturn(ret)}
                      className="bg-[#f7f8f8] border border-[#D5D9D9] rounded-lg p-4 opacity-80 cursor-pointer hover:opacity-100"
                    >
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-[#f0f2f2] rounded overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-[#565959] text-[28px]">inventory_2</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <span className="text-[11px] uppercase tracking-wider font-bold text-[#565959]">ID: {ret.id}</span>
                            <span className="text-[11px] uppercase font-bold text-[#565959]">{ret.status}</span>
                          </div>
                          <h3 className="text-[14px] font-bold mt-1">{ret.product?.name || 'Product'}</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </section>

            {/* Right Panel: Selected Return Detail */}
            <section className="lg:col-span-8 flex flex-col gap-gutter">
              {selectedReturn ? (
                <>
                  <div className="bg-white border border-border-subtle rounded p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none">
                      <span className="material-symbols-outlined text-[200px]">recycling</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-headline-md font-headline-md">Return {selectedReturn.id}</h2>
                          <span className={`text-label-bold font-label-bold px-2 py-0.5 rounded ${getStatusColor(selectedReturn.status)} bg-surface-container`}>
                            {selectedReturn.status}
                          </span>
                        </div>
                        <p className="text-body-md text-secondary">
                          {selectedReturn.product?.name || 'Product'} • Reason: {selectedReturn.reason?.replace('_', ' ')}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="pl-8 md:pl-12 flex flex-col gap-10">
                      {getTimelineSteps(selectedReturn).map((step, i, arr) => (
                        <div key={i} className="relative flex items-start gap-6">
                          {i < arr.length - 1 && (
                            <div className={`absolute -left-[21px] md:-left-[25px] top-5 md:top-7 -bottom-10 w-0.5 z-0 ${
                              step.done ? 'bg-[#2DC071]' : 'bg-[#e0e0e0]'
                            }`}></div>
                          )}
                          <div className={`absolute -left-[30px] md:-left-[38px] w-5 h-5 md:w-7 md:h-7 rounded-full flex items-center justify-center z-10 ${
                            step.done
                              ? 'bg-[#2DC071] text-white'
                              : step.inProgress
                                ? 'bg-white border-2 border-[#2DC071]'
                                : 'bg-white border-2 border-[#d5d9d9]'
                          }`}>
                            {step.done ? (
                              <span className="material-symbols-outlined text-[14px] md:text-[18px]">check</span>
                            ) : step.inProgress ? (
                              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#2DC071] animate-pulse"></div>
                            ) : null}
                          </div>
                          <div className={`flex-1 ${!step.done && !step.inProgress ? 'opacity-50' : ''}`}>
                            <h4 className={`text-[14px] font-bold ${step.done ? 'text-[#2DC071]' : 'text-[#0f1111]'}`}>
                              {step.label}
                            </h4>
                            {step.date && <span className="text-[13px] text-[#565959]">{step.date}</span>}
                            {step.detail && <p className="text-[13px] text-[#565959] mt-1">{step.detail}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-md">
                    <div className="bg-white border border-border-subtle rounded p-stack-md flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-reloop-green text-[32px] mb-2">cloud_done</span>
                      <span className="text-display-lg font-display-lg text-amazon-dark">
                        {selectedReturn.grading?.grade || '—'}
                      </span>
                      <span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">AI Grade</span>
                    </div>
                    <div className="bg-white border border-border-subtle rounded p-stack-md flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-tertiary text-[32px] mb-2">route</span>
                      <span className="text-display-lg font-display-lg text-amazon-dark">
                        {selectedReturn.routeDecision || '—'}
                      </span>
                      <span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Route Decision</span>
                    </div>
                    <div className="bg-white border border-border-subtle rounded p-stack-md flex flex-col items-center text-center">
                      <span className="material-symbols-outlined text-primary-container text-[32px] mb-2">payments</span>
                      <span className="text-display-lg font-display-lg text-amazon-dark">
                        {selectedReturn.refundAmount ? `₹${parseFloat(selectedReturn.refundAmount).toLocaleString()}` : '—'}
                      </span>
                      <span className="text-label-bold font-label-bold text-secondary uppercase tracking-wider">Refund Amount</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white border border-border-subtle rounded p-6 shadow-sm text-center text-[#565959]">
                  Select a return to view details
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
