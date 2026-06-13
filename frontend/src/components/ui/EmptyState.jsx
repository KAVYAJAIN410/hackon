import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable empty state component.
 * Props:
 *   icon         - material-symbols icon name string (e.g. 'inventory_2')
 *   title        - heading text
 *   description  - body text
 *   action       - { label: string, to: string } optional CTA link
 *   color        - accent color class for icon (default 'text-[#007185]')
 */
export default function EmptyState({ icon = 'inbox', title, description, action, color = 'text-[#007185]' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className={`material-symbols-outlined text-[72px] mb-5 opacity-30 ${color}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-[#0f1111] mb-2">{title}</h3>
      {description && (
        <p className="text-[#565959] text-[14px] max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <Link
          to={action.to}
          className="inline-block bg-[#FFD814] hover:bg-[#F7CA00] text-[#0f1111] font-bold text-sm px-6 py-2.5 rounded-full border border-[#FFA41C] transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
