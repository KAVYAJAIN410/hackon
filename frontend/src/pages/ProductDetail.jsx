import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { SkeletonBox } from '../components/ui/SkeletonCard';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import api from '../lib/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { addToCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [error, setError] = useState(null);
  const [buying, setBuying] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);

  useEffect(() => {
    if (!id || !currentUser) return;
    setIsLoading(true);
    api.get(`/marketplace/${id}`)
      .then((data) => {
        setItem(data);
        setSelectedGrade(data.defaultGrade);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id, currentUser?.id]);

  // Get the currently selected grade entry
  const currentGrade = item?.availableGrades?.find(g => g.grade === selectedGrade) || item?.availableGrades?.[0];
  // First inventory item for the selected grade (full details incl. grading + shipping)
  const currentItem = currentGrade?.items?.[0];

  const handleBuy = async () => {
    if (!currentUser || buying || !currentItem) return;
    setBuying(true);
    try {
      const result = await api.post(`/marketplace/${currentItem.inventoryItemId}/buy`, {});
      setPurchaseResult(result);
    } catch (err) {
      alert('Purchase failed: ' + err.message);
    } finally {
      setBuying(false);
    }
  };

  const handleAddToCart = () => {
    if (!item || !currentGrade || !currentItem) return;
    const product = item.product || {};
    addToCart({
      id: currentItem.inventoryItemId,
      title: product.name || 'Product',
      price: currentGrade.sellingPrice || 0,
      grade: `Grade ${currentGrade.grade}`,
      image: product.imageUrl || '',
      savesCO2: currentGrade.discountPct ? (currentGrade.discountPct * 0.1).toFixed(1) : '0.5',
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
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
        <main className="flex-grow flex items-center justify-center px-4 py-10">
          <div className="max-w-md w-full bg-white border border-[#D5D9D9] rounded-2xl shadow-lg overflow-hidden">
            {/* Green header banner */}
            <div className="bg-gradient-to-br from-[#067D62] to-[#2DC071] px-8 py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur rounded-full mb-3">
                <span className="material-symbols-outlined text-4xl text-white">check_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Order Confirmed!</h2>
              <p className="text-white/90 text-sm mt-1">{purchaseResult.message}</p>
            </div>

            {/* Order details */}
            <div className="p-6">
              {/* Product line */}
              <div className="flex items-center gap-3 pb-4 border-b border-[#EAEDED]">
                {purchaseResult.productImage && (
                  <img src={purchaseResult.productImage} alt={purchaseResult.productName}
                    className="w-14 h-14 object-contain bg-[#F7F8F8] rounded-lg p-1" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#0F1111] line-clamp-1">{purchaseResult.productName}</p>
                  <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 bg-[#F0FDF4] text-reloop-green rounded">
                    Grade {purchaseResult.grade} · Certified Refurbished
                  </span>
                </div>
              </div>

              {/* Order summary */}
              <div className="py-4 space-y-2.5 border-b border-[#EAEDED]">
                <div className="flex justify-between text-sm">
                  <span className="text-[#565959]">Order Number</span>
                  <span className="font-bold text-[#0F1111] font-mono">{purchaseResult.orderNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#565959]">Item Price</span>
                  <span className="text-[#0F1111]">₹{parseFloat(purchaseResult.sellingPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#565959]">Shipping</span>
                  <span className="text-[#0F1111]">
                    {purchaseResult.shippingCost === 0 ? 'FREE' : `₹${parseFloat(purchaseResult.shippingCost || 0).toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-1">
                  <span className="text-[#0F1111]">Total Paid</span>
                  <span className="text-[#0F1111]">₹{parseFloat(purchaseResult.totalPrice || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Delivery + credits */}
              <div className="py-4 space-y-2.5">
                <div className="flex items-center gap-2 text-sm">
                  <span className="material-symbols-outlined text-[#007185] text-[18px]">local_shipping</span>
                  <span className="text-[#565959]">
                    Estimated delivery in <span className="font-bold text-[#0F1111]">{purchaseResult.estimatedDays || 3} day{(purchaseResult.estimatedDays || 3) > 1 ? 's' : ''}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm bg-[#F0FDF4] rounded-lg p-3">
                  <span className="material-symbols-outlined text-reloop-green text-[18px]">eco</span>
                  <span className="text-[#0F1111]">
                    You earned <span className="font-bold text-reloop-green">+{purchaseResult.creditsAwarded} Green Credits</span> for choosing refurbished!
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-2">
                <button onClick={() => navigate('/marketplace')}
                  className="flex-1 px-4 py-2.5 bg-white border border-[#D5D9D9] rounded-lg text-sm font-bold hover:bg-[#F7F8F8] transition-colors">
                  Continue Shopping
                </button>
                <button onClick={() => navigate('/green-profile')}
                  className="flex-1 px-4 py-2.5 bg-[#FFD814] border border-[#FCD200] rounded-lg text-sm font-bold hover:bg-[#F7CA00] transition-colors">
                  View Green Profile
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const grading = currentItem?.grading || {};
  const shipping = currentItem?.shipping || {};
  const product = item.product || {};
  const sellingPrice = currentGrade?.sellingPrice || 0;
  const basePrice = item.mrp || 0;
  const discountPct = basePrice && sellingPrice
    ? Math.round((1 - sellingPrice / basePrice) * 100)
    : 0;

  const GRADE_BADGE = {
    'A+': 'bg-reloop-green text-white',
    'A': 'bg-[#16a34a] text-white',
    'B': 'bg-[#d97706] text-white',
    'C': 'bg-[#c2410c] text-white',
    'D': 'bg-[#b91c1c] text-white',
    'F': 'bg-[#7f1d1d] text-white',
  };

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
                    AI-VERIFIED GRADE {currentGrade?.grade}
                  </div>
                </div>

                {/* Actual condition photos (for inspected/refurbished items) */}
                {currentItem?.images?.length > 0 && (
                  <div className="bg-white border border-border-subtle rounded p-4">
                    <p className="text-xs font-bold text-[#565959] uppercase tracking-wider mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-reloop-green">photo_camera</span>
                      Actual Product Photos (AI-Verified Condition)
                    </p>
                    <div className="grid grid-cols-4 gap-2">
                      {currentItem.images.map((img, i) => (
                        <div key={i} className="aspect-square rounded overflow-hidden border border-[#D5D9D9] bg-[#F7F8F8]">
                          <img src={img.imageUrl} alt={`condition-${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-[#565959] mt-2 italic">These are real photos of this exact item, verified by AI grading.</p>
                  </div>
                )}
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-7 flex flex-col gap-stack-md">

                <div>
                  <h1 className="font-display-lg text-display-lg text-on-surface mb-1">
                    ReLoop Certified: {product.name}
                  </h1>
                  {currentItem?.source === 'OUTGROWN' && (
                    <div className="flex items-center gap-2 bg-[#F3E8FF] border border-[#7C3AED]/30 rounded-lg px-3 py-2 mb-2">
                      <span className="material-symbols-outlined text-[#7C3AED] text-[20px]">recycling</span>
                      <div>
                        <p className="text-sm font-bold text-[#7C3AED]">Pre-Loved · Resold by Original Owner</p>
                        <p className="text-[11px] text-[#565959]">This item was previously owned and traded in through ReLoop, then AI-verified for resale.</p>
                      </div>
                    </div>
                  )}
                  {item.ageLabel && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C45500] bg-[#FFF4E5] px-2 py-1 rounded mb-2">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {item.ageLabel}
                    </span>
                  )}
                  {product.description && (
                    <p className="text-body-sm text-secondary mb-2">{product.description}</p>
                  )}
                  <hr className="border-border-subtle my-2"/>
                  <div className="flex items-baseline gap-2 py-2">
                    <span className="text-body-sm text-secondary self-start mt-1">₹</span>
                    <span className="font-price-lg text-price-lg">{sellingPrice.toLocaleString()}</span>
                    <span className="text-body-sm text-secondary line-through">₹{basePrice.toLocaleString()}</span>
                    {discountPct > 0 && (
                      <span className="text-reloop-green font-label-bold text-label-bold">{discountPct}% Savings</span>
                    )}
                  </div>

                  {/* Grade Selector — like Cashify's Fair/Good/Superb */}
                  <div className="mb-4">
                    <p className="text-body-sm font-bold text-on-surface mb-2">Condition</p>
                    <div className="flex flex-wrap gap-2">
                      {item.availableGrades?.map((g) => {
                        const isSelected = g.grade === selectedGrade;
                        return (
                          <button
                            key={g.grade}
                            onClick={() => setSelectedGrade(g.grade)}
                            className={`px-4 py-2 rounded-lg border text-sm font-bold transition-all ${
                              isSelected
                                ? 'border-reloop-green bg-[#F0FDF4] text-reloop-green ring-1 ring-reloop-green'
                                : 'border-[#D5D9D9] bg-white text-[#0F1111] hover:border-reloop-green'
                            }`}
                          >
                            <div className="flex flex-col items-start">
                              <span>Grade {g.grade} · {g.gradeLabel}</span>
                              <span className="text-[11px] font-normal text-secondary">
                                ₹{g.sellingPrice.toLocaleString()}
                                {g.quantity > 1 && ` · ${g.quantity} available`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
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
                        <p className="text-body-md font-bold">AI Confidence: {grading.confidence ? Math.round(grading.confidence * 100) : '—'}%</p>
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
                        <span className="text-secondary">Last Mile Delivery</span>
                        <span className="font-bold">₹{(shipping.totalShipping || 0) - (shipping.transferCost || 0)}</span>
                      </div>
                      <div className="flex justify-between text-body-sm border-t border-border-subtle pt-2">
                        <span className="text-secondary font-bold">You Pay</span>
                        <span className="font-bold text-reloop-green">₹{shipping.totalShipping || 0}</span>
                      </div>
                      <div className="flex justify-between text-body-sm">
                        <span className="text-secondary">Estimated Delivery</span>
                        <span className="font-bold">{shipping.estimatedDays || '—'} day{(shipping.estimatedDays || 0) > 1 ? 's' : ''}</span>
                      </div>
                      {currentItem?.isNearYou && (
                        <div className="bg-[#F0FDF4] p-2 rounded text-[11px] text-center text-reloop-green font-bold">
                          📍 This item is near you — reduced carbon footprint!
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
                        onClick={handleAddToCart}
                        className={`w-full font-label-bold py-3 rounded shadow-sm transition-all active:scale-95 ${
                          addedToCart
                            ? 'bg-[#2DC071] text-white'
                            : 'bg-[#FFD814] border border-[#FCD200] hover:bg-[#F7CA00] text-[#0F1111]'
                        }`}
                      >
                        {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                      </button>
                      <button
                        onClick={handleBuy}
                        disabled={buying}
                        className="w-full bg-[#FFA41C] hover:opacity-90 active:scale-95 transition-all text-[#0F1111] font-label-bold py-3 rounded shadow-sm disabled:opacity-50"
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
