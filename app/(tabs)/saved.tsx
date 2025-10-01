import React from 'react';
import { View, ScrollView, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSavedPropertiesStore } from '@/lib/store/savedProperties';

export default function SavedScreen() {
  const { savedProperties, removeProperty } = useSavedPropertiesStore();

  if (savedProperties.length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
        <View className="flex-1 justify-center items-center px-8">
          <Text className="text-6xl mb-4">💙</Text>
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            No Saved Properties
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            Start saving properties you love{'\n'}to view them here
          </Text>
          <Link href="/" asChild>
            <Pressable className="bg-blue-600 px-6 py-3 rounded-xl">
              <Text className="text-white font-semibold text-base">
                Explore Properties
              </Text>
            </Pressable>
          </Link>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        <View className="mb-4">
          <Text className="text-2xl font-bold text-gray-900">
            {savedProperties.length} {savedProperties.length === 1 ? 'Property' : 'Properties'} Saved
          </Text>
        </View>

        {savedProperties.map((property) => (
          <View key={property.zpid} className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
            <Link href={`/property/${property.zpid}`} asChild>
              <Pressable>
                <View className="flex-row">
                  {/* Image */}
                  <Image
                    source={{ uri: property.imgSrc }}
                    className="w-32 h-32"
                    resizeMode="cover"
                  />

                  {/* Content */}
                  <View className="flex-1 p-4">
                    <Text className="text-lg font-semibold text-gray-900 mb-1" numberOfLines={1}>
                      {property.address}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-2">
                      {property.city}, {property.state}
                    </Text>

                    <Text className="text-xl font-bold text-blue-600 mb-2">
                      ${(property.price / 1000).toFixed(0)}K
                    </Text>

                    <View className="flex-row items-center space-x-3">
                      <View className="flex-row items-center">
                        <Ionicons name="bed-outline" size={16} color="#6b7280" />
                        <Text className="ml-1 text-xs text-gray-700">
                          {property.bedrooms} Bed
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="water-outline" size={16} color="#6b7280" />
                        <Text className="ml-1 text-xs text-gray-700">
                          {property.bathrooms} Bath
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="resize-outline" size={16} color="#6b7280" />
                        <Text className="ml-1 text-xs text-gray-700">
                          {property.livingArea} sqft
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Remove Button */}
                  <Pressable
                    onPress={() => removeProperty(property.zpid)}
                    className="absolute top-2 right-2 bg-white/90 rounded-full p-2 shadow-md"
                  >
                    <Ionicons name="close" size={20} color="#ef4444" />
                  </Pressable>
                </View>
              </Pressable>
            </Link>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

