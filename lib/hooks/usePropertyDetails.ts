import { useQueries, useQuery } from "@tanstack/react-query";
import { zillowClient } from "../api/zillow";

// Main property details
export function usePropertyDetails(zpid: number | null) {
  return useQuery({
    queryKey: ["property-details", zpid],
    queryFn: () => zillowClient.getPropertyDetails(zpid!),
    enabled: Boolean(zpid),
  });
}

// Property photos
export function usePropertyPhotos(zpid: number | null) {
  return useQuery({
    queryKey: ["property-photos", zpid],
    queryFn: () => zillowClient.getPropertyPhotos(zpid!),
    enabled: Boolean(zpid),
  });
}

// Property schools
export function usePropertySchools(zpid: number | null) {
  return useQuery({
    queryKey: ["property-schools", zpid],
    queryFn: () => zillowClient.getPropertySchools(zpid!),
    enabled: Boolean(zpid),
  });
}

// Property price history
export function usePropertyHistory(zpid: number | null) {
  return useQuery({
    queryKey: ["property-history", zpid],
    queryFn: () => zillowClient.getPropertyHistory(zpid!),
    enabled: Boolean(zpid),
  });
}

// Property scores (walk/transit/bike)
export function usePropertyScores(zpid: number | null) {
  return useQuery({
    queryKey: ["property-scores", zpid],
    queryFn: () => zillowClient.getPropertyScores(zpid!),
    enabled: Boolean(zpid),
  });
}

// Combined hook for parallel queries on property details page
export function usePropertyAllData(zpid: number | null) {
  const queries = useQueries({
    queries: [
      {
        queryKey: ["property-details", zpid],
        queryFn: () => zillowClient.getPropertyDetails(zpid!),
        enabled: Boolean(zpid),
      },
      {
        queryKey: ["property-photos", zpid],
        queryFn: () => zillowClient.getPropertyPhotos(zpid!),
        enabled: Boolean(zpid),
      },
      {
        queryKey: ["property-schools", zpid],
        queryFn: () => zillowClient.getPropertySchools(zpid!),
        enabled: Boolean(zpid),
      },
      {
        queryKey: ["property-history", zpid],
        queryFn: () => zillowClient.getPropertyHistory(zpid!),
        enabled: Boolean(zpid),
      },
      {
        queryKey: ["property-scores", zpid],
        queryFn: () => zillowClient.getPropertyScores(zpid!),
        enabled: Boolean(zpid),
      },
    ],
  });

  return {
    details: queries[0],
    photos: queries[1],
    schools: queries[2],
    history: queries[3],
    scores: queries[4],
    isLoading: queries.some((q) => q.isLoading),
    isError: queries.some((q) => q.isError),
  };
}
