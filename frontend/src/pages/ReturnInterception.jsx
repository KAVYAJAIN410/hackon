import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const ROUTE_META = {
  RESELL:    { icon: 'storefront',          label: 'Sell on ReLoop',     color: 'text-[#007185]',  bg: 'bg-[#E6F7F9]' },
  REFURBISH: { icon: 'build',               label: 'Refurbish',          color: 'text-[#FF9900]',  bg: 'bg-[#FFF8E1]' },
  DONATE:    { icon: 'volunteer_activism',  label: 'Donate',             color: 'text-[#2DC071]',  bg: 'bg-[#F0FDF4]' },
  RECYCLE:   { icon: 'recycling',           label: 'Recycle',            color: 'text-[#565959]',  bg: 'bg-[#F7F8F8]' },
};

export default function ReturnInterception() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gradingResult, returnData, order } = location.state || {};

  if (!gradingResult && !order) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#0F1111] mb-2">No return data</h2>
            <Link to="/return-flow" className="text-[#007185] hover:underline">← Go to Return Flow</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const product = order?.product || {};
  const grading = gradingResult?.grading || {};
  const routing = gradingResult?.routing || {};
  const route = routing.chosenRoute || 'RESELL';
  const meta = ROUTE_META[route] || ROUTE_META.RESELL;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[600px] mx-auto px-4 mt-10 pb-12">

          {/* Success header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#067D62] text-white rounded-full mb-4">
              <span className="material-symbols-outlined text-4xl">check</span>
            </div>
            <h1 className="text-2xl font-bold text-[#0F1111]">Return Submitted!</h1>
            <p className="text-sm text-[#565959] mt-1">Amazon's AI has graded your item and assigned a route.</p>
          </div>

          {/* Product info */}
          <div className="bg-white border border-[#D5D9D9] rounded-lg p-4 flex gap-4 mb-4 shadow-sm">
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name} className="w-20 h-20 object-cover rounded border border-[#D5D9D9]" />
              : <div className="w-20 h-20 bg-[#EAEDED] rounded flex items-center justify-center"><span className="material-symbols-outlined text-[#565959]">inventory_2</span></div>
            }
            <div>
              <p className="font-bold text-[#0F1111]">{product.name || 'Your Item'}</p>
              <p className="text-sm text-[#565959] mt-1">
                Grade: <span className="font-bold">{grading.grade || '—'}</span> &nbsp;•&nbsp; Score: <span className="font-bold">{grading.score || '—'}/100</span>
              </p>
              <p className="text-xs text-[#565959] mt-1 italic">{grading.conditionSummary}</p>
            </div>
          </div>

          {/* Smart routing result */}
          <div className={`border-2 border-[#007185] rounded-xl p-6 mb-4 ${meta.bg}`}>
            <p className="text-xs font-bold text-[#565959] uppercase tracking-wider mb-3">Amazon Smart Routing Decision</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                <span className={`material-symbols-outlined text-2xl ${meta.color}`}>{meta.icon}</span>
              </div>
              <div>
                <p className={`text-xl font-bold ${meta.color}`}>{meta.label}</p>
                <p className="text-sm text-[#565959] mt-0.5">{routing.reason}</p>
              </div>
            </div>
          </div>

          {/* Credits */}
          <div className="bg-[#F0FDF4] border border-[#2DC071]/30 rounded-lg p-4 flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#2DC071]">eco</span>
              <span className="text-sm font-bold text-[#0F1111]">Green Credits Earned</span>
            </div>
            <span className="text-xl font-bold text-[#2DC071]">+{gradingResult?.creditsAwarded || 0}</span>
          </div>

          <button
            onClick={() => navigate('/my-returns')}
            className="w-full bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-3 rounded-lg hover:bg-[#F7CA00] transition-colors"
          >
            View My Returns
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
