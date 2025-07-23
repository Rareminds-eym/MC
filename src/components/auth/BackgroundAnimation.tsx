import React from 'react'

const BackgroundAnimation: React.FC = () => {
  // Generate floating particles with animation similar to SplashScreen
  const particles = Array.from({ length: 20 }).map((_, i) => (
    <div
      key={i}
      className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-70"
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animation: `float-particle ${3 + Math.random() * 2}s ease-in-out infinite`,
        animationDelay: `${Math.random() * 3}s`
      }}
    />
  ));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900"></div>
      
      {/* Animated Geometric Shapes */}
      <div className="absolute inset-0">
        {/* Large floating circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-200 to-blue-300 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-200 to-purple-300 rounded-full opacity-20 animate-float-delayed"></div>
        <div className="absolute bottom-1/4 left-1/3 w-32 h-32 bg-gradient-to-r from-green-200 to-green-300 rounded-full opacity-20 animate-float-slow"></div>
        
        {/* Quality control themed shapes */}
        <div className="absolute top-1/3 right-1/4 w-24 h-24 border-4 border-blue-200 rounded-lg rotate-45 opacity-30 animate-spin-very-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 border-2 border-green-200 rounded-full opacity-40 animate-pulse"></div>
        
        {/* Floating particles */}
        {particles}
      </div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
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
      `}</style>
    </div>
  )
}

export default BackgroundAnimation