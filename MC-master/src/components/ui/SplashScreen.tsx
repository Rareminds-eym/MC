import React, { useEffect, useState } from 'react';
import {Sparkles, CheckCircle, Target } from 'lucide-react';
import { useDeviceLayout } from '../../hooks/useOrientation';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const layout = useDeviceLayout(); // Add device layout

  useEffect(() => {
    // Play splash sound
    playSplashSound();

    // Animation sequence
    const sequence = [
      { delay: 500, action: () => setShowLogo(true) },
      { delay: 1000, action: () => setShowParticles(true) },
      { delay: 1500, action: () => setShowTagline(true) },
      { delay: 2000, action: () => startLoading() }
    ];

    sequence.forEach(({ delay, action }) => {
      setTimeout(action, delay);
    });

    // Auto-complete after 5 seconds
    const autoComplete = setTimeout(() => {
      handleComplete();
    }, 9000);

    return () => clearTimeout(autoComplete);
  }, []);

  const playSplashSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a pleasant welcome chime sequence
      const notes = [
        { frequency: 523.25, duration: 0.3, delay: 0 },    // C5
        { frequency: 659.25, duration: 0.3, delay: 200 },  // E5
        { frequency: 783.99, duration: 0.4, delay: 400 },  // G5
        { frequency: 1046.5, duration: 0.6, delay: 600 }   // C6
      ];

      notes.forEach(({ frequency, duration, delay }) => {
        setTimeout(() => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);

          oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        }, delay);
      });
    } catch (error) {
      console.warn('Audio not supported:', error);
    }
  };

  const startLoading = () => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 150);
  };

  const handleComplete = () => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  // Generate floating particles
  const particles = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      className={`absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-70`}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float-particle ${3 + Math.random() * 2}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 3}s`
      }}
    />
  ));

  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-br from-gray-950 via-slate-950 to-black flex items-center justify-center transition-all duration-800 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100 scale-100'} ${layout.isMobile && layout.isHorizontal ? 'px-2 py-2' : ''}`}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* Floating Particles */}
      {showParticles && (
        <div className="absolute inset-0 overflow-hidden">
          {particles}
        </div>
      )}

      {/* Main Content - Responsive for landscape */}
      <div className={`relative z-10 flex ${layout.isMobile && layout.isHorizontal ? 'flex-row items-center justify-between w-full max-w-3xl px-2' : 'flex-col text-center px-8'}`}>
        {/* Logo and Tagline */}
        <div className={`${layout.isMobile && layout.isHorizontal ? 'flex-1 flex flex-col items-center justify-center' : ''}`}>
          {/* Company Logo */}
          <div className={`mb-8 transition-all duration-1000 ${showLogo ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-90'}`}
            style={layout.isMobile && layout.isHorizontal ? { marginBottom: 0 } : {}}>
            <div className="relative inline-block">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              {/* Logo Container */}
              <div className="relative bg-gradient-to-br from-white to-gray-100 p-2 rounded-full shadow-2xl">
                <div className="flex items-center justify-center space-x-3">
                  <div className="text-left">
                    <img src="/logos/RareMinds.png" alt="Company Logo" className={`${layout.isMobile && layout.isHorizontal ? 'h-16 w-36' : 'h-28 w-72'} rounded-xs shadow-lg py-4`} />
                  </div>
                </div>
              </div>
              {/* Orbiting Icons */}
              <div className="absolute inset-0 animate-spin-slow">
                <CheckCircle className="absolute -top-2 left-1/2 transform -translate-x-1/2 h-6 w-6 text-green-400" />
                <Target className="absolute top-1/2 -right-2 transform -translate-y-1/2 h-6 w-6 text-blue-400" />
                <Sparkles className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>
          {/* Tagline */}
          <div className={`mb-8 transition-all duration-1000 delay-500 ${showTagline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${layout.isMobile && layout.isHorizontal ? 'mb-2' : 'mb-16'}`}>
            <h2 className={`${layout.isMobile && layout.isHorizontal ? 'text-lg' : 'text-2xl md:text-3xl'} font-bold text-white mb-2`}>
              Master the Standards
            </h2>
            <p className={`${layout.isMobile && layout.isHorizontal ? 'text-base' : 'text-lg md:text-xl'} text-blue-300 font-light`}>
              Play the Practice
            </p>
            <div className="mt-4 w-16 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto rounded-full"></div>
          </div>
        </div>
        {/* Loading Indicator and Character for landscape */}
        <div className={`${layout.isMobile && layout.isHorizontal ? 'flex-1 flex flex-col items-center justify-center' : ''}`}>
          <div className={`transition-all duration-500 ${loadingProgress > 0 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-8">
              <div className={`${layout.isMobile && layout.isHorizontal ? 'w-40' : 'w-64'} h-2 bg-gray-800 rounded-full mx-auto overflow-hidden`}>
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                ></div>
              </div>
            </div>
            <p className="text-blue-300 text-sm">
              {loadingProgress < 100 ? 'Loading Experience...' : 'Ready to Play!'}
            </p>
          </div>
          {/* Character image for landscape */}
          {layout.isMobile && layout.isHorizontal && (
            <img src="/characters/intern.png" alt="Scientist Character" className="h-[120px] mt-4" />
          )}
        </div>
        {/* Skip Button */}
        <button
          onClick={handleComplete}
          className={`${layout.isMobile && layout.isHorizontal ? 'absolute bottom-4 right-4' : 'absolute bottom-8 right-2'} text-gray-500 hover:text-gray-300 transition-colors duration-200 text-sm`}
        >
          Skip →
        </button>
      </div>
      {/* Custom Styles */}
      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 1;
          }
        }
        
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;