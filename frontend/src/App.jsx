import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
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

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/return-flow" element={<ReturnFlow />} />
          <Route path="/return-interception" element={<ReturnInterception />} />
          <Route path="/outgrown-it" element={<OutgrownIt />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
          <Route path="/my-returns" element={<MyReturns />} />
          <Route path="/green-profile" element={<GreenProfile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
