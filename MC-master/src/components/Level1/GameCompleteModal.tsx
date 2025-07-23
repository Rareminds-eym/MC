import React, { useEffect, useState } from 'react';
// Format seconds as mm:ss
function formatTime(seconds: number) {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) return '-';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
import { supabase } from '../../lib/supabase';
import { getSortedAttempts } from './Hooks/getSortedAttempts';
import { Trophy, Star, RotateCcw } from 'lucide-react';
import { useDeviceLayout } from '../../hooks/useOrientation';
import { useAuth } from '../../contexts/AuthContext';
import { LevelProgressService } from '../../services/levelProgressService';
import { useLevelProgress } from '../../hooks/useLevelProgress';

type GameCompleteModalProps = {
  isVisible: boolean;
  onPlayAgain: () => Promise<void> | void;
  score: number;
  moduleId?: number;
  levelId?: number;
  isSaving?: boolean; // optional loader prop from hook
};

const GameCompleteModal: React.FC<GameCompleteModalProps> = ({
  isVisible,
  onPlayAgain,
  score,
  moduleId = 1,
  levelId = 1,
  isSaving = false
}) => {
  const { isHorizontal, isMobile } = useDeviceLayout();
  const { user } = useAuth();
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const isMobileLandscape = isMobile && isHorizontal;

  // State for attempt history
  const [attempts, setAttempts] = useState<{score: number, timer: number, attempt: number}[]>([]);

  // Fetch score/timer history when modal is shown
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isVisible || !user) return;
      const { data, error } = await supabase
        .from('level_1')
        .select('score_history, timer_history')
        .eq('user_id', user.id)
        .eq('module_number', moduleId)
        .eq('level_number', levelId)
        .order('game_start_time', { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        const { score_history, timer_history } = data[0];
        setAttempts(getSortedAttempts(score_history || [], timer_history || []));
      } else {
        setAttempts([]);
      }
    };
    fetchHistory();
  }, [isVisible, user, moduleId, levelId]);

  // Use level progress hook to refresh progress after completion
  const { refreshProgress } = useLevelProgress(moduleId);

  // Update level progress when modal becomes visible
  useEffect(() => {
    const updateLevelProgress = async () => {
      if (!isVisible || !user || isUpdatingProgress) return;

      setIsUpdatingProgress(true);
      try {
        const { error } = await LevelProgressService.completeLevel(
          user.id,
          moduleId,
          levelId
        );

        if (error) {
          console.error('Failed to update level progress:', error);
        } else {
          console.log(`Level ${levelId} of Module ${moduleId} marked as completed`);
          // Refresh the level progress to update UI with newly unlocked levels
          await refreshProgress();
        }
      } catch (error) {
        console.error('Error updating level progress:', error);
      } finally {
        setIsUpdatingProgress(false);
      }
    };

    updateLevelProgress();
  }, [isVisible, user, moduleId, levelId, isUpdatingProgress, refreshProgress]);



  // Find the best attempt: highest score, then least time
  // If multiple attempts have the same highest score, pick the one with the least time
  let bestAttempt = null;
  if (attempts.length > 0) {
    const maxScore = Math.max(...attempts.map(a => a.score));
    const bestAttempts = attempts.filter(a => a.score === maxScore);
    bestAttempt = bestAttempts.reduce((min, curr) => curr.timer < min.timer ? curr : min, bestAttempts[0]);
  }

  // Feedback message based on best attempt's time
  const getTimeFeedback = (timer: number) => {
    if (timer <= 100) return { message: "Unbelievable speed!", color: "text-yellow-300" };
    if (timer <= 160) return { message: "Lightning fast!", color: "text-green-300" };
    if (timer <= 140) return { message: "Great pace!", color: "text-blue-300" };
    if (timer <= 180) return { message: "Solid effort!", color: "text-purple-300" };
    return { message: "Keep practicing for a faster time!", color: "text-orange-300" };
  };

  const [saving, setSaving] = useState(false);
  if (!isVisible) return null;

  // Score history block styled like Level2 ResultsModal
  const renderScoreHistory = () => {
    if (!attempts || attempts.length === 0) return null;
    // Sort attempts: highest score first, then least time
    const sortedAttempts = [...attempts].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timer - b.timer;
    });
    // Always show up to 3 attempts (pad with empty if less)
    const displayAttempts = sortedAttempts.slice(0, 3);
    return (
      <div className="mt-3 p-2 bg-gray-900 bg-opacity-50 pixel-border">
        <div className="text-gray-400 text-xs font-bold mb-2 pixel-text">SCORE HISTORY</div>
        <div className="space-y-1">
          {displayAttempts.map((a, index) => {
            const isHighScore = index === 0;
            return (
              <div
                key={index}
                className={`flex items-center justify-between text-xs pixel-text ${isHighScore ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                <div className="flex items-center space-x-2">
                  <Star className="w-3 h-3" />
                  <span>{isHighScore ? 'High Score' : `PREV ${index}`}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold">{a.score}</span>
                  <span>{formatTime(a.timer)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Confetti effect (keep from previous modal)
  useEffect(() => {
    if (isVisible) {
      import('canvas-confetti').then(confetti => {
        confetti.default({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        });
      });
    }
  }, [isVisible]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-2 z-50">
      <div className={`pixel-border-thick bg-gray-800 relative overflow-hidden ${isMobileLandscape ? 'w-4/5 max-w-xs p-2 max-h-screen h-auto overflow-y-auto' : 'p-6 max-w-md w-full'}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-pixel-pattern opacity-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-scan-lines opacity-20 pointer-events-none"></div>
        <div className={`relative z-10 text-center h-full ${isMobileLandscape ? 'flex flex-col justify-between' : ''}`}> 
          {/* Mission Status */}
          <div className={isMobileLandscape ? 'flex-shrink-0 mb-1' : 'mb-4'}>
            <div className="text-gray-400 text-xs font-bold mb-1 pixel-text">MISSION STATUS</div>
            <div className={`font-black pixel-text ${isMobileLandscape ? 'text-lg' : 'text-2xl'} ${bestAttempt ? getTimeFeedback(bestAttempt.timer).color : 'text-yellow-300'} mb-2 flex items-center justify-center gap-2`}>
              <span className="relative inline-block">
                <span
                  className={`absolute inset-0 z-0 ${isMobileLandscape ? 'w-10 h-10' : 'w-14 h-14'} bg-yellow-400 animate-pulse opacity-30`}
                  style={{
                    boxShadow: '0 0 24px 8px #FFD700, 0 0 40px 16px #FFD700',
                    borderRadius: '0.5rem',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                ></span>
                <span
                  className={`relative z-10 flex items-center justify-center ${isMobileLandscape ? 'w-10 h-10' : 'w-14 h-14'} bg-yellow-500`} 
                  style={{
                    borderRadius: '0.5rem',
                    boxShadow: '0 0 16px 4px #FFD700',
                  }}
                >
                  <Trophy className={`${isMobileLandscape ? 'w-6 h-6' : 'w-8 h-8'} text-yellow-100 animate-bounce`} />
                </span>
              </span>
              <span>{bestAttempt ? getTimeFeedback(bestAttempt.timer).message : 'Complete!'}</span>
            </div>
          </div>
          {/* Score Display */}
          <div className={isMobileLandscape ? 'flex-1 flex items-center justify-center' : 'mb-4'}>
            <div className={isMobileLandscape ? 'w-full flex flex-col items-center justify-center mb-3' : 'flex flex-col items-center'}>
              <div className={isMobileLandscape ? 'text-center mt-2' : 'mt-2 text-center'}>
                <div className={isMobileLandscape ? 'text-2xl font-black text-yellow-400 pixel-text' : 'text-4xl font-black text-yellow-400 mb-1 pixel-text'}>
                  {bestAttempt ? bestAttempt.score : score} Points
                </div>
                <div className={isMobileLandscape ? 'text-xs text-cyan-300 font-black pixel-text' : 'text-xl text-cyan-300 font-black pixel-text'}>
                  {bestAttempt ? `Best Time: ${formatTime(bestAttempt.timer)}` : "You've completed all 24 terms!"}
                </div>
              </div>
              {/* Score History */}
              {renderScoreHistory()}
            </div>
          </div>
          {/* Action Buttons */}
          <div className={`flex flex-col gap-2 items-center w-full mt-4`}>
            <button
              onClick={async () => {
                setSaving(true);
                await onPlayAgain();
                setSaving(false);
              }}
              disabled={saving || isSaving}
              className={`w-full pixel-border-thick bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-700 text-white font-black ${isMobileLandscape ? 'py-2 text-xs' : 'py-3 text-base'} pixel-text transition-all duration-300 hover:scale-105 ${saving || isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-center gap-2">
                <RotateCcw className={`${isMobileLandscape ? 'w-3 h-3' : 'w-5 h-5'}`} />
                <span>Play Again</span>
              </div>
            </button>
            <button
              onClick={() => window.location.href = '/level2'}
              className={`w-full pixel-border-thick bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-black ${isMobileLandscape ? 'py-2 text-xs' : 'py-3 text-base'} pixel-text transition-all duration-300 hover:scale-105`}
            >
              <span>Continue to Level 2</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCompleteModal;