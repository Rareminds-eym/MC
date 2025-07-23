import React from "react";
import { Icon } from "@iconify/react";
import { X } from "lucide-react";

interface FeedbackConsoleProps {
  feedback: string;
  setFeedback: (feedback: string) => void;
  isMobile: boolean;
  isHorizontal: boolean;
}

export const FeedbackConsole: React.FC<FeedbackConsoleProps> = ({ 
  feedback, 
  setFeedback,
  isMobile,
  isHorizontal
}) => {
  if (!feedback) return null;

  return (
    <div
      className={`fixed bottom-5 right-5 z-[9999] flex justify-end w-auto pointer-events-none ${
        isMobile && isHorizontal ? "mobile-feedback" : ""
      }`}
    >
      <div
        className={`flex items-center gap-4 px-6 py-4 rounded-3xl shadow-2xl border-2 max-w-xl w-full sm:w-auto
          text-base md:text-lg font-extrabold game-font tracking-wide
          pointer-events-auto backdrop-blur-lg bg-opacity-90
          ${
            feedback.includes("🎯") || feedback.includes("🎉")
              ? "bg-gradient-to-br from-green-700 via-emerald-600 to-cyan-700 text-green-100 border-green-300/80"
              : "bg-gradient-to-br from-red-700 via-pink-700 to-yellow-700 text-yellow-100 border-yellow-300/80 shake"
          }
          ${isMobile && isHorizontal ? " text-xs px-2 py-2 max-w-xs" : ""}`}
        style={{
          letterSpacing: "0.04em",
          boxShadow: "0 8px 40px 0 rgba(0, 255, 255, 0.15), 0 2px 12px 0 rgba(0, 0, 0, 0.18)",
          ...(isMobile && isHorizontal
            ? {
                fontSize: "0.85rem",
                padding: "0.5rem 0.75rem",
                maxWidth: "18rem",
              }
            : {}),
        }}
        role="status"
        aria-live="polite"
      >
        <div className="relative flex items-center gap-4 w-full">
          {/* Icon with animated effects */}
          <span
            className={`text-4xl relative flex items-center justify-center${
              isMobile && isHorizontal ? " text-2xl" : ""
            }`}
          >
            <span className="relative z-10 flex items-center justify-center">
              <span
                className="absolute left-0 top-0 w-full h-full animate-shine pointer-events-none"
                style={{
                  background: "linear-gradient(120deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)",
                  borderRadius: "9999px",
                }}
              ></span>
              <span className="relative animate-pop-scale">
                {feedback.includes("🎯") ? (
                  <Icon
                    icon="mdi:gamepad-variant"
                    className={`text-green-300 drop-shadow-glow${
                      isMobile && isHorizontal ? " text-2xl" : ""
                    }`}
                    style={{
                      filter: "drop-shadow(0 0 8px #34d399) drop-shadow(0 0 16px #22d3ee)",
                    }}
                  />
                ) : feedback.includes("🎉") ? (
                  <Icon
                    icon="mdi:crown"
                    className={`text-yellow-300 drop-shadow-glow${
                      isMobile && isHorizontal ? " text-2xl" : ""
                    }`}
                    style={{
                      filter: "drop-shadow(0 0 8px #fde68a) drop-shadow(0 0 16px #06b6d4)",
                    }}
                  />
                ) : feedback.includes("⚠️") ? (
                  <Icon
                    icon="mdi:alert-octagon"
                    className={`text-yellow-400 drop-shadow-glow${
                      isMobile && isHorizontal ? " text-2xl" : ""
                    }`}
                    style={{
                      filter: "drop-shadow(0 0 8px #facc15) drop-shadow(0 0 16px #f472b6)",
                    }}
                  />
                ) : (
                  <Icon
                    icon="mdi:close-octagon"
                    className={`text-red-400 drop-shadow-glow${
                      isMobile && isHorizontal ? " text-2xl" : ""
                    }`}
                    style={{
                      filter: "drop-shadow(0 0 8px #f87171) drop-shadow(0 0 16px #06b6d4)",
                    }}
                  />
                )}
              </span>
            </span>

            {/* Decorative sparkles */}
            <span className={`absolute left-1 top-1 animate-bounce text-yellow-200 text-xs select-none pointer-events-none${isMobile && isHorizontal ? " text-[0.7rem]" : ""}`}>✦</span>
            <span className={`absolute right-1 bottom-1 animate-bounce-slow text-cyan-200 text-sm select-none pointer-events-none${isMobile && isHorizontal ? " text-xs" : ""}`}>✧</span>
            <span className={`absolute -left-2 -top-2 animate-float text-pink-300 text-lg select-none pointer-events-none${isMobile && isHorizontal ? " text-base" : ""}`}>★</span>
            <span className={`absolute -right-2 -bottom-2 animate-float-slow text-blue-200 text-base select-none pointer-events-none${isMobile && isHorizontal ? " text-xs" : ""}`}>✪</span>
          </span>

          {/* Feedback message text */}
          <span
            className={`flex-1 text-center px-2 leading-tight select-text font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-white to-cyan-100 drop-shadow-glow animate-gradient-move${
              isMobile && isHorizontal ? " text-xs" : ""
            }`}
          >
            {feedback.replace(/^[^\w\d]+\s*/, "")}
          </span>

          {/* Dismiss button */}
          <button
            className={`ml-2 p-2 rounded-full bg-gradient-to-br from-cyan-700 via-blue-700 to-teal-600 hover:from-cyan-500 hover:to-teal-400 transition-colors border-2 border-cyan-300/60 text-white focus:outline-none shadow-lg active:scale-95 animate-pop${
              isMobile && isHorizontal ? " p-1" : ""
            }`}
            onClick={() => setFeedback("")}
            aria-label="Dismiss feedback"
          >
            <X
              className={`w-5 h-5${
                isMobile && isHorizontal ? " w-4 h-4" : ""
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
