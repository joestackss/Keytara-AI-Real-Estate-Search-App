# 🚀 Quick Start Guide - AI Real Estate Search

## Get Started in 3 Steps

### Step 1: Get Your Gemini API Key (2 minutes)

1. Visit: https://aistudio.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key

### Step 2: Add API Key to Your Project

Create a `.env` file in your project root:

```bash
EXPO_PUBLIC_GEMINI_API_KEY=paste_your_key_here
EXPO_PUBLIC_RAPIDAPI_KEY=your_existing_zillow_key
```

### Step 3: Start Your App

```bash
npm start
```

Then press `i` for iOS or `a` for Android.

---

## How to Use

### 1️⃣ Open AI Search

Tap the green "AI Property Search" button on the home screen.

### 2️⃣ Describe Your Dream Home

Type something like:

- "3-bedroom house in Miami under $600k"
- "Condo with pool in Austin"
- "New construction with garage"

### 3️⃣ Refine Your Search

On the results screen, keep refining:

- "Show me ones with pools"
- "Built after 2000"
- "No pools" (to remove filter)
- "Go back" (to undo)

---

## Example Conversation

```
You: "3 bedroom house in Houston under $500k"
App: Shows 156 results

You: "Show me ones with pools"
App: Shows 42 results (with pool filter)

You: "Built after 1990"
App: Shows 28 results (pool + year built)

You: "No pools"
App: Shows 89 results (removes pool filter)

You: "Go back"
App: Instantly shows previous 28 results
```

---

## Quick Tips

✅ Be natural - talk like you're chatting with a real estate agent
✅ Use examples if you're not sure what to say
✅ Tap quick action buttons for common filters
✅ Search history is saved - you can go back/forward anytime

---

## Need Help?

Check `AI_FEATURES_README.md` for detailed documentation.

**Enjoy finding your dream home! 🏡**
