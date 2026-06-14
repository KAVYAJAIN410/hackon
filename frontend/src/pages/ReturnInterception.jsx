import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function ReturnInterception() {
  const location = useLocation();
  const navigate = useNavigate();
  const { gradingResult, returnData, order } = location.state || {};

  // If no data passed, show a fallback
  if (!gradingResult && !order) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-[64px] text-[#565959] mb-4">info</span>
            <h2 className="text-2xl font-bold text-[#0F1111] mb-2">No return data</h2>
            <p className="text-[#565959] mb-4">Please start a return from the Return Flow page.</p>
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
  const refundAmount = product.mrp ? `₹${parseFloat(product.mrp).toLocaleString()}` : '₹0';

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="max-w-[800px] mx-auto px-4 mt-8">

            {/* Product Banner */}
            <div className="bg-white border border-border-subtle p-6 mb-8 text-center rounded-lg shadow-sm">
              <div className="flex flex-col items-center gap-2">
                <span className="text-amazon-dark font-black text-display-lg-mobile md:text-display-lg uppercase tracking-tight">
                  Wait — You Have Better Options!
                </span>
                <div className="flex flex-col md:flex-row items-center gap-stack-md mt-2">
                  {product.imageUrl ? (
                    <img alt={product.name} className="w-24 h-24 object-cover rounded border border-border-subtle" src={product.imageUrl} />
                  ) : (
                    <div className="w-24 h-24 bg-[#EAEDED] rounded flex items-center justify-center border border-border-subtle">
                      <span className="material-symbols-outlined text-[#565959] text-[40px]">inventory_2</span>
                    </div>
                  )}
                  <div className="text-center md:text-left">
                    <p className="text-headline-md font-headline-md text-amazon-dark">{product.name || 'Your Item'}</p>
                    <p className="text-price-lg font-price-lg text-primary">{refundAmount}</p>
                    <p className="text-body-sm text-secondary mt-1">
                      AI Grade: <span className="font-bold">{grading.grade || '—'}</span> • Score: <span className="font-bold">{grading.score || '—'}/100</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-4">

              {/* Option 1: Sell on ReLoop (Recommended if route is RESELL) */}
              <div className={`relative bg-white border-2 p-6 rounded-xl shadow-md transition-all duration-300 ${
                routing.chosenRoute === 'RESELL' ? 'border-primary-container scale-[1.02]' : 'border-border-subtle'
              }`}>
                {routing.chosenRoute === 'RESELL' && (
                  <div className="absolute -top-3 left-6 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-label-bold font-label-bold">
                    RECOMMENDED &amp; MOST SUSTAINABLE
                  </div>
                )}
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="bg-primary-container/10 p-3 rounded-full h-fit">
                      <span className="material-symbols-outlined text-primary-container scale-125">storefront</span>
                    </div>
                    <div>
                      <h3 className="text-title-lg font-title-lg text-amazon-dark mb-1">Sell on ReLoop</h3>
                      <p className="text-body-md font-body-md text-secondary mb-4 leading-relaxed">
                        Your item has been graded <span className="font-bold text-reloop-green">{grading.grade || 'A'}</span>. 
                        Avoid logistics waste and get instant cash plus environmental rewards.
                      </p>
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className="bg-surface-container px-3 py-2 rounded">
                          <p className="text-label-caps text-secondary uppercase">Credits Earned</p>
                          <p className="text-title-lg font-bold text-reloop-green">+{gradingResult?.creditsAwarded || 0}</p>
                        </div>
                        <div className="bg-reloop-green/10 px-3 py-2 rounded border border-reloop-green/20">
                          <p className="text-label-caps text-reloop-green uppercase">Route</p>
                          <p className="text-title-lg font-bold text-reloop-green">{routing.chosenRoute || 'RESELL'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('/marketplace')}
                        className="bg-gradient-to-b from-[#FFC400] to-[#FF9900] text-black border border-[#a88734] font-label-bold text-label-bold py-3 px-8 rounded shadow-sm hover:opacity-90 active:scale-95 transition-all w-full md:w-auto uppercase tracking-wide"
                      >
                        List and Sell Instantly
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Option 2: Donate */}
              <div className="bg-white border border-border-subtle p-6 rounded-lg transition-all duration-200 cursor-pointer hover:border-reloop-green/60">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="bg-reloop-green/10 p-3 rounded-full h-fit">
                      <span className="material-symbols-outlined text-reloop-green scale-125">volunteer_activism</span>
                    </div>
                    <div>
                      <h3 className="text-title-lg font-title-lg text-amazon-dark mb-1">Donate &amp; Earn Credits</h3>
                      <p className="text-body-md font-body-md text-secondary mb-3 leading-relaxed">
                        Give to a local NGO. We'll handle the verification and give you a full refund plus a massive sustainability boost.
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-price-lg font-bold text-amazon-dark">Refund {refundAmount}</span>
                        <span className="text-reloop-green font-label-bold text-label-bold bg-reloop-green/10 px-2 py-1 rounded">
                          +{(gradingResult?.creditsAwarded || 0) * 2} Credits
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </div>
              </div>

              {/* Option 3: Standard Return */}
              <div className="bg-white border border-border-subtle p-6 rounded-lg transition-all duration-200 cursor-pointer opacity-70 hover:opacity-100">
                <div className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="bg-surface-container-high p-3 rounded-full h-fit">
                      <span className="material-symbols-outlined text-secondary scale-125">local_shipping</span>
                    </div>
                    <div>
                      <h3 className="text-title-lg font-title-lg text-amazon-dark mb-1">Standard Return</h3>
                      <p className="text-body-md font-body-md text-secondary mb-3">
                        Traditional courier pickup. Higher carbon footprint from shipping back to the warehouse.
                      </p>
                      <div className="flex items-center gap-4">
                        <span className="text-price-lg font-bold text-amazon-dark">Refund {refundAmount}</span>
                        <span className="text-secondary text-body-sm font-body-sm italic">No Credits earned</span>
                      </div>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-outline">chevron_right</span>
                </div>
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-8 p-4 bg-surface-container rounded-lg border border-border-subtle">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-reloop-green">energy_savings_leaf</span>
                <p className="text-body-sm font-body-sm text-on-surface-variant">
                  Choosing <span className="font-bold">Sell</span> or <span className="font-bold">Donate</span> saves approximately <span className="text-reloop-green font-bold">1.2kg of CO2 emissions</span> for this specific logistics route.
                </p>
              </div>
            </div>
            <button onClick={() => navigate('/my-returns')} className="mt-12 w-full text-secondary font-label-bold text-label-bold hover:underline">
              View My Returns
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
