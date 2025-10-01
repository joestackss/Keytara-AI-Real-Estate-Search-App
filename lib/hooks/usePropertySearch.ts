import { useQuery } from "@tanstack/react-query";
import { zillowClient } from "../api/zillow";
import type { SearchParams } from "../types";

export function usePropertySearch(
  params: SearchParams,
  enabled: boolean = true
) {
  console.log("🔍 usePropertySearch CALLED with:", {
    params,
    enabled,
    hasLocation: Boolean(params.location),
    willExecute: enabled && Boolean(params.location),
  });

  return useQuery({
    queryKey: ["property-search", params],
    queryFn: async () => {
      console.log("🚀 Executing property search query...");
      console.log("📤 Request params:", params);

      try {
        const result = await zillowClient.searchProperties(params);
        console.log("✅ Property search SUCCESS!");
        console.log("📊 Results count:", result?.results?.length || 0);
        console.log("📦 Full response:", JSON.stringify(result, null, 2));
        return result;
      } catch (error) {
        console.error("❌ Property search FAILED!");
        console.error("💥 Error details:", error);
        console.error("📋 Error response:", (error as any)?.response?.data);
        console.error("🔢 Error status:", (error as any)?.response?.status);
        throw error;
      }
    },
    enabled: enabled && Boolean(params.location),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
