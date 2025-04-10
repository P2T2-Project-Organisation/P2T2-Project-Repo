import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        zIndex: 1000,
        padding: '10px',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        border: 'none',
        cursor: 'pointer',
        backgroundColor: isDarkMode ? '#333' : '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      }}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
