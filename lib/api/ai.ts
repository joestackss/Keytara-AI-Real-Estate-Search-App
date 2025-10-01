import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/env";
import type { PropertyContext, PropertySummary, SearchQuery } from "../types";

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });
const MODEL = "gemini-2.0-flash-001";

export const aiClient = {
  // Parse natural language search query
  async parseSearchQuery(query: string): Promise<SearchQuery> {
    const prompt = `Extract structured search parameters from this real estate search query: "${query}"

Return ONLY a valid JSON object with this exact structure (no other text):
{
  "location": "city, state or zip code",
  "bedrooms": number or null,
  "bathrooms": number or null,
  "minPrice": number or null,
  "maxPrice": number or null,
  "propertyType": "single_family|condo|townhouse|multi_family" or null
}

Examples:
Query: "3 bedroom house in Santa Monica under 1 million"
Response: {"location":"Santa Monica, CA","bedrooms":3,"bathrooms":null,"minPrice":null,"maxPrice":1000000,"propertyType":"single_family"}

Query: "condo in Los Angeles"
Response: {"location":"Los Angeles, CA","bedrooms":null,"bathrooms":null,"minPrice":null,"maxPrice":null,"propertyType":"condo"}

Now parse: "${query}"`;

    console.log("prompt", prompt);
    console.log("query", query);

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      // Remove markdown code blocks if present
      const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      const parsedParams = JSON.parse(jsonText);

      console.log("Ai Query ", query);
      console.log("Ai Parsed Params", parsedParams);

      return {
        rawQuery: query,
        parsedParams,
      };
    } catch (error) {
      console.error("Error parsing search query:", error);
      // Fallback: treat entire query as location
      return {
        rawQuery: query,
        parsedParams: {
          location: query,
        },
      };
    }
  },

  // Generate property summary for cards (2 sentences)
  async generateShortSummary(
    propertyData: Partial<PropertyContext>
  ): Promise<string> {
    const prompt = `Summarize this property in exactly 2 concise sentences for a home buyer:

Price: $${propertyData.price?.toLocaleString()}
Bedrooms: ${propertyData.bedrooms} | Bathrooms: ${propertyData.bathrooms}
Living Area: ${propertyData.livingArea} sqft
Year Built: ${propertyData.yearBuilt}
Type: ${propertyData.homeType}
${propertyData.walkScore ? `Walk Score: ${propertyData.walkScore}` : ""}

Focus on: value proposition and location benefits. Be enthusiastic but professional.`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });

      return response.text?.trim() || "";
    } catch (error) {
      console.error("Error generating summary:", error);
      return `${propertyData.bedrooms} bed, ${propertyData.bathrooms} bath ${propertyData.homeType?.toLowerCase()} in great location. Built in ${propertyData.yearBuilt}.`;
    }
  },

  // Generate detailed property summary (3-4 sentences)
  async generateFullSummary(
    propertyData: PropertyContext
  ): Promise<PropertySummary> {
    const schoolsInfo = propertyData.schools
      ?.map((s) => `${s.name} (${s.level}, Rating: ${s.rating}/10)`)
      .join(", ");

    const priceHistoryInfo = propertyData.priceHistory
      ?.slice(0, 2)
      .map((h) => `${h.event}: $${h.price.toLocaleString()} (${h.date})`)
      .join("; ");

    const prompt = `Create a comprehensive property summary for a home buyer.

PROPERTY DETAILS:
Address: ${propertyData.address}
Price: $${propertyData.price.toLocaleString()}
Bedrooms: ${propertyData.bedrooms} | Bathrooms: ${propertyData.bathrooms}
Living Area: ${propertyData.livingArea} sqft
Year Built: ${propertyData.yearBuilt}
Type: ${propertyData.homeType}
Walk Score: ${propertyData.walkScore}/100
Transit Score: ${propertyData.transitScore}/100
Bike Score: ${propertyData.bikeScore}/100
${schoolsInfo ? `Schools: ${schoolsInfo}` : ""}
${priceHistoryInfo ? `Price History: ${priceHistoryInfo}` : ""}

Description: ${propertyData.description}

Generate:
1. A detailed summary (3-4 sentences) covering value, location benefits, schools, and standout features
2. A list of 3-5 key highlights (short phrases)

Return as JSON:
{
  "summary": "3-4 sentence summary",
  "highlights": ["highlight1", "highlight2", "highlight3"]
}`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });

      const text = response.text?.trim() || "";
      const jsonText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
      const result = JSON.parse(jsonText);

      return {
        shortSummary: result.summary.split(".").slice(0, 2).join(".") + ".",
        fullSummary: result.summary,
        highlights: result.highlights,
      };
    } catch (error) {
      console.error("Error generating full summary:", error);
      return {
        shortSummary: `${propertyData.bedrooms}BR/${propertyData.bathrooms}BA ${propertyData.homeType} in ${propertyData.address}.`,
        fullSummary: `This ${propertyData.bedrooms} bedroom, ${propertyData.bathrooms} bathroom ${propertyData.homeType} offers ${propertyData.livingArea} sqft of living space. Built in ${propertyData.yearBuilt}, it's priced at $${propertyData.price.toLocaleString()}.`,
        highlights: [
          `${propertyData.bedrooms} Bed / ${propertyData.bathrooms} Bath`,
          `${propertyData.livingArea} sqft`,
          `Built ${propertyData.yearBuilt}`,
        ],
      };
    }
  },

  // Answer property questions (chat)
  async answerPropertyQuestion(
    question: string,
    propertyContext: PropertyContext,
    chatHistory: { role: string; content: string }[] = []
  ): Promise<string> {
    const historyText = chatHistory
      .slice(-4) // Last 4 messages for context
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = `You are a helpful real estate assistant. Answer this question about the property.

PROPERTY CONTEXT:
Address: ${propertyContext.address}
Price: $${propertyContext.price.toLocaleString()}
Bedrooms: ${propertyContext.bedrooms} | Bathrooms: ${propertyContext.bathrooms}
Living Area: ${propertyContext.livingArea} sqft
Year Built: ${propertyContext.yearBuilt}
Type: ${propertyContext.homeType}
Walk Score: ${propertyContext.walkScore}/100
Transit Score: ${propertyContext.transitScore}/100
Bike Score: ${propertyContext.bikeScore}/100
${propertyContext.schools ? `\nSchools:\n${propertyContext.schools.map((s) => `- ${s.name} (${s.level}): Rating ${s.rating}/10, ${s.distance}mi away`).join("\n")}` : ""}
${propertyContext.priceHistory ? `\nPrice History:\n${propertyContext.priceHistory.map((h) => `- ${h.event}: $${h.price.toLocaleString()} (${h.date})`).join("\n")}` : ""}

Description: ${propertyContext.description}

${historyText ? `CONVERSATION HISTORY:\n${historyText}\n` : ""}

USER QUESTION: ${question}

Provide a helpful, accurate answer. Be conversational but professional. If you don't have specific information, say so honestly.`;

    try {
      const response = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });

      return response.text?.trim() || "";
    } catch (error) {
      console.error("Error answering question:", error);
      return "I apologize, but I'm having trouble processing your question right now. Please try again.";
    }
  },

  // Stream chat response (for real-time updates)
  async *streamPropertyQuestion(
    question: string,
    propertyContext: PropertyContext,
    chatHistory: { role: string; content: string }[] = []
  ): AsyncGenerator<string, void, unknown> {
    const historyText = chatHistory
      .slice(-4)
      .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const prompt = `You are a helpful real estate assistant. Answer this question about the property.

PROPERTY CONTEXT:
Address: ${propertyContext.address}
Price: $${propertyContext.price.toLocaleString()}
Bedrooms: ${propertyContext.bedrooms} | Bathrooms: ${propertyContext.bathrooms}
Living Area: ${propertyContext.livingArea} sqft
Year Built: ${propertyContext.yearBuilt}
Type: ${propertyContext.homeType}
Walk Score: ${propertyContext.walkScore}/100
Transit Score: ${propertyContext.transitScore}/100
Bike Score: ${propertyContext.bikeScore}/100

${historyText ? `CONVERSATION HISTORY:\n${historyText}\n` : ""}

USER QUESTION: ${question}

Provide a helpful, accurate answer. Be conversational but professional.`;

    try {
      const fallbackResponse = await ai.models.generateContent({
        model: MODEL,
        contents: prompt,
      });
      yield fallbackResponse.text || "";
      // const response = ai.models.generateContentStream({
      //   model: MODEL,
      //   contents: prompt,
      // });

      // // Iterate over the stream
      // for await (const chunk of response) {
      //   if (chunk.text) {
      //     yield chunk.text;
      //   }
      // }
    } catch (error) {
      console.log("Error response:", error);
      // Fall back to non-streaming response
    }
  },
};
