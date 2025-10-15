# 🏠 Keytara AI — Intelligent Real Estate Search App

Keytara AI is a cutting-edge React Native mobile application that revolutionizes real estate search through **AI-powered natural language processing**.  
Built with **Expo** and **TypeScript**, it provides an intuitive way to find properties using conversational queries instead of traditional form-based searches.

---

## ✨ Overview

Keytara AI leverages mathematical reasoning, data parsing, and AI modeling to understand natural human queries like:  
> “Show me 3-bedroom apartments under $500,000 in Lagos with a swimming pool.”

The system converts this unstructured text into structured parameters using **Google Gemini AI**, demonstrating real-world applications of **NLP (Natural Language Processing)**, **data mapping**, and **state management** in software engineering.

---

## 🚀 Features

### 🤖 AI-Powered Search
- **Natural Language Understanding:** Describe your dream home in plain English.  
- **Query Parsing:** AI converts conversational input into structured search filters.  
- **Contextual Refinements:** Adjust searches naturally (“show cheaper options”, “add a pool”).  
- **Undo Functionality:** Navigate back through search history using natural commands.

### 🔍 Advanced Property Search
- **Comprehensive Filters:** Location, price range, bedrooms, bathrooms, property type.  
- **Smart Criteria:** Pools, garages, waterfront, school ratings, construction year.  
- **Real-time Data:** Instant property listings via **Zillow API** integration.  
- **Persistent Search History:** Search data stored and retrievable across sessions.

### 💾 Property Management
- Save and manage your favorite properties.  
- Persistent local storage ensures saved properties remain available offline.

### 📱 Modern UI/UX
- Clean, elegant design with smooth transitions.  
- Supports **dark/light mode** and responsive layouts.  
- Built with **NativeWind** and **Expo Router** for fluid navigation.

---

## 🧠 Technology Stack

### **Frontend**
- React Native + Expo  
- TypeScript  
- NativeWind (Tailwind CSS for React Native)  
- React Query (data fetching + caching)  
- Zustand (lightweight state management)  
- Expo Router (file-based navigation)

### **AI & APIs**
- **Google Gemini AI** — NLP and query parsing  
- **Zillow API** — Real estate property data  
- **RapidAPI** — API gateway management

---

## 🧩 Core Logic Example

### AI Query Parsing

```typescript
// Example input: "3-bedroom house with pool under $500k in Austin"
const filters = await parseNaturalLanguageQuery(query);

// Returns:
{
  location: "Austin",
  bedrooms: 3,
  hasPool: true,
  maxPrice: 500000
}
