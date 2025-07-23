
import React, { Suspense, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentModule } from "../../store/slices/gameSlice";
const JigsawBoard = React.lazy(() =>
  import("../../components/l3/JigsawBoard").then((mod) => ({ default: mod.JigsawBoard }))
);

const Level3 = () => {
  const { moduleId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if (moduleId) {
      const idNum = Number(moduleId);
      if (!isNaN(idNum)) {
        dispatch(setCurrentModule({ id: idNum }));
      }
    }
  }, [moduleId, dispatch]);
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
          {/* Animated SVG or Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none select-none">
            <svg width="180" height="180" viewBox="0 0 100 100" className="animate-spin-slow">
              <circle cx="50" cy="50" r="40" stroke="#22d3ee" strokeWidth="8" fill="none" strokeDasharray="62.8 62.8" strokeLinecap="round"/>
              <circle cx="50" cy="50" r="28" stroke="#fde68a" strokeWidth="4" fill="none" strokeDasharray="44 44" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="z-10 flex flex-col items-center gap-4">
            <div className="text-4xl md:text-5xl font-extrabold text-cyan-200 drop-shadow-glow animate-gradient-move game-font tracking-widest text-center">
              LEVEL 3
            </div>
            <div className="text-lg md:text-2xl font-bold text-yellow-200 animate-pulse text-center">
              Initializing Mission...
            </div>
            <div className="flex items-center gap-2 mt-2">
              {/* Jigsaw: bounce */}
              <Icon
                icon="mdi:jigsaw-outline"
                className="text-cyan-300 text-3xl md:text-4xl drop-shadow-glow animate-bounce"
                style={{ animationDelay: '0s' }}
              />
              {/* Account-tie: bounce */}
              <Icon
                icon="mdi:account-tie-outline"
                className="text-yellow-300 text-3xl md:text-4xl drop-shadow-glow animate-bounce"
                style={{ animationDelay: '0.2s' }}
              />
              {/* Lightning: bounce */}
              <Icon
                icon="mdi:lightning-bolt-outline"
                className="text-pink-300 text-3xl md:text-4xl drop-shadow-glow animate-bounce"
                style={{ animationDelay: '0.3s' }}
              />
            </div>
            <div className="mt-4 text-cyan-100 text-sm opacity-80 text-center">
              Loading Jigsaw Board. Please wait...
            </div>
          </div>
        </div>
      }
    >
      <JigsawBoard />
    </Suspense>
  );
};

export default Level3;
