import React from 'react';
import { ShoppingBag, RefreshCcw, Handshake, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Personas() {
  return (
    <section className="py-16 bg-surface">
      <div className="max-w-[1500px] mx-auto px-5">
        <div className="mb-10">
          <h2 className="font-headline-lg font-bold text-on-surface mb-1 text-3xl">Tailored for Every Participant</h2>
          <p className="font-body-md text-on-surface-variant">How ReLoop adds value across the ecosystem.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* The Buyer */}
          <div className="bg-surface-container-lowest border border-border-standard rounded flex flex-col h-full hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="h-48 relative overflow-hidden rounded-t border-b border-border-standard">
              <img alt="The Conscious Buyer" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDr4jXNNmZoizeGmj7YQD4GuCrRj3Wh5H2Bwg-Xhd4cYoXYpXL-KZcFlrtAh787er19YXSENqL2S37N95d3F4dgHSPJzzLneozBAXFREaJXTYjac4PBhNZBYwfcXdzdLeOswRHJKBBa3HKfP0736TZQIclSqIbXBzUJKR6uvZzbqAmllm5ElEyKGA_wdKV6V2yca_pzu02Gz15NzwP9jST_HP6gfj6umzexx68UwzdT0RWR-SW4qK4UV_VQ8XMStnK95cNiTm8kbSQ" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <ShoppingBag className="text-link-blue w-6 h-6" />
                <h3 className="font-headline-md font-bold text-on-surface text-xl">The Conscious Buyer</h3>
              </div>
              <p className="font-body-sm text-on-surface-variant mb-6 flex-1">Access premium electronics at a fraction of the cost. Every ReLoop Certified device undergoes a rigorous 100-point inspection and comes with a 1-year Amazon warranty.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-on-surface">
                  <CheckCircle className="text-reloop-green w-5 h-5 shrink-0" /> Guaranteed Quality Standard
                </li>
                <li className="flex items-start gap-2 text-sm text-on-surface">
                  <CheckCircle className="text-reloop-green w-5 h-5 shrink-0" /> Lower Carbon Footprint
                </li>
              </ul>
              <Link to="/marketplace" className="text-link-blue font-label-bold hover:underline flex items-center gap-1 w-fit">
                Shop Certified Refurbished <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* The Upgrader */}
          <div className="bg-surface-container-lowest border border-border-standard rounded flex flex-col h-full hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="h-48 relative overflow-hidden rounded-t border-b border-border-standard bg-primary-container flex items-center justify-center">
              <RefreshCcw className="w-20 h-20 text-primary-fixed opacity-50" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <RefreshCcw className="text-secondary-container w-6 h-6" />
                <h3 className="font-headline-md font-bold text-on-surface text-xl">The Smart Upgrader</h3>
              </div>
              <p className="font-body-sm text-on-surface-variant mb-6 flex-1">Turn clutter into currency. Trade in your old smartphones, tablets, and gaming consoles for instant Amazon Pay balance. We handle the pickup and secure data wiping.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-on-surface">
                  <CheckCircle className="text-reloop-green w-5 h-5 shrink-0" /> Instant Online Valuation
                </li>
                <li className="flex items-start gap-2 text-sm text-on-surface">
                  <CheckCircle className="text-reloop-green w-5 h-5 shrink-0" /> Military-Grade Data Erasure
                </li>
              </ul>
              <Link to="/outgrown-it" className="text-link-blue font-label-bold hover:underline flex items-center gap-1 w-fit">
                Start a Trade-In <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* The Partner */}
          <div className="bg-surface-container-lowest border border-border-standard rounded flex flex-col h-full hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow">
            <div className="h-48 relative overflow-hidden rounded-t border-b border-border-standard">
              <img alt="The Certified Partner" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3_ATPKdX7pQKBBhEyjRl5vlthJCviYzrE7oXtjK3bmc4aI5VCM1hyDsduHvwXxsHgg1HgTuo3Bx2rjY52V_UoSHzSO-rcPFbldWB2GKHJ42IJCYD8YEiQoZ_MuJRrjpUI1fo9ePM3BkOvUfLPbtr1xnlKNDMvDgHh1IArpPoUL14-ohivo7oYWqRi2J1E56KicoLeLPBjBGM7YXP5bfQveeigoz4YhnDB1rbFZxkLWEJnLx6xv3uCGLRmNNrJBWEk1wKNoYVbQCw" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <Handshake className="text-tertiary-container w-6 h-6" />
                <h3 className="font-headline-md font-bold text-on-surface text-xl">The Certified Partner</h3>
              </div>
              <p className="font-body-sm text-on-surface-variant mb-6 flex-1">Are you a professional refurbisher? Join the ReLoop network to access a massive customer base, standardized grading tools, and reliable inventory supply.</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2 text-sm text-on-surface">
                  <CheckCircle className="text-reloop-green w-5 h-5 shrink-0" /> Access Amazon's Customer Base
                </li>
                <li className="flex items-start gap-2 text-sm text-on-surface">
                  <CheckCircle className="text-reloop-green w-5 h-5 shrink-0" /> Standardized Grading Protocol
                </li>
              </ul>
              <Link to="/seller-dashboard" className="text-link-blue font-label-bold hover:underline flex items-center gap-1 w-fit">
                Become a Partner <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
