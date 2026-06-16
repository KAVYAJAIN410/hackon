import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useUser } from '../context/UserContext';
import api from '../lib/api';

// ─── Order List ────────────────────────────────────────────────────────────────
function OrderList({ orders, loading, onSelect }) {
  if (loading) return (
    <div className="space-y-3">
      {[1,2,3].map(i => (
        <div key={i} className="bg-white border border-[#D5D9D9] rounded-lg p-4 animate-pulse">
          <div className="h-4 bg-[#EAEDED] rounded w-1/2 mb-2" />
          <div className="h-3 bg-[#EAEDED] rounded w-1/3" />
        </div>
      ))}
    </div>
  );
  if (!orders.length) return (
    <div className="text-center py-16 text-[#565959]">
      <span className="material-symbols-outlined text-5xl block mb-3">local_shipping</span>
      No assigned pickups right now.
    </div>
  );
  return (
    <div className="space-y-3">
      {orders.map(o => (
        <button key={o.id} onClick={() => onSelect(o)}
          className="w-full text-left bg-white border border-[#D5D9D9] rounded-lg p-4 hover:border-[#007185] transition-colors shadow-sm"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-[#0F1111] text-sm">{o.order?.product?.name || o.id}</p>
              <p className="text-xs text-[#565959] mt-0.5">{o.user?.name} • {o.user?.city}</p>
              <p className="text-xs text-[#565959] mt-0.5">Reason: {o.reason?.replace(/_/g, ' ')}</p>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
              o.status === 'INITIATED' ? 'bg-blue-100 text-blue-700' :
              o.status === 'GRADED'    ? 'bg-green-100 text-green-700' :
              'bg-gray-100 text-gray-600'
            }`}>{o.status}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── Order Detail + Photo Grading ──────────────────────────────────────────────
function OrderDetail({ order, onBack, onComplete }) {
  const fileInputRef = useRef(null);
  const [files, setFiles]           = useState([]);
  const [previews, setPreviews]     = useState([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult]         = useState(null);
  const [error, setError]           = useState(null);

  const handleFiles = (e) => {
    const picked = Array.from(e.target.files).slice(0, 5);
    setFiles(prev => [...prev, ...picked].slice(0, 5));
    setPreviews(prev => [...prev, ...picked.map(f => URL.createObjectURL(f))].slice(0, 5));
  };

  const handleGrade = async () => {
    if (!files.length) { setError('Please upload at least one photo.'); return; }
    setProcessing(true); setError(null);
    try {
      const fd = new FormData();
      fd.append('returnId', order.id);
      files.forEach(f => fd.append('images', f));
      const res = await api.postFormData('/grading', fd);
      setResult(res);
    } catch (err) {
      setError(err.message || 'Grading failed.');
    } finally {
      setProcessing(false);
    }
  };

  if (result) {
    const g = result.grading || {};
    const passed = g.grade && ['A+', 'A', 'B'].includes(g.grade);
    return (
      <div className="bg-white border border-[#D5D9D9] rounded-lg p-6 shadow-sm">
        <div className={`flex items-center gap-3 mb-6 p-4 rounded-lg ${passed ? 'bg-[#F0FDF4]' : 'bg-red-50'}`}>
          <span className={`material-symbols-outlined text-3xl ${passed ? 'text-[#067D62]' : 'text-red-500'}`}>
            {passed ? 'check_circle' : 'cancel'}
          </span>
          <div>
            <p className={`font-bold text-lg ${passed ? 'text-[#067D62]' : 'text-red-600'}`}>
              {passed ? 'Item Verified — Return Accepted' : 'Item Condition Poor — Flagged'}
            </p>
            <p className="text-sm text-[#565959]">{result.message}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          {[
            ['Grade', `Grade ${g.grade}`],
            ['Score', `${g.score}/100`],
            ['Confidence', `${g.confidence}%`],
            ['Route', result.routing?.chosenRoute],
          ].map(([k, v]) => (
            <div key={k} className="bg-[#F7F8F8] rounded p-3">
              <p className="text-xs text-[#565959] uppercase font-bold">{k}</p>
              <p className="font-bold text-[#0F1111] mt-1">{v || '—'}</p>
            </div>
          ))}
        </div>
        {g.conditionSummary && <p className="text-sm text-[#565959] italic mb-6">{g.conditionSummary}</p>}
        <button onClick={onComplete}
          className="w-full bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-3 rounded-lg hover:bg-[#F7CA00]"
        >
          Done — Back to Pickups
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="flex items-center gap-1 text-[#007185] text-sm hover:underline">
        <span className="material-symbols-outlined text-base">arrow_back</span> Back to Pickups
      </button>

      {/* Order details card */}
      <div className="bg-white border border-[#D5D9D9] rounded-lg p-5 shadow-sm">
        <h2 className="font-bold text-[#0F1111] text-lg mb-4">Pickup Details</h2>
        <div className="flex gap-4 mb-4">
          {(order.order?.product || order.product)?.imageUrl
            ? <img src={(order.order?.product || order.product).imageUrl} alt={(order.order?.product || order.product).name} className="w-20 h-20 object-cover rounded border border-[#D5D9D9]" />
            : <div className="w-20 h-20 bg-[#EAEDED] rounded flex items-center justify-center"><span className="material-symbols-outlined text-[#565959]">inventory_2</span></div>
          }
          <div className="text-sm space-y-1">
            <p className="font-bold text-[#0F1111]">{(order.order?.product || order.product)?.name || order.id}</p>
            <p className="text-[#565959]">Customer: <span className="font-medium">{order.user?.name}</span></p>
            <p className="text-[#565959]">Address: <span className="font-medium">{order.user?.city}</span></p>
            <p className="text-[#565959]">Return ID: <span className="font-medium">{order.id}</span></p>
            <p className="text-[#565959]">Reason: <span className="font-medium">{order.reason?.replace(/_/g, ' ')}</span></p>
          </div>
        </div>
      </div>

      {/* Photo upload */}
      <div className="bg-white border border-[#D5D9D9] rounded-lg p-5 shadow-sm">
        <h2 className="font-bold text-[#0F1111] mb-1">Verify Item Condition</h2>
        <p className="text-xs text-[#565959] mb-4">Take clear photos of the item to run AI grading and confirm its condition.</p>

        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
        <div onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#D5D9D9] rounded-lg p-8 flex flex-col items-center cursor-pointer hover:border-[#007185] hover:bg-[#F7F8F8] transition-colors mb-4"
        >
          <span className="material-symbols-outlined text-3xl text-[#565959] mb-2">add_a_photo</span>
          <p className="text-sm font-bold text-[#0F1111]">Click to take / upload photos</p>
          <p className="text-xs text-[#565959]">Max 5 images</p>
        </div>

        {previews.length > 0 && (
          <div className="grid grid-cols-5 gap-2 mb-4">
            {previews.map((url, i) => (
              <div key={i} className="aspect-square rounded overflow-hidden border border-[#D5D9D9]">
                <img src={url} alt={`photo-${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

        <button onClick={handleGrade} disabled={processing || !files.length}
          className="w-full bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-3 rounded-lg hover:bg-[#F7CA00] disabled:opacity-50 transition-colors"
        >
          {processing
            ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-[#0F1111] border-t-transparent rounded-full animate-spin"/>Grading...</span>
            : 'Grade & Confirm Return'
          }
        </button>
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────────────────────────────────────
export default function DeliveryDashboard() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [selected, setSelected]   = useState(null);

  useEffect(() => {
    if (!currentUser){
      return;
     } 
    
    // Fetch returns dynamically filtered by this associate's ID
    api.get(`/returns/by-associate?associate_id=${currentUser.id}`)
      .then(data => {
        
        const pending = Array.isArray(data) ? data : [];
        setOrders(pending);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [currentUser]);

  // Guard: only delivery partners can access
  if (currentUser && currentUser.role !== 'DELIVERY_PARTNER') {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <span className="material-symbols-outlined text-5xl text-[#565959] block mb-3">lock</span>
            <h2 className="text-xl font-bold text-[#0F1111] mb-2">Access Restricted</h2>
            <p className="text-[#565959]">This dashboard is only for Delivery Partners.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-[#FF9900] text-3xl">local_shipping</span>
            <div>
              <h1 className="text-xl font-bold text-[#0F1111]">Delivery Partner Dashboard</h1>
              <p className="text-sm text-[#565959]">Hello, {currentUser?.name || 'Partner'}</p>
            </div>
          </div>

          {selected
            ? <OrderDetail order={selected} onBack={() => setSelected(null)} onComplete={() => { setSelected(null); setOrders(prev => prev.filter(o => o.id !== selected.id)); }} />
            : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-[#0F1111]">Assigned Pickups</h2>
                  <span className="text-sm text-[#565959] font-bold">{orders.length} PENDING</span>
                </div>
                <OrderList orders={orders} loading={loading} onSelect={setSelected} />
              </>
            )
          }
        </div>
      </main>
      <Footer />
    </div>
  );
}
