import { Clock } from 'lucide-react';
import type { Track } from '../../types';
import { useTrack } from '../../context/TrackContext';

interface TrackCardProps {
  track: Track;
}

export function TrackCard({ track }: TrackCardProps) {
  const { selectTrack, selectedTrack } = useTrack();
  const isSelected = selectedTrack?.id === track.id;

  return (
    <button
      onClick={() => selectTrack(track.id)}
      className={`w-full rounded-lg border p-4 text-left transition-colors ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/20'
          : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-500'
      }`}
    >
      <h3 className="text-lg font-semibold dark:text-white">{track.name}</h3>
      <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-300">
        <Clock className="mr-2 h-4 w-4" />
        <span>
          {track.startTime} - {track.endTime}
        </span>
      </div>
      {track.description && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {track.description}
        </p>
      )}
    </button>
  );
}