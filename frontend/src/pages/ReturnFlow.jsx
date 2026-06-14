import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { SkeletonBox } from '../components/ui/SkeletonCard';
import { useUser } from '../context/UserContext';
import api from '../lib/api';

const REASON_MAP = {
  'Too small / Tight fit': 'SIZE_FIT',
  "Doesn't match description": 'DOESNT_MATCH',
  'Performance not as expected': 'PERFORMANCE',
  'Found a better price elsewhere': 'BETTER_PRICE',
};

export default function ReturnFlow() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const fileInputRef = useRef(null);

  // Data state
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReason, setSelectedReason] = useState('Too small / Tight fit');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  // Processing state
  const [processing, setProcessing] = useState(false);
  const [gradingResult, setGradingResult] = useState(null);
  const [returnData, setReturnData] = useState(null);

  // Load orders for step 1
  useEffect(() => {
    if (!currentUser) return;
    setLoadingOrders(true);
    api.get(`/orders?user_id=${currentUser.id}`)
      .then((data) => {
        const eligible = data.filter(o => o.status === 'DELIVERED' && !o.hasActiveReturn);
        setOrders(eligible);
        if (eligible.length > 0) setSelectedOrder(eligible[0]);
      })
      .catch((err) => console.error('Failed to load orders:', err))
      .finally(() => setLoadingOrders(false));
  }, [currentUser?.id]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setUploadedFiles(prev => [...prev, ...files].slice(0, 5));
    // Generate preview URLs
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviewUrls(prev => [...prev, ...urls].slice(0, 5));
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      // Step 3 → 4: Submit return + grading
      setProcessing(true);
      setStep(4);
      try {
        // 1. Create the return
        const returnResp = await api.post('/returns', {
          orderId: selectedOrder.id,
          userId: currentUser.id,
          reason: REASON_MAP[selectedReason] || 'SIZE_FIT',
        });
        setReturnData(returnResp);

        // 2. Grade the return with images
        const formData = new FormData();
        formData.append('returnId', returnResp.id);
        if (uploadedFiles.length > 0) {
          uploadedFiles.forEach(file => formData.append('images', file));
        }
        const gradeResp = await api.postFormData('/grading', formData);
        setGradingResult(gradeResp);
      } catch (err) {
        console.error('Return/grading failed:', err);
        alert('Return processing failed: ' + err.message);
        setStep(3);
      } finally {
        setProcessing(false);
      }
    } else if (step === 4) {
      // Navigate to interception page with grading data
      navigate('/return-interception', {
        state: {
          gradingResult,
          returnData,
          order: selectedOrder,
        }
      });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCancel = () => {
    navigate('/my-returns');
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <div className="flex-grow flex flex-col items-center py-8 px-4 md:px-12">
            <div className="w-full max-w-4xl">

              {/* Progress Bar Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#D5D9D9] -translate-y-1/2 z-0"></div>
                  <div
                    className="absolute top-1/2 left-0 h-0.5 bg-[#E47911] -translate-y-1/2 z-0 transition-all duration-300"
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  ></div>
                  {[
                    { num: 1, label: 'Item' },
                    { num: 2, label: 'Reason' },
                    { num: 3, label: 'Photos' },
                    { num: 4, label: 'Outcome' }
                  ].map((s) => {
                    const isActive = step >= s.num;
                    const isCurrent = step === s.num;
                    return (
                      <div key={s.num} className="flex flex-col items-center z-10 bg-[#f8f9fa] px-2 cursor-pointer" onClick={() => { if(s.num < step) setStep(s.num) }}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 shadow-[0_0_0_3px_#f8f9fa] transition-colors ${
                          isActive
                            ? 'bg-[#E47911] text-white'
                            : 'bg-[#EAEDED] border border-[#D5D9D9] text-[#565959]'
                        }`}>
                          {s.num}
                        </div>
                        <span className={`text-xs ${isCurrent ? 'font-bold text-[#0F1111]' : 'font-normal text-[#565959]'}`}>
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="bg-white border border-[#D5D9D9] rounded-lg shadow-sm overflow-hidden min-h-[500px] flex flex-col">

                {/* STEP 1: ITEM SELECTION */}
                {step === 1 && (
                  <div className="p-6 md:p-8 animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold mb-6 text-[#0F1111]">Select item to return</h2>
                    {loadingOrders ? (
                      <div className="space-y-4">
                        {[1,2].map(i => (
                          <div key={i} className="border border-[#D5D9D9] p-4 rounded-lg flex gap-4">
                            <SkeletonBox className="w-24 h-24 rounded" />
                            <div className="flex-1 space-y-2">
                              <SkeletonBox className="h-4 w-40" />
                              <SkeletonBox className="h-3 w-28" />
                              <SkeletonBox className="h-6 w-32" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : orders.length === 0 ? (
                      <p className="text-[#565959] text-center py-8">No eligible orders for return. Only delivered orders can be returned.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {orders.map((order) => {
                          const isSelected = selectedOrder?.id === order.id;
                          const product = order.product || {};
                          return (
                            <div
                              key={order.id}
                              onClick={() => setSelectedOrder(order)}
                              className={`border p-4 rounded-lg flex gap-4 cursor-pointer transition-colors shadow-sm ${
                                isSelected
                                  ? 'border-[#008296] bg-[#F7F8F8] ring-1 ring-[#008296]'
                                  : 'border-[#D5D9D9] hover:border-[#008296]'
                              }`}
                            >
                              {product.imageUrl ? (
                                <img alt={product.name} className="w-24 h-24 object-cover rounded bg-white p-1" src={product.imageUrl} />
                              ) : (
                                <div className="w-24 h-24 bg-[#EAEDED] rounded flex items-center justify-center">
                                  <span className="material-symbols-outlined text-[#565959]">inventory_2</span>
                                </div>
                              )}
                              <div>
                                <h3 className="text-sm font-bold text-[#007185]">{product.name}</h3>
                                <p className="text-xs text-[#565959] mb-2 mt-1">
                                  Ordered {new Date(order.orderedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                                <span className="px-2 py-1 bg-[#F4F8CB] text-[#0F1111] text-xs font-bold rounded-sm border border-[#D5D9D9]">
                                  Eligible for Return
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 2: REASON */}
                {step === 2 && (
                  <div className="p-6 md:p-8 animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold mb-2 text-[#0F1111]">Why are you returning this?</h2>
                    <p className="text-sm text-[#565959] mb-6">Please choose a reason for return.</p>
                    <div className="space-y-0 border border-[#D5D9D9] rounded-lg overflow-hidden">
                      {Object.keys(REASON_MAP).map((reason, i) => (
                        <label key={i} className="flex items-center p-4 bg-white border-b border-[#D5D9D9] cursor-pointer hover:bg-[#F7F8F8] transition-colors last:border-b-0">
                          <input
                            checked={selectedReason === reason}
                            onChange={() => setSelectedReason(reason)}
                            className="w-4 h-4 text-[#007185] border-[#888C8C] focus:ring-[#007185]"
                            name="reason"
                            type="radio"
                          />
                          <span className="ml-4 text-sm text-[#0F1111]">{reason}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: PHOTOS */}
                {step === 3 && (
                  <div className="p-6 md:p-8 animate-in fade-in duration-300">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-[#0F1111]">Upload item photos</h2>
                        <p className="text-sm text-[#565959] mt-1">Help us process your return faster by uploading a few clear photos (optional, max 5).</p>
                      </div>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#D5D9D9] bg-[#F7F8F8] rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-[#007185] transition-colors"
                    >
                      <span className="material-symbols-outlined text-4xl text-[#565959] mb-4">add_a_photo</span>
                      <p className="text-sm font-bold mb-1 text-[#0F1111]">Click to upload photos</p>
                      <p className="text-xs text-[#565959]">Upload front, back, and detail views. Max 5 images.</p>
                    </div>
                    {previewUrls.length > 0 && (
                      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                        {previewUrls.map((url, i) => (
                          <div key={i} className="aspect-square bg-[#EAEDED] rounded-lg relative overflow-hidden border border-[#D5D9D9]">
                            <img alt={`Upload ${i+1}`} className="w-full h-full object-cover" src={url} />
                            <div className="absolute bottom-2 right-2 bg-[#067D62] text-white p-1 rounded-full shadow">
                              <span className="material-symbols-outlined text-xs">check</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 4: OUTCOME */}
                {step === 4 && (
                  <div className="p-6 md:p-8 animate-in fade-in duration-300">
                    {processing ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <div className="w-16 h-16 border-4 border-[#E47911] border-t-transparent rounded-full animate-spin mb-6"></div>
                        <h2 className="text-xl font-bold text-[#0F1111] mb-2">Processing your return...</h2>
                        <p className="text-sm text-[#565959]">Our AI is grading your item. This may take a moment.</p>
                      </div>
                    ) : gradingResult ? (
                      <>
                        <div className="mb-8 flex items-center gap-4">
                          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#067D62] text-white rounded-full">
                            <span className="material-symbols-outlined text-3xl">check</span>
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-[#0F1111]">Return processed successfully!</h2>
                            <p className="text-sm text-[#565959] mt-1">{gradingResult.message}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* AI Grading Card */}
                          <div className="bg-white border border-[#D5D9D9] p-6 rounded-lg">
                            <h3 className="text-base font-bold text-[#0F1111] mb-4 border-b border-[#D5D9D9] pb-2">AI Grading Result</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-[#565959]">Grade</span>
                                <span className={`font-bold px-2 py-1 rounded text-xs ${
                                  gradingResult.grading?.grade === 'A' ? 'bg-green-100 text-green-700' :
                                  gradingResult.grading?.grade === 'B' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  Grade {gradingResult.grading?.grade}
                                </span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-[#565959]">Score</span>
                                <span className="font-bold text-[#0F1111]">{gradingResult.grading?.score}/100</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-[#565959]">Confidence</span>
                                <span className="font-bold text-[#0F1111]">{gradingResult.grading?.confidence}%</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-[#565959]">Route</span>
                                <span className="font-bold text-[#007185]">{gradingResult.routing?.chosenRoute}</span>
                              </div>
                              <p className="text-xs text-[#565959] mt-2 italic">{gradingResult.grading?.conditionSummary}</p>
                            </div>
                          </div>
                          {/* Credits & Routing Card */}
                          <div className="bg-[#F7F8F8] border border-[#D5D9D9] p-6 rounded-lg">
                            <h3 className="text-base font-bold text-[#0F1111] mb-4 border-b border-[#D5D9D9] pb-2">Credits & Routing</h3>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm text-[#0F1111]">
                                <span>Green Credits Earned</span>
                                <span className="font-bold text-[#2DC071] text-lg">+{gradingResult.creditsAwarded}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm text-[#0F1111]">
                                <span>Routing Decision</span>
                                <span className="font-bold">{gradingResult.routing?.chosenRoute}</span>
                              </div>
                              <p className="text-xs text-[#565959] italic mt-2">{gradingResult.routing?.reason}</p>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-[#565959] py-8">Something went wrong. Please try again.</p>
                    )}
                  </div>
                )}

                {/* Footer Controls */}
                <div className="mt-auto border-t border-[#D5D9D9] p-4 bg-[#F7F8F8] flex justify-between items-center rounded-b-lg">
                  <button
                    onClick={handleBack}
                    className={`px-4 py-1.5 bg-white border border-[#D5D9D9] text-[#0F1111] text-sm font-medium rounded-lg shadow-sm hover:bg-[#F7F8F8] transition-all ${step === 1 || processing ? 'invisible' : ''}`}
                  >
                    Back
                  </button>
                  <div className="flex gap-3">
                    <button onClick={handleCancel} className="px-4 py-1.5 bg-transparent border border-transparent text-[#007185] hover:text-[#C45500] hover:underline text-sm font-medium transition-all">
                      Cancel return
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={processing || (step === 1 && !selectedOrder)}
                      className="px-6 py-1.5 bg-[#FFD814] border border-[#FCD200] text-[#0F1111] text-sm font-medium rounded-lg shadow-sm hover:bg-[#F7CA00] active:scale-95 transition-all disabled:opacity-50"
                    >
                      {processing ? 'Processing...' : step === 4 ? 'View Options' : step === 3 ? 'Submit & Grade' : 'Next'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Cards */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-4 p-4 border border-[#D5D9D9] rounded-lg bg-[#F7F8F8]">
                  <div className="w-10 h-10 bg-white border border-[#D5D9D9] text-[#007185] rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#565959] uppercase font-bold tracking-wider">Estimated Refund</p>
                    <p className="text-lg font-bold text-[#0F1111]">
                      ₹{selectedOrder?.product?.mrp ? parseFloat(selectedOrder.product.mrp).toLocaleString() : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-[#D5D9D9] rounded-lg bg-[#F7F8F8]">
                  <div className="w-10 h-10 bg-white border border-[#D5D9D9] text-[#067D62] rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined">eco</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#565959] uppercase font-bold tracking-wider">Green Credits</p>
                    <p className="text-lg font-bold text-[#0F1111]">
                      {gradingResult ? `+${gradingResult.creditsAwarded} earned` : 'Earn credits by returning!'}
                    </p>
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
