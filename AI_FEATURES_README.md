# AI-Powered Real Estate Search - Setup & Usage

This document explains how to set up and use the new AI-powered search features in your real estate app.

## Features Implemented

### 1. **AI Search Input Screen** (`/ai-search`)

- Clean, centered design with large search input
- Natural language query support
- Example prompts to guide users
- Voice-to-text ready (can be enabled)

### 2. **AI Results Screen with Conversational Refinement** (`/ai-results`)

- Displays search results based on AI-parsed queries
- Floating refinement search bar for conversational follow-ups
- Active filter chips display
- Search history with back/forward navigation
- Quick action buttons for common refinements

### 3. **Search History Management**

- Zustand store for persistent search history
- Browser-like navigation (back/forward)
- Instant restore from cache (no API call on undo)
- Parent-child relationship tracking for conversation flow

### 4. **Natural Language Processing**

- Powered by Google Gemini AI
- Understands complex queries like:
  - "3-bedroom house near good schools under $500k"
  - "Condo with pool in downtown Austin"
  - "New construction with garage built after 2000"
- Supports conversational refinements:
  - **Additive**: "Show me ones with pools"
  - **Subtractive**: "No pools" or "Without garage"
  - **Replacement**: "Change to 4 bedrooms"
  - **Undo**: "Go back" or "Undo"

## Setup Instructions

### 1. Install Dependencies

Dependencies are already installed:

```bash
npm install @google/genai
```

### 2. Get Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 3. Configure Environment Variables

Create a `.env` file in the root directory (if you don't have one):

```bash
# .env
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
EXPO_PUBLIC_RAPIDAPI_KEY=your_existing_rapidapi_key
```

**Important**: Replace `your_gemini_api_key_here` with your actual Gemini API key.

### 4. Update app.json (Optional)

If you want to store keys in `app.json` for production:

```json
{
  "expo": {
    "extra": {
      "GEMINI_API_KEY": "your_gemini_api_key",
      "RAPIDAPI_KEY": "your_rapidapi_key"
    }
  }
}
```

## File Structure

```
lib/
├── services/
│   └── ai.ts                    # AI service for natural language processing
├── store/
│   ├── savedProperties.ts       # Existing saved properties store
│   └── searchHistory.ts         # New search history store
└── config/
    └── env.ts                   # Updated with GEMINI_API_KEY

app/
├── ai-search.tsx                # AI search input screen
├── ai-results.tsx               # AI results with conversational refinement
├── (tabs)/
│   └── index.tsx                # Updated with AI search button
└── _layout.tsx                  # Updated with new screen routes
```

## User Flow

### 1. **Launch App**

- User sees home screen with prominent "AI Property Search" button

### 2. **AI Search Input**

- User taps AI Search button
- Enters natural language query (or selects example)
- AI parses query → API params
- Results displayed on AI Results screen

### 3. **Conversational Refinement**

User can refine search conversationally:

**Example Flow:**

```
Initial: "3-bedroom house under $500k in Houston"
→ 156 results

Refinement 1: "Show me ones with pools"
→ 42 results (added hasPool filter)

Refinement 2: "No pools, but with garage instead"
→ 89 results (removed pool, added garage)

Refinement 3: "Built after 1990"
→ 45 results (added yearBuiltMin)

Undo: "Go back"
→ 89 results (instant restore from cache)
```

### 4. **Property Details**

- Tap any property card
- View full details (existing screen)
- Return to results (search persists)

## AI Service Functions

### `parseNaturalLanguageQuery(query, context?)`

Converts natural language to structured search parameters.

**Parameters:**

- `query`: User's natural language input
- `context` (optional): Previous search context for conversational refinements

**Returns:**

```typescript
interface AISearchFilters {
  location?: string;
  status?: "forSale" | "forRent" | "recentlySold";
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: string;
  hasPool?: boolean;
  hasGarage?: boolean;
  yearBuiltMin?: number;
  // ... more filters
}
```

### `generateSearchSummary(filters)`

Creates human-readable summary of active filters.

**Example Output:**

```
"3+ bed, Houses, under $500k, with pool, in Houston, for sale"
```

### `isUndoQuery(query)` & `isRemovalQuery(query)`

Helper functions to detect undo and removal intents.

## Search History Store API

```typescript
const {
  addSearch, // Add new search to history
  updateCurrentResults, // Update results of current search
  goBack, // Navigate to previous search
  goForward, // Navigate to next search
  getCurrentSearch, // Get current search item
  canGoBack, // Check if can go back
  canGoForward, // Check if can go forward
  clearHistory, // Clear all history
} = useSearchHistoryStore();
```

## Supported Query Patterns

### Bedrooms & Bathrooms

- "3 bedroom", "3-bed", "3BR"
- "2.5 bath", "2 bathroom"

### Price

- "$500k", "$1M"
- "under $500k", "below 500000"
- "between $300k and $500k"

### Location

- "in Houston", "near Austin"
- "downtown Miami"

### Property Type

- "house", "condo", "townhome", "apartment"

### Features

- "with pool", "has garage"
- "new construction"
- "built after 1990"

### Status

- "for sale", "for rent", "recently sold"

## Testing the AI Features

### 1. Basic Search

1. Open app
2. Tap "AI Property Search"
3. Enter: "3 bedroom house in Miami under $600k"
4. View results

### 2. Conversational Refinement

1. On results screen, type: "Show me ones with pools"
2. Results update with pool filter
3. Type: "No pools"
4. Pool filter removed, previous results restored

### 3. Undo/Back Navigation

1. Make several refinements
2. Type: "undo" or "go back"
3. Previous results instantly restored

### 4. Quick Actions

1. Tap quick action buttons at bottom
2. "+ Pool", "+ Garage", "Newer"
3. Auto-fills refinement query

## Fallback Behavior

If Gemini API fails:

- Falls back to regex-based parser
- Extracts common patterns (beds, baths, price, location)
- Ensures app continues to function

## Performance Optimizations

1. **Cached Results**: Previous searches cached in Zustand store
2. **No Re-fetch on Undo**: Instant restore from history
3. **Lazy Loading**: FlashList for efficient rendering
4. **Debouncing**: Consider adding for refinement input

## Future Enhancements

### Phase 3 Ideas

- [ ] Voice input for search queries
- [ ] Filter chip removal (tap X to remove)
- [ ] Search history UI (view past searches)
- [ ] Suggested refinements based on results
- [ ] Save favorite searches
- [ ] Share search results

## Troubleshooting

### API Key Not Working

- Verify key is correct in `.env`
- Restart Expo dev server: `npm start`
- Check console for API errors

### AI Parsing Errors

- Check network connection
- Verify Gemini API key is valid
- Fallback parser will activate automatically

### No Results

- Try broader search query
- Check location spelling
- Verify Zillow API is working

## Support

For issues or questions:

1. Check console logs for errors
2. Verify environment variables are set
3. Test with example prompts first
4. Check Gemini API quota/limits

---

**Built with:**

- Google Gemini AI (gemini-2.0-flash-exp)
- Zustand for state management
- React Native & Expo
- TypeScript
