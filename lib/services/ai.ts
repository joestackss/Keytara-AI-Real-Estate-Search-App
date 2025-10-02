import { GoogleGenAI } from "@google/genai";
import { ENV } from "../config/env";
import type { SearchParams } from "../types";

const ai = new GoogleGenAI({ apiKey: ENV.GEMINI_API_KEY });

export interface AISearchFilters extends SearchParams {
  // Extended filters
  hasPool?: boolean;
  hasGarage?: boolean;
  yearBuiltMin?: number;
  yearBuiltMax?: number;
  squareFeetMin?: number;
  squareFeetMax?: number;
  lotSizeMin?: number;
  hasView?: boolean;
  parking?: number;
}

export interface ConversationContext {
  previousQuery?: string;
  previousFilters?: AISearchFilters;
  conversationHistory?: string[];
}

/**
 * Parse natural language query into structured search parameters
 */
export async function parseNaturalLanguageQuery(
  query: string,
  context?: ConversationContext
): Promise<AISearchFilters> {
  const systemPrompt = `You are a real estate search assistant. Convert natural language queries into structured JSON search parameters.

Available parameters:
- location: string (city, state, or address)
- status: "forSale" | "forRent" | "recentlySold"
- bedrooms: number (minimum bedrooms)
- bathrooms: number (minimum bathrooms)
- minPrice: number
- maxPrice: number
- propertyType: "Houses" | "Townhomes" | "Condos" | "Apartments" | "Multi-family"
- hasPool: boolean
- hasGarage: boolean
- yearBuiltMin: number
- yearBuiltMax: number
- squareFeetMin: number
- squareFeetMax: number
- lotSizeMin: number (in square feet)
- hasView: boolean
- parking: number (parking spaces)

Rules:
1. Extract all relevant parameters from the query
2. Use reasonable defaults when not specified (e.g., status defaults to "forSale")
3. Handle price formats like "$500k", "$1M", "under 500k", "between 300k and 500k"
4. Handle bedroom/bathroom formats like "3-bedroom", "3 bed", "3BR", "2.5 bath"
5. Handle year formats like "built after 1990", "new construction", "built before 2000"
6. Understand school-related queries by inferring they want family-friendly areas
7. For conversational refinements, merge with previous filters if context is provided

${
  context?.previousFilters
    ? `\nPrevious search filters: ${JSON.stringify(context.previousFilters)}\nPrevious query: "${context.previousQuery}"\n\nFor refinements:\n- If the query adds a filter (e.g., "with pool", "add garage"), ADD to existing filters\n- If the query removes a filter (e.g., "no pool", "remove garage", "without"), REMOVE that filter\n- If the query replaces a filter (e.g., "change to 4 bedrooms", "$600k instead"), UPDATE that filter\n- If the query says "undo" or "go back", return the previous filters unchanged with a special flag`
    : ""
}

Return ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "filters": { /* search parameters */ },
  "isUndo": false,
  "summary": "Human-readable summary of the search"
}`;

  const userMessage = context?.previousFilters
    ? `Current filters: ${JSON.stringify(context.previousFilters)}\n\nUser says: "${query}"\n\nWhat are the new filters?`
    : `Parse this search query: "${query}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt + "\n\n" + userMessage }],
        },
      ],
    });

    const responseText = response.text?.trim() || "{}";

    // Clean up response - remove markdown code blocks if present
    let cleanedResponse = responseText;
    if (cleanedResponse.startsWith("```json")) {
      cleanedResponse = cleanedResponse
        .replace(/^```json\s*\n/, "")
        .replace(/\n```$/, "");
    } else if (cleanedResponse.startsWith("```")) {
      cleanedResponse = cleanedResponse
        .replace(/^```\s*\n/, "")
        .replace(/\n```$/, "");
    }

    const parsed = JSON.parse(cleanedResponse);

    return parsed.filters || {};
  } catch (error) {
    console.error("AI parsing error:", error);

    // Fallback: basic regex parsing for common patterns
    return fallbackParser(query, context?.previousFilters);
  }
}

/**
 * Fallback parser using regex patterns when AI fails
 */
function fallbackParser(
  query: string,
  previousFilters?: AISearchFilters
): AISearchFilters {
  const filters: AISearchFilters = { ...previousFilters } || {};
  const lowerQuery = query.toLowerCase();

  // Extract location (look for city, state patterns)
  const locationMatch = lowerQuery.match(
    /in\s+([a-z\s]+(?:,\s*[a-z]{2})?)|near\s+([a-z\s]+)/i
  );
  if (locationMatch) {
    filters.location = (locationMatch[1] || locationMatch[2]).trim();
  }

  // Extract bedrooms
  const bedroomMatch = lowerQuery.match(/(\d+)[\s-]*(bed|bedroom|br)/);
  if (bedroomMatch) {
    filters.bedrooms = Number.parseInt(bedroomMatch[1]);
  }

  // Extract bathrooms
  const bathroomMatch = lowerQuery.match(
    /(\d+(?:\.\d+)?)[\s-]*(bath|bathroom)/
  );
  if (bathroomMatch) {
    filters.bathrooms = Number.parseFloat(bathroomMatch[1]);
  }

  // Extract price
  const priceMatch = lowerQuery.match(
    /(?:under|below|less than|<)\s*\$?(\d+)([km])?/
  );
  if (priceMatch) {
    const multiplier =
      priceMatch[2] === "m" ? 1000000 : priceMatch[2] === "k" ? 1000 : 1;
    filters.maxPrice = Number.parseInt(priceMatch[1]) * multiplier;
  }

  // Extract status
  if (lowerQuery.includes("for rent") || lowerQuery.includes("rental")) {
    filters.status = "forRent";
  } else if (
    lowerQuery.includes("sold") ||
    lowerQuery.includes("recently sold")
  ) {
    filters.status = "recentlySold";
  } else {
    filters.status = "forSale";
  }

  // Extract property type
  if (lowerQuery.includes("condo")) {
    filters.propertyType = "Condos";
  } else if (lowerQuery.includes("townhome")) {
    filters.propertyType = "Townhomes";
  } else if (lowerQuery.includes("apartment")) {
    filters.propertyType = "Apartments";
  } else {
    filters.propertyType = "Houses";
  }

  // Extract features
  if (lowerQuery.includes("pool") && !lowerQuery.includes("no pool")) {
    filters.hasPool = true;
  } else if (
    lowerQuery.includes("no pool") ||
    lowerQuery.includes("without pool")
  ) {
    delete filters.hasPool;
  }

  if (lowerQuery.includes("garage") && !lowerQuery.includes("no garage")) {
    filters.hasGarage = true;
  } else if (
    lowerQuery.includes("no garage") ||
    lowerQuery.includes("without garage")
  ) {
    delete filters.hasGarage;
  }

  // Extract year built
  const yearMatch = lowerQuery.match(/built after (\d{4})/);
  if (yearMatch) {
    filters.yearBuiltMin = Number.parseInt(yearMatch[1]);
  }

  return filters;
}

/**
 * Generate a human-readable summary of search filters
 */
export function generateSearchSummary(filters: AISearchFilters): string {
  const parts: string[] = [];

  if (filters.bedrooms) {
    parts.push(`${filters.bedrooms}+ bed`);
  }

  if (filters.bathrooms) {
    parts.push(`${filters.bathrooms}+ bath`);
  }

  if (filters.propertyType) {
    parts.push(filters.propertyType.toLowerCase());
  }

  if (filters.maxPrice) {
    parts.push(
      `under $${filters.maxPrice >= 1000000 ? `${filters.maxPrice / 1000000}M` : `${filters.maxPrice / 1000}k`}`
    );
  }

  if (filters.minPrice) {
    parts.push(`over $${filters.minPrice / 1000}k`);
  }

  if (filters.hasPool) {
    parts.push("with pool");
  }

  if (filters.hasGarage) {
    parts.push("with garage");
  }

  if (filters.yearBuiltMin) {
    parts.push(`built after ${filters.yearBuiltMin}`);
  }

  if (filters.location) {
    parts.push(`in ${filters.location}`);
  }

  if (filters.status) {
    const statusMap = {
      forSale: "for sale",
      forRent: "for rent",
      recentlySold: "recently sold",
    };
    parts.push(statusMap[filters.status]);
  }

  return parts.join(", ") || "All properties";
}

/**
 * Detect if query is requesting to undo/go back
 */
export function isUndoQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase().trim();
  const undoKeywords = [
    "undo",
    "go back",
    "previous",
    "revert",
    "cancel",
    "never mind",
  ];

  return undoKeywords.some((keyword) => lowerQuery.includes(keyword));
}

/**
 * Detect if query is removing a filter
 */
export function isRemovalQuery(query: string): boolean {
  const lowerQuery = query.toLowerCase();
  const removalPatterns = [
    /no\s+pool/,
    /without\s+pool/,
    /remove\s+pool/,
    /don't\s+show.*pool/,
    /no\s+garage/,
    /without\s+garage/,
    /remove\s+garage/,
  ];

  return removalPatterns.some((pattern) => pattern.test(lowerQuery));
}
