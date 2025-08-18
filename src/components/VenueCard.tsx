import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Venue } from '../types';
import { useStore } from '../store/useStore';
import { getVenueStatus, getActiveDeals, formatTimeRemaining, getDealTimeRemaining, getDealEmoji } from '../utils/timeUtils';
import { StarIcon, HeartIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { PriceTooltip } from './PriceTooltip';

interface VenueCardProps {
  venue: Venue;
  distance?: number;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, distance }) => {
  const navigate = useNavigate();
  const { selectedVenueId, hoveredVenueId, favorites, setHoveredVenue, toggleFavorite } = useStore();
  const status = getVenueStatus(venue);
  const activeDeals = getActiveDeals(venue);
  const isFavorite = favorites.includes(venue.id);
  const isSelected = selectedVenueId === venue.id;
  const isHovered = hoveredVenueId === venue.id;

  const priceTier = '$'.repeat(venue.priceTier);

  return (
    <div
      className={`card transition-all duration-200 cursor-pointer ${
        isSelected ? 'ring-2 ring-primary-500' : ''
      } ${isHovered ? 'shadow-lg' : ''}`}
      onClick={() => navigate(`/venue/${venue.id}`)}
      onMouseEnter={() => setHoveredVenue(venue.id)}
      onMouseLeave={() => setHoveredVenue(null)}
    >
      <div className="relative">
        <img
          src={venue.photos[0]}
          alt={venue.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(venue.id);
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            {isFavorite ? (
              <HeartIcon className="w-5 h-5 text-red-500" />
            ) : (
              <HeartOutlineIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
        
        {/* Status badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {status.isOpen && status.hasDeals && status.endingSoon && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Ends Soon
            </span>
          )}
          {/* Current Deals Status Pill */}
          {status.isOpen && status.hasDeals ? (
            <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
              Happy Hour Now
            </span>
          ) : status.isOpen ? (
            <span className="bg-gray-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
              Not Happy Hour Now
            </span>
          ) : (
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
              Closed
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{venue.name}</h3>
          <PriceTooltip priceTier={venue.priceTier}>
            <span className="text-gray-600 font-medium">
              {priceTier}
            </span>
          </PriceTooltip>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400" />
            <span className="ml-1 text-sm text-gray-600">{venue.rating}</span>
          </div>
          <span className="text-gray-400">•</span>
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="w-4 h-4 mr-1" />
            {venue.neighborhood}
          </div>
          {distance && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">{distance.toFixed(1)} mi</span>
            </>
          )}
        </div>

        {status.isOpen && activeDeals.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <ClockIcon className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-primary-600">Active Deals</span>
            </div>
            <div className="space-y-1">
              {activeDeals.map((deal, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{deal.label}</span>
                  <span className="text-xs text-gray-500">
                    {formatTimeRemaining(getDealTimeRemaining(deal))} left
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-1">
          {venue.deals.map((deal, index) => (
            <span
              key={index}
              className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                deal.type === 'drink'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              <span>{getDealEmoji(deal.label, deal.type)}</span>
              <span>{deal.label}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
