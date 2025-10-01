import { PropertyCard } from "@/components/property/PropertyCard";
import { usePropertySearch } from "@/lib/hooks";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type StatusFilter = "forSale" | "forRent" | "recentlySold";

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "For Sale", value: "forSale" },
  { label: "For Rent", value: "forRent" },
  { label: "Recently Sold", value: "recentlySold" },
];

export default function HomeScreen() {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("forSale");

  // Santa Monica properties with status filter
  const {
    data: santaMonicaResults,
    isLoading: santaMonicaLoading,
    isError: santaMonicaError,
  } = usePropertySearch({
    location: "Santa Monica, CA",
    status: selectedStatus,
  });

  // New York recommended properties (no filter)
  const {
    data: newYorkResults,
    isLoading: newYorkLoading,
    isError: newYorkError,
  } = usePropertySearch({
    location: "New York, NY",
    status: "forSale",
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["bottom"]}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-3">
          <Text className="text-3xl font-bold text-gray-900 mb-1">
            Discover Properties
          </Text>
          <Text className="text-base text-gray-600">
            Find your perfect home in top locations
          </Text>
        </View>

        {/* Section 1: Santa Monica with Filters */}
        <View className="mb-8">
          {/* Section Header */}
          <View className="px-4 mb-3">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              Santa Monica
            </Text>
            <Text className="text-sm text-gray-600">
              {santaMonicaResults?.totalResultCount || 0} properties available
            </Text>
          </View>

          {/* Horizontal Status Filters */}
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            >
              {STATUS_FILTERS.map((filter) => (
                <Pressable
                  key={filter.value}
                  onPress={() => setSelectedStatus(filter.value)}
                  className={`px-4 py-2.5 rounded-full border ${
                    selectedStatus === filter.value
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selectedStatus === filter.value
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Properties List */}
          <View style={{ height: 400 }}>
            {santaMonicaLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-gray-600 mt-2">
                  Loading properties...
                </Text>
              </View>
            ) : santaMonicaError ? (
              <View className="flex-1 justify-center items-center px-4">
                <Ionicons
                  name="alert-circle-outline"
                  size={48}
                  color="#ef4444"
                />
                <Text className="text-gray-900 font-semibold mt-2">
                  Error loading properties
                </Text>
                <Text className="text-gray-600 text-center mt-1">
                  Please check your internet connection
                </Text>
              </View>
            ) : santaMonicaResults?.results &&
              santaMonicaResults.results.length > 0 ? (
              <FlashList
                data={santaMonicaResults.results}
                renderItem={({ item }) => (
                  <View style={{ width: 320, marginRight: 16 }}>
                    <PropertyCard property={item} />
                  </View>
                )}
                keyExtractor={(item) => item.zpid.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            ) : (
              <View className="flex-1 justify-center items-center px-4">
                <Ionicons name="home-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-600 mt-2 text-center">
                  No properties found for{" "}
                  {
                    STATUS_FILTERS.find((f) => f.value === selectedStatus)
                      ?.label
                  }
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Section 2: Recommended (New York) */}
        <View className="mb-6">
          {/* Section Header */}
          <View className="px-4 mb-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="star" size={20} color="#f59e0b" />
              <Text className="text-xl font-bold text-gray-900 ml-2">
                Recommended
              </Text>
            </View>
            <Text className="text-sm text-gray-600">
              Curated properties in New York
            </Text>
          </View>

          {/* Properties List */}
          <View style={{ height: 400 }}>
            {newYorkLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-gray-600 mt-2">
                  Loading properties...
                </Text>
              </View>
            ) : newYorkError ? (
              <View className="flex-1 justify-center items-center px-4">
                <Ionicons
                  name="alert-circle-outline"
                  size={48}
                  color="#ef4444"
                />
                <Text className="text-gray-900 font-semibold mt-2">
                  Error loading properties
                </Text>
                <Text className="text-gray-600 text-center mt-1">
                  Please check your internet connection
                </Text>
              </View>
            ) : newYorkResults?.results && newYorkResults.results.length > 0 ? (
              <FlashList
                data={newYorkResults.results}
                renderItem={({ item }) => (
                  <View style={{ width: 320, marginRight: 16 }}>
                    <PropertyCard property={item} />
                  </View>
                )}
                keyExtractor={(item) => item.zpid.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            ) : (
              <View className="flex-1 justify-center items-center px-4">
                <Ionicons name="home-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-600 mt-2">
                  No recommended properties available
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
