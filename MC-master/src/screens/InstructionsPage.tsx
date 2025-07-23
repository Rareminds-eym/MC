import React, { useState } from "react";
import logo from "../../public/logos/bulb.png";
import { Icon } from '@iconify/react';
import { Lock, Clock, Trophy, Target, Home, RotateCcw, HelpCircle, Hash, Award, Heart, Flame } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDeviceLayout } from '../hooks/useOrientation';

import { useNavigate } from 'react-router-dom';

// Mock images for levels
const levelImages = [
  "/backgrounds/Level1.png",
  "/backgrounds/Level2.png",
  "/backgrounds/Level3.png",
  "/backgrounds/Level4.png",
  "/backgrounds/Level5.png",
  "/backgrounds/Level6.png",
];

const levels = [
  {
    title: "Level 1: Memory Challenge",
    objective: "Identify and recall key terms",
    bloom: "Remembering",
    format: "Bingo / Taboo / Flashcard Race",
    interface: "Interactive Games",
    description: "Master essential GMP terminology through engaging memory games. Test your knowledge by matching definitions to terms and completing bingo patterns to advance your learning.",
    icon: "🧠",
    features: [
      {
        icon: '🎯',
        title: 'Game Objective',
        color: 'blue',
        border: 'border-blue-400',
        text: 'Listen to definitions and click matching terms on your bingo grid to form lines and achieve BINGO!'
      },
      {
        icon: '⏱️',
        title: 'Time Challenge',
        color: 'green',
        border: 'border-green-400',
        text: 'Race against the clock! Complete patterns quickly to earn bonus points and advance faster.'
      },
      {
        icon: '🏆',
        title: 'Scoring System',
        color: 'purple',
        border: 'border-purple-400',
        text: 'Earn points for correct answers and completed lines. Form patterns to unlock higher scores!'
      }
    ],
    controls: [
      { icon: Clock, label: "Timer", tooltip: "Track your remaining time", gradient: "from-blue-400 to-blue-500" },
      { icon: Trophy, label: "Score", tooltip: "Your current points", gradient: "from-amber-400 to-amber-500" },
      { icon: Target, label: "Lines", tooltip: "Completed bingo lines", gradient: "from-green-400 to-emerald-500" },
      { icon: Home, label: "Home", tooltip: "Return to main menu", gradient: "from-blue-400 to-blue-500" },
      { icon: RotateCcw, label: "Restart", tooltip: "Start the game over", gradient: "from-yellow-400 to-yellow-500" },
      { icon: HelpCircle, label: "Tutorial", tooltip: "Show game tutorial", gradient: "from-green-400 to-green-500" }
    ],
    youtube: ""
  },
 {
  title: "Level 2: GMP vs Non-GMP Sort",
  objective: "Understand and classify manufacturing activities",
  bloom: "Understanding",
  format: "Drag-and-Drop Sort",
  interface: "Dual-Zone Sorting Game",
  description: "Strengthen your knowledge of Good Manufacturing Practice by sorting items into GMP and Non-GMP categories. Learn to distinguish what is essential to quality compliance and what is not.",
  icon: "🧩",
  features: [
    {
      icon: '🎯',
      title: 'Game Objective',
      color: 'blue',
      border: 'border-blue-400',
      text: 'Sort items by dragging them into either the GMP or Non-GMP category. Focus on quality-related practices versus unrelated content.'
    },
    {
      icon: '⏱️',
      title: 'Time Challenge',
      color: 'green',
      border: 'border-green-400',
      text: 'Complete the task as quickly as possible! Speed boosts your final score.'
    },
    {
      icon: '🏆',
      title: 'Scoring System',
      color: 'purple',
      border: 'border-purple-400',
      text: '+5 points for each correctly sorted item. Reach the max score by accurately sorting all items.'
    }
  ],
  controls: [
    { icon: Clock, label: "Timer", tooltip: "Track your remaining time", gradient: "from-blue-400 to-blue-500" },
    { icon: Hash, label: "Moves", tooltip: "Total drag-and-drop attempts", gradient: "from-pink-400 to-pink-500" },
    { icon: Trophy, label: "Score", tooltip: "Your current points", gradient: "from-amber-400 to-amber-500" },
    { icon: Award, label: "Total Score", tooltip: "Cumulative score across levels", gradient: "from-purple-400 to-purple-500" },
    { icon: RotateCcw, label: "Restart", tooltip: "Start the game over", gradient: "from-yellow-400 to-yellow-500" },
    { icon: Home, label: "Exit", tooltip: "Return to main menu", gradient: "from-blue-400 to-blue-500" }
  ],
  youtube: ""
}
,
  {
  title: "Level 3: Jigsaw Mission",
  objective: "Diagnose GMP breaches and apply corrective actions",
  bloom: "Applying",
  format: "Puzzle Drag-and-Drop",
  interface: "Cause-and-Effect Strategy",
  description: "Investigate real-world GMP breach scenarios. Drag pieces from your arsenal to resolve violations in the Security Vault and Action Hub. Build strategic thinking by applying GMP knowledge to simulated issues.",
  icon: "🧩",
  features: [
    {
      icon: '🎯',
      title: 'Game Objective',
      color: 'blue',
      border: 'border-blue-400',
      text: 'Analyze the case, then drag appropriate pieces to the correct drop zones (Security Vault / Action Hub) to resolve the GMP issue.'
    },
    {
      icon: '❤️',
      title: 'Health Reduction',
      color: 'red',
      border: 'border-red-400',
      text: 'You start with 100 health. Each wrong attempt reduces your health by 10 points. Stay sharp!'
    },
    {
      icon: '🔥',
      title: 'Combo Bonus',
      color: 'orange',
      border: 'border-orange-400',
      text: 'Get answers right in a row to build your combo. A wrong attempt resets your combo to 0. Aim for accuracy and momentum!'
    }
  ],
  controls: [
    { icon: Clock, label: "Timer", tooltip: "Track your remaining time", gradient: "from-blue-400 to-blue-500" },
    { icon: Heart, label: "Health", tooltip: "Starts at 100, reduces with incorrect attempts", gradient: "from-red-400 to-rose-500" },
    { icon: Flame, label: "Combo", tooltip: "Earned with consecutive correct attempts", gradient: "from-orange-400 to-yellow-500" },
    { icon: Trophy, label: "Score", tooltip: "Your current score for this level", gradient: "from-amber-400 to-amber-500" },
    { icon: RotateCcw, label: "Restart", tooltip: "Retry the mission from the beginning", gradient: "from-yellow-400 to-yellow-500" },
    { icon: Home, label: "Back", tooltip: "Return to level menu", gradient: "from-blue-400 to-blue-500" }
  ],
  youtube: ""
}
,
  {
    title: "Level 4: Detective Mode",
    objective: "Spot problems in scenarios",
    bloom: "Analyzing",
    format: "Gap Identification",
    interface: "Document Review",
    description: "Put on your detective hat! Examine scenarios closely to identify what's missing or incorrect. Your sharp eyes will uncover hidden issues.",
    icon: "�️‍♂️",
    features: [
      {
        icon: '🎯',
        title: 'Game Objective',
        color: 'blue',
        border: 'border-blue-400',
        text: 'Analyze realistic deviation cases and answer questions about root causes, impacts, and potential violations.'
      },
      {
        icon: '⏱️',
        title: 'Time Challenge',
        color: 'green',
        border: 'border-green-400',
        text: 'The timer runs continuously until all cases are completed. Work efficiently to complete all questions within time.'
      },
      {
        icon: '🏆',
        title: 'Scoring System',
        color: 'purple',
        border: 'border-purple-400',
        text: 'Each question is worth 5 points (3 questions per case). Total max score varies by module based on number of scenarios. No points are awarded if an answer is changed after submission.'
      }
    ],
    controls: [
      { icon: Clock, label: "Timer", tooltip: "Track your total level time", gradient: "from-blue-400 to-blue-500" },
      { icon: Trophy, label: "Score", tooltip: "Your current score (Max varies by module)", gradient: "from-amber-400 to-amber-500" },
      // { icon: FileText, label: "Case", tooltip: "Current deviation case number", gradient: "from-purple-400 to-purple-500" },
      { icon: Home, label: "Home", tooltip: "Return to main menu", gradient: "from-blue-400 to-blue-500" }
    ],
    youtube: ""
  },
  {
    title: "Level 5: Design Challenge",
    objective: "Create quality solutions",
    bloom: "Evaluating",
    format: "Process Design",
    interface: "Interactive Builder",
    description: "🔒 LOCKED - Design and evaluate quality systems from scratch. Build comprehensive solutions that meet regulatory standards and optimize manufacturing processes. (Complete previous levels to unlock)",
    icon: "🔒"
  },
  {
    title: "Level 6: Innovation Lab",
    objective: "Develop new methodologies",
    bloom: "Creating",
    format: "Research & Development",
    interface: "Simulation Platform",
    description: "🔒 LOCKED - Push the boundaries of quality management! Create innovative approaches, develop new methodologies, and pioneer the future of manufacturing excellence. (Complete previous levels to unlock)",
    icon: "�"
  },
];

// Color arrays for level backgrounds and borders
const levelColors = [
  'bg-cyan-700/60', // Level 1 (core)
  'bg-cyan-700/60', // Level 2 (core)
  'bg-cyan-700/60', // Level 3 (core)
  'bg-purple-800/60', // Level 4 (advanced)
  'bg-purple-800/60', // Level 5 (advanced, if added)
  'bg-purple-800/60', // Level 6 (advanced, if added)
];
const levelBorderColors = [
  'border-cyan-300', // Level 1 (core)
  'border-cyan-300', // Level 2 (core)
  'border-cyan-300', // Level 3 (core)
  'border-purple-300', // Level 4 (advanced)
  'border-purple-300', // Level 5 (advanced, if added)
  'border-purple-300', // Level 6 (advanced, if added)
];

const InstructionsPage: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { isMobile, isHorizontal } = useDeviceLayout();
  const navigate = useNavigate();
  // Detect mobile (simple check, can be improved)
  // Determine which levels to show
  const visibleLevels = showAdvanced ? levels.slice(3, 6) : levels.slice(0, 3);
  const visibleLevelImages = showAdvanced ? levelImages.slice(3, 6) : levelImages.slice(0, 3);
  // Map selected index to correct level in visibleLevels
  const selectedIdx = showAdvanced ? selected - 3 : selected;
  // Only allow selection of visible levels
  const handleSelect = (i: number) => {
    if (showAdvanced) setSelected(i + 3);
    else setSelected(i);
  };

  // Back Button (top left, always visible)
  const BackButton = (
    <button
      className="fixed top-3 left-[6.5rem] md:left-[6.5rem] sm:left-16 left-16 z-30 flex items-center gap-2 bg-gradient-to-r from-green-400 to-emerald-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-1 px-3 rounded-full shadow-lg backdrop-blur-md border-2 border-emerald-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      onClick={() => navigate(-1)}
      aria-label="Back"
    >
      <Icon icon="mdi:arrow-left" width={18} height={18} />
      <span className="text-xs font-semibold">Back</span>
    </button>
  );

  // Landscape mode for mobile: use same layout as desktop but with smaller text
  if (isMobile && isHorizontal) {
    return (
      <>
        {BackButton}
        <motion.div 
          className="relative min-h-screen w-full text-white overflow-hidden p-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
        {/* Cosmic Planets & Stars Background from ModuleMap */}
        <div className="absolute inset-0 z-0">
          {/* Dark base gradient for space */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800" />
          {/* Large planet */}
          <div
            className="absolute rounded-full opacity-30 blur-md bg-gradient-to-br from-cyan-400 to-blue-600"
            style={{ width: "12rem", height: "12rem", right: "10%", top: "20%", transform: "translate(50%, -50%)" }}
          />
          {/* Smaller celestial body */}
          <div
            className="absolute rounded-full opacity-40 bg-gradient-to-br from-purple-400 to-pink-500"
            style={{ width: "4rem", height: "4rem", left: "15%", top: "15%" }}
          />
          {/* Stars */}
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  opacity: 1,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 2 + 2}s`,
                }}
              />
            ))}
          </div>
          {/* Floating space particles */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-cyan-300 rounded-full opacity-60"
                style={{
                  width: "2px",
                  height: "2px",
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${Math.random() * 15 + 15}s infinite linear`,
                  animationDelay: `${Math.random() * 15}s`,
                }}
              />
            ))}
          </div>
        </div>
        {/* Main Content (above background) */}
        <motion.div 
          className="relative z-10 flex flex-1 w-full pl-2"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Left Vertical Bar - sticky from the very top */}
          <motion.div 
            className="flex flex-col justify-between items-center bg-slate-800/60 w-12 py-2 min-h-screen fixed left-0 top-0 z-20 backdrop-blur-sm" 
            style={{height: '100vh' }}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <img src={logo} alt="Logo" className="w-6 h-6 mb-2" />
            <div className="flex flex-col gap-2 flex-1">
              {visibleLevels.map((_, i) => (
                <motion.button
                  key={i}
                  className={`font-bold text-xs rounded-full px-1 py-1 transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${selectedIdx === i ? 'text-white bg-gradient-to-r from-green-400 to-emerald-600 shadow-lg scale-110' : 'text-white bg-gradient-to-r from-green-400 to-emerald-600 hover:from-blue-700 hover:to-purple-700 opacity-70 hover:opacity-100'}`}
                  onClick={() => handleSelect(i)}
                  aria-label={`Show Level 0${showAdvanced ? i + 4 : i + 1}`}
                  style={{ writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(0deg)', letterSpacing: '0.1em', minHeight: '40px', minWidth: '20px' }}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {`0${showAdvanced ? i + 4 : i + 1}`}
                </motion.button>
              ))}
            </div>
            <button
              className="mt-2 text-white bg-gradient-to-r from-green-400 to-emerald-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all duration-200 p-1 rounded-full"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              <span className="text-xs">{showAdvanced ? "▲" : "▼"}</span>
            </button>
          </motion.div>
          {/* Main Content shifted right to accommodate fixed navbar */}
          <div className="flex-1 ml-12 flex flex-col min-h-screen">
            {/* Header */}
            <motion.h1
              className="relative text-lg font-extrabold text-white drop-shadow-lg text-center tracking-wide select-none mb-2"
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
            >
              <span className="inline-block animate-bounce text-emerald-300 drop-shadow-lg mr-1">
                <Icon icon="mdi:cube-outline" width={20} height={20} />
              </span>
              <span
                className="bg-gradient-to-r from-green-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg shadow-green-200 px-1 rounded-lg border-b-2 border-green-400"
                style={{
                  WebkitTextStroke: '1px #064e3b',
                  filter: 'drop-shadow(0 1px 2px #34d399)'
                }}
              >
                Instructions
              </span>
              <span className="inline-block animate-bounce text-emerald-300 drop-shadow-lg ml-1" style={{ animationDelay: '0.2s' }}>
                <Icon icon="mdi:clipboard-check-outline" width={20} height={20} />
              </span>
              <span className="block text-xs font-semibold text-emerald-200 mt-1 tracking-normal animate-fade-in-slow">
                Embark on your adventure!
              </span>
            </motion.h1>
            {/* Main Content: Horizontal Images + Instructions */}
            <div className="flex flex-row justify-start items-start gap-4 w-full pl-2">
              {/* Horizontal Images Column */}
              <motion.div 
                className="flex flex-col gap-10 items-center mt-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                {visibleLevels.map((level, i) => (
                  <motion.div
                    key={level.title}
                    className={`${selectedIdx === i ? 'w-32 h-20' : 'w-24 h-16'} flex-shrink-0 rounded-lg overflow-hidden shadow-lg border-2 transition-all duration-300 cursor-pointer relative
                      ${levelBorderColors[showAdvanced ? i + 3 : i]} 
                      ${levelColors[showAdvanced ? i + 3 : i]} 
                      ${selectedIdx === i ? 'ring-2 scale-105 z-10 bg-white/10' : 'opacity-50 blur-[1px]'}
                    `}
                    onClick={() => handleSelect(i)}
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + (i * 0.1) }}
                    whileHover={{ scale: selectedIdx === i ? 1.02 : 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={visibleLevelImages[i]}
                      alt={level.title}
                      className="w-full h-full object-cover"
                    />
                    {/* Locked overlay for levels 5 and 6 */}
                    {(showAdvanced && (i === 1 || i === 2)) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-cyan-600 to-emerald-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center backdrop-blur-sm opacity-90">
                        <div className="text-center flex flex-col items-center justify-center">
                          <Lock size={selectedIdx === i ? 20 : 16} className="text-white mb-1 drop-shadow-lg" />
                          <span className={`text-white font-bold drop-shadow-lg ${selectedIdx === i ? 'text-xs' : 'text-[10px]'}`}>LOCKED</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Instructions and Navigation Container */}
              <div className="flex flex-row gap-2 w-full">
                {/* Instructions Container */}
                <motion.div 
                  className="flex-1 bg-white/5 rounded-lg p-3 border-l-2 border-yellow-200/40 shadow-lg backdrop-blur-md mt-1 min-h-[200px]"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  key={selected} // Re-animate when selection changes
                >
                  <h2 className="text-sm font-bold text-yellow-100 mb-1">{levels[selected].title}</h2>
                  <p className="text-[10px] text-slate-100 mb-1">
                    <span className="font-semibold">Bloom:</span> {levels[selected].bloom}
                  </p>
                  <p className="text-[10px] text-slate-200 mb-1">
                    <span className="font-semibold">Objective:</span> {levels[selected].objective}
                  </p>
                  <p className="text-[10px] text-slate-200 italic mb-2">{levels[selected].description}</p>
                  {levels[selected].features && levels[selected].features.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {/* Game Features */}
                      <div className="text-[10px] text-yellow-100 space-y-1">
                        {levels[selected].features.map((feature, idx) => (
                          <div key={feature.title} className={`bg-white/10 rounded-lg p-2 border-l-2 ${feature.border}`}>
                            <span className={`font-bold text-${feature.color}-200`}>{feature.icon} {feature.title}:</span>
                            <p className="text-[10px] mt-1">{feature.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Game Navigation Icons - Vertical on Right */}
                {levels[selected].controls && levels[selected].controls.length > 0 && (
                  <motion.div 
                    className="flex flex-col gap-1 bg-white/5 rounded-lg p-2 border border-white/20 shadow-lg backdrop-blur-md mt-1"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                  >
                    <h3 className="text-[8px] font-bold text-yellow-200 mb-1 text-center">
                      🎮 Controls
                    </h3>
                    <div className="flex flex-col gap-1">
                      {levels[selected].controls.map((item, index) => (
                        <motion.div 
                          key={item.label}
                          className="group relative"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.3, delay: 1.2 + (index * 0.1) }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div className="flex flex-col items-center p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200">
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r ${item.gradient} mb-1`}>
                              <item.icon className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-white font-medium text-[8px] text-center leading-tight">{item.label}</span>
                          </div>
                          <div className="absolute right-full mr-1 top-1/2 transform -translate-y-1/2 bg-black/80 text-white text-[8px] px-1 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                            {item.tooltip}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Footer */}
        <div className="relative text-center">
          <p className="text-[10px] text-slate-300 opacity-75">
            <span className="block">
              © 2025 Rareminds. All rights reserved.
            </span>
          </p>
        </div>
        
        <style>{`
          @keyframes float {
            from { transform: translateY(100vh) rotate(0deg); }
            to { transform: translateY(-100px) rotate(360deg); }
          }
          .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
          .scrollbar-hide::-webkit-scrollbar { display: none; }
        `}</style>
        </motion.div>
      </>
    );
  }

  return (
    <>
      {BackButton}
      <motion.div 
        className="relative min-h-screen w-full text-white overflow-hidden p-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
      {/* Cosmic Planets & Stars Background from ModuleMap */}
      <div className="absolute inset-0 z-0">
        {/* Dark base gradient for space */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-800" />
        {/* Large planet */}
        <div
          className="absolute rounded-full opacity-30 blur-md bg-gradient-to-br from-cyan-400 to-blue-600"
          style={{ width: "24rem", height: "24rem", right: "10%", top: "20%", transform: "translate(50%, -50%)" }}
        />
        {/* Smaller celestial body */}
        <div
          className="absolute rounded-full opacity-40 bg-gradient-to-br from-purple-400 to-pink-500"
          style={{ width: "8rem", height: "8rem", left: "15%", top: "15%" }}
        />
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                opacity: 1,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
              }}
            />
          ))}
        </div>
        {/* Floating space particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-cyan-300 rounded-full opacity-60"
              style={{
                width: "4px",
                height: "4px",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 15 + 15}s infinite linear`,
                animationDelay: `${Math.random() * 15}s`,
              }}
            />
          ))}
        </div>
      </div>
      {/* Main Content (above background) */}
      <motion.div 
        className="relative z-10 flex flex-1 w-full pl-4"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Left Vertical Bar - sticky from the very top */}
        <motion.div 
          className="flex flex-col justify-between items-center bg-slate-800/60 w-20 py-8 min-h-screen fixed left-0 top-0 z-20 backdrop-blur-sm " 
          style={{height: '100vh' }}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}          >
            <img src={logo} alt="Logo" className="w-10 h-10 mb-8" />
            <div className="flex flex-col gap-6 flex-1">
            {visibleLevels.map((_, i) => (
              <motion.button
                key={i}
                className={`font-bold text-lg rounded-full px-2 py-1 transition-all duration-200 flex items-center justify-center transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${selectedIdx === i ? 'text-white bg-gradient-to-r from-green-400 to-emerald-600 shadow-lg scale-110' : 'text-white bg-gradient-to-r from-green-400 to-emerald-600 hover:from-blue-700 hover:to-purple-700 opacity-70 hover:opacity-100'}`}
                onClick={() => handleSelect(i)}
                aria-label={`Show Level 0${showAdvanced ? i + 4 : i + 1}`}
                style={!isMobile ? { writingMode: 'vertical-lr', textOrientation: 'mixed', transform: 'rotate(0deg)', letterSpacing: '0.2em', minHeight: '90px', minWidth: '32px' } : {}}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + (i * 0.1) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {!isMobile ? `LEVEL 0${showAdvanced ? i + 4 : i + 1}` : `0${showAdvanced ? i + 4 : i + 1}`}
              </motion.button>
            ))}
          </div>
          <button
            className="mt-6 text-white bg-gradient-to-r from-green-400 to-emerald-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all duration-200 p-2 rounded-full"
            onClick={() => setShowAdvanced((v) => !v)}
          >
            {showAdvanced ? "▲" : "▼"}
          </button>
        </motion.div>
        {/* Main Content shifted right to accommodate fixed navbar */}
        <div className="flex-1 ml-20 flex flex-col min-h-screen">
          {/* Horizontal Header */}
          <motion.h1
            className={`relative text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg text-center tracking-widest select-none ${
              isMobile ? " text-2xl mb-2" : "mb-10"
            }`}
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.1, type: "spring" }}
          >
            <span className="inline-block animate-bounce text-emerald-300 drop-shadow-lg mr-2">
              <Icon icon="mdi:cube-outline" width={38} height={38} />
            </span>
            <span
              className="bg-gradient-to-r from-green-300 via-emerald-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg shadow-green-200 px-2 rounded-lg border-b-4 border-green-400"
              style={{
                WebkitTextStroke: '2px #064e3b',
                filter: 'drop-shadow(0 2px 4px #34d399)'
              }}
            >
              Instructions
            </span>
            <span className="inline-block animate-bounce text-emerald-300 drop-shadow-lg ml-2" style={{ animationDelay: '0.2s' }}>
              <Icon icon="mdi:clipboard-check-outline" width={38} height={38} />
            </span>
            <span className="block text-base md:text-lg font-semibold text-emerald-200 mt-2 tracking-normal animate-fade-in-slow">
              Embark on your adventure!
            </span>
          </motion.h1>
          {/* Main Content: Vertical Images + Instructions */}
          <div className="flex flex-row justify-start items-start gap-16 w-full pl-8">
            {/* Vertical Images Column */}
            <motion.div 
              className="flex flex-col gap-8 items-center mt-0"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {visibleLevels.map((level, i) => (
                <motion.div
                  key={level.title}
                  className={`${selectedIdx === i ? 'w-88 h-52' : 'w-64 h-40'} flex-shrink-0 rounded-lg overflow-hidden shadow-lg border-2 transition-all duration-300 cursor-pointer relative
                    ${levelBorderColors[showAdvanced ? i + 3 : i]} 
                    ${levelColors[showAdvanced ? i + 3 : i]} 
                    ${selectedIdx === i ? 'ring-4 scale-105 z-10 bg-white/10' : 'opacity-50 blur-[2px]'}
                  `}
                  onClick={() => handleSelect(i)}
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + (i * 0.1) }}
                  whileHover={{ scale: selectedIdx === i ? 1.02 : 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={visibleLevelImages[i]}
                    alt={level.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Locked overlay for levels 5 and 6 */}
                  {(showAdvanced && (i === 1 || i === 2)) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-cyan-600 to-emerald-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center backdrop-blur-sm opacity-90">
                      <div className="text-center flex flex-col items-center justify-center">
                        <Lock size={48} className="text-white mb-2 drop-shadow-lg" />
                        <span className="text-white text-sm font-bold drop-shadow-lg">LOCKED</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
            {/* Single Instructions Container */}
            <motion.div 
              className="max-w-3xl w-full bg-white/5 rounded-lg p-6 border-l-4 border-yellow-200/40 shadow-lg backdrop-blur-md mt-4 min-h-[500px]"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              key={selected} // Re-animate when selection changes
            >
              <h2 className="text-xl font-bold text-yellow-100 mb-1">{levels[selected].title}</h2>
              <p className="text-sm text-slate-100 mb-1">
                <span className="font-semibold">Bloom:</span> {levels[selected].bloom}
              </p>
              <p className="text-sm text-slate-200 mb-2">
                <span className="font-semibold">Objective:</span> {levels[selected].objective}
              </p>
              <p className="text-xs text-slate-200 italic mb-4">{levels[selected].description}</p>
              {levels[selected].features && levels[selected].features.length > 0 && (
                <div className="mt-4 space-y-4">
                  {/* Game Features */}
                  <div className="text-sm text-yellow-100 space-y-3">
                    {levels[selected].features.map((feature, idx) => (
                      <div key={feature.title} className={`bg-white/10 rounded-lg p-4 border-l-4 ${feature.border}`}>
                        <span className={`font-bold text-${feature.color}-200`}>{feature.icon} {feature.title}:</span>
                        <p className="text-sm mt-2">{feature.text}</p>
                      </div>
                    ))}
                  </div>
                  {/* Navbar Icons Section */}
                  {levels[selected].controls && levels[selected].controls.length > 0 && (
                    <div className="mt-6 bg-white/5 rounded-lg p-6 border border-white/20">
                      <h3 className="text-lg font-bold text-yellow-200 mb-4 flex items-center gap-2">
                        <span>🎮</span> Game Controls & Navigation
                      </h3>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {levels[selected].controls.map((item, index) => (
                          <motion.div 
                            key={item.label}
                            className="group relative"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 1.2 + (index * 0.1) }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200">
                              <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${item.gradient}`}>
                                <item.icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-white font-medium">{item.label}</span>
                            </div>
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                              {item.tooltip}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Footer */}
      <div className="relative z-10 text-center mt-8 pb-6">
        <p className="text-sm text-slate-300 opacity-75">
          <span className="block text-xs sm:text-sm">
            © 2025 Rareminds. All rights reserved.
          </span>
        </p>
      </div>
      
      <style>{`
        @keyframes float {
          from { transform: translateY(100vh) rotate(0deg); }
          to { transform: translateY(-100px) rotate(360deg); }
        }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }        `}</style>
      </motion.div>
    </>
  );
};

export default InstructionsPage;
