import React, { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../contexts/AuthContext';
import { Level4Progress } from '../services/level4';

const Level4ScoreBoard: React.FC = () => {
  const [scores, setScores] = useState<Level4Progress[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchScores = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('level_4')
          .select('*')
          .eq('user_id', user.id)
          .eq('module', 1)
          .eq('level', 4)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching scores:', error);
          return;
        }

        setScores(data as Level4Progress[]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, [user]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div className="text-center p-4">Loading scores...</div>;
  }

  if (!scores.length) {
    return <div className="text-center p-4">No scores found. Play Level 4 to see your scores!</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Level 4 Scores</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Score</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id} className={index % 2 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-3 px-4">{score.created_at ? formatDate(score.created_at) : 'N/A'}</td>
                <td className="py-3 px-4 font-semibold">{score.score}</td>
                <td className="py-3 px-4">{formatTime(score.time)}</td>
                <td className="py-3 px-4">
                  {score.is_completed ? (
                    <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs">
                      Completed
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full text-xs">
                      In Progress
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {scores.length > 0 && scores[0].is_completed && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Best Score</h3>
          <div className="flex items-center justify-between mt-2">
            <div>
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-2xl font-bold text-blue-900">{Math.max(...scores.map(s => s.score))}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Best Time</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatTime(Math.min(...scores.filter(s => s.is_completed).map(s => s.time)))}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Level4ScoreBoard;
