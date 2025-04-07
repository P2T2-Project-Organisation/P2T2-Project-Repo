import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div>
        <Navbar />
        <main className="container pt-5">
          <Outlet />
        </main>
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;