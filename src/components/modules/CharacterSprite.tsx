import React from 'react';
import { Bot } from 'lucide-react';

interface CharacterSpriteProps {
  moduleId: number;
  platformWidth: number;
  platformSpacing: number;
}

const CharacterSprite: React.FC<CharacterSpriteProps> = ({ 
  moduleId, 
  platformWidth, 
  platformSpacing 
}) => {
  // Calculate position based on module ID
  const xPosition = (moduleId - 1) * (platformWidth + platformSpacing) + platformWidth / 2;

  return (
    <div
      className="absolute z-20 top-1/2"
      style={{
        left: `${xPosition}px`,
        transform: 'translateX(-50%)',
        marginTop: '-140px',
        animation: 'bobble 2.5s ease-in-out infinite',
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Simple character shadow */}
        <div
          className="absolute left-1/2 w-10 h-3 bg-black opacity-15 rounded-full blur"
          style={{ top: 80, transform: 'translateX(-50%)', animation: 'shadow-bobble 2.5s ease-in-out infinite' }}
        ></div>
        {/* Simple round head with animated nod */}
        <div className="w-12 h-12 bg-yellow-200 rounded-full border-2 border-yellow-400 flex flex-col items-center justify-center relative z-10 animate-head-nod">
          {/* Eyes with blink */}
          <div className="flex gap-2 mt-3">
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-eye-blink" />
            <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-eye-blink" />
          </div>
          {/* Smile with subtle wiggle */}
          <div className="w-5 h-1 border-b-2 border-gray-600 rounded-b-full mt-1 animate-smile-wiggle" />
        </div>
        {/* Simple body with slight sway */}
        <div className="w-6 h-10 bg-blue-400 rounded-lg border-2 border-blue-600 flex flex-col items-center justify-center mt-[-6px] animate-body-sway">
          {/* Simple belt */}
          <div className="w-5 h-1 bg-white rounded-full border border-blue-300 mt-1" />
        </div>
        {/* Simple boots */}
        <div className="flex gap-1 mt-1">
          <div className="w-2 h-2 bg-gray-700 rounded-b-lg border border-gray-400 animate-boot-bounce" />
          <div className="w-2 h-2 bg-gray-700 rounded-b-lg border border-gray-400 animate-boot-bounce" />
        </div>
      </div>
      <style>{`
        @keyframes bobble {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-6px); }
        }
        @keyframes shadow-bobble {
          0%, 100% { width: 40px; opacity: 0.15; }
          50% { width: 32px; opacity: 0.22; }
        }
        @keyframes flame-simple {
          0% { opacity: 0.5; height: 8px; }
          50% { opacity: 0.8; height: 16px; }
          100% { opacity: 0.5; height: 8px; }
        }
        .animate-flame-simple {
          animation: flame-simple 0.8s infinite alternate;
        }
        @keyframes head-nod {
          0%, 100% { transform: none; }
          20% { transform: rotate(-4deg); }
          50% { transform: rotate(3deg); }
          80% { transform: rotate(-2deg); }
        }
        .animate-head-nod {
          animation: head-nod 2.5s infinite;
        }
        @keyframes eye-blink {
          0%, 92%, 100% { height: 12px; }
          95% { height: 2px; }
        }
        .animate-eye-blink {
          animation: eye-blink 3.2s infinite;
        }
        @keyframes smile-wiggle {
          0%, 100% { transform: none; }
          50% { transform: scaleX(1.1) rotate(-3deg); }
        }
        .animate-smile-wiggle {
          animation: smile-wiggle 2.8s infinite;
        }
        @keyframes body-sway {
          0%, 100% { transform: none; }
          50% { transform: rotate(2deg); }
        }
        .animate-body-sway {
          animation: body-sway 2.5s infinite;
        }
        @keyframes boot-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(2px); }
        }
        .animate-boot-bounce {
          animation: boot-bounce 2.5s infinite;
        }
      `}</style>
    </div>
  );
};

export default CharacterSprite;