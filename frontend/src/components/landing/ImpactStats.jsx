import React from 'react';
import { Globe, Smartphone, CreditCard } from 'lucide-react';

export default function ImpactStats() {
  return (
    <section className="border-y border-border-standard bg-surface-container-low py-6">
      <div className="max-w-[1500px] mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-reloop-green/10 flex items-center justify-center text-reloop-green">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <p className="font-label-bold text-on-surface">Total CO2e Prevented</p>
              <p className="font-price-lg text-reloop-green font-bold text-2xl">1,245,600 kg</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-border-standard"></div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary-fixed/50 flex items-center justify-center text-link-blue">
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <p className="font-label-bold text-on-surface">Devices Rehomed</p>
              <p className="font-price-lg text-link-blue font-bold text-2xl">452,890</p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-border-standard"></div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary-container">
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <p className="font-label-bold text-on-surface">Customer Cashback Issued</p>
              <p className="font-price-lg text-secondary-container font-bold text-2xl">₹85.4 Cr</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
