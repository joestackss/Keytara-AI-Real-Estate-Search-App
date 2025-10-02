import { SecondaryPropertyCard } from "@/components/property/SecondaryPropertyCard";
import { useSavedPropertiesStore } from "@/lib/store/savedProperties";
import { Link } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SavedScreen() {
  const { savedProperties, removeProperty } = useSavedPropertiesStore();

  if (savedProperties.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
        <View className="flex-1 justify-center items-center px-8">
          <Text
            className="text-2xl font-bold text-gray-900 mb-2 text-center"
            style={{
              fontFamily: "UrbanistSemiBold",
            }}
          >
            No Saved Propertiess
          </Text>
          <Text
            className="text-gray-600 text-center mb-6"
            style={{
              fontFamily: "UrbanistRegular",
            }}
          >
            Start saving properties you love{"\n"}to view them here
          </Text>
          <Link href="/" asChild>
            <Pressable className="bg-blue-600 px-6 py-3 rounded-xl">
              <Text
                className="text-white  text-base"
                style={{
                  fontFamily: "UrbanistSemiBold",
                }}
              >
                Explore Properties
              </Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      <View className=" px-4 w-full">
        <View className="mb-4">
          <Text
            className="text-2xl font-bold text-gray-900"
            style={{
              fontFamily: "UrbanistSemiBold",
            }}
          >
            Saved Properties
          </Text>
          <Text
            className="text-gray-600 "
            style={{
              fontFamily: "UrbanistRegular",
            }}
          >
            Start saving properties you love to view them here
          </Text>
        </View>
      </View>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View className="mb-4">
          <Text
            className="text-xl font-bold text-gray-900"
            style={{
              fontFamily: "UrbanistSemiBold",
            }}
          >
            {savedProperties.length}{" "}
            {savedProperties.length === 1 ? "Property" : "Properties"} Saved
          </Text>
        </View>

        {savedProperties.map((property) => (
          <View key={property.zpid} className="mb-4">
            <SecondaryPropertyCard
              property={{
                zpid: property.zpid,
                streetAddress: property.address,
                price: property.price,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                livingArea: property.livingArea,
                imgSrc: property.imgSrc,
                city: property.city,
                state: property.state,
                zipcode: property.zipcode,
              }}
              showRemoveButton={true}
              onRemove={removeProperty}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
