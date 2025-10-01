import React from 'react';
import { View, ScrollView, Text, Image, Pressable, Linking, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePropertyAllData } from '@/lib/hooks';
import { useSavedPropertiesStore } from '@/lib/store/savedProperties';
import { PropertyDetailsSkeleton } from '@/components/ui/LoadingSkeleton';

const { width } = Dimensions.get('window');

export default function PropertyDetailsScreen() {
  const { zpid } = useLocalSearchParams();
  const router = useRouter();
  const propertyId = typeof zpid === 'string' ? parseInt(zpid, 10) : null;

  const { details, photos, schools, history, scores, isLoading, isError } = usePropertyAllData(propertyId);
  const { isPropertySaved, addProperty, removeProperty } = useSavedPropertiesStore();

  if (isLoading) {
    return <PropertyDetailsSkeleton />;
  }

  if (isError || !details.data) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center px-8">
        <Text className="text-xl font-semibold text-gray-900 mb-2">Error Loading Property</Text>
        <Text className="text-gray-600 text-center mb-4">
          Unable to load property details. Please try again.
        </Text>
        <Pressable onPress={() => router.back()} className="bg-blue-600 px-6 py-3 rounded-xl">
          <Text className="text-white font-semibold">Go Back</Text>
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
        imgSrc: property.originalPhotos[0]?.mixedSources.jpeg[0]?.url || '',
        city: property.city,
        state: property.state,
        zipcode: property.zipcode,
        savedAt: Date.now(),
      });
    }
  };

  const propertyScores = scores.data?.data.property;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <ScrollView className="flex-1">
        {/* Image Gallery */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="h-80"
        >
          {photos.data?.photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo.mixedSources.jpeg[2]?.url }}
              style={{ width }}
              className="h-80"
              resizeMode="cover"
            />
          ))}
        </ScrollView>

        {/* Content */}
        <View className="p-4">
          {/* Price & Save Button */}
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-3xl font-bold text-gray-900 mb-1">
                ${property.price.toLocaleString()}
              </Text>
              {property.priceChange && property.priceChange < 0 && (
                <Text className="text-red-600 font-medium">
                  Price drop: ${Math.abs(property.priceChange).toLocaleString()}
                </Text>
              )}
            </View>
            <Pressable
              onPress={handleToggleSave}
              className="bg-gray-100 rounded-full p-3"
            >
              <Ionicons
                name={isSaved ? 'heart' : 'heart-outline'}
                size={28}
                color={isSaved ? '#ef4444' : '#374151'}
              />
            </Pressable>
          </View>

          {/* Address */}
          <Text className="text-xl font-semibold text-gray-900 mb-1">
            {property.streetAddress}
          </Text>
          <Text className="text-base text-gray-600 mb-4">
            {property.city}, {property.state} {property.zipcode}
          </Text>

          {/* Key Stats */}
          <View className="flex-row flex-wrap gap-4 mb-6">
            <View className="bg-blue-50 px-4 py-3 rounded-xl flex-1 min-w-[100px]">
              <Ionicons name="bed-outline" size={24} color="#3b82f6" />
              <Text className="text-2xl font-bold text-gray-900 mt-1">
                {property.bedrooms}
              </Text>
              <Text className="text-sm text-gray-600">Bedrooms</Text>
            </View>
            <View className="bg-blue-50 px-4 py-3 rounded-xl flex-1 min-w-[100px]">
              <Ionicons name="water-outline" size={24} color="#3b82f6" />
              <Text className="text-2xl font-bold text-gray-900 mt-1">
                {property.bathrooms}
              </Text>
              <Text className="text-sm text-gray-600">Bathrooms</Text>
            </View>
            <View className="bg-blue-50 px-4 py-3 rounded-xl flex-1 min-w-[100px]">
              <Ionicons name="resize-outline" size={24} color="#3b82f6" />
              <Text className="text-2xl font-bold text-gray-900 mt-1">
                {property.livingArea.toLocaleString()}
              </Text>
              <Text className="text-sm text-gray-600">Sq Ft</Text>
            </View>
          </View>

          {/* Walk/Transit/Bike Scores */}
          {propertyScores && (
            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Location Scores
              </Text>
              <View className="space-y-3">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="walk-outline" size={20} color="#3b82f6" />
                    <Text className="ml-2 text-gray-700">Walk Score</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-bold text-gray-900 mr-2">
                      {propertyScores.walkScore.walkscore}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {propertyScores.walkScore.description}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="bus-outline" size={20} color="#3b82f6" />
                    <Text className="ml-2 text-gray-700">Transit Score</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-bold text-gray-900 mr-2">
                      {propertyScores.transitScore.transit_score}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {propertyScores.transitScore.description}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="bicycle-outline" size={20} color="#3b82f6" />
                    <Text className="ml-2 text-gray-700">Bike Score</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-bold text-gray-900 mr-2">
                      {propertyScores.bikeScore.bikescore}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      {propertyScores.bikeScore.description}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Description */}
          <View className="mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </Text>
            <Text className="text-base text-gray-700 leading-6">
              {property.description}
            </Text>
          </View>

          {/* Schools */}
          {schools.data?.schools && schools.data.schools.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-900 mb-3">
                Nearby Schools
              </Text>
              {schools.data.schools.map((school, index) => (
                <Pressable
                  key={index}
                  onPress={() => Linking.openURL(school.link)}
                  className="bg-gray-50 rounded-xl p-4 mb-3"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-gray-900 mb-1">
                        {school.name}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {school.level} • {school.grades} • {school.distance} mi
                      </Text>
                    </View>
                    <View className="bg-blue-600 px-3 py-1.5 rounded-lg">
                      <Text className="text-white font-bold">
                        {school.rating}/10
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* AI Chat Button */}
          <Pressable
            onPress={() => router.push(`/chat/${property.zpid}`)}
            className="bg-blue-600 rounded-2xl py-4 flex-row items-center justify-center mb-6"
          >
            <Ionicons name="sparkles" size={24} color="#ffffff" />
            <Text className="text-white font-semibold text-lg ml-2">
              Ask AI About This Property
            </Text>
          </Pressable>

          {/* Property Details */}
          <View className="bg-gray-50 rounded-2xl p-4 mb-6">
            <Text className="text-lg font-semibold text-gray-900 mb-3">
              Property Details
            </Text>
            <View className="space-y-2">
              {property.resoFacts.yearBuilt && (
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600">Year Built</Text>
                  <Text className="font-semibold text-gray-900">
                    {property.resoFacts.yearBuilt}
                  </Text>
                </View>
              )}
              {property.homeType && (
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600">Type</Text>
                  <Text className="font-semibold text-gray-900">{property.homeType}</Text>
                </View>
              )}
              {property.monthlyHoaFee && (
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-gray-600">HOA Fee</Text>
                  <Text className="font-semibold text-gray-900">
                    ${property.monthlyHoaFee}/month
                  </Text>
                </View>
              )}
              {property.lotSize && (
                <View className="flex-row justify-between py-2">
                  <Text className="text-gray-600">Lot Size</Text>
                  <Text className="font-semibold text-gray-900">
                    {property.lotSize.toLocaleString()} sqft
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

