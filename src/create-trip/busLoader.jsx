// src/components/BusLoader.jsx
import React from "react";
import { motion } from "framer-motion";

export default function BusLoader({ message = "Planning your trip..." }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-sky-100 to-white">
      {/* Animated Bus */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="relative"
      >
        <svg
          width="200"
          height="100"
          viewBox="0 0 200 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bus Body */}
          <rect x="20" y="30" width="160" height="50" rx="10" fill="#f97316" />
          {/* Windows */}
          <rect x="40" y="40" width="30" height="20" fill="white" />
          <rect x="80" y="40" width="30" height="20" fill="white" />
          <rect x="120" y="40" width="30" height="20" fill="white" />
          {/* Wheels */}
          <motion.circle
            cx="50"
            cy="85"
            r="10"
            fill="black"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ originX: "50%", originY: "85%" }}
          />
          <motion.circle
            cx="150"
            cy="85"
            r="10"
            fill="black"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            style={{ originX: "150%", originY: "85%" }}
          />
        </svg>
      </motion.div>

      {/* Loading Message */}
      <p className="mt-6 text-lg font-semibold text-gray-700 animate-pulse">
        {message}
      </p>
    </div>
  );
}
