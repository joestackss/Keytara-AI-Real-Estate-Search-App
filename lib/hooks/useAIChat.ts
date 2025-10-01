import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { aiClient } from "../api/ai";
import type { ChatMessage, PropertyContext } from "../types";

const CHAT_STORAGE_KEY = "property_chat_";

// Hook for chat functionality
export function useAIChat(
  zpid: number,
  propertyContext: PropertyContext | null
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);

  // Load chat history from storage
  useQuery({
    queryKey: ["chat-history", zpid],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(`${CHAT_STORAGE_KEY}${zpid}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMessages(parsed);
        return parsed;
      }
      return [];
    },
    enabled: Boolean(zpid),
  });

  // Save chat history to storage
  const saveChatHistory = useCallback(
    async (newMessages: ChatMessage[]) => {
      try {
        await AsyncStorage.setItem(
          `${CHAT_STORAGE_KEY}${zpid}`,
          JSON.stringify(newMessages)
        );
      } catch (error) {
        console.error("Error saving chat history:", error);
      }
    },
    [zpid]
  );

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (question: string) => {
      if (!propertyContext) {
        throw new Error("Property context not available");
      }

      const chatHistory = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      return aiClient.answerPropertyQuestion(
        question,
        propertyContext,
        chatHistory
      );
    },
    onSuccess: (response, question) => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: question,
        timestamp: Date.now(),
      };

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now() + 1,
      };

      const newMessages = [...messages, userMessage, assistantMessage];
      setMessages(newMessages);
      saveChatHistory(newMessages);
    },
  });

  // Stream message (alternative to regular send)
  const streamMessage = useCallback(
    async (question: string) => {
      if (!propertyContext) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: question,
        timestamp: Date.now(),
      };

      const newMessagesWithUser = [...messages, userMessage];
      setMessages(newMessagesWithUser);
      setIsStreaming(true);
      setStreamingMessage("");

      try {
        const chatHistory = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        let fullResponse = "";
        const stream = aiClient.streamPropertyQuestion(
          question,
          propertyContext,
          chatHistory
        );

        for await (const chunk of stream) {
          fullResponse += chunk;
          setStreamingMessage(fullResponse);
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fullResponse,
          timestamp: Date.now() + 1,
        };

        const finalMessages = [...newMessagesWithUser, assistantMessage];
        setMessages(finalMessages);
        saveChatHistory(finalMessages);
      } catch (error) {
        console.error("Error streaming message:", error);
      } finally {
        setIsStreaming(false);
        setStreamingMessage("");
      }
    },
    [messages, propertyContext, saveChatHistory]
  );

  // Clear chat history
  const clearChat = useCallback(async () => {
    setMessages([]);
    try {
      await AsyncStorage.removeItem(`${CHAT_STORAGE_KEY}${zpid}`);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  }, [zpid]);

  return {
    messages,
    streamingMessage,
    isStreaming,
    isLoading: sendMessageMutation.isPending,
    error: sendMessageMutation.error,
    sendMessage: sendMessageMutation.mutate,
    streamMessage,
    clearChat,
  };
}

// Hook for parsing search queries
export function useSearchQueryParser() {
  return useMutation({
    mutationFn: (query: string) => aiClient.parseSearchQuery(query),
  });
}

// Hook for generating property summaries
export function usePropertySummary(
  propertyContext: Partial<PropertyContext> | null
) {
  return useQuery({
    queryKey: ["property-summary", propertyContext?.zpid],
    queryFn: () => aiClient.generateShortSummary(propertyContext!),
    enabled: Boolean(propertyContext?.zpid),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours (summaries don't change often)
  });
}
