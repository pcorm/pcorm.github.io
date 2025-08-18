import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import type { Venue } from '../types';
import { useStore } from '../store/useStore';
import { getVenueStatus } from '../utils/timeUtils';
import { useNavigate } from 'react-router-dom';

import { mapTheme } from '../config/theme';


import { MapControls } from './MapControls';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  venues: Venue[];
  className?: string;
  onLoad?: () => void;
}

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map bounds
const MapContent: React.FC<{ venues: Venue[]; theme: string }> = ({ venues }) => {
  const map = useMap();
  const navigate = useNavigate();
  const { selectedVenueId, setSelectedVenue, setHoveredVenue, userLocation } = useStore();

  // Debounced filter/map sync
  const debouncedSync = useCallback(
    debounce(() => {
      if (venues.length > 0) {
        // Filter out venues with invalid coordinates
        const validVenues = venues.filter(venue => 
          venue.coords && 
          typeof venue.coords.lat === 'number' && 
          typeof venue.coords.lng === 'number' &&
          !isNaN(venue.coords.lat) && 
          !isNaN(venue.coords.lng) &&
          venue.coords.lat >= -90 && venue.coords.lat <= 90 &&
          venue.coords.lng >= -180 && venue.coords.lng <= 180
        );
        
        if (validVenues.length > 0) {
          try {
            const bounds = L.latLngBounds(validVenues.map(venue => [venue.coords.lat, venue.coords.lng]));
            if (bounds.isValid()) {
              map.fitBounds(bounds, { padding: [20, 20] });
            }
          } catch (error) {
            console.warn('Failed to fit bounds:', error);
          }
        }
      }
    }, 300),
    [venues, map]
  );

  useEffect(() => {
    debouncedSync();
  }, [venues, debouncedSync]);

  // Handle venue selection from outside the map
  useEffect(() => {
    if (selectedVenueId && venues.length > 0) {
      const venue = venues.find(v => v.id === selectedVenueId);
      if (venue && venue.coords && 
          typeof venue.coords.lat === 'number' && 
          typeof venue.coords.lng === 'number' &&
          !isNaN(venue.coords.lat) && 
          !isNaN(venue.coords.lng) &&
          venue.coords.lat >= -90 && venue.coords.lat <= 90 &&
          venue.coords.lng >= -180 && venue.coords.lng <= 180) {
        try {
          map.setView([venue.coords.lat, venue.coords.lng], 16);
        } catch (error) {
          console.warn('Failed to set map view:', error);
        }
      }
    }
  }, [selectedVenueId, venues, map]);

  return (
    <>
      {venues.map((venue) => {

        console.log('Rendering marker for venue:', venue.name, 'at position:', venue.coords);

        return (
          <Marker
            key={venue.id}
            position={[venue.coords.lat, venue.coords.lng]}
            icon={L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  width: 32px;
                  height: 32px;
                  background: ${(() => {
                    const status = getVenueStatus(venue);
                    // Only show green if venue is open AND has active deals
                    if (status.isOpen && status.hasDeals) return '#10B981'; // Green for active happy hour
                    if (status.isOpen) return '#F59E0B'; // Orange for open but no happy hour
                    return '#6B7280'; // Gray for closed
                  })()};
                  border: 2px solid white;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                  font-size: 16px;
                  pointer-events: none;
                ">
                  🍺
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 16]
            })}
            eventHandlers={{
              click: () => {
                console.log('Marker clicked:', venue.name);
                setSelectedVenue(venue.id);
              },
              mouseover: () => setHoveredVenue(venue.id),
              mouseout: () => setHoveredVenue(null),
            }}
          >
            <Popup
              closeButton={true}
              className="custom-popup"
              maxWidth={mapTheme.popup.maxWidth}
              minWidth={280}
              autoPan={true}
              autoPanPadding={[50, 50]}
            >
              <div style={{ padding: '10px', minWidth: '200px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  {venue.name}
                </h3>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>
                  {venue.neighborhood}
                </p>
                <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                  {venue.address}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => {
                      setSelectedVenue(venue.id);
                      navigate(`/venue/${venue.id}`);
                    }}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#3B82F6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => {
                      const { lat, lng } = venue.coords;
                      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                    }}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Directions
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
      
      {/* Current Location Marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={L.divIcon({
            className: 'current-location-marker',
            html: `
              <div style="
                width: 24px;
                height: 24px;
                background: #3B82F6;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 0 0 2px #3B82F6;
                animation: pulse 2s infinite;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
              ">
                <div style="
                  width: 8px;
                  height: 8px;
                  background: white;
                  border-radius: 50%;
                  position: absolute;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                "></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })}
        />
      )}
    </>
  );
};

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Loading Skeleton Component
const LoadingSkeleton: React.FC = () => (
  <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 font-medium">Loading map...</p>
    </div>
  </div>
);

// Main Map View Component
const LeafletMapView: React.FC<MapViewProps> = ({ venues, className = '', onLoad }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState<'default' | 'dark' | 'light'>('default');

  // Handle theme change
  const handleThemeChange = useCallback((theme: 'default' | 'dark' | 'light') => {
    setCurrentTheme(theme);
  }, []);

  // Get tile configuration based on theme
  const tileConfig = useMemo(() => {
    return mapTheme.tiles[currentTheme];
  }, [currentTheme]);

  // Handle map load
  const handleMapLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  return (
    <div 
      className={`relative w-full h-full ${className}`} 
      style={{ 
        height: '100%', 
        minHeight: '400px',
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Loading Skeleton */}
      {isLoading && <LoadingSkeleton />}

      {/* Map Container */}
      <MapContainer
        center={[40.7589, -73.9851]} // NYC center
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
        zoomControl={false} // We'll use custom controls
        attributionControl={false}
        whenReady={() => {
          handleMapLoad();
        }}

      >
        {/* Tile Layer with retina support */}
        <TileLayer
          attribution={tileConfig.attribution}
          url={tileConfig.url}
          maxZoom={tileConfig.maxZoom}
          subdomains={tileConfig.subdomains}
          // Performance hints
          updateWhenIdle
          updateWhenZooming={false}
          keepBuffer={2}
          maxNativeZoom={18}
        />

        {/* Map Content */}
        <MapContent venues={venues} theme={currentTheme} />

        {/* Custom Controls */}
        <MapControls 
          onThemeChange={handleThemeChange}
          currentTheme={currentTheme}
        />
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000] border border-gray-200">
        <div className="text-xs text-gray-600 mb-2 font-medium">Legend</div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Open</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span>Happy Hour</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Closed</span>
          </div>
        </div>
      </div>

      {/* Custom CSS for popups */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-popup .leaflet-popup-content-wrapper {
            background: white;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          }
          
          .custom-popup .leaflet-popup-content {
            margin: 0;
            padding: 0;
          }
          
          .custom-popup .leaflet-popup-tip {
            background: white;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
          }
          
          .leaflet-marker-icon.custom-marker {
            transition: all 0.3s ease;
          }
          
          .leaflet-marker-icon.custom-marker {
            pointer-events: auto !important;
            cursor: pointer !important;
            z-index: 1000 !important;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .leaflet-zoom-animated {
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `
      }} />
    </div>
  );
};

export const MapView: React.FC<MapViewProps> = (props) => {
  return <LeafletMapView {...props} />;
};
