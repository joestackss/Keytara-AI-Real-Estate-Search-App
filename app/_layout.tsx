import { queryClient } from "@/lib/config/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#111827",
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="property/[zpid]"
          options={{
            title: "Property Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="chat/[zpid]"
          options={{
            title: "AI Assistant",
            headerBackTitle: "Back",
            presentation: "modal",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
