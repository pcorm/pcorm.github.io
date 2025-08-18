import React from 'react';
import L from 'leaflet';
import type { Venue } from '../types';
import { getVenueStatus } from '../utils/timeUtils';
import { mapTheme } from '../config/theme';

interface MarkerPinProps {
  venue: Venue;
  isSelected?: boolean;
  isHovered?: boolean;
}

// SVG Beer Icon Component
const BeerIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 24 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M9 2h6v2H9V2zM7 4h10v2H7V4zM6 6h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" 
      fill={color}
      stroke="white"
      strokeWidth="1"
    />
    <path 
      d="M8 8h8v8H8V8z" 
      fill="rgba(255,255,255,0.2)"
    />
    <circle cx="12" cy="12" r="1" fill="white" opacity="0.8" />
  </svg>
);

// Create custom marker icon
export const createMarkerIcon = (venue: Venue, isSelected = false, isHovered = false): L.DivIcon => {
  const status = getVenueStatus(venue);
  let color = mapTheme.colors.venue.closed;
  
  if (status.isOpen) {
    color = status.hasDeals ? mapTheme.colors.venue.happyHour : mapTheme.colors.venue.open;
  }

  const size = isSelected ? mapTheme.markers.size.large : mapTheme.markers.size.medium;
  const scale = isHovered ? 1.1 : 1;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background: linear-gradient(135deg, ${color}, ${color}dd);
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg) scale(${scale});
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all ${mapTheme.markers.animation.duration}ms ${mapTheme.markers.animation.easing};
        cursor: pointer;
        position: relative;
      ">
        <div style="
          transform: rotate(45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        ">
          <svg width="${size * 0.6}" height="${size * 0.6}" viewBox="0 0 24 24" fill="none">
            <path d="M9 2h6v2H9V2zM7 4h10v2H7V4zM6 6h12v12a2 2 0 01-2 2H8a2 2 0 01-2-2V6z" fill="white"/>
            <path d="M8 8h8v8H8V8z" fill="rgba(255,255,255,0.2)"/>
            <circle cx="12" cy="12" r="1" fill="white" opacity="0.8"/>
          </svg>
        </div>
        ${status.hasDeals ? `
          <div style="
            position: absolute;
            top: -4px;
            right: -4px;
            width: 12px;
            height: 12px;
            background: ${mapTheme.colors.danger};
            border: 2px solid white;
            border-radius: 50%;
            animation: pulse 2s infinite;
          "></div>
        ` : ''}
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .custom-marker:hover {
          transform: scale(1.15) !important;
        }
      </style>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size - 10]
  });
};

// Marker Pin Component
export const MarkerPin: React.FC<MarkerPinProps> = ({ venue, isSelected = false, isHovered = false }) => {
  const status = getVenueStatus(venue);
  let color = mapTheme.colors.venue.closed;
  
  if (status.isOpen) {
    color = status.hasDeals ? mapTheme.colors.venue.happyHour : mapTheme.colors.venue.open;
  }

  const size = isSelected ? mapTheme.markers.size.large : mapTheme.markers.size.medium;
  const scale = isHovered ? 1.1 : 1;

  return (
    <div
      className="marker-pin"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}dd)`,
        border: '3px solid white',
        borderRadius: '50% 50% 50% 0',
        transform: `rotate(-45deg) scale(${scale})`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: `all ${mapTheme.markers.animation.duration}ms ${mapTheme.markers.animation.easing}`,
        cursor: 'pointer',
        position: 'relative'
      }}
    >
      <div
        style={{
          transform: 'rotate(45deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%'
        }}
      >
        <BeerIcon color="white" size={size * 0.6} />
      </div>
      
      {status.hasDeals && (
        <div
          className="deal-indicator"
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            width: 12,
            height: 12,
            background: mapTheme.colors.danger,
            border: '2px solid white',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}
        />
      )}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .marker-pin:hover {
            transform: rotate(-45deg) scale(1.2) !important;
          }
          
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        `
      }} />
    </div>
  );
};
