import Constants from "expo-constants";

// Environment variables configuration
export const ENV = {
  RAPIDAPI_KEY:
    Constants.expoConfig?.extra?.RAPIDAPI_KEY ||
    process.env.EXPO_PUBLIC_RAPIDAPI_KEY ||
    "",
  // USE_MOCK_DATA: __DEV__, // Use mock data in development
  USE_MOCK_DATA: false,
};

// API endpoints
export const API = {
  ZILLOW_BASE_URL: "https://zillow56.p.rapidapi.com",
  RAPIDAPI_HOST: "zillow56.p.rapidapi.com",
};
