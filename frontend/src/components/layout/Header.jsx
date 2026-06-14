import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useCart } from '../../context/CartContext';

const baseNavLinks = [
  { to: '/outgrown-it', label: 'Trade-In' },
  { to: '/marketplace', label: 'Certified Refurbished' },
  { to: '/green-profile', label: 'Impact Hub' },
  { to: '/return-flow', label: 'Return' },
  { to: '/my-returns', label: 'My Returns' },
];

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { currentUser, handleProfileClick } = useUser();
  const { totalItems } = useCart();

  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'admin';
  const isDelivery = currentUser?.role === 'DELIVERY_PARTNER' || currentUser?.role === 'delivery partner';
  const isSeller = currentUser?.role === 'SELLER' || currentUser?.role === 'seller';

  const navLinks = isAdmin
    ? [{ to: '/admin-dashboard', label: 'Admin Dashboard' }]
    : isDelivery
    ? [{ to: '/delivery-dashboard', label: 'My Pickups' }]
    : isSeller
    ? [{ to: '/seller-dashboard', label: 'Seller Dashboard' }]
    : baseNavLinks;

  return (
    <header className="bg-[#232f3e] sticky top-0 z-50 border-b border-[#37475a] shadow-md">
      <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-[1500px] mx-auto h-14 md:h-16">
        <Link to="/" className="text-[20px] md:text-[24px] font-bold text-[#2DC071] hover:opacity-90 transition-opacity">
          ReLoop <span className="text-[#FF9900]">x</span> Amazon
        </Link>

        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map(link => {
            const isActive = location.pathname === link.to;
            return (
              <Link key={link.to} to={link.to}
                className={`px-3 py-2 text-[13px] lg:text-[14px] font-semibold rounded-md transition-all duration-200 ${
                  isActive ? 'text-[#FF9900] border-b-2 border-[#FF9900]' : 'text-[#e0e0e0] hover:text-white hover:bg-[#37475a]'
                }`}
              >{link.label}</Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-3 md:space-x-4">
          <button onClick={handleProfileClick}
            className="flex items-center gap-1 text-[#e0e0e0] hover:text-white transition-colors text-[12px] md:text-[13px] px-2 py-1 rounded hover:bg-[#37475a]"
          >
            <User className="w-4 h-4" />
            <span className="hidden md:inline font-semibold truncate max-w-[100px]">
              {currentUser?.name?.split(' ')[0] || 'Sign In'}
            </span>
            {currentUser?.role && (
              <span className="hidden md:inline text-[9px] text-[#FF9900] uppercase">({currentUser.role})</span>
            )}
          </button>

          {!isAdmin && !isDelivery && !isSeller && (
            <>
              <Link to="/green-profile" className="text-[#2DC071] hover:text-[#5be09a] transition-colors" title="Green Profile">
                <Leaf className="w-5 h-5" />
              </Link>
              <Link to="/cart" className="relative text-[#e0e0e0] hover:text-white transition-colors" title="Cart">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF9900] text-black text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>
            </>
          )}
          <button className="md:hidden text-white p-1" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#232f3e] border-t border-[#37475a] px-4 pb-4">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
              className={`block py-3 px-3 text-[14px] font-medium rounded-md transition-all ${
                location.pathname === link.to ? 'text-[#FF9900] bg-[#37475a]' : 'text-[#e0e0e0] hover:text-white hover:bg-[#37475a]'
              }`}
            >{link.label}</Link>
          ))}
          <button onClick={() => { handleProfileClick(); setMobileOpen(false); }}
            className="block w-full text-left py-3 px-3 text-[14px] font-medium text-[#e0e0e0] hover:text-white hover:bg-[#37475a] rounded-md"
          >
            {currentUser ? currentUser.name : 'Sign In'}
          </button>
        </div>
      )}
    </header>
  );
}
