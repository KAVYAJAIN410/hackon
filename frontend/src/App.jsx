import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './pages/Cart';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import ReturnFlow from './pages/ReturnFlow';
import ReturnInterception from './pages/ReturnInterception';
import OutgrownIt from './pages/OutgrownIt';
import SellerDashboard from './pages/SellerDashboard';
import MyReturns from './pages/MyReturns';
import GreenProfile from './pages/GreenProfile';
import AdminDashboard from './pages/AdminDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';

function App() {
  return (
    <UserProvider>
      <CartProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* Customer pages */}
          <Route path="/marketplace" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Marketplace /></ProtectedRoute>} />
          <Route path="/product-detail/:id" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ProductDetail /></ProtectedRoute>} />
          <Route path="/return-flow" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ReturnFlow /></ProtectedRoute>} />
          <Route path="/return-interception" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><ReturnInterception /></ProtectedRoute>} />
          <Route path="/outgrown-it" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><OutgrownIt /></ProtectedRoute>} />
          <Route path="/my-returns" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><MyReturns /></ProtectedRoute>} />
          <Route path="/green-profile" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><GreenProfile /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={['CUSTOMER']}><Cart /></ProtectedRoute>} />

          {/* Seller only */}
          <Route path="/seller-dashboard" element={<ProtectedRoute allowedRoles={['SELLER']}><SellerDashboard /></ProtectedRoute>} />

          {/* Admin only */}
          <Route path="/admin-dashboard" element={<ProtectedRoute allowedRoles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />

          {/* Delivery partner only */}
          <Route path="/delivery-dashboard" element={<ProtectedRoute allowedRoles={['DELIVERY_PARTNER']}><DeliveryDashboard /></ProtectedRoute>} />
        </Routes>
      </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
