import React from 'react';
import type { Venue } from '../types';
import { getVenueStatus, getActiveDeals, getDealEmoji } from '../utils/timeUtils';
import { mapTheme } from '../config/theme';
import { PriceTooltip } from './PriceTooltip';

interface PopupCardProps {
  venue: Venue;
  onViewDetails?: () => void;
  onGetDirections?: () => void;
}

// Star Rating Component
const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg' }> = ({ rating, size = 'md' }) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={sizes[size]}
          fill={star <= rating ? '#FBBF24' : '#E5E7EB'}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-sm font-medium text-gray-600 ml-1">{rating}</span>
    </div>
  );
};

// Deal Chip Component
const DealChip: React.FC<{ deal: string; type: 'drink' | 'food' }> = ({ deal, type }) => {
  const colors = {
    drink: 'bg-blue-100 text-blue-800 border-blue-200',
    food: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border gap-1
      ${colors[type]}
    `}>
      <span>{getDealEmoji(deal, type)}</span>
      <span>{deal}</span>
    </span>
  );
};

// Hours Badge Component
const HoursBadge: React.FC<{ status: ReturnType<typeof getVenueStatus> }> = ({ status }) => {
  if (!status.isOpen) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
        🔒 Closed
      </span>
    );
  }

  if (status.isOpen && status.hasDeals) {
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200 animate-pulse">
        ⏰ Happy Hour Now!
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
      ✅ Open Now
    </span>
  );
};

// Popup Card Component
export const PopupCard: React.FC<PopupCardProps> = ({ 
  venue, 
  onViewDetails, 
  onGetDirections 
}) => {
  const status = getVenueStatus(venue);
  const activeDeals = getActiveDeals(venue);

  return (
    <div 
      className="popup-card"
      style={{
        maxWidth: mapTheme.popup.maxWidth,
        borderRadius: mapTheme.popup.borderRadius,
        boxShadow: mapTheme.popup.shadow,
        padding: mapTheme.popup.padding,
        background: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Venue Image */}
      {venue.photos && venue.photos.length > 0 && (
        <div className="relative mb-3">
          <img
            src={venue.photos[0]}
            alt={venue.name}
            className="w-full h-32 object-cover rounded-lg"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute top-2 right-2">
            <HoursBadge status={status} />
          </div>
        </div>
      )}

      {/* Venue Header */}
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {venue.name}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>{venue.neighborhood}</span>
          <PriceTooltip priceTier={venue.priceTier}>
            <span className="font-medium text-green-600">
              {Array(venue.priceTier).fill('$').join('')}
            </span>
          </PriceTooltip>
        </div>
        <div className="flex items-center justify-between">
          <StarRating rating={venue.rating} size="sm" />
          <span className="text-xs text-gray-500">
            {venue.deals.length} deals
          </span>
        </div>
      </div>

      {/* Active Deals */}
      {status.isOpen && activeDeals.length > 0 && (
        <div className="mb-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            🎉 Active Deals
          </h4>
          <div className="flex flex-wrap gap-1">
            {activeDeals.slice(0, 3).map((deal, index) => (
              <DealChip 
                key={index} 
                deal={deal.label} 
                type={deal.type} 
              />
            ))}
            {activeDeals.length > 3 && (
              <span className="text-xs text-gray-500 self-center">
                +{activeDeals.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={onViewDetails}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`View details for ${venue.name}`}
        >
          View Details
        </button>
        <button
          onClick={onGetDirections}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
          aria-label={`Get directions to ${venue.name}`}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Accessibility */}
      <div className="sr-only">
        Venue: {venue.name}, Rating: {venue.rating} stars, Price: {Array(venue.priceTier).fill('$').join('')}, 
        {status.isOpen ? 'Currently open' : 'Currently closed'}
        {activeDeals.length > 0 && `, ${activeDeals.length} active deals available`}
      </div>
    </div>
  );
};
