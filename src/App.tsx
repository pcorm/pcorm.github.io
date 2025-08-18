import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MapView } from './components/MapView';
import { VenueCard } from './components/VenueCard';
import { FiltersBar } from './components/FiltersBar';
import { VenueDetail } from './components/VenueDetail';
import { useStore } from './store/useStore';
import { Logo } from './components/Logo';
import { MapPinIcon, ListBulletIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Main App Layout Component
const AppLayout: React.FC = () => {
  const { filteredVenues, userLocation, setUserLocation, getFilteredVenues, filters, updateFilters } = useStore();
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'split'>('split');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery || '');

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setViewMode('list');
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          getFilteredVenues();
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Use default NYC location
          setUserLocation({ lat: 40.7589, lng: -73.9851 });
          getFilteredVenues();
        }
      );
    } else {
      // Fallback to NYC location
      setUserLocation({ lat: 40.7589, lng: -73.9851 });
      getFilteredVenues();
    }
  }, [setUserLocation, getFilteredVenues]);

  const calculateDistance = (venue: any) => {
    if (!userLocation) return null;
    const R = 3959; // Earth's radius in miles
    const dLat = (venue.coords.lat - userLocation.lat) * (Math.PI / 180);
    const dLon = (venue.coords.lng - userLocation.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(userLocation.lat * (Math.PI / 180)) *
        Math.cos(venue.coords.lat * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleMapLoad = () => {
    setMapLoaded(true);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== (filters.searchQuery || '')) {
        updateFilters({ searchQuery: searchQuery || '' });
        getFilteredVenues();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, filters.searchQuery, updateFilters, getFilteredVenues]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search venues, neighborhoods, deals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* View Mode Toggle */}
            {!isMobile && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    if (viewMode === 'list') {
                      setViewMode('split');
                    } else {
                      setViewMode('list');
                    }
                  }}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list' || viewMode === 'split' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={viewMode === 'list' ? 'Click for dual view' : viewMode === 'split' ? 'List view' : 'List view'}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    if (viewMode === 'map') {
                      setViewMode('split');
                    } else {
                      setViewMode('map');
                    }
                  }}
                  className={`p-2 rounded-lg ${
                    viewMode === 'map' || viewMode === 'split' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title={viewMode === 'map' ? 'Click for dual view' : viewMode === 'split' ? 'Map view' : 'Map view'}
                >
                  <MapPinIcon className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isMobile && (
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search venues, neighborhoods, deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <FiltersBar />

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {viewMode === 'split' && !isMobile ? (
          <>
            {/* Venue List - Show immediately */}
            <div className="w-1/2 overflow-y-auto bg-white">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {filteredVenues.length} venues found
                  </h2>
                </div>
                
                {filteredVenues.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🍺</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
                    <p className="text-gray-500">
                      {searchQuery ? 
                        `No venues match "${searchQuery}". Try a different search term or adjust your filters.` : 
                        'Try adjusting your filters or expanding your search radius.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredVenues.map((venue) => (
                      <VenueCard
                        key={venue.id}
                        venue={venue}
                        distance={calculateDistance(venue) || undefined}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Map - Show loading state initially */}
            <div className="w-1/2">
              {!mapLoaded && (
                <div className="h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
              <MapView venues={filteredVenues} onLoad={handleMapLoad} />
            </div>
          </>
        ) : viewMode === 'map' ? (
          <div className="w-full">
            <MapView venues={filteredVenues} onLoad={handleMapLoad} />
          </div>
        ) : (
          <div className="w-full overflow-y-auto bg-white">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {filteredVenues.length} venues found
                </h2>
              </div>
              
              {filteredVenues.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🍺</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
                  <p className="text-gray-500">
                    {searchQuery ? 
                      `No venues match "${searchQuery}". Try a different search term or adjust your filters.` : 
                      'Try adjusting your filters or expanding your search radius.'
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVenues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      distance={calculateDistance(venue) || undefined}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// Main App Component with Routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />} />
        <Route path="/venue/:id" element={<VenueDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
