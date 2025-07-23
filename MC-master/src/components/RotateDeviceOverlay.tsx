import React from 'react';
import { RotateCcw } from 'lucide-react';

export const RotateDeviceOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-blue-900 flex flex-col items-center justify-center z-50 text-white p-8">
      <div className="text-center">
        <RotateCcw className="w-24 h-24 mx-auto mb-6 animate-pulse" />
        <h2 className="text-2xl font-bold mb-4">Please rotate your device</h2>
        <p className="text-lg opacity-90 mb-2">to landscape to continue.</p>
        <p className="text-sm opacity-75">This game is optimized for landscape mode</p>
      </div>
    </div>
  );
};