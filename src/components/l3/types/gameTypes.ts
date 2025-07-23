import { PuzzlePiece } from "../../../data/level3Scenarios";

export interface GameProgress {
  user_id: string;
  module_id: string;
  scenario_index: number;
  score: number;
  health: number;
  combo: number;
  placed_pieces: {
    violations: PuzzlePiece[];
    actions: PuzzlePiece[];
  };
  completed: boolean;
  created_at: string;
}

export interface PlacedPiecesState {
  violations: PuzzlePiece[];
  actions: PuzzlePiece[];
}

export interface GameState {
  score: number;
  health: number;
  combo: number;
  placedPieces: PlacedPiecesState;
  isComplete: boolean;
}
