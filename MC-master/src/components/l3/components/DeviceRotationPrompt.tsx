import React from "react";
import { RotateCcw } from "lucide-react";

export const DeviceRotationPrompt: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="text-center bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-8 max-w-md border-2 border-cyan-400 glow-border">
        <RotateCcw className="w-16 h-16 mx-auto mb-4 text-cyan-400 animate-spin" />
        <h2 className="text-xl font-bold text-white mb-2 game-font">
          ROTATE DEVICE
        </h2>
        <p className="text-cyan-200">
          Switch to landscape mode to begin your mission!
        </p>
      </div>
    </div>
  );
};
