import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const UserContext = createContext(null);

// Role mapping: backend roles → frontend display
const ROLE_DISPLAY = {
  CUSTOMER: 'User',
  ADMIN: 'Admin',
  DELIVERY_PARTNER: 'Delivery Partner',
  SELLER: 'Seller',
};

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // Restore session from stored token on mount
  useEffect(() => {
    const token = localStorage.getItem('reloop_token');
    if (!token) { setLoading(false); return; }
    api.get('/auth/me')
      .then(user => setCurrentUser({ ...user, displayRole: ROLE_DISPLAY[user.role] || user.role }))
      .catch(() => localStorage.removeItem('reloop_token'))
      .finally(() => setLoading(false));
  }, []);

  const handleProfileClick = () => {
    if (currentUser) setShowUserModal(true);
    else setShowLoginModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('reloop_token');
    setCurrentUser(null);
    setShowUserModal(false);
    window.location.href = '/';
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading, showLoginModal, setShowLoginModal, handleProfileClick }}>
      {children}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={(user, token) => {
            localStorage.setItem('reloop_token', token);
            const mapped = { ...user, displayRole: ROLE_DISPLAY[user.role] || user.role };
            setCurrentUser(mapped);
            setShowLoginModal(false);
            const role = user.role;
            if (role === 'DELIVERY_PARTNER') window.location.href = '/delivery-dashboard';
            else if (role === 'ADMIN') window.location.href = '/admin-dashboard';
          }}
        />
      )}
      {showUserModal && currentUser && (
        <UserDetailModal user={currentUser} onClose={() => setShowUserModal(false)} onLogout={handleLogout} />
      )}
    </UserContext.Provider>
  );
}

// ─── Demo accounts for judges (all use password: password123) ───
const DEMO_PASSWORD = 'password123';
const DEMO_ACCOUNTS = [
  {
    group: 'Shoppers',
    accent: '#1971c2',
    accounts: [
      { label: 'Vikram Patel', sub: 'Mumbai · 1,055 credits', email: 'vikram@email.com' },
      { label: 'Rohan Mehta', sub: 'Gurgaon · 1,075 credits', email: 'rohan@email.com' },
      { label: 'Priya Verma', sub: 'Jaipur · return demo', email: 'priya.v@email.com' },
    ],
  },
  {
    group: 'Sellers',
    accent: '#e8590c',
    accounts: [
      { label: 'Tech Gadgets Store', sub: 'Rahul Tech', email: 'seller.tech@email.com' },
      { label: 'Fashion Hub', sub: 'Neha Fashion', email: 'seller.fashion@email.com' },
    ],
  },
  {
    group: 'Delivery Partners',
    accent: '#6741d9',
    accounts: [
      { label: 'Rahul Kumar', sub: 'Delhi DC', email: 'del1@delivery.com' },
      { label: 'Manoj Gowda', sub: 'Bangalore DC', email: 'blr1@delivery.com' },
    ],
  },
  {
    group: 'Admin',
    accent: '#2f9e44',
    accounts: [
      { label: 'System Admin', sub: 'Full dashboard access', email: 'admin@hackon.com' },
    ],
  },
];

function LoginModal({ onClose, onLogin }) {
  const [tab, setTab] = useState('demo'); // 'demo' | 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', name: '', city: '', state: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState('');

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const doLogin = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    onLogin(res.user, res.token);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Email and password are required'); return; }
    setLoading(true);
    try {
      await doLogin(form.email, form.password);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (email) => {
    setError('');
    setDemoLoading(email);
    try {
      await doLogin(email, DEMO_PASSWORD);
    } catch (err) {
      setError(err.message || 'Demo login failed');
      setDemoLoading('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password || !form.name || !form.city || !form.state) {
      setError('All fields are required'); return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', {
        email: form.email, password: form.password,
        name: form.name, city: form.city, state: form.state,
      });
      onLogin(res.user, res.token);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-lg shadow-xl w-full mx-4 p-6"
        style={{ maxWidth: tab === 'demo' ? '480px' : '384px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#0F1111]">
            {tab === 'login' ? 'Sign In to ReLoop' : tab === 'register' ? 'Create Account' : '🎯 Demo Accounts'}
          </h2>
          <button onClick={onClose} className="text-[#565959] hover:text-[#0F1111] text-xl leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#D5D9D9] mb-4">
          {[
            { key: 'demo', label: '🎯 Demo' },
            { key: 'login', label: 'Sign In' },
            { key: 'register', label: 'Register' },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => { setTab(key); setError(''); }}
              className={`flex-1 pb-2 text-sm font-bold transition-colors ${tab === key ? 'border-b-2 border-[#FF9900] text-[#0F1111]' : 'text-[#565959] hover:text-[#0F1111]'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Demo Accounts Panel ── */}
        {tab === 'demo' && (
          <div className="space-y-4">
            <p className="text-xs text-[#565959] bg-[#F7FAFA] border border-[#D5D9D9] rounded px-3 py-2">
              All demo accounts use password: <span className="font-mono font-bold text-[#0F1111]">password123</span>
            </p>
            {error && <p className="text-xs text-red-600">{error}</p>}
            {DEMO_ACCOUNTS.map(({ group, accent, accounts }) => (
              <div key={group}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: accent }}>{group}</p>
                <div className="space-y-1.5">
                  {accounts.map(({ label, sub, email }) => (
                    <button
                      key={email}
                      onClick={() => handleDemoLogin(email)}
                      disabled={!!demoLoading}
                      className="w-full flex items-center justify-between px-3 py-2 rounded border border-[#D5D9D9] hover:border-[#007185] hover:bg-[#F7FAFA] transition-all disabled:opacity-60 text-left group"
                    >
                      <div>
                        <span className="text-sm font-bold text-[#0F1111] block">{label}</span>
                        <span className="text-xs text-[#565959]">{sub}</span>
                      </div>
                      <span className="text-xs text-[#007185] font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                        {demoLoading === email ? 'Signing in…' : '→ Login'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Sign In / Register Form ── */}
        {tab !== 'demo' && (
          <form onSubmit={tab === 'login' ? handleLogin : handleRegister} className="space-y-3">
            {tab === 'register' && (
              <>
                <input value={form.name} onChange={set('name')} placeholder="Full Name *"
                  className="w-full border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]" />
                <div className="grid grid-cols-2 gap-2">
                  <input value={form.city} onChange={set('city')} placeholder="City *"
                    className="border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]" />
                  <input value={form.state} onChange={set('state')} placeholder="State *"
                    className="border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]" />
                </div>
              </>
            )}
            <input type="email" value={form.email} onChange={set('email')} placeholder="Email *"
              className="w-full border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]" />
            <input type="password" value={form.password} onChange={set('password')} placeholder="Password *"
              className="w-full border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]" />

            {error && <p className="text-xs text-red-600">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-2 rounded hover:bg-[#F7CA00] transition-colors disabled:opacity-60">
              {loading ? 'Please wait…' : tab === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function UserDetailModal({ user, onClose, onLogout }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-[#232f3e] flex items-center justify-center text-white text-xl font-bold">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#0F1111]">{user.name}</h2>
            <p className="text-xs text-[#565959]">{user.email}</p>
            <p className="text-xs text-[#FF9900] font-bold uppercase mt-0.5">{user.displayRole || user.role}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm border-t border-[#D5D9D9] pt-4 mb-4">
          {user.city && <div className="flex justify-between"><span className="text-[#565959]">City</span><span className="font-bold">{user.city}</span></div>}
          <div className="flex justify-between"><span className="text-[#565959]">Green Credits</span><span className="font-bold text-[#2DC071]">{user.greenCredits || 0}</span></div>
          <div className="flex justify-between"><span className="text-[#565959]">Tier</span><span className="font-bold">{user.greenTier || 'SEEDLING'}</span></div>
        </div>
        <button onClick={onLogout} className="w-full border border-[#D5D9D9] text-[#C45500] font-bold py-2 rounded hover:bg-[#FFF4E5] transition-colors text-sm">
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within a UserProvider');
  return ctx;
}

export default UserContext;
