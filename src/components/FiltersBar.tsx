import React, { useState } from 'react';
import { useStore, calculateDistance } from '../store/useStore';
import type { FilterState } from '../types';
import { MapPinIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { PriceTooltip } from './PriceTooltip';


const subFilterOptions = [
  { label: 'Oysters', emoji: '🦪' },
  { label: 'Margaritas', emoji: '🍹' },
  { label: 'Wine', emoji: '🍷' },
  { label: 'Beer', emoji: '🍺' },
  { label: 'Cocktails', emoji: '🍸' },
  { label: 'Appetizers', emoji: '🥨' },
  { label: 'Tacos', emoji: '🌮' },
  { label: 'Sushi', emoji: '🍣' }
];

const timeWindowOptions = [
  { value: 'now', label: 'Now' },
  { value: 'tonight', label: 'Tonight' },
  { value: 'weekend', label: 'This Weekend' },
  { value: 'all', label: 'All Times' }
];

const dayOptions = [
  { value: 'monday', label: 'Mon' },
  { value: 'tuesday', label: 'Tue' },
  { value: 'wednesday', label: 'Wed' },
  { value: 'thursday', label: 'Thu' },
  { value: 'friday', label: 'Fri' },
  { value: 'saturday', label: 'Sat' },
  { value: 'sunday', label: 'Sun' }
];

const sortOptions = [
  { value: 'distance', label: 'Distance' },
  { value: 'rating', label: 'Rating' },
  { value: 'bestDeals', label: 'Best Deals' },
  { value: 'endsSoon', label: 'Ends Soon' }
];

const priceTierOptions = [
  { value: 1, label: '$' },
  { value: 2, label: '$$' },
  { value: 3, label: '$$$' }
];

const neighborhoodOptions = ['Financial District', 'West Village', 'Midtown', 'Flatiron', 'Chelsea', 'East Village', 'Upper East Side', 'Gramercy'];

// Top 3 neighborhoods to show by default (will be reordered based on user location)
const defaultNeighborhoods = ['Financial District', 'West Village', 'Midtown'];

const featureOptions = [
  { value: 'outdoor-seating', label: 'Outdoor Seating' },
  { value: 'dog-friendly', label: 'Dog Friendly' },
  { value: 'lgbtq-friendly', label: 'LGBTQ+ Friendly' },
  { value: 'live-music', label: 'Live Music' },
  { value: 'rooftop', label: 'Rooftop' },
  { value: 'private-dining', label: 'Private Dining' },
  { value: 'wheelchair-accessible', label: 'Wheelchair Accessible' },
  { value: 'sports-tv', label: 'Sports TV' },
  { value: 'pool-table', label: 'Pool Table' },
  { value: 'dart-board', label: 'Dart Board' },
  { value: 'karaoke', label: 'Karaoke' },
  { value: 'trivia-night', label: 'Trivia Night' },
  { value: 'board-games', label: 'Board Games' }
];

export const FiltersBar: React.FC = () => {
  const { filters, updateFilters, getFilteredVenues, userLocation } = useStore();
  const [showAllNeighborhoods, setShowAllNeighborhoods] = useState(false);
  const [showAdditionalFilters, setShowAdditionalFilters] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    updateFilters(newFilters);
    // Trigger filtering
    setTimeout(() => getFilteredVenues(), 0);
  };

  const toggleSubFilter = (filter: string) => {
    const newSubFilters = filters.subFilters.includes(filter)
      ? filters.subFilters.filter(f => f !== filter)
      : [...filters.subFilters, filter];
    
    handleFilterChange({ subFilters: newSubFilters });
  };

  const togglePriceTier = (tier: number) => {
    const newPriceTier = filters.priceTier.includes(tier)
      ? filters.priceTier.filter(t => t !== tier)
      : [...filters.priceTier, tier];
    
    handleFilterChange({ priceTier: newPriceTier });
  };

  const toggleNeighborhood = (neighborhood: string) => {
    const newNeighborhoods = filters.neighborhood.includes(neighborhood)
      ? filters.neighborhood.filter(n => n !== neighborhood)
      : [...filters.neighborhood, neighborhood];
    
    handleFilterChange({ neighborhood: newNeighborhoods });
  };

  const toggleDay = (day: string) => {
    const currentDays = filters.days || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    handleFilterChange({ days: newDays });
  };

  const toggleFeature = (feature: string) => {
    const currentFeatures = filters.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    
    handleFilterChange({ features: newFeatures });
  };

  // Get neighborhoods to display (top 3 closest to user, or all if expanded)
  const getDisplayNeighborhoods = () => {
    if (!userLocation) {
      return showAllNeighborhoods ? neighborhoodOptions : defaultNeighborhoods;
    }
    
    // Define neighborhood coordinates (approximate center points)
    const neighborhoodCoords: Record<string, { lat: number; lng: number }> = {
      'Financial District': { lat: 40.7075, lng: -74.0104 },
      'West Village': { lat: 40.7355, lng: -74.0026 },
      'Midtown': { lat: 40.7589, lng: -73.9851 },
      'Flatiron': { lat: 40.7411, lng: -73.9897 },
      'Chelsea': { lat: 40.7484, lng: -74.0016 },
      'East Village': { lat: 40.7265, lng: -73.9815 },
      'Upper East Side': { lat: 40.7736, lng: -73.9595 },
      'Gramercy': { lat: 40.7388, lng: -73.9857 }
    };
    
    // Calculate distances and sort neighborhoods by proximity
    const neighborhoodsWithDistance = neighborhoodOptions.map(neighborhood => {
      const coords = neighborhoodCoords[neighborhood];
      if (!coords) return { neighborhood, distance: Infinity };
      
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        coords.lat,
        coords.lng
      );
      
      return { neighborhood, distance };
    });
    
    // Sort by distance
    const sortedNeighborhoods = neighborhoodsWithDistance
      .sort((a, b) => a.distance - b.distance)
      .map(item => item.neighborhood);
    
    // Return top 3 if collapsed, or all if expanded
    return showAllNeighborhoods ? sortedNeighborhoods : sortedNeighborhoods.slice(0, 3);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Main filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Deal Type */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <div className="flex gap-1">
              {['drink', 'food'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    // Toggle the filter - if already selected, deselect it
                    const newDealType = filters.dealType === type ? 'all' : type;
                    handleFilterChange({ dealType: newDealType as any });
                  }}
                  className={`filter-pill ${filters.dealType === type ? 'active' : ''}`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Time Window */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Time:</span>
            <div className="flex gap-1">
              {timeWindowOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleFilterChange({ timeWindow: option.value as any })}
                  className={`filter-pill ${filters.timeWindow === option.value ? 'active' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value as any })}
              className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 mr-2">Deals:</span>
          {subFilterOptions.map((filter) => (
            <button
              key={filter.label}
              onClick={() => toggleSubFilter(filter.label)}
              className={`filter-pill flex items-center gap-1 ${filters.subFilters.includes(filter.label) ? 'active' : ''}`}
            >
              <span>{filter.emoji}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Day filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm font-medium text-gray-700 mr-2">Days:</span>
          {dayOptions.map((day) => (
            <button
              key={day.value}
              onClick={() => toggleDay(day.value)}
              className={`filter-pill ${(filters.days || []).includes(day.value) ? 'active' : ''}`}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Additional Filters Toggle */}
        <div className="mb-4">
          <button
            onClick={() => setShowAdditionalFilters(!showAdditionalFilters)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            {showAdditionalFilters ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : (
              <ChevronDownIcon className="w-4 h-4" />
            )}
            Additional Filters
          </button>
        </div>

        {/* Additional Filters (Collapsible) */}
        {showAdditionalFilters && (
          <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
            {/* Features */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-700 mr-2">Features:</span>
              {(showAllFeatures ? featureOptions : featureOptions.slice(0, 7)).map((feature) => (
                <button
                  key={feature.value}
                  onClick={() => toggleFeature(feature.value)}
                  className={`filter-pill ${(filters.features || []).includes(feature.value) ? 'active' : ''}`}
                >
                  {feature.label}
                </button>
              ))}
              {!showAllFeatures && (
                <button
                  onClick={() => setShowAllFeatures(true)}
                  className="filter-pill text-primary-600 hover:bg-primary-50"
                >
                  +{featureOptions.length - 7} more
                </button>
              )}
              {showAllFeatures && (
                <button
                  onClick={() => setShowAllFeatures(false)}
                  className="filter-pill text-gray-600 hover:bg-gray-100"
                >
                  Show less
                </button>
              )}
            </div>

            {/* Price and Location */}
            <div className="flex flex-wrap gap-4">
              {/* Price Tier */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Price:</span>
                <div className="flex gap-1">
                  {priceTierOptions.map((option) => (
                    <PriceTooltip key={option.value} priceTier={option.value}>
                      <button
                        onClick={() => togglePriceTier(option.value)}
                        className={`filter-pill ${filters.priceTier.includes(option.value) ? 'active' : ''}`}
                      >
                        {option.label}
                      </button>
                    </PriceTooltip>
                  ))}
                </div>
              </div>

              {/* Neighborhood */}
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Area:</span>
                <div className="flex gap-1 flex-wrap">
                  {getDisplayNeighborhoods().map((neighborhood) => (
                    <button
                      key={neighborhood}
                      onClick={() => toggleNeighborhood(neighborhood)}
                      className={`filter-pill ${filters.neighborhood.includes(neighborhood) ? 'active' : ''}`}
                    >
                      {neighborhood}
                    </button>
                  ))}
                  {!showAllNeighborhoods && (
                    <button
                      onClick={() => setShowAllNeighborhoods(true)}
                      className="filter-pill text-primary-600 hover:bg-primary-50"
                    >
                      +{neighborhoodOptions.length - getDisplayNeighborhoods().length} more
                    </button>
                  )}
                  {showAllNeighborhoods && (
                    <button
                      onClick={() => setShowAllNeighborhoods(false)}
                      className="filter-pill text-gray-600 hover:bg-gray-100"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </div>

              {/* Radius */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Radius:</span>
                <select
                  value={filters.radius}
                  onChange={(e) => handleFilterChange({ radius: Number(e.target.value) })}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={5}>5 mi</option>
                  <option value={10}>10 mi</option>
                  <option value={15}>15 mi</option>
                  <option value={25}>25 mi</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
