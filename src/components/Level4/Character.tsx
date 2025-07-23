import React from 'react';

interface CharacterProps {
  type: 'player' | 'npc' | 'investigator';
  position: { x: number; y: number };
  isActive?: boolean;
  onClick?: () => void;
}

const Character: React.FC<CharacterProps> = ({ type, position, isActive = false, onClick }) => {
  const getCharacterSprite = () => {
    switch (type) {
      case 'player':
        return '🧑‍🔬';
      case 'npc':
        return '👨‍💼';
      case 'investigator':
        return '🕵️‍♂️';
      default:
        return '❓';
    }
  };

  const getCharacterName = () => {
    switch (type) {
      case 'player':
        return 'Lab Scientist';
      case 'npc':
        return 'Quality Manager';
      case 'investigator':
        return 'Compliance Officer';
      default:
        return 'Unknown';
    }
  };

  return (
    <div 
      className={`character ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        position: 'absolute',
        left: position.x * 60,
        top: position.y * 60,
        width: 60,
        height: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        transform: isActive ? 'scale(1.1)' : 'scale(1)',
        filter: isActive ? 'drop-shadow(0 0 10px #3b82f6)' : 'none'
      }}
    >
      <div className="sprite">{getCharacterSprite()}</div>
      {isActive && (
        <div 
          className="character-name"
          style={{
            fontSize: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '2px 4px',
            borderRadius: '4px',
            marginTop: '2px',
            whiteSpace: 'nowrap'
          }}
        >
          {getCharacterName()}
        </div>
      )}
    </div>
  );
};

export default Character;
