import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

import React, { useState, useEffect } from "react";

import GooglePlaceAutoComplete from "react-google-autocomplete";

import { Input } from "../components/ui/input";

import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelsList,
} from "../constants/options";

import { Button } from "../components/ui/button";

import { toast } from "sonner";

import { chatSession } from "../service/AIModel";

import { FcGoogle } from "react-icons/fc";

import axios from "axios";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGoogleLogin } from "@react-oauth/google";

import { doc, setDoc } from "firebase/firestore";

import { db } from "../service/Firebaseconfig";

import { useNavigate } from "react-router-dom";
import AsyncLoader from "../components/custom/AsyncLoader";
import { getStandardLocation } from "../lib/location";
import {
  LoaderCircle,
  MapPin,
  CalendarRange,
  Wallet,
  Users,
  ShieldCheck,
} from "lucide-react";
import LocationPicker from "./LocationPicker";

function CreateTrip() {
  const [formData, setFormData] = useState({});

  const [selectedBudget, setSelectedBudget] = useState(null);

  const [selectedTravellers, setSelectedTravellers] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [user, setUser] = useState(null); // Add user state
  const loadingMessages = [
    "Analyzing destination...",
    "Finding best places...",
    "Designing your itinerary...",
    "Optimizing hotels & routes...",
    "Almost ready..."
  ];

  const [currentMessage, setCurrentMessage] = useState(0);
  const [openMap, setOpenMap] = useState(false);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % loadingMessages.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [isLoading]);
  const navigate = useNavigate();

  // Initialize user state from localStorage on component mount

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // Function to validate all required fields

  const validateForm = () => {
    const requiredFields = {
      location: formData?.location,

      noOfDays: formData?.noOfDays && parseInt(formData.noOfDays) > 0,

      budget: formData?.budget,

      travellers: formData?.travellers,
    };

    const missingFields = [];

    if (!requiredFields.location) missingFields.push("Destination");

    if (!requiredFields.noOfDays) missingFields.push("Number of days");

    if (!requiredFields.budget) missingFields.push("Budget");

    if (!requiredFields.travellers) missingFields.push("Number of travelers");

    return { isValid: missingFields.length === 0, missingFields };
  };

  const OnGenerateTrips = async () => {
    // Check if user is logged in

    if (!user) {
      setOpenDialog(true);

      return;
    }

    // Validate all required fields

    const validation = validateForm();

    if (!validation.isValid) {
      toast.error(
        `Please fill the following fields: ${validation.missingFields.join(
          ", "
        )}`
      );

      return;
    }

    // Additional validation for days (should be reasonable)

    if (parseInt(formData.noOfDays) > 30) {
      toast.error("Please enter a reasonable number of days (maximum 30)");

      return;
    }

    setIsLoading(true);

    const FINAL_PROMPT = AI_PROMPT.replace(
      "{location}",

      getStandardLocation(formData?.location || "")
    )

      .replace("{totalDays}", formData?.noOfDays)

      .replace("{travelers}", formData?.travellers)

      .replace("{budget}", formData?.budget);

    // console.log("Generated Prompt:", FINAL_PROMPT);

    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT);

      const response = await result.response.text();

      // console.log("AI Response:", response);

      SaveAiTrip(response);
    } catch (err) {
      toast.error("Something went wrong with AI response");

      console.error(err);

      setIsLoading(false);
    }
  };

  const SaveAiTrip = async (TripData) => {
    try {
      console.log("formdata", formData);

      console.log("Original TripData:", TripData);

      const docId = Date.now().toString();

      let cleanedTripData = TripData;

      // Data cleaning logic (keeping your existing logic)

      cleanedTripData = cleanedTripData.replace(/^```json\s*/g, "");

      cleanedTripData = cleanedTripData.replace(/```.*$/g, "");

      cleanedTripData = cleanedTripData.replace(/\/\/.*$/gm, "");

      cleanedTripData = cleanedTripData.replace(/,(\s*[}\]])/g, "$1");

      cleanedTripData = cleanedTripData.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

      cleanedTripData = cleanedTripData.replace(
        /"Insert Image URL H[^"]*"/g,

        '"https://example.com/placeholder.jpg"'
      );

      cleanedTripData = cleanedTripData.replace(
        /"https:\s*"([a-zA-Z]+)"/g,

        '"https://example.com/placeholder.jpg", "$1"'
      );

      cleanedTripData = cleanedTripData.replace(
        /"http:\s*"([a-zA-Z]+)"/g,

        '"http://example.com/placeholder.jpg", "$1"'
      );

      cleanedTripData = cleanedTripData.replace(
        /"Insert Image URL[^"]*"/g,

        '"https://example.com/placeholder.jpg"'
      );

      const firstBrace = cleanedTripData.indexOf("{");

      const lastBrace = cleanedTripData.lastIndexOf("}");

      if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No valid JSON structure found");
      }

      cleanedTripData = cleanedTripData.substring(firstBrace, lastBrace + 1);

      console.log("Cleaned TripData after URL fix:", cleanedTripData);

      const parsedData = JSON.parse(cleanedTripData);

      console.log("Successfully parsed data:", parsedData);

      const cleanedFormData = {
        ...parsedData,
      };

      console.log("Cleaned form data:", cleanedFormData);

      await setDoc(doc(db, "AiTrips", docId), {
        userSelection: cleanedFormData,

        tripData: cleanedFormData,

        userEmail: user?.email,

        id: docId,
      });

      console.log("Trip saved successfully!");

      setIsLoading(false);

      navigate("/view-trip/" + docId);
    } catch (error) {
      console.error("Error saving trip:", error);

      setIsLoading(false);

      alert("Error saving trip. Please try generating the trip again.");
    }
  };

  const getUserProfile = (tokenInfo) => {
    axios

      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,

        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,

            Accept: "application/json",
          },
        }
      )

      .then((res) => {
        console.log(res);

        const userData = res.data;

        localStorage.setItem("user", JSON.stringify(userData));

        setUser(userData); // Update user state immediately

        setOpenDialog(false);

        // Don't call OnGenerateTrips here, let user click the button again

        toast.success(
          "Successfully logged in! You can now generate your trip."
        );
      })

      .catch((err) => {
        console.log(err);

        toast.error("Login failed. Please try again.");
      });
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Success:", tokenResponse);

      getUserProfile(tokenResponse);
    },

    onError: (error) => {
      console.log("Login Error:", error);

      toast.error("Login failed. Please try again.");
    },
  });

  // Check if form is valid for button state

  const validation = validateForm();

  const isFormValid = validation.isValid && user;

  // Show loading screen when generating trip

  // if (!isLoading) {
  //   return (
  //     <AsyncLoader
  //       title="Creating your perfect trip"
  //       messages={[
  //         "Planning your trip...",
  //         "Fetching best places...",
  //         "Crafting daily itinerary...",
  //         "Optimizing hotels and budget...",
  //       ]}
  //       destination={getStandardLocation(formData?.location)}
  //     />
  //   );
  // }

  return (
    <div className="app-shell">
      {isLoading && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-md">
        
        <div className="flex flex-col items-center gap-6 px-10 py-8 rounded-3xl bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl shadow-2xl border border-white/40 dark:border-slate-700">

          {/* Spinner with glow */}
          <div className="relative">
            <div className="absolute inset-0 bg-blue-400/30 blur-2xl rounded-full"></div>
            <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-slate-900 shadow-md">
              <LoaderCircle className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              Creating your perfect trip ✨
            </h2>

            <p className="text-sm text-gray-500 mt-2 animate-pulse">
              {loadingMessages[currentMessage]}
            </p>
          </div>

          {/* Progress bar (fake but feels real) */}
          <div className="w-56 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-orange-500 animate-[progress_2s_linear_infinite]"></div>
          </div>
        </div>
      </div>
    )}

      <div className="relative px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center overflow-x-hidden">
        {/* Background accents */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-20 -left-10 w-64 h-64 bg-blue-500/10 dark:bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-40 -right-10 w-72 h-72 bg-orange-500/10 dark:bg-orange-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/10 dark:bg-purple-400/10 rounded-full blur-3xl" />
        </div>

        {/* Hero Section */}
        <div className="w-full max-w-5xl mx-auto mb-14 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 dark:bg-slate-900/70 border border-white/60 dark:border-slate-700 px-4 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-300 mb-4 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-blue-500" />
            Smart, secure, AI-assisted trip planning
          </p>

          <h2 className="font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-5xl tracking-tight mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
              Design your perfect journey
            </span>
          </h2>

          <p className="mt-2 text-gray-600 dark:text-gray-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Answer a few quick questions about your destination, duration, budget, and
            group size. Our AI trip planner will craft a complete, presentation-ready
            itinerary for you.
          </p>

          {user && (
            <div className="mt-5 inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-200 px-4 py-2 rounded-full text-sm shadow-sm">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Logged in as <span className="font-semibold">{user.name}</span>
            </div>
          )}
        </div>

        <div className="w-full max-w-5xl mx-auto">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
            {/* Left column: main form cards */}
            <div className="space-y-8">
              {/* Destination Field */}
              <div className="glass-card p-7 md:p-8 hover:shadow-xl transition-all duration-300 border border-white/60 dark:border-slate-800">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Choose your destination
                      </h2>
                      {!formData?.location && (
                        <span className="text-red-500 text-xs font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Search for a city or place you want to explore. You can also
                      pick a location directly from the interactive map.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setOpenMap(true)}
                    className="self-start inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 dark:bg-slate-800">
                      <MapPin className="w-3.5 h-3.5" />
                    </span>
                    Select from map
                  </button>
              <div className="relative">
              <GooglePlaceAutoComplete
                apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                value={formData?.location || ""}
                onChange={(e) => handleChange("location", e.target.value)} // ✅ FIX
                onPlaceSelected={(place) => {
                  handleChange("location", place.formatted_address);
                }}
                className={`border-2 rounded-xl px-6 py-4 w-full shadow-sm 
                focus:outline-none transition-all duration-200 text-base sm:text-lg bg-white dark:bg-slate-900 dark:text-gray-100
                ${
                  formData?.location
                    ? "border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900"
                    : "border-gray-200 dark:border-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900"
                }`}
                placeholder="Search for destinations..."
              />

                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                  {formData?.location ? (
                    <svg
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 text-gray-400 dark:text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 9l-7 7-7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </div>
              </div>
              </div>
            </div>

            {/* Number of Days Field */}
              <div className="glass-card p-7 md:p-8 hover:shadow-xl transition-all duration-300 border border-white/60 dark:border-slate-800">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                    <CalendarRange className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        How many days are you planning?
                      </h2>
                      {(!formData?.noOfDays ||
                        parseInt(formData.noOfDays) <= 0) && (
                        <span className="text-red-500 text-xs font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Short weekend getaway or an extended vacation – tell us how
                      long you want to stay.
                    </p>
                  </div>
                </div>

                <Input
                  placeholder="e.g. 3"
                  type="number"
                  min="1"
                  max="30"
                  className={`border-2 rounded-xl px-6 py-4 text-base sm:text-lg transition-all duration-200 bg-white dark:bg-slate-900 dark:text-gray-100 ${
                    formData?.noOfDays && parseInt(formData.noOfDays) > 0
                      ? "border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900"
                      : "border-gray-200 dark:border-slate-700 focus:border-green-500 focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900"
                  }`}
                  onChange={(e) => {
                    handleChange("noOfDays", e.target.value);
                  }}
                />
              </div>

              {/* Budget Options */}
              <div className="glass-card p-7 md:p-8 hover:shadow-xl transition-all duration-300 border border-white/60 dark:border-slate-800">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        What is your budget level?
                      </h2>
                      {!formData?.budget && (
                        <span className="text-red-500 text-xs font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Select the range that best matches how much you want to
                      spend per person for the trip.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {SelectBudgetOptions.map((item, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => {
                        setSelectedBudget(item.title);
                        handleChange("budget", item.title);
                      }}
                      className={`text-left border rounded-2xl p-5 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-orange-300 dark:hover:border-orange-400 transition-all duration-300 cursor-pointer group ${
                        selectedBudget === item.title
                          ? "shadow-lg border-orange-400 ring-2 ring-orange-100 dark:ring-orange-500/40"
                          : "border-gray-200 dark:border-slate-700"
                      }`}
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </div>

                      <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Travelers */}
              <div className="glass-card p-7 md:p-8 hover:shadow-xl transition-all duration-300 border border-white/60 dark:border-slate-800">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Who are you travelling with?
                      </h2>
                      {!formData?.travellers && (
                        <span className="text-red-500 text-xs font-medium">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Solo, couple, friends, or family – we’ll tailor suggestions to
                      match your group.
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {SelectTravelsList.map((item, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => {
                        setSelectedTravellers(item.people);
                        handleChange("travellers", item.people);
                      }}
                      className={`text-left border rounded-2xl p-5 bg-white/70 dark:bg-slate-900/80 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-orange-300 dark:hover:border-orange-400 transition-all duration-300 cursor-pointer group ${
                        selectedTravellers === item.people
                          ? "shadow-lg border-orange-400 ring-2 ring-orange-100 dark:ring-orange-500/40"
                          : "border-gray-200 dark:border-slate-700"
                      }`}
                    >
                      <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </div>

                      <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-gray-100">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: summary & action */}
            <div className="space-y-6">
              <div className="glass-card p-6 md:p-7 border border-white/60 dark:border-slate-800 flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Trip summary preview
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  As you fill in your preferences, we’ll use them to generate a
                  detailed, day-wise itinerary that you can showcase in your college
                  projects or personal portfolio.
                </p>

                <div className="mt-2 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Destination
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formData?.location
                        ? getStandardLocation(formData.location)
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Duration
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formData?.noOfDays
                        ? `${formData.noOfDays} day(s)`
                        : "Not set"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Budget
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formData?.budget || "Not selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Travelers
                    </span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {formData?.travellers || "Not selected"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 dark:border-slate-700 pt-4 space-y-2 text-xs text-gray-500 dark:text-gray-400">
                  <p>
                    You can review and tweak the generated itinerary on the next
                    screen, export it as PDF, or present it directly in your event.
                  </p>
                </div>
              </div>

              {/* Generate Button */}
              <div className="glass-card p-6 border border-white/60 dark:border-slate-800 flex flex-col gap-3 items-stretch">
                {!user && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
                    Please sign in to generate your trip.
                  </p>
                )}

                {!validation.isValid && user && (
                  <p className="text-sm text-red-600 text-center">
                    Missing: {validation.missingFields.join(", ")}
                  </p>
                )}

                <Button
                  disabled={!isFormValid || isLoading}
                  onClick={OnGenerateTrips}
                  className={`w-full font-semibold py-3.5 px-6 rounded-xl text-base md:text-lg shadow-md hover:shadow-xl transition-all duration-300 transform ${
                    isFormValid && !isLoading
                      ? "bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white hover:scale-[1.02]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-slate-700 dark:text-slate-400"
                  } disabled:transform-none`}
                >
                  {!user
                    ? "Sign in to continue"
                    : isFormValid
                    ? "Generate my smart itinerary"
                    : "Complete all required fields"}
                </Button>
              </div>
            </div>
          </div>
        </div>
</div>
        {/* Login Dialog */}

        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="rounded-2xl p-8 max-w-md mx-auto bg-white/90 dark:bg-slate-900/95">
            <DialogHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>

              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Sign In Required
              </DialogTitle>

              <DialogDescription className="text-gray-600 dark:text-gray-300 text-lg">
                Sign in to the App with secure Google authentication to generate
                your personalized trip.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-8">
              <div className="flex items-center justify-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-orange-100 rounded-lg">
                  <span className="text-xl">✈️</span>
                </div>
              </div>

              <Button
                onClick={login}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-gray-100 border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500 font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-4 text-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FcGoogle className="h-8 w-8" />
                Sign In with Google
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openMap} onOpenChange={setOpenMap}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select your destination</DialogTitle>
            <DialogDescription>
              Click anywhere on the map to choose location
            </DialogDescription>
          </DialogHeader>

          <LocationPicker
            onSelect={(place) => {
              handleChange("location", place.name);
              setOpenMap(false);
            }}
          />
        </DialogContent>
      </Dialog>
      </div>
    // </div>
  );
}

export default CreateTrip;
