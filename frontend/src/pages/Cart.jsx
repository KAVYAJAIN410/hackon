import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { Leaf, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import api from '../lib/api';

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, totalItems, totalPrice, clearCart } = useCart();
  const { currentUser, setShowLoginModal } = useUser();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [pledgeMade, setPledgeMade] = useState(false);

  const handleCheckout = async () => {
    if (!currentUser) { setShowLoginModal(true); return; }
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const results = await Promise.all(
        cartItems.map(item => api.post(`/marketplace/${item.id}/buy`, { buyerId: currentUser.id, pledgeMade }))
      );
      const totalCredits = results.reduce((s, r) => s + (r.creditsAwarded || 0), 0);
      clearCart();
      setOrderResult({ orders: results.map(r => r.order), totalCredits });
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (orderResult) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="max-w-lg w-full bg-white border border-[#D5D9D9] rounded-lg p-8 shadow-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#067D62] text-white rounded-full mb-4">
              <span className="material-symbols-outlined text-4xl">check</span>
            </div>
            <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Order Placed!</h2>
            <p className="text-[#565959] mb-4">{orderResult.orders.length} item{orderResult.orders.length !== 1 ? 's' : ''} purchased successfully.</p>
            <div className="bg-[#F0FDF4] border border-[#2DC071]/30 rounded-lg p-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#565959]">Green Credits Earned</span>
                <span className="font-bold text-[#2DC071] text-lg">+{orderResult.totalCredits}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate('/marketplace')} className="flex-1 px-4 py-2 bg-white border border-[#D5D9D9] rounded-lg text-sm font-bold hover:bg-[#F7F8F8]">
                Continue Shopping
              </button>
              <button onClick={() => navigate('/green-profile')} className="flex-1 px-4 py-2 bg-[#FFD814] border border-[#FCD200] rounded-lg text-sm font-bold hover:bg-[#F7CA00]">
                View Profile
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-16">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-[#0F1111] mb-2">Your cart is empty</h2>
            <p className="text-[#565959] mb-6">
              Add certified refurbished items to your cart and give them a second life!
            </p>
            <Link
              to="/marketplace"
              className="inline-block bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold px-8 py-3 rounded-lg hover:bg-[#F7CA00] transition-colors"
            >
              Browse Certified Refurbished
            </Link>
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
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8">
          <h1 className="text-2xl font-bold text-[#0F1111] mb-6">Shopping Cart</h1>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-9">
              <div className="bg-white border border-[#D5D9D9] rounded-lg overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-[#D5D9D9] flex justify-between items-center bg-[#F7F8F8]">
                  <span className="text-sm text-[#565959]">Price</span>
                  <button
                    onClick={clearCart}
                    className="text-[#007185] text-sm hover:text-[#C45500] hover:underline"
                  >
                    Clear cart
                  </button>
                </div>

                {cartItems.map((item) => (
                  <div key={item.id} className="px-6 py-5 border-b border-[#D5D9D9] last:border-b-0">
                    <div className="flex gap-5">
                      {/* Image */}
                      <Link to={`/product-detail/${item.id}`} className="flex-shrink-0 w-28 h-28 bg-white border border-[#D5D9D9] rounded flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                        ) : (
                          <span className="material-symbols-outlined text-[#565959] text-[40px]">inventory_2</span>
                        )}
                      </Link>

                      {/* Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between">
                          <div className="flex-1 pr-4">
                            <Link to={`/product-detail/${item.id}`}>
                              <h3 className="text-[#007185] font-medium hover:text-[#C45500] hover:underline line-clamp-2 mb-1">
                                {item.title}
                              </h3>
                            </Link>
                            {item.grade && (
                              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded mb-2 ${
                                item.grade === 'Grade A+' ? 'bg-green-100 text-green-700' :
                                item.grade === 'Grade A' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {item.grade}
                              </span>
                            )}
                            <div className="flex items-center gap-1 text-xs text-[#2DC071] mt-1">
                              <Leaf className="w-3 h-3" />
                              <span>Saves {item.savesCO2 || '0.5'}kg CO2e</span>
                            </div>
                            <p className="text-[#007600] text-sm font-medium mt-1">In Stock</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-[#0F1111]">₹{(item.price * item.qty).toLocaleString()}</p>
                            {item.qty > 1 && (
                              <p className="text-xs text-[#565959]">₹{item.price.toLocaleString()} each</p>
                            )}
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-[#D5D9D9] rounded-full overflow-hidden bg-[#F7F8F8]">
                            <button
                              onClick={() => updateQty(item.id, item.qty - 1)}
                              className="px-3 py-1.5 hover:bg-[#EAEDED] transition-colors text-[#0F1111]"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-4 py-1.5 font-bold text-sm border-x border-[#D5D9D9] min-w-[40px] text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, item.qty + 1)}
                              disabled={item.qty >= 1}
                              className="px-3 py-1.5 hover:bg-[#EAEDED] transition-colors text-[#0F1111] disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="text-[#D5D9D9]">|</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="flex items-center gap-1 text-[#007185] text-sm hover:text-[#C45500] hover:underline transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal bottom */}
              <div className="text-right mt-4">
                <p className="text-lg text-[#0F1111]">
                  Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''}):
                  <span className="font-bold ml-2">₹{totalPrice.toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-3">
              <div className="bg-white border border-[#D5D9D9] rounded-lg p-5 shadow-sm sticky top-20">
                <div className="bg-[#F0FDF4] border border-[#2DC071]/30 rounded p-3 mb-4 flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-[#2DC071] flex-shrink-0" />
                  <p className="text-xs text-[#2DC071] font-medium">
                    You're saving emissions by buying certified refurbished!
                  </p>
                </div>

                <div className="space-y-2 mb-4 border-b border-[#D5D9D9] pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#565959]">Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span className="font-bold text-[#0F1111]">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#565959]">Shipping</span>
                    <span className="text-[#007600] font-medium">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-lg mb-5">
                  <span>Order Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>

                {/* Green Checkout Pledge */}
                <div className="bg-[#F0FDF4] border border-[#2DC071]/30 rounded-lg p-3 mb-4">
                  <label className="flex gap-2 items-start cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={pledgeMade}
                      onChange={(e) => setPledgeMade(e.target.checked)}
                      className="mt-1 w-4 h-4 text-[#2DC071] border-gray-300 rounded focus:ring-[#2DC071]" 
                    />
                    <span className="text-xs text-[#0F1111]">
                      <b>🌱 The Green Pledge:</b> I have double-checked specifications. 
                      <span className="text-[#2DC071] font-bold block mt-0.5">Earn +50 Green Credits per item!</span>
                    </span>
                  </label>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-[#FFD814] border border-[#FCD200] text-[#0F1111] font-bold py-3 rounded-lg hover:bg-[#F7CA00] active:scale-95 transition-all mb-3 disabled:opacity-60"
                >
                  {checkingOut ? 'Placing Order...' : 'Proceed to Checkout'}
                </button>
                {checkoutError && <p className="text-xs text-red-600 mb-2 text-center">{checkoutError}</p>}
                <button
                  onClick={() => navigate('/marketplace')}
                  className="w-full bg-white border border-[#D5D9D9] text-[#0F1111] font-bold py-3 rounded-lg hover:bg-[#F7F8F8] transition-colors text-sm"
                >
                  Continue Shopping
                </button>

                <p className="flex items-center justify-center gap-1 text-xs text-[#565959] mt-4">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Secure checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
