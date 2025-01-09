import { TrackProvider } from './context/TrackContext';
import { TrackTable } from './components/tracks/TrackTable';
import { TrackDetails } from './components/tracks/TrackDetails';
import { CreateTrack } from './components/tracks/CreateTrack';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { Button } from './components/ui/Button';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="absolute top-4 right-40 z-50 bg-white dark:bg-gray-800 transition-colors duration-200"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 transition-transform duration-200 ease-in-out" />
      ) : (
        <Sun className="h-4 w-4 transition-transform duration-200 ease-in-out" />
      )}
    </Button>
  );
}

export default function App() {
  return (
    <TrackProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 antialiased">
        <header className="border-b border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-800 transition-colors duration-200">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
              Sygnific Scheduler
            </h1>
            <CreateTrack />
          </div>
        </header>
        <ThemeToggle />
        <main className="p-6">
          <TrackTable />
        </main>
        <TrackDetails />
      </div>
    </TrackProvider>
  );
}