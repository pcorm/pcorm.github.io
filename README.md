# 🍺 Happy Hour Near Me

A fun, mobile-first React app that helps you discover nearby happy hours with a map view, filters, and deal details—visually inspired by Yelp.

## ✨ Features

- **📍 Geolocation**: Automatically detects your location and shows nearby venues
- **🗺️ Interactive Map**: View venues on a map with custom markers and popups
- **📱 Mobile-First Design**: Responsive design that works great on all devices
- **🔍 Advanced Filtering**: Filter by deal type, time window, price, neighborhood, and more
- **⭐ Smart Sorting**: Sort by distance, rating, best deals, or ending soon
- **💝 Favorites**: Save your favorite venues to localStorage
- **⏰ Real-time Status**: See which venues are open and have active deals
- **📊 Deal Tracking**: View active deals with countdown timers
- **🎨 Beautiful UI**: Modern, playful design with smooth animations

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Zustand** for state management
- **React Router** for navigation
- **Leaflet with OpenStreetMap** for interactive maps
- **date-fns** for time calculations
- **Heroicons** for beautiful icons

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd happy-hour-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📱 Usage

### Finding Happy Hours

1. **Allow Location Access**: The app will request your location to show nearby venues
2. **Browse Venues**: View venues in list or map mode
3. **Filter Results**: Use the filter bar to narrow down options:
   - Deal type (drinks/food)
   - Time window (now/tonight/weekend)
   - Price range ($/$$/$$$)
   - Neighborhood
   - Search radius

### Interacting with Venues

- **Click a venue card** to select it and see details
- **Hover over cards** to highlight them on the map
- **Click map markers** to view venue information
- **Toggle favorites** with the heart icon
- **View detailed information** including hours, deals, and photos

### Map Features

- **Custom Markers**: Color-coded markers show venue status
  - 🟢 Green: Open with deals
  - 🟠 Orange: Open without deals
  - ⚫ Gray: Closed
- **Interactive Popups**: Click markers for quick venue info
- **Synchronized Views**: Hovering cards highlights map markers

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── VenueCard.tsx   # Individual venue display
│   ├── FiltersBar.tsx  # Filtering and sorting controls
│   ├── MapView.tsx     # Interactive map component
│   └── VenueDetail.tsx # Detailed venue modal
├── store/              # State management
│   └── useStore.ts     # Zustand store
├── types/              # TypeScript definitions
│   └── index.ts        # Type interfaces
├── utils/              # Utility functions
│   └── timeUtils.ts    # Time calculations
├── data/               # Mock data
│   └── seed.json       # Sample venues
└── App.tsx             # Main application component
```

## 🎨 Design System

### Colors
- **Primary**: Orange (#ed7518) - Happy hour theme
- **Secondary**: Blue (#0ea5e9) - Accent color
- **Success**: Green (#10b981) - Open venues
- **Warning**: Orange (#f59e0b) - Active deals
- **Error**: Red (#ef4444) - Ending soon

### Components
- **Cards**: Clean, shadowed containers with rounded corners
- **Pills**: Rounded filter buttons with active states
- **Badges**: Status indicators for venue states
- **Buttons**: Consistent styling with hover effects

## 📊 Data Model

### Venue Structure
```typescript
interface Venue {
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
  hours: { [key: string]: string };
}
```

### Deal Structure
```typescript
interface Deal {
  type: 'drink' | 'food';
  label: string;
  days: string[];
  start: string;
  end: string;
}
```

## 🔧 Configuration

### Map Features

The app uses Leaflet with OpenStreetMap:

- **No API Keys Required**: Works out of the box with OpenStreetMap
- **Interactive Markers**: Click to view venue details, hover for selection
- **Color-Coded Status**: 
  - 🟢 Green: Open venues
  - 🟠 Orange: Active happy hours
  - ⚫ Gray: Closed venues
- **Rich Popups**: Detailed venue information with active deals
- **Automatic Bounds**: Map automatically fits all venues in view
- **Custom Markers**: Beer icons with color-coded status
- **Instant Loading**: No external API dependencies

### Environment Variables
Create a `.env` file for API configuration (when switching from mock data):
```env
VITE_API_BASE_URL=your_api_url_here
```

### Customization
- **Colors**: Modify `tailwind.config.js` for brand colors
- **Mock Data**: Update `src/data/seed.json` with your venues
- **Map Center**: Change default coordinates in `App.tsx`

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## 📦 Building for Production

Build the app for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🚀 Deployment

The app can be deployed to any static hosting service:

- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **GitHub Pages**: Use the `gh-pages` package
- **AWS S3**: Upload the `dist` folder to an S3 bucket

## 🔮 Future Enhancements

- [ ] **Real API Integration**: Replace mock data with REST API
- [ ] **User Reviews**: Add review system for venues
- [ ] **Push Notifications**: Alert users about nearby deals
- [ ] **Social Features**: Share deals with friends
- [ ] **Offline Support**: Cache data for offline use
- [ ] **Advanced Filters**: More granular filtering options
- [ ] **Analytics**: Track user behavior and popular venues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** for beautiful venue photos
- **Leaflet with OpenStreetMap** for interactive mapping
- **Heroicons** for the icon set
- **Tailwind CSS** for the utility-first CSS framework

---

**Happy Hour Near Me** - Find the best deals around you! 🍺✨
