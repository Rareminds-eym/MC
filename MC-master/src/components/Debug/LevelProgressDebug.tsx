import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LevelProgressService } from '../../services/levelProgressService';

interface LevelProgressDebugProps {
  moduleId: number;
}

const LevelProgressDebug: React.FC<LevelProgressDebugProps> = ({ moduleId }) => {
  const { user } = useAuth();
  const [progressData, setProgressData] = useState<any>(null);
  const [moduleProgress, setModuleProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const loadProgressData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get raw level progress data
      const { data: rawData, error: rawError } = await LevelProgressService.getLevelProgress(user.id, moduleId);
      
      // Get module progress (with unlock status)
      const { data: moduleData, error: moduleError } = await LevelProgressService.getModuleProgress(user.id, moduleId);
      
      setProgressData({ rawData, rawError });
      setModuleProgress({ moduleData, moduleError });
      
      console.log('Debug: Raw progress data:', rawData);
      console.log('Debug: Module progress data:', moduleData);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await LevelProgressService.resetUserProgress(user.id);
      if (error) {
        setMessage(`Error resetting progress: ${error.message}`);
      } else {
        setMessage('Progress reset successfully');
        await loadProgressData();
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const initializeProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await LevelProgressService.initializeUserProgress(user.id, moduleId);
      if (error) {
        setMessage(`Error initializing progress: ${error.message}`);
      } else {
        setMessage(`Module ${moduleId} initialized with only level 1 unlocked`);
        await loadProgressData();
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testLevelUnlock = async (levelId: number) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await LevelProgressService.isLevelUnlocked(user.id, moduleId, levelId);
      if (error) {
        setMessage(`Error checking level ${levelId}: ${error.message}`);
      } else {
        setMessage(`Level ${levelId} is ${data ? 'UNLOCKED' : 'LOCKED'}`);
      }
    } catch (error) {
      setMessage(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgressData();
  }, [user, moduleId]);

  if (!user) {
    return <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Please log in to debug level progress</div>;
  }

  return (
    <div className="p-6 bg-white border rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Level Progress Debug - Module {moduleId}</h2>
      
      <div className="mb-4 space-x-2">
        <button
          onClick={loadProgressData}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Refresh Data
        </button>
        <button
          onClick={resetProgress}
          disabled={loading}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          Reset All Progress
        </button>
        <button
          onClick={initializeProgress}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Initialize Module {moduleId}
        </button>
      </div>

      <div className="mb-4 space-x-2">
        {[1, 2, 3, 4].map(levelId => (
          <button
            key={levelId}
            onClick={() => testLevelUnlock(levelId)}
            disabled={loading}
            className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Test Level {levelId}
          </button>
        ))}
      </div>

      {message && (
        <div className="mb-4 p-3 bg-gray-100 border rounded">
          <strong>Message:</strong> {message}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          Loading...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Raw Progress Data</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
            {JSON.stringify(progressData, null, 2)}
          </pre>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Module Progress (with unlock status)</h3>
          <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
            {JSON.stringify(moduleProgress, null, 2)}
          </pre>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Expected Behavior</h3>
        <ul className="list-disc list-inside text-sm text-gray-700">
          <li>Level 1 should always be unlocked</li>
          <li>Level 2 should only be unlocked when Level 1 is completed</li>
          <li>Level 3 should only be unlocked when Level 2 is completed</li>
          <li>Level 4 should only be unlocked when Level 3 is completed</li>
        </ul>
      </div>

      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
        <h4 className="font-semibold text-yellow-800">User ID:</h4>
        <code className="text-sm text-yellow-700">{user.id}</code>
      </div>
    </div>
  );
};

export default LevelProgressDebug;
