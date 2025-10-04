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
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const EXAMPLE_PROMPTS = [
  "3-bedroom house near good schools under $500k in Houston",
  "Condo with pool in downtown Austin",
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

      // Check if location is missing - REQUIRED by Zillow API
      if (!filters.location || filters.location.trim() === "") {
        alert(
          "Please specify a location in your search.\n\nExample:\n• '3 bedroom house in Houston'\n• 'Condo in Miami under $500k'\n• 'New construction with garage in Austin'"
        );
        setIsProcessing(false);
        setLoading(false);
        return;
      }

      // Generate summary
      const summary = generateSearchSummary(filters);

      // Call Zillow API with ALL parsed filters
      const response = await zillowClient.searchProperties(filters);

      // Save to search history
      addSearch({
        query: searchQuery,
        filters,
        results: response.results || [],
        resultCount: response.totalResultCount || 0,
        summary,
      });

      // Navigate to results screen
      router.push("/(tabs)/ai-results");
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
    <View className=" flex-1 w-full ">
      <ImageBackground
        source={require("../assets/welcome-bg.jpg")}
        className="flex-1 justify-end items-end"
        resizeMode="cover"
      >
        <View className="absolute inset-0 bg-black/70 " />

        <View className=" p-8 mb-14">
          {/* Header */}
          <View className="items-center mb-12">
            {/* <View className="w-20 h-20 bg-[#4C8F70] rounded-full items-center justify-center mb-6">
              <Ionicons name="search" size={40} color="white" />
            </View> */}

            <Text
              className="text-4xl text-white text-center mb-3"
              style={{ fontFamily: "UrbanistBold" }}
            >
              Keytara AI
            </Text>

            <Text
              className="text-lg text-neutral-200 text-center"
              style={{ fontFamily: "UrbanistRegular" }}
            >
              Just describe what you&apos;re looking for & find Your Dream Home
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
                className="text-lg text-neutral-900 min-h-[20px]"
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
        </View>
      </ImageBackground>
    </View>
  );
}
