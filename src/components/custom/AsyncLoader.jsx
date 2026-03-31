import React, { useEffect, useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";

function AsyncLoader({
  title = "Preparing your experience",
  messages = [],
  destination = "",
  className = "",
}) {
  const fallbackMessages = useMemo(
    () => [
      "Planning your trip...",
      "Fetching best places...",
      "Building your itinerary...",
      "Finalizing details...",
    ],
    []
  );
  const messageList = messages.length ? messages : fallbackMessages;
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messageList.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [messageList.length]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-md ${className}`}
    >
      <div className="mx-4 w-full max-w-xl rounded-3xl border border-white/35 bg-white/30 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-2xl border border-white/40 bg-white/40 p-3">
            <LoaderCircle className="h-8 w-8 animate-spin text-slate-700" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
            {!!destination && (
              <p className="text-sm font-medium text-slate-600">{destination}</p>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-white/35 bg-white/45 p-4">
          <p key={currentMessage} className="text-lg font-medium text-slate-700">
            {messageList[currentMessage]}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AsyncLoader;
