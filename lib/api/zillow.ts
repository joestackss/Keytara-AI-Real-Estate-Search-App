import axios from "axios";
import { API, ENV } from "../config/env";
import type {
  AgentDetails,
  PhotosResponse,
  PriceHistoryResponse,
  PropertyDetails,
  PropertyScores,
  SchoolsResponse,
  SearchParams,
  SearchResponse,
  SimilarPropertiesResponse,
} from "../types";

// Import mock data for development
import agentMock from "../../responses/agentusername.json";
import photosMock from "../../responses/photos.json";
import priceHistoryMock from "../../responses/price-tax-history.json";
import propertyDetailsMock from "../../responses/propertydetails.json";
import schoolsMock from "../../responses/schools.json";
import searchMock from "../../responses/search.json";
import similarPropertiesMock from "../../responses/similarproperties.json";
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
      status: params.status || "forSale",
      home_type: params.propertyType || "Houses",
      page: 1,

      // Basic filters
      ...(params.bedrooms && { beds_min: params.bedrooms }),
      ...(params.bathrooms && { baths_min: params.bathrooms }),
      ...(params.minPrice && { price_min: params.minPrice }),
      ...(params.maxPrice && { price_max: params.maxPrice }),

      // Extended filters - pass through exactly as named in API
      ...(params.hasPool !== undefined && { hasPool: params.hasPool }),
      ...(params.hasGarage !== undefined && { hasGarage: params.hasGarage }),
      ...(params.isNewConstruction !== undefined && {
        isNewConstruction: params.isNewConstruction,
      }),
      ...(params.built_min && { built_min: params.built_min }),
      ...(params.built_max && { built_max: params.built_max }),
      ...(params.sqft_min && { sqft_min: params.sqft_min }),
      ...(params.sqft_max && { sqft_max: params.sqft_max }),
      ...(params.lotSize_min && { lotSize_min: params.lotSize_min }),
      ...(params.lotSize_max && { lotSize_max: params.lotSize_max }),
      ...(params.parkingSpots_min && {
        parkingSpots_min: params.parkingSpots_min,
      }),
      ...(params.greatSchoolsRating_min && {
        greatSchoolsRating_min: params.greatSchoolsRating_min,
      }),
      ...(params.hasAirConditioning !== undefined && {
        hasAirConditioning: params.hasAirConditioning,
      }),
      ...(params.isWaterfront !== undefined && {
        isWaterfront: params.isWaterfront,
      }),
      ...(params.isCityView !== undefined && { isCityView: params.isCityView }),
      ...(params.isMountainView !== undefined && {
        isMountainView: params.isMountainView,
      }),
      ...(params.isWaterView !== undefined && {
        isWaterView: params.isWaterView,
      }),
      ...(params.isParkView !== undefined && { isParkView: params.isParkView }),
      ...(params.singleStory !== undefined && {
        singleStory: params.singleStory,
      }),
    };

    console.log("🌐 Making REAL API call to Zillow");
    console.log("🔗 URL:", `${API.ZILLOW_BASE_URL}/search`);
    console.log("📋 Request params:", requestParams);

    const response = await zillowApi.get("/search", {
      params: requestParams,
    });

    console.log("✅ Zillow API response received");
    console.log("📦 Response status:", response.status);

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

    // console.log("getPropertyDetails response", response.data);

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

  // Get similar properties
  async getSimilarProperties(zpid: number): Promise<SimilarPropertiesResponse> {
    if (ENV.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return similarPropertiesMock as SimilarPropertiesResponse;
    }

    const response = await zillowApi.get("/similar_properties", {
      params: { zpid },
    });

    return response.data;
  },

  // Get agent details by username
  async getAgentDetails(username: string): Promise<AgentDetails> {
    if (ENV.USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return agentMock as AgentDetails;
    }

    const response = await zillowApi.get("/agent", {
      params: { username },
    });

    return response.data;
  },
};
