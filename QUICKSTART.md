# 🚀 Quick Start Guide - Nestwise

Get up and running with Nestwise in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment (Optional for Development)

The app works with **mock data by default** - no API keys needed for initial development!

To use real APIs later:

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your API keys to `.env`:
```
EXPO_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### Getting API Keys:

**Zillow API (RapidAPI):**
- Sign up: https://rapidapi.com/
- Subscribe: https://rapidapi.com/apimaker/api/zillow-com1
- Copy your API key

**Google Gemini AI:**
- Visit: https://makersuite.google.com/app/apikey
- Create new API key
- Copy to `.env`

## Step 3: Run the App

```bash
# Start development server
npm start

# Then press:
# - 'i' for iOS simulator
# - 'a' for Android emulator
# - 'w' for web browser
```

Or directly:
```bash
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

## 🎯 What to Try First

### 1. Natural Language Search
Go to the **Search** tab and try:
- "3 bedroom house in Santa Monica under 1 million"
- "Modern condo in Los Angeles"
- "Family home with good schools"

### 2. View Property Details
- Tap any property card
- See photos, stats, schools, and location scores
- Scroll through the comprehensive details

### 3. AI Chat Assistant
- On any property detail page, tap **"Ask AI About This Property"**
- Ask questions like:
  - "What are the nearby schools like?"
  - "Is this a good investment?"
  - "Tell me about the neighborhood"
  - "How does the price compare to similar properties?"

### 4. Save Properties
- Tap the ♥️ icon on any property
- View all saved properties in the **Saved** tab

## 🔧 Development vs Production

### Development Mode (Default)
- Uses mock data from `/responses` folder
- No API keys required
- Instant responses
- Perfect for UI development and testing

### Production Mode
To switch to real APIs:

1. Edit `lib/config/env.ts`:
```typescript
export const ENV = {
  RAPIDAPI_KEY: Constants.expoConfig?.extra?.RAPIDAPI_KEY || process.env.EXPO_PUBLIC_RAPIDAPI_KEY || '',
  GEMINI_API_KEY: Constants.expoConfig?.extra?.GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY || '',
  USE_MOCK_DATA: false, // Change to false
};
```

2. Add API keys to `.env`
3. Restart the app

## 📱 Testing the App

### Mock Data Available:
- ✅ Property search results (Santa Monica, CA)
- ✅ Property details (zpid: 51582406)
- ✅ Property photos
- ✅ School information
- ✅ Walk/Transit/Bike scores
- ✅ Price history

### Navigate to Test Property:
The mock data is for property `zpid: 51582406` (1918 11th St APT D, Santa Monica, CA)

Search for "Santa Monica" to see it in results!

## 🎨 Project Structure

```
/app                    # Screens
  /(tabs)              # Bottom tab navigation
    /index.tsx         # Search screen
    /saved.tsx         # Saved properties
  /property/[zpid].tsx # Property details
  /chat/[zpid].tsx     # AI chat

/components             # Reusable UI components
  /property           # Property-related components
  /search             # Search components
  /ui                 # Generic UI components

/lib                    # Core functionality
  /api                # API clients (Zillow, AI)
  /config             # Configuration
  /hooks              # React hooks
  /store              # Zustand stores
  /types              # TypeScript types

/responses             # Mock data (JSON files)
```

## 🐛 Troubleshooting

### App won't start?
```bash
# Clear cache and restart
npx expo start -c
```

### Module not found errors?
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Types not working?
Make sure `tsconfig.json` has the correct paths configured.

### Simulator issues?
- iOS: Open Xcode, go to Xcode → Settings → Locations, set Command Line Tools
- Android: Ensure Android Studio and emulator are installed

## 🎯 Next Steps

1. ✅ **Explore the UI** - Navigate through all screens
2. ✅ **Test AI Features** - Try the chat and search parsing
3. ✅ **Customize** - Modify colors, layouts in components
4. ✅ **Add Features** - Extend with your own ideas
5. ✅ **Deploy** - Build for App Store/Play Store

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnavigation.org/)
- [NativeWind](https://www.nativewind.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 💡 Tips

- **Hot Reload**: Save any file to see changes instantly
- **DevTools**: Shake device or press `m` in terminal for dev menu
- **Logs**: Check terminal for console.log output
- **Network**: Use React Query DevTools (coming in future version)

## 🎉 You're Ready!

Start building amazing real estate experiences with AI! 🏡✨

Questions? Check the full README.md or create an issue on GitHub.

