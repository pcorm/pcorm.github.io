export interface Deal {
  type: 'drink' | 'food';
  label: string;
  days: string[];
  start: string;
  end: string;
}

export interface Venue {
  id: string;
  name: string;
  coords: { lat: number; lng: number };
  neighborhood: string;
  priceTier: 1 | 2 | 3;
  rating: number;
  deals: Deal[];
  photos: string[];
  url?: string;
  phone?: string;
  address: string;
  hours: {
    [key: string]: string;
  };
  features?: string[];
}

export interface FilterState {
  dealType: 'all' | 'drink' | 'food';
  subFilters: string[];
  timeWindow: 'now' | 'tonight' | 'weekend' | 'all';
  days: string[];
  priceTier: number[];
  neighborhood: string[];
  radius: number;
  features: string[];
  sortBy: 'distance' | 'rating' | 'bestDeals' | 'endsSoon';
  searchQuery: string;
}

export interface MapState {
  selectedVenueId: string | null;
  hoveredVenueId: string | null;
  userLocation: { lat: number; lng: number } | null;
  venues: Venue[];
  filteredVenues: Venue[];
}

export interface AppState extends MapState {
  filters: FilterState;
  favorites: string[];
  isLoading: boolean;
  error: string | null;
  setUserLocation: (location: { lat: number; lng: number }) => void;
  setSelectedVenue: (venueId: string | null) => void;
  setHoveredVenue: (venueId: string | null) => void;
  updateFilters: (newFilters: Partial<FilterState>) => void;
  toggleFavorite: (venueId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getFilteredVenues: () => Venue[];
}
