import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ProductCard({ id, title, price, grade, image, baseValue, logisticsCost, savesCO2, isNearYou, estimatedDays, isResold, ageLabel }) {
  const gradeColors = {
    'Grade A+': 'bg-reloop-green text-white',
    'Grade B': 'bg-surface-variant text-on-surface-variant',
    'Grade A': 'bg-primary-fixed text-link-blue',
  };

  const badgeClass = gradeColors[grade] || 'bg-gray-200 text-gray-700';

  return (
    <Card className={`flex flex-col h-full hover:shadow-md transition-shadow duration-200 overflow-hidden rounded bg-surface-container-lowest ${
      isResold ? 'border-2 border-[#7C3AED]' : 'border-border-standard'
    }`}>
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
          {isResold ? (
            <span className="absolute top-0 left-0 bg-[#7C3AED] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[11px]">recycling</span>
              PRE-LOVED
            </span>
          ) : isNearYou && (
            <span className="absolute top-0 left-0 bg-[#2DC071] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br">
              NEAR YOU
            </span>
          )}
        </div>
        <Link to={`/product-detail/${id}`}>
          <h3 className="font-body-md text-link-blue hover:underline cursor-pointer line-clamp-2 mb-1">{title}</h3>
        </Link>

        {/* Resold tag line */}
        {isResold && (
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[10px] font-bold text-[#7C3AED] bg-[#F3E8FF] px-1.5 py-0.5 rounded">
              Resold by owner
            </span>
            {ageLabel && (
              <span className="text-[10px] text-on-surface-variant">· {ageLabel}</span>
            )}
          </div>
        )}

        <div className="font-price-lg text-on-surface mb-2 font-medium text-xl">₹{price.toLocaleString()}</div>
        
        <div className="mt-auto">
          {/* Logistics breakdown inset */}
          <div className="bg-surface-bright border border-gray-300 border-dashed p-2 rounded-sm mb-3">
            <div className="flex justify-between font-body-sm text-[10px] text-on-surface-variant mb-1">
              <span>Base Value:</span><span>₹{baseValue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-body-sm text-[10px] text-on-surface-variant">
              <span>Shipping:</span><span>+₹{logisticsCost.toLocaleString()}</span>
            </div>
            {estimatedDays && (
              <div className="flex justify-between font-body-sm text-[10px] text-on-surface-variant mt-1">
                <span>Delivery:</span><span>{estimatedDays} day{estimatedDays > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          <Link to={`/product-detail/${id}`}>
            <Button className="w-full h-8 bg-gradient-to-b from-[#FFB03B] to-[#FF9900] hover:from-[#f7c06c] hover:to-[#f3a847] border border-[#A88734] rounded-[3px] text-black font-body-md">
              View Details
            </Button>
          </Link>
        </div>
      </div>
      
      {/* ReLoop Row (Sustainability Layer) */}
      <div className={`border-t border-border-standard p-2 mt-auto ${isResold ? 'bg-[#F3E8FF]' : 'bg-[#F0FDF4]'}`}>
        <p className={`font-body-sm text-[10px] flex items-center gap-1 font-medium ${isResold ? 'text-[#7C3AED]' : 'text-reloop-green'}`}>
          <Leaf className="w-3 h-3" />
          {isResold ? 'Second life · Saves' : 'Saves'} {savesCO2}kg CO2e
        </p>
      </div>
    </Card>
  );
}
