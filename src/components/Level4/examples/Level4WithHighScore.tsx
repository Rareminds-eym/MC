// import React, { useState, useEffect } from 'react';
// import { useLevel4HighScore } from '../hooks/useLevel4HighScore';
// import { VictoryPopup } from '../../ui/Popup';

// /**
//  * Example component showing how to use the Level4 high score system
//  */
// export const Level4WithHighScore: React.FC = () => {
//   const [showVictory, setShowVictory] = useState(false);
//   const [currentScore, setCurrentScore] = useState(0);
//   const [combo, setCombo] = useState(0);
//   const [health, setHealth] = useState(100);
  
//   // Use our custom hook to manage high scores
//   const { highScore, updateScore, resetGame, loading } = useLevel4HighScore();
  
//   const handleGameFinish = (score: number) => {
//     // Set the current score
//     setCurrentScore(score);
    
//     // Update the high score if needed
//     updateScore(score);
    
//     // Show victory popup
//     setShowVictory(true);
//   };
  
//   const handleCloseVictory = () => {
//     setShowVictory(false);
//   };
  
//   const handleResetLevel = () => {
//     // Reset the game state in the database
//     resetGame();
    
//     // Reset local state
//     setCurrentScore(0);
//     setCombo(0);
//     setHealth(100);
    
//     // Close the victory popup
//     setShowVictory(false);
//   };
  
//   return (
//     <div>
//       {/* Game content goes here */}
      
//       {/* Victory popup */}
//       <VictoryPopup
//         open={showVictory}
//         onClose={handleCloseVictory}
//         score={currentScore}
//         combo={combo}
//         health={health}
//         showNext={false}
//         showReset={true}
//         onReset={handleResetLevel}
//       />
//     </div>
//   );
// };
