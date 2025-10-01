import { useSavedPropertiesStore } from "@/lib/store/savedProperties";
import type { SearchResult } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface PropertyCardProps {
  property: SearchResult;
}

export function PropertyCard({ property }: PropertyCardProps) {
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
      <Pressable className="bg-white rounded-2xl shadow-sm overflow-hidden w-80">
        {/* Image */}
        <View className="relative">
          <Image
            source={{ uri: property.imgSrc }}
            className="w-full h-48"
            resizeMode="cover"
          />
          {/* Save Button */}
          <Pressable
            onPress={handleToggleSave}
            className="absolute top-3 right-3 bg-white/90 rounded-full p-2 shadow-md"
          >
            <Ionicons
              name={isSaved ? "heart" : "heart-outline"}
              size={22}
              color={isSaved ? "#ef4444" : "#374151"}
            />
          </Pressable>
          {/* Price Tag */}
          <View className="absolute bottom-3 left-3 bg-gray-900/90 px-3 py-1.5 rounded-lg">
            <Text className="text-white font-bold text-lg">
              ${(property.price / 1000).toFixed(0)}K
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-4">
          {/* Address */}
          <Text
            className="text-base font-semibold text-gray-900 mb-1"
            numberOfLines={1}
          >
            {property.streetAddress}
          </Text>
          <Text className="text-sm text-gray-600 mb-3" numberOfLines={1}>
            {property.city}, {property.state}
          </Text>

          {/* Details */}
          <View className="flex-row items-center flex-wrap gap-3 mb-3">
            <View className="flex-row items-center">
              <Ionicons name="bed-outline" size={16} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-700 font-medium">
                {property.bedrooms}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="water-outline" size={16} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-700 font-medium">
                {property.bathrooms}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="resize-outline" size={16} color="#6b7280" />
              <Text className="ml-1 text-sm text-gray-700 font-medium">
                {property.livingArea} sqft
              </Text>
            </View>
          </View>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2">
            {property.isShowcaseListing && (
              <View className="bg-purple-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-purple-700">
                  Showcase
                </Text>
              </View>
            )}
            {property.listing_sub_type.is_openHouse && (
              <View className="bg-green-100 px-2 py-1 rounded-full">
                <Text className="text-xs font-medium text-green-700">
                  Open House
                </Text>
              </View>
            )}
            {property.priceReduction && (
              <View className="bg-red-100 px-2 py-1 rounded-full">
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
