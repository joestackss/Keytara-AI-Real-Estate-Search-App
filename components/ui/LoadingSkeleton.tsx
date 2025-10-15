import React, { useEffect } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Shimmer component wrapper
function ShimmerView({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: any;
}) {
  const shimmerTranslate = useSharedValue(-1);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerTranslate.value,
      [-1, 1],
      [-width, width],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View style={style} className="overflow-hidden">
      {children}
      <Animated.View
        style={[
          animatedStyle,
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
          },
        ]}
      />
    </View>
  );
}

export function PropertyCardSkeleton() {
  return (
    <View className="bg-white rounded-2xl shadow-sm mb-4 overflow-hidden">
      <ShimmerView>
        <View className="bg-gray-200 w-full h-56" />
      </ShimmerView>
      <View className="p-4">
        <ShimmerView>
          <View className="bg-gray-200 h-5 w-3/4 rounded mb-2" />
        </ShimmerView>
        <ShimmerView>
          <View className="bg-gray-200 h-4 w-1/2 rounded mb-3" />
        </ShimmerView>
        <View className="flex-row space-x-4 mb-3">
          <ShimmerView>
            <View className="bg-gray-200 h-4 w-16 rounded" />
          </ShimmerView>
          <ShimmerView>
            <View className="bg-gray-200 h-4 w-16 rounded" />
          </ShimmerView>
          <ShimmerView>
            <View className="bg-gray-200 h-4 w-20 rounded" />
          </ShimmerView>
        </View>
        <View className="bg-gray-100 rounded-lg p-3">
          <ShimmerView>
            <View className="bg-gray-200 h-3 w-full rounded mb-2" />
          </ShimmerView>
          <ShimmerView>
            <View className="bg-gray-200 h-3 w-5/6 rounded" />
          </ShimmerView>
        </View>
      </View>
    </View>
  );
}

export function PropertyDetailsSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={["bottom"]}>
      {/* Floating header skeleton */}
      <View className="absolute top-10 left-0 right-0 px-6 py-4 z-50">
        <View className="flex-row items-center justify-between">
          <ShimmerView>
            <View className="bg-gray-200 rounded-full w-10 h-10" />
          </ShimmerView>
          <ShimmerView>
            <View className="bg-gray-200 h-7 w-40 rounded-lg" />
          </ShimmerView>
          <ShimmerView>
            <View className="bg-gray-200 rounded-full w-10 h-10" />
          </ShimmerView>
        </View>
      </View>

      {/* Image Gallery Skeleton */}
      <View className="h-2/5">
        <ShimmerView style={{ height: "100%" }}>
          <View className="bg-gray-200 w-full h-full" />
        </ShimmerView>
      </View>

      {/* Content Section */}
      <View className="bg-white flex-1 -mt-12 pt-2 rounded-3xl">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="p-4">
            {/* Address & Save Button */}
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <ShimmerView>
                  <View className="bg-gray-200 h-7 w-4/5 rounded-lg mb-2" />
                </ShimmerView>
                <View className="flex-row items-center gap-1">
                  <ShimmerView>
                    <View className="bg-gray-200 h-5 w-5 rounded-full" />
                  </ShimmerView>
                  <ShimmerView>
                    <View className="bg-gray-200 h-5 w-32 rounded-lg ml-1" />
                  </ShimmerView>
                </View>
              </View>
              <ShimmerView>
                <View className="bg-gray-200 rounded-full w-7 h-7" />
              </ShimmerView>
            </View>

            {/* Key Stats */}
            <View className="flex-row flex-wrap gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  className="bg-gray-50 px-4 py-3 rounded-xl flex-1 min-w-[100px]"
                >
                  <ShimmerView>
                    <View className="bg-gray-200 w-6 h-6 rounded mb-2" />
                  </ShimmerView>
                  <ShimmerView>
                    <View className="bg-gray-200 h-5 w-20 rounded-lg" />
                  </ShimmerView>
                </View>
              ))}
            </View>

            {/* Location Scores */}
            <View className="bg-gray-50 rounded-2xl p-4 mb-6">
              <ShimmerView>
                <View className="bg-gray-200 h-5 w-32 rounded-lg mb-3" />
              </ShimmerView>
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  className="flex-row items-center justify-between mb-3"
                >
                  <View className="flex-row items-center">
                    <ShimmerView>
                      <View className="bg-gray-200 w-5 h-5 rounded-full" />
                    </ShimmerView>
                    <ShimmerView>
                      <View className="bg-gray-200 h-4 w-20 rounded-lg ml-2" />
                    </ShimmerView>
                  </View>
                  <View className="flex-row items-center">
                    <ShimmerView>
                      <View className="bg-gray-200 h-5 w-8 rounded-lg mr-2" />
                    </ShimmerView>
                    <ShimmerView>
                      <View className="bg-gray-200 h-4 w-16 rounded-lg" />
                    </ShimmerView>
                  </View>
                </View>
              ))}
            </View>

            {/* Description */}
            <View className="mb-6">
              <ShimmerView>
                <View className="bg-gray-200 h-5 w-28 rounded-lg mb-2" />
              </ShimmerView>
              <ShimmerView>
                <View className="bg-gray-200 h-4 w-full rounded-lg mb-2" />
              </ShimmerView>
              <ShimmerView>
                <View className="bg-gray-200 h-4 w-full rounded-lg mb-2" />
              </ShimmerView>
              <ShimmerView>
                <View className="bg-gray-200 h-4 w-3/4 rounded-lg" />
              </ShimmerView>
            </View>

            {/* Schools */}
            <View className="mb-6">
              <ShimmerView>
                <View className="bg-gray-200 h-5 w-32 rounded-lg mb-3" />
              </ShimmerView>
              {[1, 2, 3].map((i) => (
                <View key={i} className="bg-gray-100 rounded-xl p-4 mb-3">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <ShimmerView>
                        <View className="bg-gray-200 h-4 w-40 rounded-lg mb-2" />
                      </ShimmerView>
                      <ShimmerView>
                        <View className="bg-gray-200 h-3 w-32 rounded-lg" />
                      </ShimmerView>
                    </View>
                    <ShimmerView>
                      <View className="bg-gray-200 w-12 h-7 rounded-lg" />
                    </ShimmerView>
                  </View>
                </View>
              ))}
            </View>

            {/* Property Details */}
            <View className="bg-gray-100 rounded-2xl p-4 mb-6">
              <ShimmerView>
                <View className="bg-gray-200 h-5 w-36 rounded-lg mb-3" />
              </ShimmerView>
              {[1, 2, 3, 4].map((i) => (
                <View
                  key={i}
                  className="flex-row justify-between py-2 border-b border-gray-200"
                >
                  <ShimmerView>
                    <View className="bg-gray-200 h-4 w-20 rounded-lg" />
                  </ShimmerView>
                  <ShimmerView>
                    <View className="bg-gray-200 h-4 w-24 rounded-lg" />
                  </ShimmerView>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Floating Bottom Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-2xl rounded-3xl">
        <View className="flex-row items-center justify-between">
          <View>
            <ShimmerView>
              <View className="bg-gray-200 h-4 w-20 rounded-lg mb-2" />
            </ShimmerView>
            <ShimmerView>
              <View className="bg-gray-200 h-8 w-32 rounded-lg" />
            </ShimmerView>
          </View>
          <ShimmerView>
            <View className="bg-gray-200 h-14 w-40 rounded-full ml-4" />
          </ShimmerView>
        </View>
      </View>
    </SafeAreaView>
  );
}
