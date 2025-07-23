export interface Term {
  id: string;
  text: string;
  correctCategory: string;
  currentCategory?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

export interface GameMode {
  id: string;
  title: string;
  description: string;
  moduleId: number;
  type: number;
  categories: Category[];
  terms: Term[];
}

export interface Level2GameData {
  id?: string;
  user_id?: string;
  module_id: string;
  level_number: number;
  game_mode_id: string; // For service layer compatibility (single game mode being played)
  game_mode_ids?: string[]; // Database field (array of all game modes played)
  score: number;
  is_completed: boolean;
  time?: number;
  total_terms: number;
  placed_terms: Term[];
  // Score history arrays to store last 3 scores and times
  score_history?: number[]; // [current_score, previous_score, past_previous_score]
  time_history?: number[]; // [current_time, previous_time, past_previous_time]
  created_at?: string;
  updated_at?: string;
}

export interface Level2GameStats {
  highScore: number;
  totalGamesPlayed: number;
  bestTime: number;
  lastPlayedDate: string;
  perfectGames: number;
  averageScore: number;
}

export interface Level2ScoreHistory {
  current_score?: number;
  previous_score?: number;
  past_previous_score?: number;
  current_time_value?: number;
  previous_time?: number;
  past_previous_time?: number;
}

export interface Level2GameDataWithHistory extends Level2GameData {
  score_history: number[];
  time_history: number[];
}