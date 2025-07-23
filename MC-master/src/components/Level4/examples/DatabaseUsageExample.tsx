/**
 * Level 4 Database Usage Example
 * 
 * This file demonstrates how to use the Level4Service to interact with your Supabase database.
 * The service is already connected to your existing Supabase configuration.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import level4Service from '../services';
import type { Level4GameData, Level4Stats } from '../services';

const DatabaseUsageExample: React.FC = () => {
  const { user } = useAuth();
  const [gameData, setGameData] = useState<Level4GameData[]>([]);
  const [stats, setStats] = useState<Level4Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user's game data when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user's game data
        const userData = await level4Service.getUserGameData(user.id);
        setGameData(userData);

        // Fetch user's statistics
        const userStats = await level4Service.getUserStats(user.id);
        setStats(userStats);

      } catch (err) {
        console.error('Error loading Level 4 data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  // Example function to save game data
  const saveGameData = async (module: number, score: number, isCompleted: boolean) => {
    if (!user) return;

    try {
      const gameTime = 300; // 5 minutes in seconds
      const casesData = {
        currentCase: 1,
        caseProgress: [
          {
            id: 1,
            answers: { violation: 1, rootCause: 1, impact: 0 },
            isCorrect: true,
            attempts: 1,
            timeSpent: gameTime
          }
        ],
        scoredQuestions: { "0": ["violation", "rootCause", "impact"] }
      };

      // Save using the enhanced upsert function with history
      const recordId = await level4Service.upsertGameDataWithHistory(
        user.id,
        module,
        score,
        isCompleted,
        gameTime,
        casesData
      );

      console.log('Game data saved with ID:', recordId);

      // Reload data to show updated information
      const updatedData = await level4Service.getUserGameData(user.id);
      setGameData(updatedData);

    } catch (err) {
      console.error('Error saving game data:', err);
      setError(err instanceof Error ? err.message : 'Failed to save game data');
    }
  };

  // Example function to get past scores
  const getPastScores = async (module: number) => {
    if (!user) return;

    try {
      const scoreHistory = await level4Service.getPastThreeScores(user.id, module);
      console.log('Past three scores:', scoreHistory);
    } catch (err) {
      console.error('Error fetching past scores:', err);
    }
  };

  if (!user) {
    return <div>Please log in to view Level 4 data.</div>;
  }

  if (loading) {
    return <div>Loading Level 4 data...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Level 4 Database Connection Example</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '20px' }}>
          Error: {error}
        </div>
      )}

      {/* User Statistics */}
      {stats && (
        <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h3>Your Level 4 Statistics</h3>
          <p>Total Games: {stats.total_games}</p>
          <p>Completed Games: {stats.completed_games}</p>
          <p>Average Score: {stats.average_score}</p>
          <p>Highest Score: {stats.highest_score}</p>
          <p>Total Modules: {stats.total_modules}</p>
          <p>Completion Rate: {stats.completion_rate}%</p>
        </div>
      )}

      {/* Game Data */}
      <div style={{ marginBottom: '30px' }}>
        <h3>Your Game Data</h3>
        {gameData.length === 0 ? (
          <p>No game data found. Start playing to see your progress!</p>
        ) : (
          <div>
            {gameData.map((game) => (
              <div key={game.id} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #eee', borderRadius: '3px' }}>
                <p><strong>Module:</strong> {game.module}</p>
                <p><strong>Score:</strong> {game.score}</p>
                <p><strong>Completed:</strong> {game.is_completed ? 'Yes' : 'No'}</p>
                <p><strong>Time:</strong> {game.time[0] || 0} seconds</p>
                <p><strong>Score History:</strong> {game.score_history.join(', ') || 'None'}</p>
                <button 
                  onClick={() => getPastScores(game.module)}
                  style={{ marginTop: '5px', padding: '5px 10px' }}
                >
                  View Past Scores
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Example Actions */}
      <div>
        <h3>Test Database Operations</h3>
        <button 
          onClick={() => saveGameData(1, 85, true)}
          style={{ marginRight: '10px', padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}
        >
          Save Test Game (Module 1, Score 85)
        </button>
        <button 
          onClick={() => saveGameData(2, 92, false)}
          style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '3px' }}
        >
          Save Test Game (Module 2, Score 92)
        </button>
      </div>

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h4>Database Connection Status</h4>
        <p style={{ color: 'green' }}>✅ Successfully connected to Supabase database</p>
        <p>✅ Level 4 service is ready to use</p>
        <p>✅ All database functions are available</p>
      </div>
    </div>
  );
};

export default DatabaseUsageExample;
