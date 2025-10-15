import type { AgentDetails } from "@/lib/types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Linking, Pressable, Text, View } from "react-native";

interface AgentCardProps {
  agent: AgentDetails;
}

export function AgentCard({ agent }: AgentCardProps) {
  const handleCall = () => {
    const phoneNumber = agent.displayUser.phoneNumbers.cell;
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleEmail = () => {
    const email = agent.displayUser.email;
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  return (
    <View className="bg-gray-50 rounded-2xl p-4 mb-6">
      <Text
        className="text-lg text-gray-900 mb-4"
        style={{
          fontFamily: "UrbanistSemiBold",
        }}
      >
        Listed By
      </Text>

      {/* Agent Info */}
      <View className="flex-row items-start mb-4">
        <Image
          source={{
            uri:
              agent.displayUser.profilePhotoSrc ||
              "https://via.placeholder.com/80",
          }}
          className="w-20 h-20 rounded-full mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text
            className="text-xl font-semibold text-gray-900 mb-1"
            style={{
              fontFamily: "UrbanistSemiBold",
            }}
          >
            {agent.displayUser.name}
          </Text>
          <Text
            className="text-sm text-gray-600 mb-1"
            style={{
              fontFamily: "UrbanistRegular",
            }}
          >
            {agent.displayUser.businessName}
          </Text>
          {agent.displayUser.isTopAgent && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="star" size={16} color="#f59e0b" />
              <Text
                className="ml-1 text-sm text-amber-600"
                style={{
                  fontFamily: "UrbanistMedium",
                }}
              >
                Top Agent
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row flex-wrap gap-3 mb-4">
        <View className="bg-white rounded-xl px-3 py-2 flex-1 min-w-[100px]">
          <Text
            className="text-sm text-gray-600 mb-1"
            style={{
              fontFamily: "UrbanistRegular",
            }}
          >
            Total Sales
          </Text>
          <Text
            className="text-lg font-semibold text-gray-900"
            style={{
              fontFamily: "UrbanistSemiBold",
            }}
          >
            {agent.agentSalesStats.countAllTime}
          </Text>
        </View>
        <View className="bg-white rounded-xl px-3 py-2 flex-1 min-w-[100px]">
          <Text
            className="text-sm text-gray-600 mb-1"
            style={{
              fontFamily: "UrbanistRegular",
            }}
          >
            Avg Price
          </Text>
          <Text
            className="text-lg font-semibold text-gray-900"
            style={{
              fontFamily: "UrbanistSemiBold",
            }}
          >
            ${(agent.agentSalesStats.averageValueThreeYear / 1000).toFixed(0)}K
          </Text>
        </View>
      </View>

      {/* Reviews */}
      {agent.displayUser.ratings && (
        <View className="flex-row items-center mb-4">
          <View className="flex-row items-center mr-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={
                  star <= agent.displayUser.ratings.average
                    ? "star"
                    : "star-outline"
                }
                size={16}
                color="#f59e0b"
              />
            ))}
          </View>
          <Text
            className="text-sm text-gray-600"
            style={{
              fontFamily: "UrbanistRegular",
            }}
          >
            {agent.displayUser.ratings.average.toFixed(1)} (
            {agent.displayUser.ratings.count} reviews)
          </Text>
        </View>
      )}

      {/* Contact Buttons */}
      <View className="flex-row gap-3">
        {agent.displayUser.phoneNumbers.cell && (
          <Pressable
            onPress={handleCall}
            className="flex-1 bg-[#4C8F70] rounded-xl py-3 flex-row items-center justify-center"
          >
            <Ionicons name="call" size={20} color="white" />
            <Text
              className="ml-2 text-white font-semibold"
              style={{
                fontFamily: "UrbanistSemiBold",
              }}
            >
              Call
            </Text>
          </Pressable>
        )}
        {agent.displayUser.email && (
          <Pressable
            onPress={handleEmail}
            className="flex-1 bg-white border border-gray-300 rounded-xl py-3 flex-row items-center justify-center"
          >
            <Ionicons name="mail" size={20} color="#4C8F70" />
            <Text
              className="ml-2 text-[#4C8F70] font-semibold"
              style={{
                fontFamily: "UrbanistSemiBold",
              }}
            >
              Email
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
