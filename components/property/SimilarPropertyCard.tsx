import type { SimilarProperty } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface SimilarPropertyCardProps {
  property: SimilarProperty;
}

export function SimilarPropertyCard({ property }: SimilarPropertyCardProps) {
  return (
    <Link href={`/property/${property.zpid}`} asChild>
      <Pressable className="mr-4 rounded-2xl bg-white overflow-hidden border border-gray-200 w-64">
        {/* Image */}
        <View className="relative">
          <Image
            source={{
              uri:
                property.miniCardPhotos[0]?.url ||
                "https://via.placeholder.com/300x200",
            }}
            className="w-full h-40"
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View className="p-3">
          {/* Address */}
          <Text
            className="text-lg font-semibold text-gray-900 mb-1"
            numberOfLines={1}
            style={{
              fontFamily: "UrbanistSemiBold",
            }}
          >
            {property.address.streetAddress}
          </Text>

          {/* Location */}
          <View className="flex-row items-center gap-1 mb-2">
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text
              className="text-sm text-gray-600"
              numberOfLines={1}
              style={{
                fontFamily: "UrbanistRegular",
              }}
            >
              {property.address.city}, {property.address.state}
            </Text>
          </View>

          {/* Details */}
          <View className="flex-row items-center gap-3 mb-2">
            <View className="flex-row items-center">
              <Ionicons name="bed-outline" size={16} color="#6b7280" />
              <Text
                className="ml-1 text-sm text-gray-700"
                style={{
                  fontFamily: "UrbanistRegular",
                }}
              >
                {property.bedrooms}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="water-outline" size={16} color="#6b7280" />
              <Text
                className="ml-1 text-sm text-gray-700"
                style={{
                  fontFamily: "UrbanistRegular",
                }}
              >
                {property.bathrooms}
              </Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="resize-outline" size={16} color="#6b7280" />
              <Text
                className="ml-1 text-sm text-gray-700"
                style={{
                  fontFamily: "UrbanistRegular",
                }}
              >
                {property.livingArea?.toLocaleString()} sqft
              </Text>
            </View>
          </View>

          {/* Price */}
          <Text
            className="text-[#4C8F70] font-bold text-xl"
            style={{
              fontFamily: "UrbanistBold",
            }}
          >
            ${property.price?.toLocaleString()}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
