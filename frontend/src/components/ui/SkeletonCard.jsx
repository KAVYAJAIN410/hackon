import React from 'react';

/**
 * Generic pulsing skeleton placeholder.
 * Props:
 *   variant: 'product' | 'list' | 'stat' | 'table-row' | 'timeline'
 *   count:   how many cards to render (default 1)
 */
export function SkeletonBox({ className = '' }) {
  return <div className={`animate-pulse bg-gray-200 rounded ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <SkeletonBox className="h-48 w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <SkeletonBox className="h-4 w-20" />
        <SkeletonBox className="h-5 w-3/4" />
        <SkeletonBox className="h-4 w-1/2" />
        <div className="flex justify-between mt-1">
          <SkeletonBox className="h-6 w-24" />
          <SkeletonBox className="h-6 w-16" />
        </div>
        <SkeletonBox className="h-9 w-full mt-2" />
      </div>
    </div>
  );
}

export function ListCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 flex gap-4 items-start">
      <SkeletonBox className="w-20 h-20 flex-shrink-0 rounded-md" />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonBox className="h-4 w-1/3" />
        <SkeletonBox className="h-5 w-2/3" />
        <SkeletonBox className="h-4 w-1/2" />
        <SkeletonBox className="h-3 w-1/4" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col gap-3">
      <SkeletonBox className="h-8 w-8 rounded-full" />
      <SkeletonBox className="h-8 w-24" />
      <SkeletonBox className="h-4 w-32" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="border-b border-gray-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <SkeletonBox className={`h-4 ${i === 0 ? 'w-24' : 'w-16'}`} />
        </td>
      ))}
    </tr>
  );
}

export function TimelineSkeleton() {
  return (
    <div className="pl-10 flex flex-col gap-8">
      {[1, 2, 3].map(i => (
        <div key={i} className="relative flex items-start gap-4">
          <SkeletonBox className="absolute -left-[26px] w-5 h-5 rounded-full" />
          <div className="flex-1 flex flex-col gap-2">
            <SkeletonBox className="h-4 w-40" />
            <SkeletonBox className="h-3 w-64" />
          </div>
          <SkeletonBox className="h-3 w-20 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}

// Generic count-based skeleton grid
export default function SkeletonGrid({ count = 6, children }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>{children}</React.Fragment>
      ))}
    </>
  );
}
