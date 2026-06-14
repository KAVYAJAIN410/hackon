import React from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';
import Header from './layout/Header';

/**
 * ProtectedRoute — wraps a page and checks if user has the required role.
 * 
 * @param {string[]} allowedRoles - Array of roles that can access this page (e.g. ['ADMIN'], ['SELLER'], ['CUSTOMER'])
 * @param {React.ReactNode} children - The page component to render if authorized
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { currentUser, loading, setShowLoginModal } = useUser();

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin w-8 h-8 border-4 border-[#2DC071] border-t-transparent rounded-full" />
        </div>
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <ShieldX className="w-16 h-16 text-[#C45500] mb-4" />
          <h1 className="text-2xl font-bold text-[#0F1111] mb-2">Sign In Required</h1>
          <p className="text-[#565959] text-center mb-6">You need to sign in to access this page.</p>
          <button
            onClick={() => setShowLoginModal(true)}
            className="bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold px-6 py-2 rounded hover:bg-[#F7CA00] transition-colors"
          >
            Sign In
          </button>
        </div>
      </>
    );
  }

  const userRole = currentUser.role?.toUpperCase();
  const allowed = allowedRoles.map(r => r.toUpperCase());

  if (!allowed.includes(userRole)) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <ShieldX className="w-16 h-16 text-[#C45500] mb-4" />
          <h1 className="text-2xl font-bold text-[#0F1111] mb-2">Access Denied</h1>
          <p className="text-[#565959] text-center mb-2">You are not authorised to view this page.</p>
          <p className="text-xs text-[#565959] mb-6">
            Your role: <span className="font-bold capitalize">{currentUser.role}</span> — This page requires: <span className="font-bold capitalize">{allowedRoles.join(', ')}</span>
          </p>
          <Link
            to="/"
            className="bg-[#232f3e] text-white font-bold px-6 py-2 rounded hover:bg-[#37475a] transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </>
    );
  }

  return children;
}
