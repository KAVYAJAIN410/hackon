import React from 'react';
import { MapPin } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function MarketplaceHeader() {
  const { currentUser } = useUser();
  const userName = currentUser?.name || 'Guest';
  const userLocation = currentUser?.city ? ` • ${currentUser.city}` : '';

  return (
    <div className="bg-surface-container-lowest border-b border-border-standard w-full">
      <div className="max-w-[1500px] mx-auto px-5 py-3 flex items-center justify-between">
        <p className="font-body-sm text-on-surface-variant flex items-center gap-1">
          <MapPin className="w-4 h-4" />
          Browsing as: <strong>{userName}{userLocation}</strong>
        </p>
        <div className="text-link-blue font-body-sm cursor-pointer hover:underline">Change location</div>
      </div>
    </div>
  );
}
