import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#f9fafb",
        tabBarStyle: {
          backgroundColor: "#4C8F70",
          borderTopWidth: 1,
          borderTopColor: "#ffffff",
          paddingTop: 8,
          paddingBottom: 8,
          height: 100,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="ai-results"
        options={{
          title: "Search",
          headerTitle: "Search",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "sparkles" : "sparkles-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerTitle: "Nestwise",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      /> */}
      {/* <Tabs.Screen
        name="ai-search"
        options={{
          title: "Dream Ai",
          headerTitle: "AI Search",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles" size={size} color={color} />
          ),
        }}
      /> */}

      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          headerTitle: "Saved Properties",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
