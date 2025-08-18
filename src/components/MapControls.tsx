import React, { useState, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { mapTheme } from '../config/theme';

interface MapControlsProps {
  onThemeChange?: (theme: 'default' | 'dark' | 'light') => void;
  currentTheme?: 'default' | 'dark' | 'light';
}

// Custom Zoom Control
const ZoomControl: React.FC = () => {
  const map = useMap();

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <div 
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
        style={{
          borderRadius: mapTheme.controls.borderRadius,
          boxShadow: mapTheme.controls.shadow,
          background: mapTheme.controls.background,
          backdropFilter: mapTheme.controls.backdropFilter
        }}
      >
        <button
          onClick={zoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Zoom in"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
        <div className="border-t border-gray-200">
          <button
            onClick={zoomOut}
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Zoom out"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Geolocation Control
const GeolocationControl: React.FC = () => {
  const map = useMap();
  const [isLocating, setIsLocating] = useState(false);
  const [hasLocation, setHasLocation] = useState(false);

  const locateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 15);
        setHasLocation(true);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please check your browser settings.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="absolute top-4 left-4 z-[1000]">
      <button
        onClick={locateMe}
        disabled={isLocating}
        className={`
          w-10 h-10 rounded-full shadow-lg border-2 border-white transition-all duration-200 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          flex items-center justify-center
          ${isLocating 
            ? 'bg-orange-500 animate-pulse' 
            : hasLocation 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }
        `}
        style={{
          boxShadow: mapTheme.controls.shadow,
        }}
        aria-label={isLocating ? 'Locating...' : 'Find my location'}
      >
        {isLocating ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin flex items-center justify-center" />
        ) : (
          <svg className="w-5 h-5 text-white flex items-center justify-center" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )}
      </button>
    </div>
  );
};

// Theme Control (unused - keeping for future use)
/*
const ThemeControl: React.FC<MapControlsProps> = ({ onThemeChange, currentTheme = 'default' }) => {
  const themes = [
    { id: 'default', name: 'Default', icon: '🗺️' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'light', name: 'Light', icon: '☀️' }
  ] as const;

  return (
    <div className="absolute bottom-4 left-4 z-[1000]">
      <div 
        className="bg-white rounded-lg shadow-lg border border-gray-200 p-1"
        style={{
          borderRadius: mapTheme.controls.borderRadius,
          boxShadow: mapTheme.controls.shadow,
          background: mapTheme.controls.background,
          backdropFilter: mapTheme.controls.backdropFilter
        }}
      >
        <div className="flex">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => onThemeChange?.(theme.id)}
              className={`
                w-10 h-10 rounded-md flex items-center justify-center text-lg transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${currentTheme === theme.id 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'hover:bg-gray-100 text-gray-600'
                }
              `}
              aria-label={`Switch to ${theme.name} theme`}
              title={theme.name}
            >
              {theme.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
*/

// Scale Bar
const ScaleBar: React.FC = () => {
  const map = useMap();
  const [scale, setScale] = useState('');

  useEffect(() => {
    const updateScale = () => {
      const zoom = map.getZoom();
      const center = map.getCenter();
      const lat = center.lat;
      
      // Calculate scale based on zoom level and latitude
      const metersPerPixel = 156543.03392 * Math.cos(lat * Math.PI / 180) / Math.pow(2, zoom);
      const scaleMeters = metersPerPixel * 100; // 100 pixels
      
      if (scaleMeters >= 1000) {
        setScale(`${Math.round(scaleMeters / 1000)}km`);
      } else {
        setScale(`${Math.round(scaleMeters)}m`);
      }
    };

    updateScale();
    map.on('zoomend', updateScale);
    map.on('moveend', updateScale);

    return () => {
      map.off('zoomend', updateScale);
      map.off('moveend', updateScale);
    };
  }, [map]);

  return (
    <div className="absolute bottom-4 right-4 z-[1000]">
      <div 
        className="bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700"
        style={{
          borderRadius: mapTheme.controls.borderRadius,
          boxShadow: mapTheme.controls.shadow,
          background: mapTheme.controls.background,
          backdropFilter: mapTheme.controls.backdropFilter
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-16 h-1 bg-gray-300 rounded-full">
            <div className="w-full h-full bg-gray-600 rounded-full" />
          </div>
          <span>{scale}</span>
        </div>
      </div>
    </div>
  );
};

// Main Map Controls Component
export const MapControls: React.FC<MapControlsProps> = () => {
  return (
    <>
      <ZoomControl />
      <GeolocationControl />
      <ScaleBar />
    </>
  );
};
