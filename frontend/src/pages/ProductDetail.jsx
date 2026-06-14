import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { SkeletonBox } from '../components/ui/SkeletonCard';
import { useUser } from '../context/UserContext';
import api from '../lib/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);

  useEffect(() => {
    if (!id || !currentUser) return;
    setIsLoading(true);
    api.get(`/marketplace/${id}?user_id=${currentUser.id}`)
      .then(setItem)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, currentUser?.id]);

  const handleBuy = async () => {
    if (!currentUser || buying) return;
    setBuying(true);
    try {
      const result = await api.post(`/marketplace/${id}/buy`, { buyerId: currentUser.id });
      setPurchaseResult(result);
    } catch (err) {
      alert('Purchase failed: ' + err.message);
    } finally {
      setBuying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5">
                <SkeletonBox className="aspect-square w-full rounded-xl" />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <SkeletonBox className="h-8 w-4/5" />
                <SkeletonBox className="h-4 w-32" />
                <SkeletonBox className="h-10 w-40" />
                <SkeletonBox className="h-4 w-56" />
                <div className="grid grid-cols-2 gap-4">
                  <SkeletonBox className="h-36 rounded-xl" />
                  <SkeletonBox className="h-36 rounded-xl" />
                </div>
                <SkeletonBox className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <span className="material-symbols-outlined text-[64px] text-[#565959] mb-4">error</span>
            <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Product not found</h2>
            <p className="text-[#565959] mb-4">{error || 'This item may no longer be available.'}</p>
            <Link to="/marketplace" className="text-[#007185] hover:underline">← Back to Marketplace</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Purchase success overlay
  if (purchaseResult) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-lg w-full bg-white border border-[#D5D9D9] rounded-lg p-8 shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#067D62] text-white rounded-full mb-4">
              <span className="material-symbols-outlined text-4xl">check</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Purchase Successful!</h2>
            <p className="text-[#565959] mb-4">{purchaseResult.message}</p>
            <div className="bg-[#F0FDF4] border border-[#2DC071]/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#565959]">Order ID</span>
                <span className="font-bold text-[#0F1111]">{purchaseResult.order?.id}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#565959]">Total Price</span>
                <span className="font-bold text-[#0F1111]">₹{purchaseResult.order?.totalPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#565959]">Green Credits Earned</span>
                <span className="font-bold text-[#2DC071]">+{purchaseResult.creditsAwarded}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/marketplace')} className="flex-1 px-4 py-2 bg-white border border-[#D5D9D9] rounded-lg text-sm font-bold hover:bg-[#F7F8F8]">
                Continue Shopping
              </button>
              <button onClick={() => navigate('/green-profile')} className="flex-1 px-4 py-2 bg-[#FFD814] border border-[#FCD200] rounded-lg text-sm font-bold hover:bg-[#F7CA00]">
                View Green Profile
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const grading = item.grading || {};
  const shipping = item.shipping || {};
  const product = item.product || {};
  const discountPct = item.basePrice && item.sellingPrice
    ? Math.round((1 - parseFloat(item.sellingPrice) / parseFloat(item.basePrice)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="max-w-container-max mx-auto px-margin-desktop py-stack-md">

            <nav className="flex items-center gap-2 mb-4 text-body-sm text-secondary">
              <Link className="hover:underline" to="/marketplace">Marketplace</Link>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface">{product.name || 'Product'}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

              {/* Left: Image */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <div className="flex-1 bg-white border border-border-subtle rounded p-4 relative">
                  {product.imageUrl ? (
                    <img className="w-full h-auto object-contain aspect-square" alt={product.name} src={product.imageUrl} />
                  ) : (
                    <div className="w-full aspect-square flex items-center justify-center bg-gray-100 text-gray-400">No image</div>
                  )}
                  <div className="absolute top-4 left-4 bg-reloop-green text-white px-2 py-1 text-label-caps font-label-caps rounded flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    AI-VERIFIED GRADE {item.grade}
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-7 flex flex-col gap-stack-md">

                <div>
                  <h1 className="font-display-lg text-display-lg text-on-surface mb-1">
                    ReLoop Certified: {product.name}
                  </h1>
                  {product.description && (
                    <p className="text-body-sm text-secondary mb-2">{product.description}</p>
                  )}
                  <hr className="border-border-subtle my-2"/>
                  <div className="flex items-baseline gap-2 py-2">
                    <span className="text-body-sm text-secondary self-start mt-1">₹</span>
                    <span className="font-price-lg text-price-lg">{parseFloat(item.sellingPrice).toLocaleString()}</span>
                    <span className="text-body-sm text-secondary line-through">₹{parseFloat(item.basePrice).toLocaleString()}</span>
                    {discountPct > 0 && (
                      <span className="text-reloop-green font-label-bold text-label-bold">{discountPct}% Savings</span>
                    )}
                  </div>
                  <p className="text-body-sm text-secondary mb-4">
                    {shipping.totalShipping === 0 ? (
                      <span>Eligible for <span className="text-reloop-green font-bold">Free Eco-Shipping</span> to {currentUser?.city || 'you'}.</span>
                    ) : (
                      <span>Shipping: ₹{shipping.totalShipping} • Est. {shipping.estimatedDays} day{shipping.estimatedDays > 1 ? 's' : ''} delivery</span>
                    )}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Health Status Card */}
                  <div className="bg-surface-container-lowest border border-border-subtle p-4 rounded flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <span className="font-label-bold text-label-bold uppercase tracking-wider text-secondary">Health Status</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        grading.score >= 80 ? 'bg-reloop-green/10 text-reloop-green' :
                        grading.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {grading.score >= 80 ? 'EXCELLENT' : grading.score >= 60 ? 'GOOD' : 'FAIR'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 my-2">
                      <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center ${
                        grading.score >= 80 ? 'border-reloop-green' : grading.score >= 60 ? 'border-yellow-500' : 'border-red-500'
                      }`}>
                        <span className={`font-display-lg text-headline-md ${
                          grading.score >= 80 ? 'text-reloop-green' : grading.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                        }`}>{grading.score || '—'}</span>
                      </div>
                      <div>
                        <p className="text-body-md font-bold">AI Confidence: {grading.confidence || '—'}%</p>
                        <p className="text-body-sm text-secondary">{grading.conditionSummary || 'No grading data available.'}</p>
                      </div>
                    </div>
                    <div className="mt-2 space-y-1">
                      {grading.functionalNotes && (
                        <div className="flex items-center gap-2 text-body-sm">
                          <span className="material-symbols-outlined text-reloop-green text-[16px]">check_circle</span>
                          <span>{grading.functionalNotes}</span>
                        </div>
                      )}
                      {(grading.defectsFound || []).map((d, i) => (
                        <div key={i} className="flex items-center gap-2 text-body-sm">
                          <span className="material-symbols-outlined text-error text-[16px]">info</span>
                          <span className="text-on-surface-variant font-medium">Defect: {d.type} ({d.severity})</span>
                        </div>
                      ))}
                      {(grading.missingParts || []).map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-body-sm">
                          <span className="material-symbols-outlined text-error text-[16px]">warning</span>
                          <span className="text-on-surface-variant font-medium">Missing: {p}</span>
                        </div>
                      ))}
                      {(grading.defectsFound || []).length === 0 && (grading.missingParts || []).length === 0 && (
                        <div className="flex items-center gap-2 text-body-sm">
                          <span className="material-symbols-outlined text-reloop-green text-[16px]">check_circle</span>
                          <span>No defects found</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping & Impact Card */}
                  <div className="bg-surface-container-lowest border border-border-subtle p-4 rounded flex flex-col gap-2">
                    <span className="font-label-bold text-label-bold uppercase tracking-wider text-secondary">Shipping & Impact</span>
                    <div className="mt-2 space-y-3">
                      <div className="flex justify-between text-body-sm">
                        <span className="text-secondary">Transfer Cost</span>
                        <span className="font-bold">{shipping.transferCost === 0 ? 'FREE' : `₹${shipping.transferCost}`}</span>
                      </div>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-secondary">Last Mile</span>
                        <span className="font-bold">₹{shipping.lastMile || 0}</span>
                      </div>
                      <div className="flex justify-between text-body-sm border-t border-border-subtle pt-2">
                        <span className="text-secondary font-bold">Total Shipping</span>
                        <span className="font-bold text-reloop-green">₹{shipping.totalShipping || 0}</span>
                      </div>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-secondary">Estimated Delivery</span>
                        <span className="font-bold">{shipping.estimatedDays || '—'} day{(shipping.estimatedDays || 0) > 1 ? 's' : ''}</span>
                      </div>
                      {item.isNearYou && (
                        <div className="bg-[#F0FDF4] p-2 rounded text-[11px] text-center text-reloop-green font-bold">
                          📍 This item is near you — reduced carbon footprint!
                        </div>
                      )}
                      {item.demandSignal > 0 && (
                        <div className="bg-[#FFF8E1] p-2 rounded text-[11px] text-center text-[#F57C00] font-bold">
                          🔥 {item.demandSignal} people are viewing this item
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Buy Section */}
                <div className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm mt-2">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-title-lg font-title-lg">In Stock</p>
                        <p className="text-body-sm text-secondary">Ships from ReLoop {currentUser?.nearestDc?.city || ''} Center.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <button
                        onClick={handleBuy}
                        disabled={buying}
                        className="w-full bg-primary-container hover:opacity-90 active:scale-95 transition-all text-amazon-dark font-label-bold py-3 rounded shadow-sm disabled:opacity-50"
                      >
                        {buying ? 'Processing...' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={handleBuy}
                        disabled={buying}
                        className="w-full bg-[#FFA41C] hover:opacity-90 active:scale-95 transition-all text-amazon-dark font-label-bold py-3 rounded shadow-sm disabled:opacity-50"
                      >
                        {buying ? 'Processing...' : 'Buy Now'}
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-body-sm text-secondary">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">lock</span>
                        Secure Transaction
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[18px]">cached</span>
                        7-Day Returns
                      </div>
                    </div>
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
