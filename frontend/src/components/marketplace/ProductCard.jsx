import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ProductCard({ title, price, grade, image, baseValue, logisticsCost, savesCO2 }) {
  const gradeColors = {
    'Grade A+': 'bg-reloop-green text-white',
    'Grade B': 'bg-surface-variant text-on-surface-variant',
    'Grade A': 'bg-primary-fixed text-link-blue',
  };

  const badgeClass = gradeColors[grade] || 'bg-gray-200 text-gray-700';

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200 overflow-hidden border-border-standard rounded bg-surface-container-lowest">
      <div className="p-3 flex-grow flex flex-col">
        <div className="relative w-full h-40 mb-3 flex items-center justify-center bg-surface-container-low rounded-sm overflow-hidden">
          {image ? (
            <img alt={title} className="max-h-full max-w-full object-contain mix-blend-multiply" src={image} />
          ) : (
            <div className="text-gray-400 text-sm">Image not available</div>
          )}
          <span className={`absolute top-0 right-0 font-label-medium text-[10px] px-2 py-0.5 rounded-bl ${badgeClass}`}>
            {grade}
          </span>
        </div>
        <Link to="/product-detail"><Link to="/product-detail"><Link to="/product-detail"><Link to="/product-detail"><h3 className="font-body-md text-link-blue hover:underline cursor-pointer line-clamp-2 mb-1">{title}</h3></Link></Link></Link></Link>
        <div className="font-price-lg text-on-surface mb-2 font-medium text-xl">₹{price.toLocaleString()}</div>
        
        <div className="mt-auto">
          {/* Logistics breakdown inset */}
          <div className="bg-surface-bright border border-gray-300 border-dashed p-2 rounded-sm mb-3">
            <div className="flex justify-between font-body-sm text-[10px] text-on-surface-variant mb-1">
              <span>Base Value:</span><span>₹{baseValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-body-sm text-[10px] text-on-surface-variant">
              <span>Logistics & Check:</span><span>+₹{logisticsCost.toLocaleString()}</span>
            </div>
          </div>
          <Button className="w-full h-8 bg-gradient-to-b from-[#FFB03B] to-[#FF9900] hover:from-[#f7c06c] hover:to-[#f3a847] border border-[#A88734] rounded-[3px] text-black font-body-md">
            Add to Cart
          </Button>
        </div>
      </div>
      
      {/* ReLoop Row (Sustainability Layer) */}
      <div className="bg-[#F0FDF4] border-t border-border-standard p-2 mt-auto">
        <p className="font-body-sm text-[10px] text-reloop-green flex items-center gap-1 font-medium">
          <Leaf className="w-3 h-3" />
          Saves {savesCO2}kg CO2e
        </p>
      </div>
    </Card>
  );
}
