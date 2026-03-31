// export const SelectTravelsList = [
//   {
//     id: 1,
//     title: "Just Me",
//     desc: "A sole traveler in exploration",
//     icon: "👤",
//     people: "1",
//   },
//   {
//     id: 2,
//     title: "A Couple",
//     desc: "Two travelers in tandem",
//     icon: "🍷",
//     people: "2 People",
//   },
//   {
//     id: 3,
//     title: "Family",
//     desc: "A group of fun-loving adventurers",
//     icon: "👨‍👩‍👧‍👦",
//     people: "3 to 5 People",
//   },
//   {
//     id: 4,
//     title: "Friend",
//     desc: "A companion for your travels",
//     icon: "👯‍♂️",
//     people: "1 or more Friends",
//   },
// ];

// export const SelectBudgetOptions = [
//   {
//     id: 1,
//     title: "Cheap",
//     desc: "Stay conscious of costs",
//     icon: "💸",
//   },
//   {
//     id: 2,
//     title: "Moderate",
//     desc: "Keep cost on the average side",
//     icon: "💰",
//   },
//   {
//     id: 3,
//     title: "Luxury",
//     desc: "Spend freely for premium experiences",
//     icon: "🪙",
//   },
// ];

// export const AI_PROMPT = `Generate Travel Plan for Location: {location}, for {totalDays} Days for {travelers} with a {budget} budget.
// Give me Hotels at least 5 options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions
// and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating,
// Time travel each of the location for{totalDays} days with each day plan with best time to visit time in JSON format.`;

export const SelectTravelsList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveler in exploration",
    icon: "👤",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "Two travelers in tandem",
    icon: "🍷",
    people: "2 People",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of fun-loving adventurers",
    icon: "👨‍👩‍👧‍👦",
    people: "3 to 5 People",
  },
  {
    id: 4,
    title: "Friend",
    desc: "A companion for your travels",
    icon: "👯‍♂️",
    people: "1 or more Friends",
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of costs",
    icon: "💸",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on the average side",
    icon: "💰",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Spend freely for premium experiences",
    icon: "🪙",
  },
];

// Enhanced JSON Schema for consistent structure
export const TRIP_PLAN_SCHEMA = `{
  "location": "string",
  "tripDurationDays": number,
  "travelers": "string",
  "budget": "string",
  "totalEstimatedCost": "string",
  "transportationOptions": {
    "bestMode": "string",
    "details": "string",
    "estimatedCost": "string",
    "travelTime": "string"
  },
  "currencyInfo": {
    "localCurrency": "string",
    "conversionToINR": "string",
    "averageDailySpendINR": "string"
  },
  "hotelOptions": [
    {
      "hotelName": "string",
      "address": "string",
      "pricePerNight": "string",
      "imageUrl": "string",
      "geoCoordinates": {
        "latitude": number,
        "longitude": number
      },
      "rating": number,
      "description": "string"
    }
  ],
  "itinerary": {
    "day1": {
      "theme": "string",
      "activities": [
        {
          "time": "string (HH:MM)",
          "placeName": "string",
          "placeDetails": "string",
          "placeImageUrl": "string",
          "geoCoordinates": {
            "latitude": number,
            "longitude": number
          },
          "ticketPricing": "string",
          "rating": number,
          "timeToSpend": "string",
          "bestTimeToVisit": "string"
        }
      ]
    }
  },
  "budgetBreakdown": {
    "accommodation": "string",
    "activities": "string",
    "food": "string",
    "transportation": "string"
  },
  "tips": ["string"]
}`;

// Comprehensive AI Prompt with strict formatting requirements
export const AI_PROMPT = `You are a professional travel planner. Generate a comprehensive travel plan in STRICT JSON FORMAT ONLY.

LOCATION: {location}
DURATION: {totalDays} days
TRAVELERS: {travelers}
BUDGET: {budget}

CRITICAL REQUIREMENTS - MUST FOLLOW EXACTLY:

1. RESPOND WITH ONLY VALID JSON - No explanations, no markdown, no additional text
2. MUST follow this EXACT schema: ${TRIP_PLAN_SCHEMA}
3. Include exactly {totalDays} days in itinerary (day1, day2, day3, etc.)
4. Include 5+ hotels with ALL fields completed
5. Include 4-6 activities per day with complete information
6. ALL data must be realistic and specific to {location}
7. Include a "transportationOptions" field at ROOT LEVEL with:
   - bestMode: "Flight" | "Train" | "Bus" | "Combination"
   - details: Explanation of why this mode is best
   - estimatedCost: Price range
   - travelTime: Approx duration

8. Include a "currencyInfo" field at ROOT LEVEL with:
   - localCurrency: Currency used in {location}
   - conversionToINR: Example "1 USD = 83 INR"
   - averageDailySpendINR: Estimated per person per day in INR
9. DO NOT skip transportationOptions or currencyInfo under any circumstances

DATA FORMAT RULES:
✅ Prices: "$50 - $80", "Free", "$25" (never use "Starting from" or vague terms)
✅ Ratings: Numbers only (4.2, 3.8) - never use "4.2/5" or "★★★★"
✅ Coordinates: Decimal numbers (40.7128, -74.0060) - never strings
✅ Times: "HH:MM" format ("09:00", "14:30") - never "9 AM" or vague times
✅ Image URLs: Use format "https://images.unsplash.com/photo-[id]?w=800"
✅ Currency: Always include currency symbol ($, ₹, €, etc.)

TRANSPORTATION RULES:
- Choose best realistic option based on distance from India
- International destinations → usually Flight
- Nearby cities → Train or Bus
- If multiple modes required → use "Combination"
- Provide realistic time and cost estimates

CURRENCY RULES:
- Always use correct local currency for {location}
- Provide realistic INR conversion rate
- Do NOT leave empty or vague values

+ 🚨 CRITICAL:
+ If the destination is in India:
+ - localCurrency MUST be "INR"
+ - conversionToINR MUST be "1 INR = 1 INR"
+ - NEVER use USD or any foreign currency
+
+ 🚨 STRICT CONSISTENCY RULE:
+ The currency used in "conversionToINR" MUST MATCH the "localCurrency"
+ Example:
+ - If localCurrency = "USD" → "1 USD = XX INR"
+ - If localCurrency = "EUR" → "1 EUR = XX INR"
+ - If localCurrency = "INR" → "1 INR = 1 INR"
+
+ ❌ NEVER mix currencies (e.g., INR + USD together)


EXAMPLE HOTEL (follow this structure exactly):
{
  "hotelName": "{location} Grand Hotel",
  "address": "123 Main Street, {location}",
  "pricePerNight": "$85 - $120",
  "imageUrl": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
  "geoCoordinates": {"latitude": 40.7128, "longitude": -74.0060},
  "rating": 4.2,
  "description": "Modern hotel in prime location with excellent amenities and city views"
}

EXAMPLE ACTIVITY (follow this structure exactly):
{
  "time": "10:00",
  "placeName": "Central Museum",
  "placeDetails": "World-renowned museum featuring extensive art and history collections",
  "placeImageUrl": "https://images.unsplash.com/photo-1554907984-15263bfd63bd?w=800",
  "geoCoordinates": {"latitude": 40.7794, "longitude": -73.9632},
  "ticketPricing": "$15 - $25",
  "rating": 4.5,
  "timeToSpend": "2-3 hours",
  "bestTimeToVisit": "Morning (less crowded)"
}

BUDGET CONSIDERATIONS:
- Cheap: Focus on budget hotels, free activities, local transportation
- Moderate: Mix of mid-range and budget options, some paid attractions
- Luxury: Premium hotels, exclusive experiences, fine dining

Generate the complete travel plan as pure JSON now:`;

// Alternative ultra-strict prompt for retry attempts
export const STRICT_AI_PROMPT = `RESPOND WITH ONLY JSON. NO OTHER TEXT.

Travel Plan: {location} | {totalDays} days | {travelers} | {budget} budget

Required JSON structure - fill ALL fields with real data:
{
  "location": "{location}",
  "tripDurationDays": {totalDays},
  "travelers": "{travelers}",
  "budget": "{budget}",
  "totalEstimatedCost": "$XXX - $XXX",
  "transportationOptions": {
    "bestMode": "string",
    "details": "string",
    "estimatedCost": "string",
    "travelTime": "string"
  },
  "currencyInfo": {
    "localCurrency": "string",
    "conversionToINR": "string",
    "averageDailySpendINR": "string"
  },
  "hotelOptions": [
    {
      "hotelName": "Actual Hotel Name",
      "address": "Full Street Address",
      "pricePerNight": "$XX - $XX",
      "imageUrl": "https://images.unsplash.com/photo-example.jpg",
      "geoCoordinates": {"latitude": 00.0000, "longitude": -00.0000},
      "rating": 0.0,
      "description": "Detailed hotel description"
    }
  ],
  "itinerary": {
    ${Array.from(
      { length: "{totalDays}" },
      (_, i) => `"day${i + 1}": {
      "theme": "Day ${i + 1} theme",
      "activities": [
        {
          "time": "HH:MM",
          "placeName": "Real place name",
          "placeDetails": "Detailed description",
          "placeImageUrl": "https://images.unsplash.com/photo-example.jpg",
          "geoCoordinates": {"latitude": 00.0000, "longitude": -00.0000},
          "ticketPricing": "$XX or Free",
          "rating": 0.0,
          "timeToSpend": "X hours",
          "bestTimeToVisit": "Time period"
        }
      ]
    }`
    ).join(",\n    ")}
  },
  "budgetBreakdown": {
    "accommodation": "$XXX - $XXX",
    "activities": "$XXX - $XXX",
    "food": "$XXX - $XXX",
    "transportation": "$XXX - $XXX"
  },
  "tips": ["Real tip 1", "Real tip 2", "Real tip 3"]
}`;

// Helper function to format prompts with actual values
export const formatPrompt = (
  promptTemplate,
  location,
  totalDays,
  travelers,
  budget
) => {
  return promptTemplate
    .replace(/{location}/g, location)
    .replace(/{totalDays}/g, totalDays)
    .replace(/{travelers}/g, travelers)
    .replace(/{budget}/g, budget);
};

// Validation rules for consistent data
export const VALIDATION_RULES = {
  minHotels: 4,
  minActivitiesPerDay: 3,
  maxActivitiesPerDay: 8,
  requiredHotelFields: [
    "hotelName",
    "address",
    "pricePerNight",
    "geoCoordinates",
    "rating",
    "description",
  ],
  requiredActivityFields: [
    "time",
    "placeName",
    "placeDetails",
    "geoCoordinates",
    "ticketPricing",
    "rating",
  ],
  priceFormats: /^\$\d+(\s*-\s*\$\d+)?$|^Free$|^\$\d+$/,
  timeFormat: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  ratingRange: { min: 1, max: 5 },
};

// Sample fallback data for different budget types
export const FALLBACK_HOTEL_DATA = {
  cheap: [
    { priceRange: "$40 - $70", rating: 3.5 },
    { priceRange: "$35 - $65", rating: 3.2 },
    { priceRange: "$50 - $75", rating: 3.8 },
  ],
  moderate: [
    { priceRange: "$80 - $120", rating: 4.1 },
    { priceRange: "$90 - $140", rating: 4.3 },
    { priceRange: "$75 - $110", rating: 3.9 },
  ],
  luxury: [
    { priceRange: "$200 - $350", rating: 4.7 },
    { priceRange: "$250 - $400", rating: 4.8 },
    { priceRange: "$180 - $300", rating: 4.5 },
  ],
};

// Export legacy prompt for backward compatibility (but recommend using new approach)
export const LEGACY_AI_PROMPT = `Generate Travel Plan for Location: {location}, for {totalDays} Days for {travelers} with a {budget} budget.
Give me Hotels at least 5 options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions
and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, rating,
Time travel each of the location for {totalDays} days with each day plan with best time to visit time in JSON format.`;
