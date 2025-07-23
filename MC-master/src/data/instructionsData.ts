import { LucideIcon, Clock, Trophy, Target, Home, RotateCcw, HelpCircle } from 'lucide-react';

// Types
export interface Level {
  title: string;
  objective: string;
  bloom: string;
  format: string;
  interface: string;
  description: string;
  icon: string;
}

export interface NavbarIcon {
  icon: LucideIcon;
  label: string;
}

export interface GameFeature {
  title: string;
  description: string;
  icon: string;
}

export interface PageContent {
  header: string;
  subtitle: string;
  footerCopyright: string;
  basicLevelsLabel: string;
  advancedLevelsLabel: string;
  showBasicLabel: string;
  showAdvancedLabel: string;
  featuresTitle: string;
}

export interface AnimationConfig {
  container: {
    hidden: { opacity: number };
    visible: {
      opacity: number;
      transition: {
        delayChildren: number;
        staggerChildren: number;
      };
    };
  };
  item: {
    hidden: { y: number; opacity: number };
    visible: {
      y: number;
      opacity: number;
    };
  };
}

// Level data
export const levels: Level[] = [
  {
    title: "Level 1: Memory Challenge",
    objective: "Identify and recall key terms",
    bloom: "Remembering",
    format: "Bingo / Taboo / Flashcard Race",
    interface: "Interactive Games",
    description: "Master essential GMP terminology through engaging memory games. Test your knowledge by matching definitions to terms and completing bingo patterns to advance your learning.",
    icon: "🧠"
  },
  {
    title: "Level 2: Sorting Challenge",
    objective: "Group terms by function",
    bloom: "Understanding",
    format: "Category Matching",
    interface: "Drag & Drop",
    description: "Test your comprehension by organizing terms into their proper categories. Think fast and sort accurately to unlock the next level!",
    icon: "🗂️"
  },
  {
    title: "Level 3: Process Puzzle",
    objective: "Arrange steps in order",
    bloom: "Applying",
    format: "Flow Chart Builder",
    interface: "Jigsaw Puzzle",
    description: "Put processes in motion by arranging steps in the correct sequence. Solve the puzzle to demonstrate you can apply what you've learned.",
    icon: "🧩"
  },
  {
    title: "Level 4: Detective Mode",
    objective: "Spot problems in scenarios",
    bloom: "Analyzing",
    format: "Gap Identification",
    interface: "Document Review",
    description: "Put on your detective hat! Examine scenarios closely to identify what's missing or incorrect. Your sharp eyes will uncover hidden issues.",
    icon: "🔍"
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
    icon: "⚗️"
  },
];

// Level images
export const levelImages: string[] = [
  "/backgrounds/Level1.png",
  "/backgrounds/Level2.png",
  "/backgrounds/Level3.png",
  "/backgrounds/Level4.png",
  "/backgrounds/Level5.png",
  "/backgrounds/Level6.png",
];

// Color arrays for level backgrounds and borders
export const levelColors: string[] = [
  'bg-cyan-700/60', // Level 1 (core)
  'bg-cyan-700/60', // Level 2 (core)
  'bg-cyan-700/60', // Level 3 (core)
  'bg-purple-800/60', // Level 4 (advanced)
  'bg-purple-800/60', // Level 5 (advanced)
  'bg-purple-800/60', // Level 6 (advanced)
];

export const levelBorderColors: string[] = [
  'border-cyan-400', // Level 1 (core)
  'border-cyan-400', // Level 2 (core)
  'border-cyan-400', // Level 3 (core)
  'border-purple-400', // Level 4 (advanced)
  'border-purple-400', // Level 5 (advanced)
  'border-purple-400', // Level 6 (advanced)
];

// Game features
export const gameFeatures: GameFeature[] = [
  {
    title: "Interactive Learning",
    description: "Engage with dynamic content through games, simulations, and interactive exercises",
    icon: "🎮"
  },
  {
    title: "Progressive Difficulty",
    description: "Build knowledge systematically from basic recall to complex problem-solving",
    icon: "📈"
  },
  {
    title: "Real-world Application",
    description: "Practice with authentic pharmaceutical manufacturing scenarios and challenges",
    icon: "🏭"
  },
  {
    title: "Instant Feedback",
    description: "Get immediate guidance and explanations to reinforce learning",
    icon: "💡"
  }
];

// Navbar icons
export const navbarIcons: NavbarIcon[] = [
  { icon: Clock, label: "Time" },
  { icon: Trophy, label: "Score" },
  { icon: Target, label: "Level" },
  { icon: Home, label: "Home" },
  { icon: RotateCcw, label: "Reset" },
  { icon: HelpCircle, label: "Help" }
];

// Page content strings
export const pageContent: PageContent = {
  header: "Game Instructions & Level Overview",
  subtitle: "Learn pharmaceutical quality management through interactive gameplay",
  footerCopyright: "© 2024 RareMinds Technologies. All rights reserved.",
  basicLevelsLabel: "Core Learning Levels (1-3)",
  advancedLevelsLabel: "Advanced Challenge Levels (4-6)",
  showBasicLabel: "Show Core Levels",
  showAdvancedLabel: "Show Advanced Levels",
  featuresTitle: "Game Features"
};

// Animation configuration
export const animationConfig: AnimationConfig = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }
};
