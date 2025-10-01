import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { SavedProperty } from "../types";

interface SavedPropertiesState {
  savedProperties: SavedProperty[];
  addProperty: (property: SavedProperty) => void;
  removeProperty: (zpid: number) => void;
  isPropertySaved: (zpid: number) => boolean;
  clearAll: () => void;
}

export const useSavedPropertiesStore = create<SavedPropertiesState>()(
  persist(
    (set, get) => ({
      savedProperties: [],

      addProperty: (property) =>
        set((state) => {
          // Check if already saved
          if (state.savedProperties.some((p) => p.zpid === property.zpid)) {
            return state;
          }
          return {
            savedProperties: [
              ...state.savedProperties,
              { ...property, savedAt: Date.now() },
            ],
          };
        }),

      removeProperty: (zpid) =>
        set((state) => ({
          savedProperties: state.savedProperties.filter((p) => p.zpid !== zpid),
        })),

      isPropertySaved: (zpid) => {
        return get().savedProperties.some((p) => p.zpid === zpid);
      },

      clearAll: () => set({ savedProperties: [] }),
    }),
    {
      name: "saved-properties-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
