import axios from "axios";
import { API, ENV } from "../config/env";
import type {
  PhotosResponse,
  PriceHistoryResponse,
  PropertyDetails,
  PropertyScores,
  SchoolsResponse,
  SearchParams,
  SearchResponse,
} from "../types";

// Import mock data for development
import photosMock from "../../responses/photos.json";
import priceHistoryMock from "../../responses/price-tax-history.json";
import propertyDetailsMock from "../../responses/propertydetails.json";
import schoolsMock from "../../responses/schools.json";
import searchMock from "../../responses/search.json";
import scoresMock from "../../responses/walk_transit_bike_score.json";

// Axios instance for Zillow API
const zillowApi = axios.create({
  baseURL: API.ZILLOW_BASE_URL,
  headers: {
    "X-RapidAPI-Key": ENV.RAPIDAPI_KEY,
    "X-RapidAPI-Host": API.RAPIDAPI_HOST,
  },
});

export const zillowClient = {
  // Search properties
  async searchProperties(params: SearchParams): Promise<SearchResponse> {
    console.log("🏠 zillowClient.searchProperties CALLED");
    console.log("📝 USE_MOCK_DATA:", ENV.USE_MOCK_DATA);

    if (ENV.USE_MOCK_DATA) {
      console.log("✨ Using MOCK data");
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return searchMock as SearchResponse;
    }

    const requestParams = {
      location: params.location,
      home_type: params.propertyType || "Houses",
      ...(params.bedrooms && { beds_min: params.bedrooms }),
      ...(params.bathrooms && { baths_min: params.bathrooms }),
      ...(params.minPrice && { price_min: params.minPrice }),
      ...(params.maxPrice && { price_max: params.maxPrice }),
      page: 1,
    };

    console.log("🌐 Making REAL API call to Zillow");
    console.log("🔗 URL:", `${API.ZILLOW_BASE_URL}/propertyExtendedSearch`);
    console.log("📋 Request params:", requestParams);
    console.log("🔑 API Key present:", Boolean(ENV.RAPIDAPI_KEY));
    console.log(
      "🔑 API Key (first 10 chars):",
      ENV.RAPIDAPI_KEY?.substring(0, 10) + "..."
    );

    const response = await zillowApi.get("/propertyExtendedSearch", {
      params: requestParams,
    });

    console.log("✅ Zillow API response received");
    console.log("📦 Response status:", response.status);
    console.log("📊 Response data keys:", Object.keys(response.data || {}));

    return response.data;
  },

  // Get property details
  async getPropertyDetails(zpid: number): Promise<PropertyDetails> {
    if (ENV.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      return propertyDetailsMock as PropertyDetails;
    }

    const response = await zillowApi.get("/propertyV2", {
      params: { zpid },
    });

    return response.data;
  },

  // Get property photos
  async getPropertyPhotos(zpid: number): Promise<PhotosResponse> {
    if (ENV.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return photosMock as PhotosResponse;
    }

    const response = await zillowApi.get("/photos", {
      params: { zpid },
    });

    return response.data;
  },

  // Get property schools
  async getPropertySchools(zpid: number): Promise<SchoolsResponse> {
    if (ENV.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return schoolsMock as SchoolsResponse;
    }

    const response = await zillowApi.get("/schools", {
      params: { zpid },
    });

    return response.data;
  },

  // Get property price and tax history
  async getPropertyHistory(zpid: number): Promise<PriceHistoryResponse> {
    if (ENV.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return priceHistoryMock as PriceHistoryResponse;
    }

    const response = await zillowApi.get("/priceHistory", {
      params: { zpid },
    });

    return response.data;
  },

  // Get walk/transit/bike scores
  async getPropertyScores(zpid: number): Promise<PropertyScores> {
    if (ENV.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return scoresMock as PropertyScores;
    }

    const response = await zillowApi.get("/walkTransitBikeScore", {
      params: { zpid },
    });

    return response.data;
  },
};
