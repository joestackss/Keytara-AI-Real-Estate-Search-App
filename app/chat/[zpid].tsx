import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePropertyDetails, usePropertyScores, usePropertySchools } from '@/lib/hooks';
import { useAIChat } from '@/lib/hooks/useAIChat';
import type { PropertyContext } from '@/lib/types';

export default function ChatScreen() {
  const { zpid } = useLocalSearchParams();
  const router = useRouter();
  const propertyId = typeof zpid === 'string' ? parseInt(zpid, 10) : null;

  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const { data: propertyDetails, isLoading: detailsLoading } = usePropertyDetails(propertyId);
  const { data: scoresData } = usePropertyScores(propertyId);
  const { data: schoolsData } = usePropertySchools(propertyId);

  // Build property context for AI
  const propertyContext: PropertyContext | null = propertyDetails
    ? {
        zpid: propertyDetails.zpid,
        address: propertyDetails.streetAddress,
        price: propertyDetails.price,
        bedrooms: propertyDetails.bedrooms,
        bathrooms: propertyDetails.bathrooms,
        livingArea: propertyDetails.livingArea,
        description: propertyDetails.description,
        yearBuilt: propertyDetails.yearBuilt,
        homeType: propertyDetails.homeType,
        walkScore: scoresData?.data.property.walkScore.walkscore,
        transitScore: scoresData?.data.property.transitScore.transit_score,
        bikeScore: scoresData?.data.property.bikeScore.bikescore,
        schools: schoolsData?.schools.map(s => ({
          name: s.name,
          level: s.level,
          rating: s.rating,
          distance: s.distance,
        })),
        priceHistory: propertyDetails.priceHistory?.slice(0, 3).map(h => ({
          date: h.date,
          event: h.event,
          price: h.price,
        })),
      }
    : null;

  const {
    messages,
    streamingMessage,
    isStreaming,
    isLoading,
    sendMessage,
    streamMessage,
    clearChat,
  } = useAIChat(propertyId || 0, propertyContext);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0 || streamingMessage) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, streamingMessage]);

  const handleSend = () => {
    if (inputText.trim() && !isLoading && !isStreaming) {
      streamMessage(inputText.trim());
      setInputText('');
    }
  };

  if (detailsLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading property details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-4 py-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
                {propertyDetails?.streetAddress}
              </Text>
              <Text className="text-xs text-gray-600">
                Ask me anything about this property
              </Text>
            </View>
            {messages.length > 0 && (
              <Pressable onPress={clearChat} className="ml-2">
                <Ionicons name="trash-outline" size={22} color="#ef4444" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {/* Welcome Message */}
          {messages.length === 0 && !isStreaming && (
            <View className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="sparkles" size={20} color="#3b82f6" />
                <Text className="ml-2 text-base font-semibold text-blue-900">
                  AI Assistant
                </Text>
              </View>
              <Text className="text-sm text-blue-800 leading-5">
                Hi! I'm here to answer any questions about this property. You can ask me about:
              </Text>
              <View className="mt-3 space-y-2">
                <Text className="text-sm text-blue-700">• Location and neighborhood</Text>
                <Text className="text-sm text-blue-700">• Schools and ratings</Text>
                <Text className="text-sm text-blue-700">• Price history and value</Text>
                <Text className="text-sm text-blue-700">• Property features</Text>
                <Text className="text-sm text-blue-700">• Walk/transit/bike scores</Text>
              </View>
            </View>
          )}

          {/* Chat Messages */}
          {messages.map((message) => (
            <View
              key={message.id}
              className={`mb-4 ${message.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <Text
                  className={`text-base leading-6 ${
                    message.role === 'user' ? 'text-white' : 'text-gray-800'
                  }`}
                >
                  {message.content}
                </Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1 px-2">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          ))}

          {/* Streaming Message */}
          {isStreaming && streamingMessage && (
            <View className="mb-4 items-start">
              <View className="max-w-[80%] bg-white border border-gray-200 rounded-2xl p-4">
                <Text className="text-base text-gray-800 leading-6">
                  {streamingMessage}
                </Text>
              </View>
            </View>
          )}

          {/* Loading Indicator */}
          {(isLoading || (isStreaming && !streamingMessage)) && (
            <View className="mb-4 items-start">
              <View className="bg-white border border-gray-200 rounded-2xl p-4">
                <ActivityIndicator size="small" color="#3b82f6" />
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="bg-white border-t border-gray-200 px-4 py-3">
          <View className="flex-row items-end">
            <View className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 mr-2">
              <TextInput
                className="text-base text-gray-900 max-h-24"
                placeholder="Ask about this property..."
                placeholderTextColor="#9ca3af"
                value={inputText}
                onChangeText={setInputText}
                multiline
                editable={!isLoading && !isStreaming}
              />
            </View>
            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading || isStreaming}
              className={`rounded-full p-3 ${
                inputText.trim() && !isLoading && !isStreaming
                  ? 'bg-blue-600'
                  : 'bg-gray-300'
              }`}
            >
              {isLoading || isStreaming ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Ionicons name="send" size={24} color="#ffffff" />
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

