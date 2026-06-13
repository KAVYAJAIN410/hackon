import React from 'react';

export default function FiltersSidebar() {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-surface-container-lowest border border-border-standard rounded p-4 self-start">
      <h2 className="font-headline-sm mb-4 font-bold text-lg">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-label-bold mb-2">Category</h3>
        <ul className="space-y-2 font-body-sm">
          <li><label className="flex items-center gap-2"><input className="rounded border-gray-300 text-link-blue focus:ring-link-blue" type="checkbox" /> Electronics</label></li>
          <li><label className="flex items-center gap-2"><input className="rounded border-gray-300 text-link-blue focus:ring-link-blue" type="checkbox" /> Appliances</label></li>
          <li><label className="flex items-center gap-2"><input className="rounded border-gray-300 text-link-blue focus:ring-link-blue" type="checkbox" /> Furniture</label></li>
        </ul>
      </div>

      {/* Grade Filter */}
      <div className="mb-6">
        <h3 className="font-label-bold mb-2">Grade</h3>
        <div className="space-y-2 font-body-sm">
          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2"><input defaultChecked className="rounded border-gray-300 text-link-blue focus:ring-link-blue" type="checkbox" /> Grade A+</span>
            <span className="text-on-surface-variant text-[10px]">Like New</span>
          </label>
          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2"><input className="rounded border-gray-300 text-link-blue focus:ring-link-blue" type="checkbox" /> Grade A</span>
            <span className="text-on-surface-variant text-[10px]">Minor Wear</span>
          </label>
          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2"><input className="rounded border-gray-300 text-link-blue focus:ring-link-blue" type="checkbox" /> Grade B</span>
            <span className="text-on-surface-variant text-[10px]">Visible Scratches</span>
          </label>
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="font-label-bold mb-2">Price</h3>
        <ul className="space-y-2 font-body-sm text-link-blue">
          <li className="cursor-pointer hover:underline">Under ₹1,000</li>
          <li className="cursor-pointer hover:underline">₹1,000 - ₹5,000</li>
          <li className="cursor-pointer hover:underline">₹5,000 - ₹10,000</li>
          <li className="cursor-pointer hover:underline">Over ₹10,000</li>
        </ul>
      </div>
    </aside>
  );
}
