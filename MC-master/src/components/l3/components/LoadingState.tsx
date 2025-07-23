import React from "react";

interface LoadingStateProps {
  loadingProgress?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ loadingProgress }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 gap-4">
      <div className="text-white text-2xl font-bold">
        {loadingProgress ? "Loading saved progress..." : "Loading scenario..."}
      </div>
      <div className="animate-pulse flex gap-2">
        <div className="h-4 w-4 bg-white rounded-full"></div>
        <div className="h-4 w-4 bg-white rounded-full animation-delay-200"></div>
        <div className="h-4 w-4 bg-white rounded-full animation-delay-400"></div>
      </div>
    </div>
  );
};
