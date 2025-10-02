import { queryClient } from "@/lib/config/react-query";
import { Urbanist_400Regular } from "@expo-google-fonts/urbanist/400Regular";
import { Urbanist_500Medium } from "@expo-google-fonts/urbanist/500Medium";
import { Urbanist_600SemiBold } from "@expo-google-fonts/urbanist/600SemiBold";
import { Urbanist_700Bold } from "@expo-google-fonts/urbanist/700Bold";
import { Urbanist_800ExtraBold } from "@expo-google-fonts/urbanist/800ExtraBold";
import { Urbanist_900Black } from "@expo-google-fonts/urbanist/900Black";
import { useFonts } from "@expo-google-fonts/urbanist/useFonts";
import { QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    UrbanistRegular: Urbanist_400Regular,
    UrbanistMedium: Urbanist_500Medium,
    UrbanistSemiBold: Urbanist_600SemiBold,
    UrbanistBold: Urbanist_700Bold,
    UrbanistExtraBold: Urbanist_800ExtraBold,
    UrbanistBlack: Urbanist_900Black,
  });

  useEffect(() => {
    if (fontError) throw fontError;
  }, [fontError]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="property/[zpid]"
          options={{
            title: "Property Details",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="ai-search"
          options={{
            title: "AI Search",
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="ai-results"
          options={{
            title: "Search Results",
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}
