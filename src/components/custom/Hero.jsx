import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Zap, PiggyBank, Compass } from "lucide-react";

function Hero() {
  return (
    <div className="app-shell relative overflow-hidden">
      {/* Main Hero Section */}
      <div className="flex flex-col items-center max-w-6xl mx-auto px-4 pt-20 pb-32 relative z-10">
        {/* Floating Badge */}
        <div className="inline-flex items-center gap-2 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl px-6 py-2.5 rounded-full mb-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/70 dark:border-slate-700">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            AI-assisted planning for serious travelers
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="font-extrabold text-4xl md:text-6xl lg:text-7xl text-center leading-tight mb-8 max-w-5xl tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
            Discover your next adventure
          </span>
          <br />
          <span className="text-gray-800 dark:text-gray-100 text-3xl md:text-5xl lg:text-6xl mt-3 block">
            with an AI travel co‑pilot
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-xl text-gray-600 dark:text-gray-300 text-center max-w-3xl leading-relaxed mb-12">
          Turn vague ideas into structured itineraries in minutes. No spreadsheets,
          no chaos—just clear, presentation-ready plans powered by modern AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link to="/create-trip">
            <Button className="bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 min-w-[200px]">
              <Zap className="w-5 h-5 mr-2" />
              Start planning
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 min-w-[200px] dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            <Compass className="w-5 h-5 mr-2" />
            Explore features
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 w-full max-w-5xl mb-20">
          <div className="glass-card p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Smart recommendations
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              The planner learns from your inputs to suggest destinations, time
              frames, and experiences that match your style.
            </p>
          </div>

          <div className="glass-card p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <Zap className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Instant itineraries
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Generate day-wise plans in seconds, ready to present in college
              events, demos, or real trips.
            </p>
          </div>

          <div className="glass-card p-8 hover:shadow-xl transition-all duration-300 group hover:scale-105">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <PiggyBank className="w-8 h-8 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Budget aware
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Plans are aligned with your budget preferences, balancing experience
              quality and cost.
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Built to look great in demos, portfolios, and college competitions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 opacity-80 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-yellow-400/10 px-2 py-1 text-yellow-600 text-xs font-medium">
                ★ 4.9 student rating
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              50,000+ trips planned
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-300" />
            <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Optimized for presentations
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div
        className="pointer-events-none absolute top-12 left-6 opacity-30 animate-[float_6s_ease-in-out_infinite]"
        style={{ animationDelay: "0s" }}
      >
        <div className="w-20 h-20 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full blur-sm" />
      </div>
      <div
        className="pointer-events-none absolute top-40 right-8 opacity-30 animate-[float_7s_ease-in-out_infinite]"
        style={{ animationDelay: "1s" }}
      >
        <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full blur-sm" />
      </div>
      <div
        className="pointer-events-none absolute bottom-32 left-16 opacity-30 animate-[float_8s_ease-in-out_infinite]"
        style={{ animationDelay: "2s" }}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full blur-sm" />
      </div>
    </div>
  );
}

export default Hero;