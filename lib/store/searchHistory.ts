import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AISearchFilters } from "../services/ai";
import type { SearchResult } from "../types";

export interface SearchHistoryItem {
  id: string;
  query: string;
  filters: AISearchFilters;
  results: SearchResult[];
  resultCount: number;
  summary: string;
  timestamp: number;
  parentId?: string; // Link to previous search for navigation
}

interface SearchHistoryState {
  searchHistory: SearchHistoryItem[];
  currentSearchIndex: number;
  isLoading: boolean;

  // Actions
  addSearch: (item: Omit<SearchHistoryItem, "id" | "timestamp">) => void;
  updateCurrentResults: (results: SearchResult[], resultCount: number) => void;
  goBack: () => SearchHistoryItem | null;
  goForward: () => SearchHistoryItem | null;
  getCurrentSearch: () => SearchHistoryItem | null;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  clearHistory: () => void;
  setLoading: (loading: boolean) => void;
  removeSearch: (id: string) => void;
}

export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      searchHistory: [],
      currentSearchIndex: -1,
      isLoading: false,

      addSearch: (item) => {
        const id = `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const timestamp = Date.now();

        const currentIndex = get().currentSearchIndex;
        const currentHistory = get().searchHistory;

        // If we're not at the end of history, truncate forward history
        const newHistory =
          currentIndex === -1 || currentIndex === currentHistory.length - 1
            ? currentHistory
            : currentHistory.slice(0, currentIndex + 1);

        const newSearch: SearchHistoryItem = {
          id,
          timestamp,
          ...item,
          parentId:
            currentIndex >= 0 && newHistory[currentIndex]
              ? newHistory[currentIndex].id
              : undefined,
        };

        set({
          searchHistory: [...newHistory, newSearch],
          currentSearchIndex: newHistory.length, // Point to the new search
        });
      },

      updateCurrentResults: (results, resultCount) => {
        const currentIndex = get().currentSearchIndex;
        if (currentIndex === -1) return;

        const updatedHistory = [...get().searchHistory];
        if (updatedHistory[currentIndex]) {
          updatedHistory[currentIndex] = {
            ...updatedHistory[currentIndex],
            results,
            resultCount,
          };
          set({ searchHistory: updatedHistory });
        }
      },

      goBack: () => {
        const currentIndex = get().currentSearchIndex;
        if (currentIndex <= 0) return null;

        const newIndex = currentIndex - 1;
        set({ currentSearchIndex: newIndex });
        return get().searchHistory[newIndex];
      },

      goForward: () => {
        const currentIndex = get().currentSearchIndex;
        const history = get().searchHistory;

        if (currentIndex >= history.length - 1) return null;

        const newIndex = currentIndex + 1;
        set({ currentSearchIndex: newIndex });
        return history[newIndex];
      },

      getCurrentSearch: () => {
        const currentIndex = get().currentSearchIndex;
        const history = get().searchHistory;

        if (currentIndex === -1 || currentIndex >= history.length) {
          return null;
        }

        return history[currentIndex];
      },

      canGoBack: () => {
        const currentIndex = get().currentSearchIndex;
        return currentIndex > 0;
      },

      canGoForward: () => {
        const currentIndex = get().currentSearchIndex;
        const history = get().searchHistory;
        return currentIndex < history.length - 1;
      },

      clearHistory: () => {
        set({
          searchHistory: [],
          currentSearchIndex: -1,
        });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      removeSearch: (id) => {
        const history = get().searchHistory;
        const currentIndex = get().currentSearchIndex;
        const indexToRemove = history.findIndex((item) => item.id === id);

        if (indexToRemove === -1) return;

        const newHistory = history.filter((item) => item.id !== id);

        // Adjust currentSearchIndex if needed
        let newIndex = currentIndex;
        if (indexToRemove < currentIndex) {
          newIndex = currentIndex - 1;
        } else if (indexToRemove === currentIndex) {
          newIndex = Math.min(currentIndex, newHistory.length - 1);
        }

        set({
          searchHistory: newHistory,
          currentSearchIndex: newIndex,
        });
      },
    }),
    {
      name: "search-history-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
