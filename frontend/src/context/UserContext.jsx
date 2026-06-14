import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const UserContext = createContext(null);

const ROLES = ['user', 'admin', 'delivery partner'];

export function UserProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    api.get('/users')
      .then((data) => setUsers(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleProfileClick = () => {
    if (currentUser) setShowUserModal(true);
    else setShowLoginModal(true);
  };

  return (
    <UserContext.Provider value={{ users, currentUser, setCurrentUser, loading, showLoginModal, setShowLoginModal, handleProfileClick }}>
      {children}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={(user, redirectTo) => { setCurrentUser(user); setShowLoginModal(false); if (redirectTo && typeof window !== 'undefined') window.location.href = redirectTo; }} users={users} />}
      {showUserModal && currentUser && <UserDetailModal user={currentUser} onClose={() => setShowUserModal(false)} onLogout={() => { setCurrentUser(null); setShowUserModal(false); }} />}
    </UserContext.Provider>
  );
}

function LoginModal({ onClose, onLogin, users }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) { setError('Username is required'); return; }
    if (!password.trim()) { setError('Password is required'); return; }

    const matched = users.find(u => u.name?.toLowerCase() === username.trim().toLowerCase());
    const loginUser = matched
      ? { ...matched, role }
      : { id: `local-${Date.now()}`, name: username.trim(), city: 'Unknown', greenCredits: 0, greenTier: 'SEEDLING', role };

    const redirectTo = role === 'delivery partner' ? '/delivery-dashboard'
      : role === 'admin' ? '/admin-dashboard'
      : null;
    onLogin(loginUser, redirectTo);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-[#0F1111] mb-1">Sign In to ReLoop</h2>
        <p className="text-xs text-[#565959] mb-4">Any password works for this demo.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#0F1111] mb-1">Username *</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter your name"
              className="w-full border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0F1111] mb-1">Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Any password"
              className="w-full border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#0F1111] mb-1">Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full border border-[#D5D9D9] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185] bg-white"
            >
              {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
            </select>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button type="submit" className="w-full bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-2 rounded hover:bg-[#F7CA00] transition-colors">
            Sign In
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
            <p className="text-xs text-[#565959]">{user.city} • <span className="capitalize">{user.role || 'user'}</span></p>
          </div>
        </div>
        <div className="space-y-2 text-sm border-t border-[#D5D9D9] pt-4 mb-4">
          <div className="flex justify-between"><span className="text-[#565959]">Green Credits</span><span className="font-bold text-[#2DC071]">{user.greenCredits || 0}</span></div>
          <div className="flex justify-between"><span className="text-[#565959]">Tier</span><span className="font-bold">{user.greenTier || 'SEEDLING'}</span></div>
          {user.email && <div className="flex justify-between"><span className="text-[#565959]">Email</span><span className="font-bold truncate ml-4">{user.email}</span></div>}
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
