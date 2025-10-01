// AI Chat Types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface PropertyContext {
  zpid: number;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  description: string;
  schools?: Array<{
    name: string;
    level: string;
    rating: number;
    distance: number;
  }>;
  walkScore?: number;
  transitScore?: number;
  bikeScore?: number;
  priceHistory?: Array<{
    date: string;
    event: string;
    price: number;
  }>;
  yearBuilt: number;
  homeType: string;
  features?: string[];
}

export interface SearchQuery {
  rawQuery: string;
  parsedParams: {
    location: string;
    bedrooms?: number;
    bathrooms?: number;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: string;
  };
}

export interface PropertySummary {
  shortSummary: string; // 2 sentences for cards
  fullSummary: string; // 3-4 sentences for details page
  highlights: string[];
}
