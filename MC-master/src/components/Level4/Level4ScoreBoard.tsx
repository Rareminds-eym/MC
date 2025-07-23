import React, { useEffect, useState } from 'react';
import { getLevel4UserSummary, Level4UserSummary } from '../../services/level4GameService';
import { useAuth } from '../../contexts/AuthContext';

interface Level4ScoreBoardProps {
  moduleId: number;
}

const Level4ScoreBoard: React.FC<Level4ScoreBoardProps> = ({ moduleId }) => {
  const [summary, setSummary] = useState<Level4UserSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadSummary = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const { data } = await getLevel4UserSummary(user.id, moduleId);
        setSummary(data);
      } catch (error) {
        console.error("Error loading Level 4 summary:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSummary();
  }, [user?.id, moduleId]);

  if (loading) {
    return <div className="animate-pulse p-4 bg-gray-100 rounded-lg">Loading scores...</div>;
  }

  if (!summary) {
    return <div className="p-4 bg-gray-100 rounded-lg">No scores available yet</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 max-w-md">
      <h3 className="text-xl font-bold mb-4 text-blue-700">Your Level 4 Performance</h3>
      
      <div className="mb-4">
        <div className="bg-blue-50 p-3 rounded-md border-l-4 border-blue-500">
          <h4 className="font-semibold text-blue-800">Highest Score</h4>
          <div className="flex justify-between items-center mt-2">
            <span className="text-2xl font-bold text-blue-600">{summary.highest_score}</span>
            <span className="text-sm text-gray-500">
              Time: {summary.best_time}s
            </span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-2 text-gray-700">Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 border-b border-gray-100 last:border-b-0">
            <span className="font-medium">Total Violations: {summary.total_violations}</span>
            <span className="text-sm text-gray-600">Correct Answers: {summary.total_correct_answers}</span>
          </div>
          <div className="flex justify-between items-center p-2 border-b border-gray-100 last:border-b-0">
            <span className="font-medium">Total Questions: {summary.total_questions}</span>
            <span className="text-sm text-gray-600">Completions: {summary.completion_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level4ScoreBoard;
