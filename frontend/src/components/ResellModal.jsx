import React, { useState, useEffect, useRef } from 'react';
import api from '../lib/api';

/**
 * Multi-step resell (Outgrown It) flow — Cashify-style.
 * Steps: 1) condition questions  2) photos  3) evaluating  4) result
 */
export default function ResellModal({ order, onClose, onListed }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [questionData, setQuestionData] = useState(null);
  const [answers, setAnswers] = useState({}); // { q1: 'option', ... }

  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  // Load AI-generated questions
  useEffect(() => {
    setLoading(true);
    api.get(`/resell/${order.id}/questions`)
      .then((data) => {
        setQuestionData(data);
        // Pre-select first option for each question
        const init = {};
        (data.questions || []).forEach(q => { init[q.id] = q.options?.[0] || ''; });
        setAnswers(init);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [order.id]);

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files).slice(0, 5);
    setFiles(prev => [...prev, ...picked].slice(0, 5));
    setPreviews(prev => [...prev, ...picked.map(f => URL.createObjectURL(f))].slice(0, 5));
  };

  const allAnswered = questionData?.questions?.every(q => answers[q.id]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setStep(3); // evaluating
    try {
      const fd = new FormData();
      const answerPayload = (questionData.questions || []).map(q => ({
        question: q.question,
        answer: answers[q.id],
      }));
      fd.append('answers', JSON.stringify(answerPayload));
      files.forEach(f => fd.append('images', f));

      const res = await api.postFormData(`/resell/${order.id}/list`, fd);
      setResult(res);
      setStep(4);
      if (res.listed && onListed) onListed(order.id, res);
    } catch (err) {
      setError(err.message || 'Failed to list product');
      setStep(2);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEDED] sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-bold text-[#0F1111]">Trade-In Assessment</h2>
            <p className="text-xs text-[#565959]">{order.product?.name}</p>
          </div>
          <button onClick={onClose} className="text-[#565959] hover:text-[#0F1111]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Progress dots */}
        {step < 4 && (
          <div className="flex items-center gap-2 px-6 pt-4">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 flex-1 rounded-full ${step >= s ? 'bg-[#2DC071]' : 'bg-[#EAEDED]'}`} />
            ))}
          </div>
        )}

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center py-12">
              <div className="w-10 h-10 border-4 border-[#2DC071] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-[#565959]">Generating condition questions...</p>
            </div>
          ) : error && step !== 2 ? (
            <div className="text-center py-8">
              <span className="material-symbols-outlined text-4xl text-red-500 mb-2">error</span>
              <p className="text-sm text-red-600">{error}</p>
              <button onClick={onClose} className="mt-4 text-[#007185] text-sm hover:underline">Close</button>
            </div>
          ) : (
            <>
              {/* STEP 1: Condition questions */}
              {step === 1 && questionData && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 bg-[#F7F8F8] rounded-lg p-3">
                    <span className="material-symbols-outlined text-[#FF9900]">schedule</span>
                    <span className="text-sm text-[#0F1111]">
                      This product is <span className="font-bold">{questionData.ageLabel}</span> — age affects its resale value.
                    </span>
                  </div>

                  {questionData.questions.map((q, i) => (
                    <div key={q.id}>
                      <p className="text-sm font-bold text-[#0F1111] mb-2">{i + 1}. {q.question}</p>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map(opt => (
                          <button
                            key={opt}
                            onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                              answers[q.id] === opt
                                ? 'border-[#2DC071] bg-[#F0FDF4] text-[#067D62] ring-1 ring-[#2DC071]'
                                : 'border-[#D5D9D9] bg-white text-[#0F1111] hover:border-[#2DC071]'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setStep(2)}
                    disabled={!allAnswered}
                    className="w-full bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-2.5 rounded-lg hover:bg-[#F7CA00] disabled:opacity-50 transition-colors mt-2"
                  >
                    Continue to Photos
                  </button>
                </div>
              )}

              {/* STEP 2: Photos */}
              {step === 2 && (
                <div className="space-y-4">
                  <p className="text-sm text-[#565959]">Upload clear photos of the product so our AI can verify its condition. (Max 5)</p>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
                  <div onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#D5D9D9] rounded-lg p-8 flex flex-col items-center cursor-pointer hover:border-[#2DC071] hover:bg-[#F7F8F8] transition-colors"
                  >
                    <span className="material-symbols-outlined text-3xl text-[#565959] mb-2">add_a_photo</span>
                    <p className="text-sm font-bold text-[#0F1111]">Click to upload photos</p>
                    <p className="text-xs text-[#565959]">Front, back, and any wear/damage close-ups</p>
                  </div>

                  {previews.length > 0 && (
                    <div className="grid grid-cols-5 gap-2">
                      {previews.map((url, i) => (
                        <div key={i} className="aspect-square rounded overflow-hidden border border-[#D5D9D9]">
                          <img src={url} alt={`p-${i}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {error && <p className="text-xs text-red-600">{error}</p>}

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="flex-1 border border-[#D5D9D9] py-2.5 rounded-lg text-sm font-bold hover:bg-[#F7F8F8]">
                      Back
                    </button>
                    <button onClick={handleSubmit} disabled={submitting}
                      className="flex-1 bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-2.5 rounded-lg hover:bg-[#F7CA00] disabled:opacity-50">
                      Get My Quote
                    </button>
                  </div>
                  <p className="text-[11px] text-center text-[#565959]">You can submit without photos, but photos improve grading accuracy.</p>
                </div>
              )}

              {/* STEP 3: Evaluating */}
              {step === 3 && (
                <div className="flex flex-col items-center py-12">
                  <div className="w-12 h-12 border-4 border-[#2DC071] border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="font-bold text-[#0F1111] mb-1">AI is assessing your product...</p>
                  <p className="text-sm text-[#565959]">Analyzing photos and your answers</p>
                </div>
              )}

              {/* STEP 4: Result */}
              {step === 4 && result && (
                <div className="text-center">
                  {result.listed ? (
                    <>
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F0FDF4] rounded-full mb-3">
                        <span className="material-symbols-outlined text-4xl text-[#067D62]">check_circle</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0F1111] mb-1">Listed Successfully!</h3>
                      <p className="text-sm text-[#565959] mb-4">{result.message}</p>

                      <div className="bg-[#F7F8F8] rounded-lg p-4 text-left space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#565959]">AI Grade</span>
                          <span className="font-bold text-[#0F1111]">Grade {result.grade} · {result.gradeLabel}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#565959]">Listed Price</span>
                          <span className="font-bold text-[#0F1111]">₹{result.sellingPrice?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#565959]">Green Credits</span>
                          <span className="font-bold text-[#2DC071]">+{result.creditsAwarded}</span>
                        </div>
                      </div>
                      {result.grading?.conditionSummary && (
                        <p className="text-xs text-[#565959] italic mb-4">{result.grading.conditionSummary}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 rounded-full mb-3">
                        <span className="material-symbols-outlined text-4xl text-[#C45500]">info</span>
                      </div>
                      <h3 className="text-xl font-bold text-[#0F1111] mb-1">Not Suitable for Resale</h3>
                      <p className="text-sm text-[#565959] mb-4">{result.message}</p>
                      <div className="bg-[#F7F8F8] rounded-lg p-3 text-sm mb-4">
                        AI Grade: <span className="font-bold">Grade {result.grade}</span>
                      </div>
                    </>
                  )}
                  <button onClick={onClose}
                    className="w-full bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-2.5 rounded-lg hover:bg-[#F7CA00]">
                    Done
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
