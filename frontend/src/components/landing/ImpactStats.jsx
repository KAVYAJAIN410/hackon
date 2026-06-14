import React, { useState, useEffect } from 'react';
import { Globe, Smartphone, CreditCard } from 'lucide-react';
import api from '../../lib/api';

export default function ImpactStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats')
      .then(setStats)
      .catch((err) => console.error('Failed to load stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const display = stats || { totalReturns: 0, totalSold: 0, co2SavedKg: 0, totalGreenCredits: 0 };

  return (
    <section className="border-y border-border-standard bg-surface-container-low py-6">
      <div className="max-w-[1500px] mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-reloop-green/10 flex items-center justify-center text-reloop-green ${loading ? 'animate-pulse' : ''}`}>
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <p className="font-label-bold text-on-surface">Total CO2e Prevented</p>
              <p className="font-price-lg text-reloop-green font-bold text-2xl">
                {loading ? '...' : `${display.co2SavedKg.toLocaleString()} kg`}
              </p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-border-standard"></div>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-primary-fixed/50 flex items-center justify-center text-link-blue ${loading ? 'animate-pulse' : ''}`}>
              <Smartphone className="w-7 h-7" />
            </div>
            <div>
              <p className="font-label-bold text-on-surface">Items Resold</p>
              <p className="font-price-lg text-link-blue font-bold text-2xl">
                {loading ? '...' : display.totalSold.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="hidden md:block w-px h-12 bg-border-standard"></div>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary-container ${loading ? 'animate-pulse' : ''}`}>
              <CreditCard className="w-7 h-7" />
            </div>
            <div>
              <p className="font-label-bold text-on-surface">Green Credits Issued</p>
              <p className="font-price-lg text-secondary-container font-bold text-2xl">
                {loading ? '...' : display.totalGreenCredits.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
