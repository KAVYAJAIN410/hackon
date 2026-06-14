import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-amazon-dark w-full border-t border-border-standard">
      <div className="w-full py-8 px-5 max-w-[1500px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col gap-4">
          <span className="font-headline-md text-reloop-green font-bold">ReLoop</span>
          <p className="text-white font-body-sm">
            © 1996-2024, Amazon.com, Inc. or its affiliates. ReLoop Sustainability Partner.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/marketplace" className="text-gray-400 hover:text-white font-label-bold text-sm cursor-pointer hover:underline">Sustainability Standards</Link>
          <Link to="/green-profile" className="text-gray-400 hover:text-white font-label-bold text-sm cursor-pointer hover:underline">Circular Economy Impact</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/outgrown-it" className="text-gray-400 hover:text-white font-label-bold text-sm cursor-pointer hover:underline">Trade-In Terms</Link>
          <Link to="/green-profile" className="text-gray-400 hover:text-white font-label-bold text-sm cursor-pointer hover:underline">Carbon Footprint Help</Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link to="/admin-dashboard" className="text-gray-400 hover:text-white font-label-bold text-sm cursor-pointer hover:underline">Contact ReLoop</Link>
        </div>
      </div>
    </footer>
  );
}
