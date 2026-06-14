import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const navLinks = [
  { to: '/outgrown-it', label: 'Trade-In' },
  { to: '/marketplace', label: 'Certified Refurbished' },
  { to: '/green-profile', label: 'Impact Hub' },
  { to: '/return-flow', label: 'Recycle' },
  { to: '/my-returns', label: 'Returns' },
  { to: '/seller-dashboard', label: 'Seller Dashboard' },
];

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);
  const { users, currentUser, setCurrentUser } = useUser();
  const dropdownRef = React.useRef(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-[#232f3e] sticky top-0 z-50 border-b border-[#37475a] shadow-md">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1500px] mx-auto h-14 md:h-16">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-[20px] md:text-[24px] font-bold text-[#2DC071] hover:opacity-90 transition-opacity">
            ReLoop <span className="text-[#FF9900]">x</span> Amazon
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-[13px] lg:text-[14px] font-semibold rounded-md transition-all duration-200 ${
                  isActive
                    ? 'text-[#FF9900] border-b-2 border-[#FF9900]'
                    : 'text-[#e0e0e0] hover:text-white hover:bg-[#37475a]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Icon Actions + User Selector */}
        <div className="flex items-center space-x-3 md:space-x-4">
          {/* User Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-1 text-[#e0e0e0] hover:text-white transition-colors text-[12px] md:text-[13px] border border-transparent hover:border-[#37475a] px-2 py-1 rounded"
            >
              <span className="hidden md:inline text-[10px] text-[#a0a0a0]">Hello,</span>
              <span className="font-semibold truncate max-w-[100px]">{currentUser?.name?.split(' ')[0] || 'User'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {userDropdownOpen && users.length > 0 && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-[#D5D9D9] rounded-lg shadow-xl z-[100] overflow-hidden">
                <div className="px-3 py-2 bg-[#F7F8F8] border-b border-[#D5D9D9]">
                  <p className="text-[11px] font-bold text-[#565959] uppercase tracking-wider">Switch User (Demo)</p>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {users.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setCurrentUser(user);
                        setUserDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-[13px] hover:bg-[#F7F8F8] transition-colors flex items-center justify-between ${
                        currentUser?.id === user.id ? 'bg-[#F0FDF4] border-l-2 border-[#2DC071]' : ''
                      }`}
                    >
                      <div>
                        <p className="font-medium text-[#0F1111]">{user.name}</p>
                        <p className="text-[11px] text-[#565959]">{user.city} • {user.greenTier}</p>
                      </div>
                      {currentUser?.id === user.id && (
                        <span className="text-[#2DC071] text-[11px] font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link to="/green-profile" className="text-[#2DC071] hover:text-[#5be09a] transition-colors" title="Green Profile">
            <Leaf className="w-5 h-5" />
          </Link>
          <Link to="/marketplace" className="text-[#e0e0e0] hover:text-white transition-colors" title="Cart">
            <ShoppingCart className="w-5 h-5" />
          </Link>
          <Link to="/admin-dashboard" className="text-[#e0e0e0] hover:text-white transition-colors" title="Admin">
            <User className="w-5 h-5" />
          </Link>
          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-[#232f3e] border-t border-[#37475a] px-4 pb-4">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 px-3 text-[14px] font-medium rounded-md transition-all ${
                  isActive
                    ? 'text-[#FF9900] bg-[#37475a]'
                    : 'text-[#e0e0e0] hover:text-white hover:bg-[#37475a]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-[#37475a] mt-2 pt-3 flex gap-4 px-3">
            <Link to="/admin-dashboard" onClick={() => setMobileOpen(false)} className="text-[#e0e0e0] text-[13px] hover:text-white">Admin</Link>
            <Link to="/seller-dashboard" onClick={() => setMobileOpen(false)} className="text-[#e0e0e0] text-[13px] hover:text-white">Seller</Link>
          </div>
        </div>
      )}
    </header>
  );
}
