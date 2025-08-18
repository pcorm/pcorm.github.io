import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useStore } from '../store/useStore';
import { getVenueStatus, getActiveDeals, getDealTimeRemaining, formatTimeRemaining, formatTime12Hour, formatHours12Hour, getDealEmoji } from '../utils/timeUtils';
import { StarIcon, HeartIcon, MapPinIcon, PhoneIcon, GlobeAltIcon, ClockIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutlineIcon } from '@heroicons/react/24/outline';
import { MapView } from './MapView';
import { PriceTooltip } from './PriceTooltip';

export const VenueDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { venues, favorites, toggleFavorite } = useStore();
  
  const venue = venues.find(v => v.id === id);
  
  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Venue not found</h1>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  const status = getVenueStatus(venue);
  const activeDeals = getActiveDeals(venue);
  const isFavorite = favorites.includes(venue.id);

  const priceTier = '$'.repeat(venue.priceTier);

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Back to Venues</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="h-96 relative rounded-lg overflow-hidden">
            <img
              src={venue.photos[0]}
              alt={venue.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Favorite button */}
            <button
              onClick={() => toggleFavorite(venue.id)}
              className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
            >
              {isFavorite ? (
                <HeartIcon className="w-6 h-6 text-red-500" />
              ) : (
                <HeartOutlineIcon className="w-6 h-6 text-gray-600" />
              )}
            </button>

            {/* Status badges */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {status.isOpen && (
                <span className="bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                  Open Now
                </span>
              )}
              {status.isOpen && status.hasDeals && (
                <span className="bg-primary-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                  Happy Hour Active
                </span>
              )}
              {status.isOpen && status.hasDeals && status.endingSoon && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                  Ends Soon
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Venue info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center">
                      <StarIcon className="w-5 h-5 text-yellow-400 mr-1" />
                      <span className="font-medium">{venue.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <div className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>{venue.neighborhood}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <PriceTooltip priceTier={venue.priceTier}>
                      <span className="font-medium">
                        {priceTier}
                      </span>
                    </PriceTooltip>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{venue.address}</span>
                </div>
                {venue.phone && (
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${venue.phone}`} className="text-primary-600 hover:text-primary-700">
                      {venue.phone}
                    </a>
                  </div>
                )}
                {venue.url && (
                  <div className="flex items-center gap-2">
                    <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                    <a
                      href={venue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Active deals */}
            {status.isOpen && activeDeals.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary-500" />
                  Active Happy Hour Deals
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeDeals.map((deal, index) => (
                    <div key={index} className="bg-primary-50 p-4 rounded-lg border border-primary-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-primary-800 flex items-center gap-2">
                          <span>{getDealEmoji(deal.label, deal.type)}</span>
                          <span>{deal.label}</span>
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          deal.type === 'drink' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {deal.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Time: {formatTime12Hour(deal.start)} - {formatTime12Hour(deal.end)}</div>
                        <div className="text-red-600 font-medium">
                          {formatTimeRemaining(getDealTimeRemaining(deal))} remaining
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All deals */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">All Deals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {venue.deals.map((deal, index) => (
                  <div key={index} className="border border-gray-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 flex items-center gap-2">
                        <span>{getDealEmoji(deal.label, deal.type)}</span>
                        <span>{deal.label}</span>
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        deal.type === 'drink' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {deal.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Days: {deal.days.join(', ')}</div>
                      <div>Time: {formatTime12Hour(deal.start)} - {formatTime12Hour(deal.end)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Hours</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {daysOfWeek.map((day, index) => (
                  <div key={day} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{dayLabels[index]}</span>
                    <span className="text-gray-600">{formatHours12Hour(venue.hours[day])}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Photos */}
            {venue.photos.length > 1 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {venue.photos.slice(1).map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${venue.name} photo ${index + 2}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Map */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Location</h2>
              <div className="h-64 rounded-lg overflow-hidden">
                <MapView venues={[venue]} />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
              <div className="space-y-3">
                {venue.phone && (
                  <a
                    href={`tel:${venue.phone}`}
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    <PhoneIcon className="w-4 h-4" />
                    Call Now
                  </a>
                )}
                {venue.url && (
                  <a
                    href={venue.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full btn-secondary flex items-center justify-center gap-2"
                  >
                    <GlobeAltIcon className="w-4 h-4" />
                    Visit Website
                  </a>
                )}
                <button
                  onClick={() => toggleFavorite(venue.id)}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg border transition-colors ${
                    isFavorite
                      ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {isFavorite ? (
                    <HeartIcon className="w-4 h-4" />
                  ) : (
                    <HeartOutlineIcon className="w-4 h-4" />
                  )}
                  {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
