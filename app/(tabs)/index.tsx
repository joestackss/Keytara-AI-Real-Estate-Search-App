import { PropertyCard } from "@/components/property/PropertyCard";
import { SearchBar } from "@/components/search/SearchBar";
import { PropertyCardSkeleton } from "@/components/ui/LoadingSkeleton";
import { usePropertySearch, useSearchQueryParser } from "@/lib/hooks";
import type { SearchParams } from "@/lib/types";
import React, { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const searchQueryParser = useSearchQueryParser();

  const {
    data: searchResults,
    isPending: isLoading,
    refetch,
    isError,
    error,
  } = usePropertySearch(
    searchParams || { location: "" },
    Boolean(searchParams)
  );

  console.log("Search Results", searchResults);

  const handleSearch = async (query: string) => {
    console.log("🎯 handleSearch called with query:", query);

    try {
      console.log("🤖 Calling AI to parse query...");
      const result = await searchQueryParser.mutateAsync(query);

      console.log("✅ AI parsing successful!");
      console.log("📝 Parsed result:", result.parsedParams);

      setSearchParams(result.parsedParams);
      console.log("💾 Search params updated, React Query should trigger now");
    } catch (error) {
      console.error("❌ Error parsing query:", error);
      // Fallback: treat as location search
      console.log("🔄 Falling back to simple location search");
      setSearchParams({ location: query });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => searchParams && refetch()}
          />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Dream Home
          </Text>
          <Text className="text-base text-gray-600">
            Search using natural language - tell us what you're looking for
          </Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          isLoading={searchQueryParser.isPending || isLoading}
        />

        {/* Search Info */}
        {searchParams && (
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <Text className="text-sm font-semibold text-blue-900 mb-1">
              Searching for:
            </Text>
            <Text className="text-sm text-blue-700">
              {searchParams.location}
              {searchParams.bedrooms && ` • ${searchParams.bedrooms}+ beds`}
              {searchParams.bathrooms && ` • ${searchParams.bathrooms}+ baths`}
              {searchParams.minPrice &&
                ` • From $${(searchParams.minPrice / 1000).toFixed(0)}K`}
              {searchParams.maxPrice &&
                ` • Up to $${(searchParams.maxPrice / 1000).toFixed(0)}K`}
              {searchParams.propertyType && ` • ${searchParams.propertyType}`}
            </Text>
          </View>
        )}

        {/* Loading State */}
        {isLoading && (
          <View>
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
            <PropertyCardSkeleton />
          </View>
        )}

        {/* Error State */}
        {isError && (
          <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <Text className="text-red-800 font-semibold mb-1">Error</Text>
            <Text className="text-red-700 text-sm">
              {error?.message || "Failed to load properties. Please try again."}
            </Text>
          </View>
        )}

        {/* Results */}
        {searchResults && searchResults.results && (
          <>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                {searchResults.totalResultCount.toLocaleString()} Properties
                Found
              </Text>
              <Text className="text-sm text-gray-600">
                Page {searchResults.results.length > 0 ? 1 : 0} of{" "}
                {searchResults.totalPages}
              </Text>
            </View>

            {searchResults.results.length === 0 ? (
              <View className="bg-gray-100 rounded-xl p-8 items-center">
                <Text className="text-gray-600 text-center text-base mb-2">
                  No properties found
                </Text>
                <Text className="text-gray-500 text-center text-sm">
                  Try adjusting your search criteria
                </Text>
              </View>
            ) : (
              searchResults.results.map((property) => (
                <PropertyCard key={property.zpid} property={property} />
              ))
            )}
          </>
        )}

        {/* Initial State */}
        {!searchParams && !isLoading && (
          <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
            <Text className="text-6xl mb-4">🏡</Text>
            <Text className="text-xl font-semibold text-gray-900 mb-2 text-center">
              Start Your Search
            </Text>
            <Text className="text-gray-600 text-center">
              Use natural language to find your perfect home{"\n"}
              Try: "Modern 2 bedroom condo in downtown"
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
