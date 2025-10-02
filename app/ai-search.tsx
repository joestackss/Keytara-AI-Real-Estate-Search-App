import { zillowClient } from "@/lib/api/zillow";
import {
  generateSearchSummary,
  parseNaturalLanguageQuery,
} from "@/lib/services/ai";
import { useSearchHistoryStore } from "@/lib/store/searchHistory";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EXAMPLE_PROMPTS = [
  "3-bedroom house near good schools under $500k in Texas",
  "Condo with pool in downtown Austin",
  "New construction with garage",
  "4 bed home in Miami under $800k",
  "Townhome for rent with 2+ bathrooms",
];

export default function AISearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { addSearch, setLoading } = useSearchHistoryStore();

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setIsProcessing(true);
    setLoading(true);

    try {
      // Parse natural language query using AI
      const filters = await parseNaturalLanguageQuery(searchQuery);

      // Generate summary
      const summary = generateSearchSummary(filters);

      // Call Zillow API with parsed filters
      const response = await zillowClient.searchProperties({
        location: filters.location || "United States",
        status: filters.status,
        bedrooms: filters.bedrooms,
        bathrooms: filters.bathrooms,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        propertyType: filters.propertyType,
      });

      // Save to search history
      addSearch({
        query: searchQuery,
        filters,
        results: response.results || [],
        resultCount: response.totalResultCount || 0,
        summary,
      });

      // Navigate to results screen
      router.push("/ai-results");
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to process your search. Please try again.");
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };

  const handleExamplePress = (example: string) => {
    setQuery(example);
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-white">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="items-center mb-12">
          <View className="w-20 h-20 bg-[#4C8F70] rounded-full items-center justify-center mb-6">
            <Ionicons name="search" size={40} color="white" />
          </View>

          <Text
            className="text-4xl text-neutral-900 text-center mb-3"
            style={{ fontFamily: "UrbanistBold" }}
          >
            Find Your Dream Home
          </Text>

          <Text
            className="text-lg text-neutral-600 text-center"
            style={{ fontFamily: "UrbanistRegular" }}
          >
            Just describe what you&apos;re looking for
          </Text>
        </View>

        {/* Search Input */}
        <View className="mb-8">
          <View className="bg-white rounded-3xl border-2 border-gray-200 p-5 shadow-sm">
            <TextInput
              placeholder="Describe your dream home..."
              placeholderTextColor="#9D9D9D"
              value={query}
              onChangeText={setQuery}
              multiline
              numberOfLines={3}
              className="text-lg text-neutral-900 min-h-[80px]"
              style={{ fontFamily: "UrbanistRegular" }}
              onSubmitEditing={() => handleSearch(query)}
              editable={!isProcessing}
            />
          </View>

          {/* Search Button */}
          <Pressable
            onPress={() => handleSearch(query)}
            disabled={!query.trim() || isProcessing}
            className={`mt-4 rounded-full py-5 ${
              !query.trim() || isProcessing ? "bg-gray-300" : "bg-[#4C8F70]"
            }`}
          >
            {isProcessing ? (
              <View className="flex-row items-center justify-center gap-2">
                <ActivityIndicator color="white" />
                <Text
                  className="text-white text-lg font-semibold"
                  style={{ fontFamily: "UrbanistSemiBold" }}
                >
                  Finding homes...
                </Text>
              </View>
            ) : (
              <Text
                className="text-white text-lg font-semibold text-center"
                style={{ fontFamily: "UrbanistSemiBold" }}
              >
                Search
              </Text>
            )}
          </Pressable>
        </View>

        {/* Example Prompts */}
        <View className="mt-4">
          <Text
            className="text-sm text-neutral-500 mb-3"
            style={{ fontFamily: "UrbanistMedium" }}
          >
            Try these examples:
          </Text>

          <View className="gap-2">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <Pressable
                key={index}
                onPress={() => handleExamplePress(example)}
                className="bg-white rounded-2xl p-4 border border-gray-200 flex-row items-center"
                disabled={isProcessing}
              >
                <Ionicons
                  name="bulb-outline"
                  size={20}
                  color="#4C8F70"
                  style={{ marginRight: 12 }}
                />
                <Text
                  className="text-neutral-700 flex-1"
                  style={{ fontFamily: "UrbanistRegular" }}
                >
                  {example}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
