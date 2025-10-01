import { useSavedPropertiesStore } from "@/lib/store/savedProperties";
import type { SearchResult } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface SecondaryPropertyCardProps {
  property: SearchResult;
}

export function SecondaryPropertyCard({
  property,
}: SecondaryPropertyCardProps) {
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
      <Pressable className=" gap-2 rounded-3xl px-2 bg-white  py-3 overflow-hidden flex-row  w-full  border-gray-200 border-2">
        {/* Image */}
        <View className="relative rounded-2xl overflow-hidden w-[25%]  h-28">
          <Image
            source={{ uri: property.imgSrc }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Content */}
        <View className="px-2 py-2 flex-1">
          {/* Name and Fav Icon */}
          <View className=" gap-2 justify-between flex-row items-center">
            <Text
              className="text-2xl font-semibold text-gray-900 "
              numberOfLines={1}
              style={{
                fontFamily: "UrbanistBold",
              }}
            >
              {property.streetAddress.length > 18
                ? property.streetAddress.slice(0, 18) + "..."
                : property.streetAddress}
            </Text>

            {/* Save Button */}
            <Pressable onPress={handleToggleSave}>
              <Ionicons
                name={isSaved ? "heart" : "heart-outline"}
                size={25}
                color={isSaved ? "red" : "#374151"}
              />
            </Pressable>
          </View>

          {/* Location */}
          <View className=" justify-start flex-row items-center gap-1">
            <Ionicons name="location-outline" size={20} color="#6b7280" />

            {/* Address */}
            <Text
              className="text-lg text-gray-600 "
              numberOfLines={1}
              style={{
                fontFamily: "UrbanistRegular",
              }}
            >
              {property.city.length > 20
                ? property.city.slice(0, 20) + "..."
                : property.city}
              , {property.state}
            </Text>
          </View>

          {/* Details */}
          <View className="flex-row flex-wrap gap-2 justify-between items-center">
            <View className="flex-row items-center flex-wrap gap-3 mb-3">
              <View className="flex-row items-center bg-gray-100 rounded-full p-2 px-4">
                <Ionicons name="bed-outline" size={16} color="#6b7280" />
                <Text
                  className="ml-1 text-sm text-gray-700 font-medium"
                  style={{
                    fontFamily: "UrbanistRegular",
                  }}
                >
                  {property.bedrooms}
                </Text>
              </View>
              <View className="flex-row items-center bg-gray-100 rounded-full p-2 px-4">
                <Ionicons name="water-outline" size={16} color="#6b7280" />
                <Text
                  className="ml-1 text-sm text-gray-700 font-medium"
                  style={{
                    fontFamily: "UrbanistRegular",
                  }}
                >
                  {property.bathrooms}
                </Text>
              </View>
            </View>
            {/* Price Tag */}
            <View className=" ">
              <Text
                className="text-[#4C8F70] font-bold text-2xl"
                style={{
                  fontFamily: "UrbanistBold",
                }}
              >
                $
                {property.price
                  .toFixed(0)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
