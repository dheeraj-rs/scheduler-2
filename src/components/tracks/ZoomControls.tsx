import { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';
import { Button } from '../ui/Button';
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch';

interface ZoomControlsProps {
  transformRef: ReactZoomPanPinchRef;
}

export function ZoomControls({ transformRef }: ZoomControlsProps) {
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' && !isPanning) {
        setIsPanning(true);
        document.body.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ' && isPanning) {
        setIsPanning(false);
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPanning]);

  const handleZoomIn = () => {
    transformRef.zoomIn(0.2);
    setScale(transformRef.state.scale);
  };

  const handleZoomOut = () => {
    transformRef.zoomOut(0.2);
    setScale(transformRef.state.scale);
  };

  const handleReset = () => {
    transformRef.resetTransform();
    setScale(1);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2">
        <div className="px-2 text-sm text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
          {Math.round(scale * 100)}%
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomOut}
          className="hover:bg-gray-100 dark:hover:bg-gray-700/50"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleZoomIn}
          className="hover:bg-gray-100 dark:hover:bg-gray-700/50"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleReset}
          className="hover:bg-gray-100 dark:hover:bg-gray-700/50"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <div 
          className={`px-2 flex items-center space-x-1 text-sm ${
            isPanning ? 'text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          <Move className="h-4 w-4" />
          <span className="hidden sm:inline">Space + Drag</span>
        </div>
      </div>
    </div>
  );
} 