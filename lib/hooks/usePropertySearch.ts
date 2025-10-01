import { useQuery } from "@tanstack/react-query";
import { zillowClient } from "../api/zillow";
import type { SearchParams } from "../types";

export function usePropertySearch(
  params: SearchParams,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: ["property-search", params],
    queryFn: async () => {
      const result = await zillowClient.searchProperties(params);
      return result;
    },
    enabled: enabled && Boolean(params.location),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
