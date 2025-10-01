import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  isLoading,
  placeholder,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <View className="bg-white rounded-2xl shadow-sm p-4 mb-4">
      <Text className="text-sm font-medium text-gray-600 mb-2">
        🏠 Natural Language Search
      </Text>
      <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-200">
        <Ionicons name="search" size={20} color="#9ca3af" />
        <TextInput
          className="flex-1 ml-3 text-base text-gray-900"
          placeholder={
            placeholder || "Try '3 bed house in Santa Monica under $1M'"
          }
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          editable={!isLoading}
        />
        {isLoading ? (
          <ActivityIndicator size="small" color="#3b82f6" />
        ) : (
          query.trim() && (
            <Pressable onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </Pressable>
          )
        )}
      </View>
      <Pressable
        onPress={handleSearch}
        disabled={!query.trim() || isLoading}
        className={`mt-3 rounded-xl py-3.5 ${
          query.trim() && !isLoading ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <Text
          className={`text-center font-semibold text-base ${
            query.trim() && !isLoading ? "text-white" : "text-gray-500"
          }`}
        >
          {isLoading ? "Searching..." : "Search Properties"}
        </Text>
      </Pressable>
    </View>
  );
}
