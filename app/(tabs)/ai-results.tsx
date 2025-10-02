import { PropertyCard } from "@/components/property/PropertyCard";
import { zillowClient } from "@/lib/api/zillow";
import {
  generateSearchSummary,
  isUndoQuery,
  parseNaturalLanguageQuery,
} from "@/lib/services/ai";
import { useSearchHistoryStore } from "@/lib/store/searchHistory";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AIResultsScreen() {
  const router = useRouter();
  const [refinementQuery, setRefinementQuery] = useState("");
  const [isRefining, setIsRefining] = useState(false);

  const { getCurrentSearch, addSearch, goBack, clearHistory } =
    useSearchHistoryStore();

  const currentSearch = getCurrentSearch();

  useEffect(() => {
    // If no current search, redirect to search screen
    if (!currentSearch) {
      router.replace("/ai-search");
    }
  }, [currentSearch]);

  if (!currentSearch) {
    return null;
  }

  const handleRefineSearch = async () => {
    if (!refinementQuery.trim()) return;

    setIsRefining(true);

    try {
      // Check if it's an undo query
      if (isUndoQuery(refinementQuery)) {
        const previousSearch = goBack();
        if (previousSearch) {
          setRefinementQuery("");
          return;
        }
      }

      // Parse the refinement query with context
      const filters = await parseNaturalLanguageQuery(refinementQuery, {
        previousQuery: currentSearch.query,
        previousFilters: currentSearch.filters,
        conversationHistory: [currentSearch.query],
      });

      // Generate summary
      const summary = generateSearchSummary(filters);

      // Call API with refined filters
      const response = await zillowClient.searchProperties({
        location:
          filters.location || currentSearch.filters.location || "United States",
        status: filters.status,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        propertyType: filters.propertyType,
      });

      // Add to history
      addSearch({
        query: refinementQuery,
        filters,
        results: response.results || [],
        resultCount: response.totalResultCount || 0,
        summary,
      });

      setRefinementQuery("");
    } catch (error) {
      console.error("Refinement error:", error);
      alert("Failed to refine your search. Please try again.");
    } finally {
      setIsRefining(false);
    }
  };

  const handleGoBack = () => {
    const previousSearch = goBack();
    if (!previousSearch) {
      router.back();
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    router.replace("/ai-search");
  };

  const renderFilterChip = (label: string, onRemove?: () => void) => (
    <View className="flex-row items-center bg-[#4C8F70] rounded-full px-3 py-1.5 mr-2">
      <Text
        className="text-white text-sm mr-1"
        style={{ fontFamily: "UrbanistMedium" }}
      >
        {label}
      </Text>
      {onRemove && (
        <Pressable onPress={onRemove}>
          <Ionicons name="close-circle" size={16} color="white" />
        </Pressable>
      )}
    </View>
  );

  const getActiveFilters = () => {
    const filters = currentSearch.filters;
    const chips: { label: string; key: string }[] = [];

    if (filters.bedrooms) {
      chips.push({ label: `${filters.bedrooms}+ beds`, key: "bedrooms" });
    }
    if (filters.bathrooms) {
      chips.push({ label: `${filters.bathrooms}+ baths`, key: "bathrooms" });
    }
    if (filters.maxPrice) {
      const priceLabel =
        filters.maxPrice >= 1000000
          ? `<$${filters.maxPrice / 1000000}M`
          : `<$${filters.maxPrice / 1000}k`;
      chips.push({ label: priceLabel, key: "maxPrice" });
    }
    if (filters.propertyType) {
      chips.push({ label: filters.propertyType, key: "propertyType" });
    }
    if (filters.hasPool) {
      chips.push({ label: "Pool", key: "hasPool" });
    }
    if (filters.hasGarage) {
      chips.push({ label: "Garage", key: "hasGarage" });
    }
    if (filters.yearBuiltMin) {
      chips.push({
        label: `Built after ${filters.yearBuiltMin}`,
        key: "yearBuiltMin",
      });
    }

    return chips;
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-blue-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <StatusBar barStyle="dark-content" />
        <View className="flex-1 px-4">
          {/* Header */}
          <View className="w-full flex-row justify-between items-start ">
            <View className="inline-flex flex-col justify-start items-start gap-2">
              <View>
                <Text
                  className=" text-neutral-900 text-3xl"
                  style={{
                    fontFamily: "UrbanistBold",
                  }}
                >
                  Find Your
                </Text>
                <Text
                  className=" text-neutral-900 text-3xl"
                  style={{
                    fontFamily: "UrbanistBold",
                  }}
                >
                  Dream Home
                </Text>
              </View>
            </View>
            <View className="p-4 ">
              <View className="flex-row justify-between items-center mb-3">
                <Pressable onPress={handleClearHistory}>
                  <Text
                    className="text-red-500 text-base"
                    style={{ fontFamily: "UrbanistMedium" }}
                  >
                    Clear History
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Floating Search/Refinement Bar */}

          <View className="bg-gray-50 my-4 rounded-full border border-gray-200 px-4 py-4 flex-row items-center">
            <Ionicons name="sparkles" size={20} color="#4C8F70" />
            <TextInput
              placeholder="Refine your search..."
              placeholderTextColor="#9D9D9D"
              value={refinementQuery}
              onChangeText={setRefinementQuery}
              className="flex-1 ml-2 text-base text-neutral-900"
              style={{ fontFamily: "UrbanistRegular" }}
              onSubmitEditing={handleRefineSearch}
              editable={!isRefining}
            />
            {isRefining ? (
              <ActivityIndicator size="small" color="#4C8F70" />
            ) : refinementQuery.trim() ? (
              <Pressable onPress={handleRefineSearch}>
                <Ionicons name="send" size={20} color="#4C8F70" />
              </Pressable>
            ) : null}
          </View>

          {/* Search Context */}
          <View className="bg-white px-4 py-3 border-b border-gray-200 rounded-3xl">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location" size={18} color="#6b7280" />
              <Text
                className="ml-2 text-gray-700 text-base flex-1"
                style={{ fontFamily: "UrbanistMedium" }}
              >
                {currentSearch.summary}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              {/* Filter Chips */}
              {getActiveFilters().length > 0 && (
                <View className="flex-row flex-wrap">
                  {getActiveFilters().map((chip) => (
                    <View key={chip.key} className="">
                      {renderFilterChip(chip.label)}
                    </View>
                  ))}
                </View>
              )}

              <Text
                className="text-gray-500 text-lg"
                style={{ fontFamily: "UrbanistRegular" }}
              >
                {currentSearch.resultCount} results
              </Text>
            </View>
          </View>

          {/* Results List */}
          <View className="flex-1 pt-4">
            {isRefining ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#4C8F70" />
                <Text
                  className="text-gray-600 mt-3"
                  style={{ fontFamily: "UrbanistMedium" }}
                >
                  Refining your search...
                </Text>
              </View>
            ) : currentSearch.results.length > 0 ? (
              <FlashList
                data={currentSearch.results}
                renderItem={({ item }) => (
                  <View className="mb-4">
                    <PropertyCard property={item} />
                  </View>
                )}
                keyExtractor={(item) => item.zpid.toString()}
                estimatedItemSize={320}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 100,
                }}
              />
            ) : (
              <View className="flex-1 justify-center items-center px-8">
                <Ionicons name="search-outline" size={64} color="#9ca3af" />
                <Text
                  className="text-gray-900 text-xl mt-4 text-center"
                  style={{ fontFamily: "UrbanistBold" }}
                >
                  No properties found
                </Text>
                <Text
                  className="text-gray-600 text-base mt-2 text-center"
                  style={{ fontFamily: "UrbanistRegular" }}
                >
                  Try adjusting your filters or search in a different location
                </Text>
                <Pressable
                  onPress={() => router.replace("/ai-search")}
                  className="mt-6 bg-[#4C8F70] rounded-full px-6 py-3"
                >
                  <Text
                    className="text-white text-base"
                    style={{ fontFamily: "UrbanistSemiBold" }}
                  >
                    New Search
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Quick Action Buttons */}
          {currentSearch.results.length > 0 && (
            <View className="bg-white border-t border-gray-200 px-4 py-3">
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setRefinementQuery("Show me ones with pools")}
                  className="flex-1 bg-blue-50 rounded-full py-2 px-3 border border-blue-200"
                >
                  <Text
                    className="text-blue-600 text-sm text-center"
                    style={{ fontFamily: "UrbanistMedium" }}
                  >
                    + Pool
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    setRefinementQuery("Show me ones with garages")
                  }
                  className="flex-1 bg-blue-50 rounded-full py-2 px-3 border border-blue-200"
                >
                  <Text
                    className="text-blue-600 text-sm text-center"
                    style={{ fontFamily: "UrbanistMedium" }}
                  >
                    + Garage
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setRefinementQuery("Built after 2000")}
                  className="flex-1 bg-blue-50 rounded-full py-2 px-3 border border-blue-200"
                >
                  <Text
                    className="text-blue-600 text-sm text-center"
                    style={{ fontFamily: "UrbanistMedium" }}
                  >
                    Newer
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
