import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

export default function ReturnFlow() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      navigate('/return-interception'); // Redirect to interception page on complete
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
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
                  {/* Background Line */}
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#D5D9D9] -translate-y-1/2 z-0"></div>

                  {/* Active Progress Line */}
                  <div 
                    className="absolute top-1/2 left-0 h-0.5 bg-[#E47911] -translate-y-1/2 z-0 transition-all duration-300" 
                    style={{ width: `${((step - 1) / 3) * 100}%` }}
                  ></div>

                  {/* Steps */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-[#008296] bg-[#F7F8F8] p-4 rounded-lg flex gap-4 cursor-pointer transition-colors shadow-sm ring-1 ring-[#008296]">
                        <img alt="Running Shoes" className="w-24 h-24 object-cover rounded bg-white p-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTMAtADsS05P5grYVjwv6RUm4Zpu3k09aD1iV-DddOwzu_SBtTV-KuK8MXBIWhQRMHE6oeoN7wy_7s7cWIOQg9F5Hm2_TU9vmHBXi6m-HL7qOIIzAYqNkCFcv2kMLf9FTGC0qOv4TqnZ7BEY0FsELVxfBZiOL6DDFouvXFni4CtKdIIRrv3IpLC4KwRpG9CSSgzZKzOhUo2alCqXRZVE46UffbfHK8QeIGbu-QTbPvOHrbU-YmrCIy-jG_hToSgG3Z7vzEye-6dS8"/>
                        <div>
                          <h3 className="text-sm font-bold text-[#007185]">Apex Runner Elite</h3>
                          <p className="text-xs text-[#565959] mb-2 mt-1">Ordered June 12, 2024</p>
                          <span className="px-2 py-1 bg-[#F4F8CB] text-[#0F1111] text-xs font-bold rounded-sm border border-[#D5D9D9]">Eligible for Return</span>
                        </div>
                      </div>
                      <div className="border border-[#D5D9D9] p-4 rounded-lg flex gap-4 opacity-60 bg-[#F7F8F8]">
                        <img alt="Mechanical Keyboard" className="w-24 h-24 object-cover rounded bg-white p-1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgJuujmVnN1hB-sIOG9aZBQ9Fmqx6qGC7WxO6G4bI75q_afxFzb0lu-uAc6pc3Qjb5gGPvcLx-rTpVJuXa3E_aL0PdJiVtxqBpxcdEzD5-oc9XpS3XtrXTPYzMdyjEt6UJrA-uz1IRPCJSuNPbaG8En7LWnbQ0YMduY6mhSC26kL8tpGZA8i_TZKTOIrjXgO3cX8Ihoi3eZvQTyUGWQXhTJa71NkmLE0uuWzwWDmaTmMJuyT-1O-RTqg67uglXuQJPYANj2RkN5to"/>
                        <div>
                          <h3 className="text-sm font-bold text-[#0F1111]">TypeMaster Pro K2</h3>
                          <p className="text-xs text-[#565959] mb-2 mt-1">Ordered May 04, 2024</p>
                          <span className="px-2 py-1 bg-[#EAEDED] text-[#565959] text-xs font-medium rounded-sm border border-[#D5D9D9]">Return window closed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: REASON */}
                {step === 2 && (
                  <div className="p-6 md:p-8 animate-in fade-in duration-300">
                    <h2 className="text-2xl font-bold mb-2 text-[#0F1111]">Why are you returning this?</h2>
                    <p className="text-sm text-[#565959] mb-6">Please choose a reason for return.</p>
                    <div className="space-y-0 border border-[#D5D9D9] rounded-lg overflow-hidden">
                      {['Too small / Tight fit', 'Doesn\'t match description', 'Performance not as expected', 'Found a better price elsewhere'].map((reason, i) => (
                        <label key={i} className="flex items-center p-4 bg-white border-b border-[#D5D9D9] cursor-pointer hover:bg-[#F7F8F8] transition-colors last:border-b-0">
                          <input defaultChecked={i===0} className="w-4 h-4 text-[#007185] border-[#888C8C] focus:ring-[#007185]" name="reason" type="radio"/>
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
                        <p className="text-sm text-[#565959] mt-1">Help us process your return faster by uploading a few clear photos.</p>
                      </div>
                    </div>
                    <div className="border-2 border-dashed border-[#D5D9D9] bg-[#F7F8F8] rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white hover:border-[#007185] transition-colors">
                      <span className="material-symbols-outlined text-4xl text-[#565959] mb-4">add_a_photo</span>
                      <p className="text-sm font-bold mb-1 text-[#0F1111]">Drag photos here or click to upload</p>
                      <p className="text-xs text-[#565959]">Upload front, sole, and internal tag views.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-8">
                      <div className="aspect-square bg-[#EAEDED] rounded-lg relative overflow-hidden flex items-center justify-center border border-[#D5D9D9]">
                        <img alt="Upload Preview" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCSwIU40wiXPDmvQo-dN5rZY8q65Qbs-TH_6w5Q9mdRCRXfOGsfVm_ZS1MKnooqeZdeNlM4F2PP3UPGdKqE5MoUvtgVvvqvO5E_PEiibvSCPb0KKhIPj40PrtRVWJOKzgcB0hHO7aMJrgHd332ah94VpkIk1FKWnkm-MLmr8caJ8HVUmjItTocsFb1kberc3zlYUe8tnusYDxF-mHrfrcWDYwrxA0MQUpbVat21I6Rs4bS4eEmcsVRSIwszEmONKUsWdb1ndft1_J4"/>
                        <div className="absolute bottom-2 right-2 bg-[#067D62] text-white p-1 rounded-full shadow">
                          <span className="material-symbols-outlined text-xs">check</span>
                        </div>
                      </div>
                      <div className="aspect-square bg-[#EAEDED] rounded-lg border border-[#D5D9D9] flex flex-col items-center justify-center relative overflow-hidden">
                        <span className="material-symbols-outlined animate-spin text-[#007185]">refresh</span>
                        <span className="text-xs font-bold mt-2 text-[#565959]">Processing...</span>
                      </div>
                      <div className="aspect-square bg-[#F7F8F8] rounded-lg border border-dashed border-[#D5D9D9] flex items-center justify-center text-[#565959] cursor-pointer hover:bg-white hover:border-[#007185]">
                        <span className="material-symbols-outlined">add</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: OUTCOME */}
                {step === 4 && (
                  <div className="p-6 md:p-8 animate-in fade-in duration-300">
                    <div className="mb-8 flex items-center gap-4">
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-[#067D62] text-white rounded-full">
                        <span className="material-symbols-outlined text-3xl">check</span>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-[#0F1111]">Return request authorized</h2>
                        <p className="text-sm text-[#565959] mt-1">Your item is eligible for return and refund.</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white border border-[#D5D9D9] p-6 rounded-lg">
                        <h3 className="text-base font-bold text-[#0F1111] mb-4 border-b border-[#D5D9D9] pb-2">Return Method</h3>
                        <div className="flex items-start gap-3 mb-4">
                          <input defaultChecked name="returnMethod" className="mt-1 text-[#007185] focus:ring-[#007185]" type="radio"/>
                          <div>
                            <p className="text-sm font-bold text-[#0F1111]">Amazon Hub Locker Drop-off</p>
                            <p className="text-sm text-[#007185] hover:underline cursor-pointer mb-1">Find a locker near you</p>
                            <p className="text-xs text-[#565959]"><span className="font-bold text-[#067D62]">FREE</span> No box or label needed.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <input name="returnMethod" className="mt-1 text-[#007185] focus:ring-[#007185]" type="radio"/>
                          <div>
                            <p className="text-sm font-bold text-[#0F1111]">Agent Pickup</p>
                            <p className="text-xs text-[#565959] mt-1"><span className="font-bold text-[#067D62]">FREE</span> ReLoop agent picks it up from your doorstep.</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#F7F8F8] border border-[#D5D9D9] p-6 rounded-lg">
                        <h3 className="text-base font-bold text-[#0F1111] mb-4 border-b border-[#D5D9D9] pb-2">Refund Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center text-sm text-[#0F1111]">
                            <span>Refund to Original Payment Method</span>
                            <span className="font-bold">₹12,499.00</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-[#565959]">
                            <span>Estimated processing time</span>
                            <span>3-5 business days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="mt-auto border-t border-[#D5D9D9] p-4 bg-[#F7F8F8] flex justify-between items-center rounded-b-lg">
                  <button 
                    onClick={handleBack}
                    className={`px-4 py-1.5 bg-white border border-[#D5D9D9] text-[#0F1111] text-sm font-medium rounded-lg shadow-sm hover:bg-[#F7F8F8] transition-all ${step === 1 ? 'invisible' : ''}`}
                  >
                    Back
                  </button>
                  <div className="flex gap-3">
                    <button onClick={handleCancel} className="px-4 py-1.5 bg-transparent border border-transparent text-[#007185] hover:text-[#C45500] hover:underline text-sm font-medium transition-all">
                      Cancel return
                    </button>
                    <button onClick={handleNext} className="px-6 py-1.5 bg-[#FFD814] border border-[#FCD200] text-[#0F1111] text-sm font-medium rounded-lg shadow-sm hover:bg-[#F7CA00] active:scale-95 transition-all">
                      {step === 4 ? 'Continue' : 'Next'}
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
                    <p className="text-lg font-bold text-[#0F1111]">₹12,499.00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 border border-[#D5D9D9] rounded-lg bg-[#F7F8F8]">
                  <div className="w-10 h-10 bg-white border border-[#D5D9D9] text-[#067D62] rounded-full flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined">eco</span>
                  </div>
                  <div>
                    <p className="text-xs text-[#565959] uppercase font-bold tracking-wider">Projected Saving</p>
                    <p className="text-lg font-bold text-[#0F1111]">4.2kg CO2e</p>
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
