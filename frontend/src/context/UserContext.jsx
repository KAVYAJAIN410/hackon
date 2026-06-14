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

function LoginModal({ onClose, onLogin }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ email: '', password: '', name: '', city: '', state: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => { setForm(f => ({ ...f, [k]: e.target.value })); setError(''); };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Email and password are required'); return; }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      onLogin(res.user, res.token);
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-[#0F1111] mb-4">
          {tab === 'login' ? 'Sign In to ReLoop' : 'Create Account'}
        </h2>

        {/* Tabs */}
        <div className="flex border-b border-[#D5D9D9] mb-4">
          {['login', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }}
              className={`flex-1 pb-2 text-sm font-bold transition-colors ${tab === t ? 'border-b-2 border-[#FF9900] text-[#0F1111]' : 'text-[#565959]'}`}>
              {t === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

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
            {loading ? 'Please wait...' : tab === 'login' ? 'Sign In' : 'Create Account'}
          </button>
          <button type="button" onClick={onClose} className="w-full text-[#007185] text-sm hover:underline">
            Cancel
          </button>
        </form>
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
