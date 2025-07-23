import { useState, useEffect } from 'react';
import { GameBoard2D } from '../../components/Level4/GameBoard2D';
import Level4LoadingScreen from '../../components/Level4/Level4LoadingScreen';

const Level4 = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // You can add any initialization logic here if needed
    // Simulate loading time for resources, data fetching, etc.
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds minimum loading time

    return () => clearTimeout(loadingTimer);
  }, []);

  if (isLoading) {
    return <Level4LoadingScreen onComplete={() => setIsLoading(false)} />;
  }

  return <GameBoard2D />;
};

export default Level4;
