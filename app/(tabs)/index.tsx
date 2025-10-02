import { PropertyCard } from "@/components/property/PropertyCard";
import { SecondaryPropertyCard } from "@/components/property/SecondaryPropertyCard";
import { usePropertySearch } from "@/lib/hooks";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
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

type StatusFilter = "forSale" | "forRent" | "recentlySold";

const STATUS_FILTERS: {
  label: string;
  value: StatusFilter;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { label: "For Sale", value: "forSale", icon: "home" },
  { label: "For Rent", value: "forRent", icon: "key" },
  { label: "Recently Sold", value: "recentlySold", icon: "pricetag" },
];

export default function HomeScreen() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("forSale");
  const [searchQuery, setSearchQuery] = useState("");

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
    <SafeAreaView edges={["top"]} className=" flex-1 bg-blue-50">
      <View className=" flex-col justify-start items-center gap-4 px-4">
        {/* Header */}
        <View className="w-full flex-row justify-between items-start ">
          <View className="inline-flex flex-col justify-start items-start gap-2">
            <Text
              className="justify-start text-neutral-400 text-lg leading-tight"
              style={{
                fontFamily: "UrbanistRegular",
              }}
            >
              {new Date().getHours() < 12
                ? "Morning"
                : new Date().getHours() < 18
                  ? "Afternoon"
                  : "Evening"}
              , Joe Stacks 👋{" "}
            </Text>

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
          <View className="p-4 bg-white/60 rounded-[40px] backdrop-blur-lg flex justify-start items-center gap-2.5">
            <View className="w-6 h-6 relative">
              <Ionicons name="notifications-outline" size={24} color="black" />
            </View>
          </View>
        </View>

        <ScrollView
          className=""
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 300,
          }}
        >
          {/* AI Search Button */}
          <Pressable
            onPress={() => router.push("/ai-search" as any)}
            className="bg-gradient-to-r from-[#4C8F70] to-[#3d7259] rounded-3xl p-5 mb-4 flex-row items-center justify-between shadow-lg"
          >
            <View className="flex-row items-center flex-1">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center mr-3">
                <Ionicons name="sparkles" size={24} color="white" />
              </View>
              <View className="flex-1">
                <Text
                  className="text-white text-lg font-bold"
                  style={{ fontFamily: "UrbanistBold" }}
                >
                  AI Property Search
                </Text>
                <Text
                  className="text-white/80 text-sm"
                  style={{ fontFamily: "UrbanistRegular" }}
                >
                  Describe your dream home...
                </Text>
              </View>
            </View>
            <Ionicons name="arrow-forward-circle" size={32} color="white" />
          </Pressable>

          {/* Section 1: Santa Monica with Filters */}
          <View className="">
            {/* Search Input and filter icon */}
            <View className="flex-row items-center gap-3 mb-4">
              {/* Search Input */}
              <View className="flex-1 h-16  rounded-full border border-gray-200 flex-row items-center px-4 gap-2 bg-white">
                <View className=" h-14 justify-center items-center">
                  <Ionicons name="search-outline" size={23} color="#9D9D9D" />
                </View>
                <View className="flex-1 h-14 justify-center">
                  <TextInput
                    placeholder="Search by location"
                    placeholderTextColor="#9D9D9D"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    className="flex-1 text-lg text-neutral-900"
                    style={{
                      fontFamily: "UrbanistRegular",
                    }}
                  />
                </View>
              </View>

              {/* Filter Button */}
              <Pressable className="w-14 h-14 bg-[#4C8F70] rounded-full justify-center items-center">
                <Ionicons name="options-outline" size={24} color="white" />
              </Pressable>
            </View>

            {/* Horizontal Status Filters */}
            <View className="mb-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {STATUS_FILTERS.map((filter) => (
                  <Pressable
                    key={filter.value}
                    onPress={() => setSelectedStatus(filter.value)}
                    className={`px-4 py-2.5 rounded-full border flex flex-row items-center gap-2 ${
                      selectedStatus === filter.value
                        ? "bg-[#4C8F70] border-[#4C8F70]"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <View className="w-6 h-6 justify-center items-center">
                      <Ionicons
                        name={filter.icon}
                        size={20}
                        color={
                          selectedStatus === filter.value ? "white" : "#9D9D9D"
                        }
                      />
                    </View>

                    <Text
                      className={`font-normal ${
                        selectedStatus === filter.value
                          ? "text-white font-medium"
                          : "text-[#9D9D9D]"
                      }`}
                    >
                      {filter.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>

          {/* Properties List */}
          <View style={{ height: 300 }} className="">
            {santaMonicaLoading ? (
              <View className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text
                  className="text-gray-600 mt-2"
                  style={{
                    fontFamily: "UrbanistRegular",
                  }}
                >
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
                <Text
                  className="text-gray-900 font-semibold mt-2"
                  style={{
                    fontFamily: "UrbanistRegular",
                  }}
                >
                  Error loading properties
                </Text>
                <Text
                  className="text-gray-600 text-center mt-1"
                  style={{
                    fontFamily: "UrbanistRegular",
                  }}
                >
                  Please check your internet connection
                </Text>
              </View>
            ) : santaMonicaResults?.results &&
              santaMonicaResults.results.length > 0 ? (
              <FlashList
                data={santaMonicaResults.results}
                renderItem={({ item }) => (
                  <View style={{ width: 320, marginRight: 16 }} className="">
                    <PropertyCard property={item} />
                  </View>
                )}
                keyExtractor={(item) => item.zpid.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Ionicons name="home-outline" size={48} color="#9ca3af" />
                <Text
                  className="text-gray-600 mt-2 text-center"
                  style={{
                    fontFamily: "UrbanistRegular",
                  }}
                >
                  No properties found for{" "}
                  {
                    STATUS_FILTERS.find((f) => f.value === selectedStatus)
                      ?.label
                  }
                </Text>
              </View>
            )}
          </View>

          {/* Section 2: Recommended (New York) */}
          <View className="">
            {/* Section Header */}
            <View className=" mb-3 flex-row justify-between items-center">
              <View className="flex-row items-center mb-1">
                <Text
                  className="text-xl  text-neutral-900 leading-tight"
                  style={{
                    fontFamily: "UrbanistSemiBold",
                  }}
                >
                  Recommended Property
                </Text>
              </View>

              {/* 3 DOTS */}
              <Ionicons
                name="ellipsis-horizontal-outline"
                size={20}
                color="#6b7280"
              />
            </View>

            {/* Properties List */}
            <View>
              {newYorkLoading ? (
                <View className="flex-1 justify-center items-center mt-15">
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text
                    className="text-gray-600 mt-2"
                    style={{
                      fontFamily: "UrbanistRegular",
                    }}
                  >
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
                  <Text
                    className="text-gray-900 font-semibold mt-2"
                    style={{
                      fontFamily: "UrbanistRegular",
                    }}
                  >
                    Error loading properties
                  </Text>
                  <Text
                    className="text-gray-600 text-center mt-1"
                    style={{
                      fontFamily: "UrbanistRegular",
                    }}
                  >
                    Please check your internet connection
                  </Text>
                </View>
              ) : newYorkResults?.results &&
                newYorkResults.results.length > 0 ? (
                <FlashList
                  data={newYorkResults.results}
                  renderItem={({ item }) => (
                    <View className="w-full mb-4">
                      <SecondaryPropertyCard property={item} />
                    </View>
                  )}
                  keyExtractor={(item) => item.zpid.toString()}
                  scrollEnabled={false}
                />
              ) : (
                <View className="flex-1 justify-center items-center px-4">
                  <Ionicons name="home-outline" size={48} color="#9ca3af" />
                  <Text
                    className="text-gray-600 mt-2"
                    style={{
                      fontFamily: "UrbanistRegular",
                    }}
                  >
                    No recommended properties available
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
