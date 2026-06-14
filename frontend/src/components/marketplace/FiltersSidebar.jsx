import React from 'react';

const GRADES = ['A+', 'A', 'B'];

export default function FiltersSidebar({ filters, onChange }) {
  const toggleGrade = (g) => {
    const next = filters.grades.includes(g)
      ? filters.grades.filter(x => x !== g)
      : [...filters.grades, g];
    onChange({ ...filters, grades: next });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-surface-container-lowest border border-border-standard rounded p-4 self-start">
      <h2 className="font-headline-sm mb-4 font-bold text-lg">Filters</h2>

      <div className="mb-6">
        <h3 className="font-label-bold mb-2">Grade</h3>
        <div className="space-y-2 font-body-sm">
          {GRADES.map(g => (
            <label key={g} className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.grades.includes(g)}
                  onChange={() => toggleGrade(g)}
                  className="rounded border-gray-300 text-link-blue focus:ring-link-blue"
                />
                Grade {g}
              </span>
              <span className="text-on-surface-variant text-[10px]">
                {g === 'A+' ? 'Like New' : g === 'A' ? 'Minor Wear' : 'Visible Scratches'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-label-bold mb-2">Price</h3>
        <ul className="space-y-2 font-body-sm">
          {[
            { label: 'All Prices', value: null },
            { label: 'Under ₹1,000', value: [0, 1000] },
            { label: '₹1,000 – ₹5,000', value: [1000, 5000] },
            { label: '₹5,000 – ₹10,000', value: [5000, 10000] },
            { label: 'Over ₹10,000', value: [10000, Infinity] },
          ].map(({ label, value }) => (
            <li key={label}
              onClick={() => onChange({ ...filters, priceRange: value })}
              className={`cursor-pointer hover:underline ${
                JSON.stringify(filters.priceRange) === JSON.stringify(value) ? 'text-on-surface font-bold' : 'text-link-blue'
              }`}
            >{label}</li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
