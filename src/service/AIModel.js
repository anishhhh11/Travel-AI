import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_API_KEY;
const MODEL_NAME = "models/gemini-2.5-flash"; // ✅ Fixed prefix

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: MODEL_NAME });

const generationConfig = {
  temperature: 0.3,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  // ❌ Removed responseMimeType (not valid here)
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: `Generate Travel Plan for Location : Las Vegas, for 3 Days for Couple with a Cheap budget. Give me a 3 or more Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format.`,
        },
      ],
    },
    // ⚠️ This model response block is **mocked**, should ideally be removed or used for display/testing only
    {
      role: "model",
      parts: [
        {
          text: `{
  "location": "Las Vegas, USA",
  "tripDurationDays": 3,
  "travelers": "Couple",
  "budget": "Cheap",
  "notes": "This plan focuses on free activities, budget-friendly hotels typically found off-Strip or older Strip properties, and cheap eats options. Prices, especially for hotels, can fluctuate significantly based on demand, day of the week (weekends are much more expensive), and events. Hotel prices listed are rough estimates for off-peak weekdays. Transportation costs (rideshare, bus, etc.) are not included in activity pricing but should be factored in.",
  "hotelOptions": [
    {
      "hotelName": "The D Las Vegas",
      "address": "301 Fremont Street, Las Vegas, NV 89101",
      "pricePerNightEstimate": "$60 - $180 per night",
      "imageUrl": "https://www.thedcasino.com/images/hero/main-hero-02.jpg",
      "geoCoordinates": {
        "latitude": 36.1695,
        "longitude": -115.1438
      },
      "rating": 3.5,
      "description": "A budget-friendly hotel located in downtown Las Vegas with a lively atmosphere..."
    }
  ]
}`,
        },
      ],
    },
  ],
});
