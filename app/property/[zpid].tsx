import { PropertyDetailsSkeleton } from "@/components/ui/LoadingSkeleton";
import { usePropertyAllData } from "@/lib/hooks";
import { useSavedPropertiesStore } from "@/lib/store/savedProperties";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function PropertyDetailsScreen() {
  const { zpid } = useLocalSearchParams();
  const router = useRouter();
  const propertyId = typeof zpid === "string" ? parseInt(zpid, 10) : null;

  // console.log("zpid", zpid);

  const { details, photos, schools, scores, isLoading, isError } =
    usePropertyAllData(propertyId);

  console.log("details", details);
  console.log("photos", photos);
  console.log("schools", schools);
  console.log("scores", scores);
  console.log("isLoading", isLoading);
  console.log("isError", isError);

  const { isPropertySaved, addProperty, removeProperty } =
    useSavedPropertiesStore();

  if (isLoading) {
    return <PropertyDetailsSkeleton />;
  }

  if (!details.data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-8">
        <Text
          className="text-xl font-semibold text-gray-900 mb-2"
          style={{
            fontFamily: "UrbanistSemiBold",
          }}
        >
          Error Loading Property
        </Text>
        <Text
          className="text-gray-600 text-center mb-4"
          style={{
            fontFamily: "UrbanistRegular",
          }}
        >
          Unable to load property details. Please try again.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          <Text
            className="text-white font-semibold"
            style={{
              fontFamily: "UrbanistSemiBold",
            }}
          >
            Go Back
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const property = details.data;
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
        imgSrc: property.originalPhotos[0]?.mixedSources.jpeg[0]?.url || "",
        city: property.city,
        state: property.state,
        zipcode: property.zipcode,
        savedAt: Date.now(),
      });
    }
  };

  const propertyScores = scores.data?.data.property;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      {/* Floating header with back button, property details text at the center and an icon at the right */}
      <View className="absolute top-10 left-0 right-0  px-6 py-4 shadow-2xl rounded-3xl z-50">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() => router.back()}
            className="bg-white rounded-full p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#4b5563" />
          </Pressable>

          <Text
            className="text-2xl  text-gray-900"
            style={{
              fontFamily: "UrbanistSemiBold",
            }}
          >
            Property Details
          </Text>

          <Pressable
            onPress={() => router.back()}
            className="bg-white rounded-full p-2"
          >
            <Ionicons name="ellipsis-vertical" size={24} color="#4b5563" />
          </Pressable>
        </View>
      </View>

      {/* Image Gallery */}

      {/* Section 1 */}
      <View className="h-2/5 ">
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="h-12 "
        >
          {photos.data?.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo.mixedSources.jpeg[2]?.url }}
              style={{ width }}
              className="h-full"
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </View>

      {/* Section 2 */}
      <View className="bg-white flex-1 -mt-12 pt-2 rounded-3xl">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View>
            {/* Content */}
            <View className="p-4">
              <View className="flex-row justify-between items-start">
                <View>
                  {/* Address */}
                  <Text
                    className="text-2xl  text-gray-900 mb-1"
                    style={{
                      fontFamily: "UrbanistBold",
                    }}
                  >
                    {property.streetAddress.length > 30
                      ? property.streetAddress.slice(0, 30) + "..."
                      : property.streetAddress}
                  </Text>

                  <View className="flex-row items-center gap-1 mb-4">
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#4b5563"
                    />
                    <Text
                      className="text-lg text-gray-600"
                      style={{
                        fontFamily: "UrbanistRegular",
                      }}
                    >
                      {property.city}, {property.state}{" "}
                      {property.zipcode.slice(0, 5)}
                      {property.zipcode.length > 5 && "..."}
                    </Text>
                  </View>
                </View>

                {/* Save Button */}
                <View className="flex-row justify-end items-start mb-4">
                  <Pressable onPress={handleToggleSave}>
                    <Ionicons
                      name={isSaved ? "heart" : "heart-outline"}
                      size={28}
                      color={isSaved ? "#ef4444" : "#374151"}
                    />
                  </Pressable>
                </View>
              </View>

              {/* Key Stats */}
              <View className="flex-row flex-wrap gap-4 mb-6">
                <View className="bg-gray-100 px-4 py-3 rounded-xl flex-1 min-w-[100px]">
                  <Ionicons name="bed-outline" size={24} color="#4b5563" />
                  <Text
                    className="text-lg  text-gray-900 mt-1"
                    style={{
                      fontFamily: "UrbanistSemiBold",
                    }}
                  >
                    {property.bedrooms} Bedrooms
                  </Text>
                </View>
                <View className="bg-gray-100 px-4 py-3 rounded-xl flex-1 min-w-[100px]">
                  <Ionicons name="water-outline" size={24} color="#4b5563" />
                  <Text
                    className="text-lg  text-gray-900 mt-1"
                    style={{
                      fontFamily: "UrbanistSemiBold",
                    }}
                  >
                    {property.bathrooms} Bathrooms
                  </Text>
                </View>
                <View className="bg-gray-100 px-4 py-3 rounded-xl flex-1 min-w-[100px]">
                  <Ionicons name="resize-outline" size={24} color="#4b5563" />
                  <Text
                    className="text-lg  text-gray-900 mt-1"
                    style={{
                      fontFamily: "UrbanistSemiBold",
                    }}
                  >
                    {property.livingArea.toLocaleString()} Sq Ft
                  </Text>
                </View>
              </View>

              {/* Walk/Transit/Bike Scores */}
              {propertyScores && (
                <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                  <Text
                    className="text-lg  text-gray-900 mb-3"
                    style={{
                      fontFamily: "UrbanistSemiBold",
                    }}
                  >
                    Location Scores
                  </Text>
                  <View className="space-y-3">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="walk-outline"
                          size={20}
                          color="#4b5563"
                        />
                        <Text
                          className="ml-2 text-gray-700"
                          style={{
                            fontFamily: "UrbanistRegular",
                          }}
                        >
                          Walk Score
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text
                          className="text-lg  text-gray-900 mr-2"
                          style={{
                            fontFamily: "UrbanistSemiBold",
                          }}
                        >
                          {propertyScores.walkScore.walkscore}
                        </Text>
                        <Text
                          className="text-sm text-gray-600"
                          style={{
                            fontFamily: "UrbanistRegular",
                          }}
                        >
                          {propertyScores.walkScore.description}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="bus-outline"
                          size={20}
                          color="#4b5563"
                        />
                        <Text
                          className="ml-2 text-gray-700"
                          style={{
                            fontFamily: "UrbanistRegular",
                          }}
                        >
                          Transit Score
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text
                          className="text-lg  text-gray-900 mr-2"
                          style={{
                            fontFamily: "UrbanistSemiBold",
                          }}
                        >
                          {propertyScores.transitScore.transit_score}
                        </Text>
                        <Text
                          className="text-sm text-gray-600"
                          style={{
                            fontFamily: "UrbanistRegular",
                          }}
                        >
                          {propertyScores.transitScore.description}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="bicycle-outline"
                          size={20}
                          color="#4b5563"
                        />
                        <Text
                          className="ml-2 text-gray-700"
                          style={{
                            fontFamily: "UrbanistRegular",
                          }}
                        >
                          Bike Score
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Text
                          className="text-lg  text-gray-900 mr-2"
                          style={{
                            fontFamily: "UrbanistSemiBold",
                          }}
                        >
                          {propertyScores.bikeScore.bikescore}
                        </Text>
                        <Text
                          className="text-sm text-gray-600"
                          style={{
                            fontFamily: "UrbanistRegular",
                          }}
                        >
                          {propertyScores.bikeScore.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Description */}
              <View className="mb-6">
                <Text
                  className="text-lg  text-gray-900 mb-2"
                  style={{
                    fontFamily: "UrbanistSemiBold",
                  }}
                >
                  Description
                </Text>
                <Text
                  className="text-base text-gray-700 leading-6"
                  style={{
                    fontFamily: "UrbanistRegular",
                  }}
                >
                  {property.description}
                </Text>
              </View>

              {/* Schools */}
              {schools.data?.schools && schools.data.schools.length > 0 && (
                <View className="mb-6">
                  <Text
                    className="text-lg  text-gray-900 mb-3"
                    style={{
                      fontFamily: "UrbanistSemiBold",
                    }}
                  >
                    Nearby Schools
                  </Text>
                  {schools.data.schools.map((school, index) => (
                    <Pressable
                      key={index}
                      onPress={() => Linking.openURL(school.link)}
                      className="bg-gray-100 rounded-xl p-4 mb-3"
                    >
                      <View className="flex-row justify-between items-start mb-2">
                        <View className="flex-1">
                          <Text className="text-base  text-gray-900 mb-1">
                            {school.name}
                          </Text>
                          <Text
                            className="text-sm text-gray-600"
                            style={{
                              fontFamily: "UrbanistRegular",
                            }}
                          >
                            {school.level} • {school.grades} • {school.distance}{" "}
                            mi
                          </Text>
                        </View>
                        <View className="bg-[#4C8F70] px-3 py-1.5 rounded-lg">
                          <Text
                            className="text-white "
                            style={{
                              fontFamily: "UrbanistBold",
                            }}
                          >
                            {school.rating}/10
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              )}

              {/* Property Details */}
              <View className="bg-gray-100 rounded-2xl p-4 mb-6">
                <Text
                  className="text-lg  text-gray-900 mb-3"
                  style={{
                    fontFamily: "UrbanistBold",
                  }}
                >
                  Property Details
                </Text>
                <View className="space-y-2">
                  {property.resoFacts.yearBuilt && (
                    <View className="flex-row justify-between py-2 border-b border-gray-200">
                      <Text
                        className="text-gray-600"
                        style={{
                          fontFamily: "UrbanistRegular",
                        }}
                      >
                        Year Built
                      </Text>
                      <Text
                        className="font-semibold text-gray-900"
                        style={{
                          fontFamily: "UrbanistSemiBold",
                        }}
                      >
                        {property.resoFacts.yearBuilt}
                      </Text>
                    </View>
                  )}
                  {property.homeType && (
                    <View className="flex-row justify-between py-2 border-b border-gray-200">
                      <Text
                        className="text-gray-600"
                        style={{
                          fontFamily: "UrbanistRegular",
                        }}
                      >
                        Type
                      </Text>
                      <Text
                        className="font-semibold text-gray-900"
                        style={{
                          fontFamily: "UrbanistSemiBold",
                        }}
                      >
                        {property.homeType}
                      </Text>
                    </View>
                  )}
                  {property.monthlyHoaFee && (
                    <View className="flex-row justify-between py-2 border-b border-gray-200">
                      <Text
                        className="text-gray-600"
                        style={{
                          fontFamily: "UrbanistRegular",
                        }}
                      >
                        HOA Fee
                      </Text>
                      <Text
                        className="font-semibold text-gray-900"
                        style={{
                          fontFamily: "UrbanistSemiBold",
                        }}
                      >
                        ${property.monthlyHoaFee}/month
                      </Text>
                    </View>
                  )}
                  {property.lotSize && (
                    <View className="flex-row justify-between py-2">
                      <Text
                        className="text-gray-600"
                        style={{
                          fontFamily: "UrbanistRegular",
                        }}
                      >
                        Lot Size
                      </Text>
                      <Text
                        className="font-semibold text-gray-900"
                        style={{
                          fontFamily: "UrbanistSemiBold",
                        }}
                      >
                        {property.lotSize.toLocaleString()} sqft
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Floating Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-2xl rounded-3xl">
        <View className="flex-row items-center justify-between">
          <View className="">
            <Text
              className="text-lg text-gray-600 mb-1"
              style={{
                fontFamily: "UrbanistMedium",
              }}
            >
              Cost Total
            </Text>
            <Text
              className="text-3xl  text-[#4C8F70]"
              style={{
                fontFamily: "UrbanistSemiBold",
              }}
            >
              ${property.price.toLocaleString()}
            </Text>
          </View>

          <Pressable
            onPress={() => {
              // Add your schedule visit logic here
              console.log("Schedule a visit");
            }}
            className="bg-[#4C8F70] px-6 py-4 rounded-full ml-4 w-2/4 justify-center items-center"
          >
            <Text
              className="text-white  text-lg"
              style={{
                fontFamily: "UrbanistSemiBold",
              }}
            >
              Schedule a Visit
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
