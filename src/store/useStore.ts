import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppState, FilterState, Venue } from '../types';
import { getCurrentDay, getCurrentTime, getSmartDefaultTimeWindow } from '../utils/timeUtils';
import venueData from '../data/seed.json';

const initialFilters: FilterState = {
  dealType: 'all',
  subFilters: [],
  timeWindow: getSmartDefaultTimeWindow(),
  days: [],
  priceTier: [1, 2, 3],
  neighborhood: [],
  radius: 10,
  features: [],
  sortBy: 'rating',
  searchQuery: '',
};

const initialMapState = {
  selectedVenueId: null,
  hoveredVenueId: null,
  userLocation: null,
  venues: venueData.venues as Venue[],
  filteredVenues: venueData.venues as Venue[],
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialMapState,
      filters: initialFilters,
      favorites: [],
      isLoading: false,
      error: null,

      // Actions
      setUserLocation: (location: { lat: number; lng: number }) =>
        set({ userLocation: location }),

      setSelectedVenue: (venueId: string | null) =>
        set({ selectedVenueId: venueId }),

      setHoveredVenue: (venueId: string | null) =>
        set({ hoveredVenueId: venueId }),

      updateFilters: (newFilters: Partial<FilterState>) =>
        set((state) => ({
          filters: { 
            ...initialFilters, // Ensure all properties are present
            ...state.filters, 
            ...newFilters 
          },
        })),

      toggleFavorite: (venueId: string) =>
        set((state) => ({
          favorites: state.favorites.includes(venueId)
            ? state.favorites.filter((id) => id !== venueId)
            : [...state.favorites, venueId],
        })),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error }),

      // Computed actions
      getFilteredVenues: () => {
        const state = get();
        const { filters, venues, userLocation } = state;
        
        console.log('Filtering venues:', {
          totalVenues: venues.length,
          userLocation,
          filters
        });
        
        let filtered = venues;

        // Filter by search query
        if (filters.searchQuery && filters.searchQuery.trim()) {
          const searchTerm = filters.searchQuery.toLowerCase().trim();
          console.log('🔍 Searching for:', searchTerm);
          filtered = filtered.filter((venue) => {
            // Search in venue name
            if (venue.name.toLowerCase().includes(searchTerm)) return true;
            
            // Search in neighborhood
            if (venue.neighborhood.toLowerCase().includes(searchTerm)) return true;
            
            // Search in address
            if (venue.address.toLowerCase().includes(searchTerm)) return true;
            
            // Search in deal labels
            if (venue.deals.some(deal => deal.label.toLowerCase().includes(searchTerm))) return true;
            
            return false;
          });
          console.log('🔍 Search results:', filtered.length, 'venues found');
        }

        // Filter by deal type
        if (filters.dealType !== 'all') {
          filtered = filtered.filter((venue) =>
            venue.deals.some((deal) => deal.type === filters.dealType)
          );
        }

        // Filter by sub-filters
        if (filters.subFilters.length > 0) {
          filtered = filtered.filter((venue) =>
            venue.deals.some((deal) =>
              filters.subFilters.some((subFilter) =>
                deal.label.toLowerCase().includes(subFilter.toLowerCase())
              )
            )
          );
        }

        // Filter by price tier
        if (filters.priceTier.length > 0) {
          filtered = filtered.filter((venue) =>
            filters.priceTier.includes(venue.priceTier)
          );
        }

        // Filter by neighborhood
        if (filters.neighborhood.length > 0) {
          filtered = filtered.filter((venue) =>
            filters.neighborhood.includes(venue.neighborhood)
          );
        }

            // Filter by days
    if (filters.days && filters.days.length > 0) {
      filtered = filtered.filter((venue) =>
        venue.deals.some((deal) =>
          deal.days.some((day) => filters.days.includes(day))
        )
      );
    }

    // Filter by features
    if (filters.features && filters.features.length > 0) {
      filtered = filtered.filter((venue) =>
        filters.features.every((feature) => venue.features?.includes(feature))
      );
    }

        // Filter by time window
        if (filters.timeWindow === 'now') {
          filtered = filtered.filter((venue) => {
            const currentDay = getCurrentDay();
            const currentTime = getCurrentTime();
            
            return venue.deals.some((deal) => {
              if (!deal.days.includes(currentDay)) return false;
              return currentTime >= deal.start && currentTime <= deal.end;
            });
          });
        }

        // Filter by distance (if user location is available)
        if (userLocation && filters.radius > 0) {
          filtered = filtered.filter((venue) => {
            const distance = calculateDistance(
              userLocation.lat,
              userLocation.lng,
              venue.coords.lat,
              venue.coords.lng
            );
            return distance <= filters.radius;
          });
        }

        // Sort venues
        filtered = sortVenues(filtered, filters.sortBy, userLocation);

        console.log('Final filtered venues:', filtered.length);
        
        set({ filteredVenues: filtered });
        return filtered;
      },
    }),
    {
      name: 'happy-hour-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        filters: state.filters,
      }),
    }
  )
);

// Utility functions
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function sortVenues(
  venues: Venue[],
  sortBy: string,
  userLocation: { lat: number; lng: number } | null
): Venue[] {
  const sorted = [...venues];

  switch (sortBy) {
    case 'distance':
      if (userLocation) {
        return sorted.sort((a, b) => {
          const distA = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            a.coords.lat,
            a.coords.lng
          );
          const distB = calculateDistance(
            userLocation.lat,
            userLocation.lng,
            b.coords.lat,
            b.coords.lng
          );
          return distA - distB;
        });
      }
      return sorted;

    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);

    case 'bestDeals':
      return sorted.sort((a, b) => {
        const aDealCount = a.deals.length;
        const bDealCount = b.deals.length;
        if (aDealCount !== bDealCount) {
          return bDealCount - aDealCount;
        }
        return b.rating - a.rating;
      });

    case 'endsSoon':
      const currentDay = getCurrentDay();
      const currentTime = getCurrentTime();
      
      return sorted.sort((a, b) => {
        // Get active deals for each venue
        const aActiveDeals = a.deals.filter(deal => 
          deal.days.includes(currentDay) && 
          currentTime >= deal.start && 
          currentTime <= deal.end
        );
        
        const bActiveDeals = b.deals.filter(deal => 
          deal.days.includes(currentDay) && 
          currentTime >= deal.start && 
          currentTime <= deal.end
        );
        
        // If one has active deals and the other doesn't, prioritize active deals
        if (aActiveDeals.length > 0 && bActiveDeals.length === 0) return -1;
        if (bActiveDeals.length > 0 && aActiveDeals.length === 0) return 1;
        
        // If both have active deals, sort by which ends soonest
        if (aActiveDeals.length > 0 && bActiveDeals.length > 0) {
          const aEarliestEnd = Math.min(
            ...aActiveDeals.map((deal) => {
              const [hours, minutes] = deal.end.split(':').map(Number);
              return hours * 60 + minutes;
            })
          );
          
          const bEarliestEnd = Math.min(
            ...bActiveDeals.map((deal) => {
              const [hours, minutes] = deal.end.split(':').map(Number);
              return hours * 60 + minutes;
            })
          );
          
          return aEarliestEnd - bEarliestEnd;
        }
        
        // If neither has active deals, sort by which has deals starting soonest today
        const aTodayDeals = a.deals.filter(deal => 
          deal.days.includes(currentDay) && 
          currentTime < deal.start
        );
        
        const bTodayDeals = b.deals.filter(deal => 
          deal.days.includes(currentDay) && 
          currentTime < deal.start
        );
        
        if (aTodayDeals.length > 0 && bTodayDeals.length > 0) {
          const aEarliestStart = Math.min(
            ...aTodayDeals.map((deal) => {
              const [hours, minutes] = deal.start.split(':').map(Number);
              return hours * 60 + minutes;
            })
          );
          
          const bEarliestStart = Math.min(
            ...bTodayDeals.map((deal) => {
              const [hours, minutes] = deal.start.split(':').map(Number);
              return hours * 60 + minutes;
            })
          );
          
          return aEarliestStart - bEarliestStart;
        }
        
        // Fallback to rating
        return b.rating - a.rating;
      });

    default:
      return sorted;
  }
}
