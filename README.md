# Nestwise - AI-Powered Real Estate Discovery App

A modern React Native real estate application that helps users discover and analyze properties using AI-powered insights, integrating Zillow API for property data and Google Gemini AI for intelligent property analysis.

## 🚀 Features

- **Natural Language Search**: Search for properties using conversational queries
- **AI-Powered Insights**: Get intelligent property summaries and analysis
- **Property Details**: Comprehensive property information with photos, schools, and location scores
- **AI Chat Assistant**: Ask questions about any property and get intelligent responses
- **Saved Properties**: Save favorite properties for quick access
- **Walk/Transit/Bike Scores**: Location walkability and transit information
- **School Ratings**: Nearby schools with ratings and distances
- **Price History**: Track property price changes over time

## 🛠 Tech Stack

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand (global state)
- **Data Fetching**: TanStack React Query v5 (API caching & management)
- **Styling**: NativeWind v4 + Tailwind CSS
- **Animations**: Reanimated v5
- **AI Integration**: @google/genai (Google Gemini 2.0 Flash)

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- RapidAPI account (for Zillow API)
- Google AI Studio account (for Gemini API)

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd realestateai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```
EXPO_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys

**RapidAPI (Zillow API):**
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to [Zillow API](https://rapidapi.com/apimaker/api/zillow-com1)
3. Copy your API key from the dashboard

**Google Gemini AI:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env` file

## 🏃 Running the App

### Development Mode (Uses Mock Data)

By default, the app uses mock data from the `/responses` folder for development:

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Production Mode (Uses Real APIs)

To use real APIs, update `/lib/config/env.ts`:

```typescript
export const ENV = {
  RAPIDAPI_KEY: Constants.expoConfig?.extra?.RAPIDAPI_KEY || process.env.EXPO_PUBLIC_RAPIDAPI_KEY || '',
  GEMINI_API_KEY: Constants.expoConfig?.extra?.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
  USE_MOCK_DATA: false, // Set to false for production
};
```

## 📁 Project Structure

```
/app
  /(tabs)
    /index.tsx          # Home/Search screen
    /saved.tsx          # Saved properties
  /property/[zpid].tsx  # Property details
  /chat/[zpid].tsx      # AI chat screen
/components
  /property
    /PropertyCard.tsx   # Property listing card
  /search
    /SearchBar.tsx      # Search input with AI parsing
  /ui
    /LoadingSkeleton.tsx # Loading states
/lib
  /api
    /zillow.ts          # Zillow API client
    /ai.ts              # Gemini AI client
  /config
    /env.ts             # Environment configuration
    /react-query.ts     # React Query setup
  /hooks
    /usePropertySearch.ts    # Property search hook
    /usePropertyDetails.ts   # Property details hooks
    /useAIChat.ts           # AI chat functionality
  /store
    /savedProperties.ts # Zustand store for saved properties
  /types
    /zillow.ts          # Zillow API types
    /ai.ts              # AI types
/responses              # Mock data for development
  /search.json
  /propertydetails.json
  /photos.json
  /schools.json
  /price-tax-history.json
  /walk_transit_bike_score.json
```

## 🎯 Key Features Implementation

### Natural Language Search

The app uses Google Gemini AI to parse natural language queries into structured search parameters:

```typescript
// Example queries:
"3 bedroom house in Santa Monica under 1 million"
"Modern condo in Los Angeles with 2 bathrooms"
"Family home in Beverly Hills with good schools"
```

### AI Property Summaries

Each property gets an AI-generated summary highlighting:
- Value proposition
- Location benefits
- School ratings
- Standout features

### AI Chat Assistant

Property-specific conversational AI with context including:
- Property details and features
- Photos metadata
- Walk/transit/bike scores
- Price and tax history
- School information

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXPO_PUBLIC_RAPIDAPI_KEY` | RapidAPI key for Zillow API | Yes (Production) |
| `EXPO_PUBLIC_GEMINI_API_KEY` | Google Gemini AI API key | Yes |

## 🧪 Development

### Mock Data

The app includes comprehensive mock data for development in the `/responses` folder:
- Search results
- Property details
- Photos
- Schools
- Price history
- Walk/transit/bike scores

### Type Safety

All API responses are fully typed using TypeScript interfaces in `/lib/types/`.

### State Management

- **Zustand**: Global state for saved properties (persisted to AsyncStorage)
- **React Query**: Server state management with caching and automatic refetching

## 🎨 Styling

The app uses NativeWind for styling, providing a Tailwind CSS-like experience:

```tsx
<View className="bg-white rounded-2xl shadow-sm p-4">
  <Text className="text-lg font-semibold text-gray-900">
    Property Title
  </Text>
</View>
```

## 📱 Screens

### Search Screen
- Natural language search input
- AI-powered query parsing
- Property cards with AI summaries
- Filter display

### Property Details
- Image gallery
- Key statistics (beds, baths, sqft)
- Walk/Transit/Bike scores
- AI-generated property summary
- Schools with ratings
- Price history
- Save/unsave functionality

### AI Chat Screen
- Property-specific chat interface
- Streaming responses
- Chat history persistence
- Context-aware answers

### Saved Properties
- List of favorited properties
- Quick access to details
- Remove from saved

## 🚢 Deployment

### Building for iOS

```bash
# Build for iOS
npx expo build:ios

# Or with EAS Build
eas build --platform ios
```

### Building for Android

```bash
# Build for Android
npx expo build:android

# Or with EAS Build
eas build --platform android
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Zillow API for property data
- Google Gemini AI for intelligent insights
- Expo for the excellent development platform
- React Native community for amazing libraries

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact: [your-email@example.com]

---

Built with ❤️ using React Native & AI
