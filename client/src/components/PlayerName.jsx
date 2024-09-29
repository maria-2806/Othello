import React, { useState ,useContext} from 'react';
import { MyContext } from '../context/MyProvider';
import { useNavigate } from 'react-router-dom';

const Button = ({ onClick, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`py-3 px-6 text-lg font-bold text-white bg-green-500 rounded-full transition-all duration-300 shadow-md
      ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-600 cursor-pointer'}`}

  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="py-3 px-4 text-base border-2 border-green-500 rounded-full w-full box-border transition-all duration-300 outline-none focus:ring-2 focus:ring-green-400"

  />
);





const PlayerName = ({ onSubmit }) => {
  const [playerName, setPlayerName] = useContext(MyContext);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (playerName.trim()) {
      navigate('/board'); 
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      backgroundImage: `
      linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
      linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #000000 75%),
      linear-gradient(-45deg, transparent 75%, #000000 75%)
    `,
      backgroundSize: '40px 40px',
      backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '350px',
        animation: 'fadeIn 0.5s ease-out',
      }}>
        <h1 className="text-center text-4xl font-bold mb-8 text-gray-800">
          Welcome to Othello
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label htmlFor="playerName" className="block mb-2 text-lg text-gray-700">
              Enter your name:
            </label>
            <Input
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <Button  disabled={!playerName.trim()}>
            Start Game
          </Button>
        </form>
      </div>
    </div>
  );
};

// Add a keyframe animation for the fade-in effect
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

export default PlayerName;