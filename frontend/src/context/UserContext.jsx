import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setToken } from '../lib/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  // On mount, check if we have a stored token and fetch user info
  useEffect(() => {
    const token = localStorage.getItem('reloop_token');
    if (token) {
      api.get('/auth/me')
        .then((user) => setCurrentUser(user))
        .catch(() => {
          // Token invalid/expired — clear it
          setToken(null);
          localStorage.removeItem('reloop_user');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setCurrentUser(data.user);
    localStorage.setItem('reloop_user', JSON.stringify(data.user));
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('reloop_user');
  };

  const handleProfileClick = () => {
    if (currentUser) setShowUserModal(true);
    else setShowLoginModal(true);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading, login, logout, showLoginModal, setShowLoginModal, handleProfileClick }}>
      {children}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={async (email, password) => {
            const user = await login(email, password);
            setShowLoginModal(false);
            return user;
          }}
        />
      )}
      {showUserModal && currentUser && (
        <UserDetailModal
          user={currentUser}
          onClose={() => setShowUserModal(false)}
          onLogout={() => { logout(); setShowUserModal(false); }}
        />
      )}
    </UserContext.Provider>
  );
}

function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!password.trim()) { setError('Password is required'); return; }

    setIsLoading(true);
    setError('');

    try {
      await onLogin(email.trim(), password);
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick-login buttons for demo
  const demoUsers = [
    { name: 'Ananya (Delhi)', email: 'ananya@email.com' },
    { name: 'Priya Verma (Jaipur)', email: 'priya.v@email.com' },
    { name: 'Vikram (Mumbai)', email: 'vikram@email.com' },
    { name: 'Rahul (Pune)', email: 'rahul.d@email.com' },
    { name: 'Karthik (Bangalore)', email: 'karthik@email.com' },
    { name: 'Admin', email: 'admin@hackon.com' },
    { name: 'Delivery (Rahul)', email: 'del1@delivery.com' },
    { name: 'Seller (Tech)', email: 'seller.tech@email.com' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-[#0F1111] mb-1">Sign In to ReLoop</h2>
        <p className="text-xs text-[#565959] mb-4">Use your email and password to sign in.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#0F1111] mb-1">Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="your@email.com"
              className="w-full border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0F1111] mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              className="w-full border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
            />
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-2 rounded hover:bg-[#F7CA00] transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
          <button type="button" onClick={onClose} className="w-full text-[#007185] text-sm hover:underline">
            Cancel
          </button>
        </form>

        {/* Demo quick login buttons */}
        <div className="mt-4 pt-4 border-t border-[#D5D9D9]">
          <p className="text-xs text-[#565959] mb-2">Quick demo login:</p>
          <div className="flex flex-wrap gap-1.5">
            {demoUsers.map(u => (
              <button
                key={u.email}
                type="button"
                onClick={() => { setEmail(u.email); setPassword('password123'); }}
                className="text-xs px-2 py-1 bg-[#F0F2F2] border border-[#D5D9D9] rounded hover:bg-[#E3E6E6] transition-colors"
              >
                {u.name}
              </button>
            ))}
          </div>
        </div>
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
            <p className="text-xs text-[#565959]">{user.city} • <span className="capitalize">{user.role || 'customer'}</span></p>
          </div>
        </div>
        <div className="space-y-2 text-sm border-t border-[#D5D9D9] pt-4 mb-4">
          <div className="flex justify-between"><span className="text-[#565959]">Green Credits</span><span className="font-bold text-[#2DC071]">{user.greenCredits || 0}</span></div>
          <div className="flex justify-between"><span className="text-[#565959]">Tier</span><span className="font-bold">{user.greenTier || 'SEEDLING'}</span></div>
          {user.email && <div className="flex justify-between"><span className="text-[#565959]">Email</span><span className="font-bold truncate ml-4">{user.email}</span></div>}
          {user.nearestDc && <div className="flex justify-between"><span className="text-[#565959]">Nearest DC</span><span className="font-bold">{user.nearestDc.city}</span></div>}
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
