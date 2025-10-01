import React from "react";
import { View } from "react-native";

export function PropertyCardSkeleton() {
  return (
    <View className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
      <View className="bg-gray-200 w-full h-56" />
      <View className="p-4">
        <View className="bg-gray-200 h-5 w-3/4 rounded mb-2" />
        <View className="bg-gray-200 h-4 w-1/2 rounded mb-3" />
        <View className="flex-row space-x-4 mb-3">
          <View className="bg-gray-200 h-4 w-16 rounded" />
          <View className="bg-gray-200 h-4 w-16 rounded" />
          <View className="bg-gray-200 h-4 w-20 rounded" />
        </View>
        <View className="bg-gray-100 rounded-lg p-3">
          <View className="bg-gray-200 h-3 w-full rounded mb-2" />
          <View className="bg-gray-200 h-3 w-5/6 rounded" />
        </View>
      </View>
    </View>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-gray-200 w-full h-80" />
      <View className="p-4">
        <View className="bg-gray-200 h-6 w-3/4 rounded mb-2" />
        <View className="bg-gray-200 h-4 w-1/2 rounded mb-4" />
        <View className="flex-row space-x-4 mb-4">
          <View className="bg-gray-200 h-5 w-20 rounded" />
          <View className="bg-gray-200 h-5 w-20 rounded" />
          <View className="bg-gray-200 h-5 w-24 rounded" />
        </View>
        <View className="bg-gray-100 rounded-xl p-4">
          <View className="bg-gray-200 h-4 w-full rounded mb-2" />
          <View className="bg-gray-200 h-4 w-full rounded mb-2" />
          <View className="bg-gray-200 h-4 w-3/4 rounded" />
        </View>
      </View>
    </View>
  );
}
