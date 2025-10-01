import { useSavedPropertiesStore } from "@/lib/store/savedProperties";
import type { SearchResult } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface PropertyCardProps {
  property: SearchResult;
  aiSummary?: string;
}

export function PropertyCard({ property, aiSummary }: PropertyCardProps) {
  const { isPropertySaved, addProperty, removeProperty } =
    useSavedPropertiesStore();
  const isSaved = isPropertySaved(property.zpid);

  const handleToggleSave = () => {
    if (isSaved) {
      removeProperty(property.zpid);
    } else {
      addProperty({
        zpid: property.zpid,
        address: property.streetAddress,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        livingArea: property.livingArea,
        imgSrc: property.imgSrc,
        city: property.city,
        state: property.state,
        zipcode: property.zipcode,
        savedAt: Date.now(),
      });
    }
  };

  return (
    <Link href={`/property/${property.zpid}`} asChild>
      <Pressable className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
        {/* Image */}
        <View className="relative">
          <Image
            source={{ uri: property.imgSrc }}
            className="w-full h-56"
            resizeMode="cover"
          />
          {/* Save Button */}
          <Pressable
            onPress={handleToggleSave}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-2.5 shadow-md"
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={24}
              color={isSaved ? "#ef4444" : "#374151"}
            />
          </Pressable>
          {/* Price Tag */}
          <View className="absolute bottom-3 left-3 bg-gray-900/90 px-4 py-2 rounded-lg">
            <Text className="text-white font-bold text-xl">
              ${(property.price / 1000).toFixed(0)}K
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-4">
          {/* Address */}
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {property.streetAddress}
          </Text>
          <Text className="text-sm text-gray-600 mb-3">
            {property.city}, {property.state} {property.zipcode}
          </Text>

          {/* Details */}
          <View className="flex-row items-center space-x-4 mb-3">
            <View className="flex-row items-center">
              <Ionicons name="bed-outline" size={18} color="#6b7280" />
              <Text className="ml-1.5 text-gray-700 font-medium">
                {property.bedrooms} Bed
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="water-outline" size={18} color="#6b7280" />
              <Text className="ml-1.5 text-gray-700 font-medium">
                {property.bathrooms} Bath
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="resize-outline" size={18} color="#6b7280" />
              <Text className="ml-1.5 text-gray-700 font-medium">
                {property.livingArea} sqft
              </Text>
            </View>
          </View>

          {/* AI Summary */}
          {aiSummary && (
            <View className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <View className="flex-row items-start">
                <Ionicons name="sparkles" size={16} color="#3b82f6" />
                <Text className="ml-2 text-sm text-gray-700 flex-1 leading-5">
                  {aiSummary}
                </Text>
              </View>
            </View>
          )}

          {/* Tags */}
          <View className="flex-row flex-wrap mt-3 gap-2">
            {property.isShowcaseListing && (
              <View className="bg-purple-100 px-2.5 py-1 rounded-full">
                <Text className="text-xs font-medium text-purple-700">
                  Showcase
                </Text>
              </View>
            )}
            {property.listing_sub_type.is_openHouse && (
              <View className="bg-green-100 px-2.5 py-1 rounded-full">
                <Text className="text-xs font-medium text-green-700">
                  Open House
                </Text>
              </View>
            )}
            {property.priceReduction && (
              <View className="bg-red-100 px-2.5 py-1 rounded-full">
                <Text className="text-xs font-medium text-red-700">
                  Price Drop
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
