import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PriceTooltipProps {
  priceTier: number;
  children: React.ReactNode;
}

export const PriceTooltip: React.FC<PriceTooltipProps> = ({ priceTier, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [tooltipPlacement, setTooltipPlacement] = useState<'above' | 'below'>('above');
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const getTooltipText = (tier: number) => {
    switch (tier) {
      case 1:
        return 'Budget-friendly ($15-30 per person)';
      case 2:
        return 'Mid-range ($30-60 per person)';
      case 3:
        return 'High-end ($60+ per person)';
      default:
        return '';
    }
  };

  const updateTooltipPosition = () => {
    if (triggerRef.current && tooltipRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      // Calculate initial position (above the trigger)
      let top = triggerRect.top - tooltipRect.height - 8;
      let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
      
      // Check if tooltip would be clipped at the top
      if (top < 10) {
        // Position below the trigger instead
        top = triggerRect.bottom + 8;
        setTooltipPlacement('below');
      } else {
        setTooltipPlacement('above');
      }
      
      // Check if tooltip would be clipped on the left
      if (left < 10) {
        left = 10;
      }
      
      // Check if tooltip would be clipped on the right
      const rightEdge = left + tooltipRect.width;
      if (rightEdge > window.innerWidth - 10) {
        left = window.innerWidth - tooltipRect.width - 10;
      }
      
      setTooltipPosition({ top, left });
    }
  };

  useEffect(() => {
    if (showTooltip) {
      updateTooltipPosition();
      window.addEventListener('scroll', updateTooltipPosition);
      window.addEventListener('resize', updateTooltipPosition);
      
      return () => {
        window.removeEventListener('scroll', updateTooltipPosition);
        window.removeEventListener('resize', updateTooltipPosition);
      };
    }
  }, [showTooltip]);

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      
      {showTooltip && createPortal(
        <div 
          ref={tooltipRef}
          className="fixed px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap"
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left,
            zIndex: 999999
          }}
        >
          {getTooltipText(priceTier)}
          {tooltipPlacement === 'above' ? (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          ) : (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
