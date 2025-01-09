import { useTrack } from '../../context/TrackContext';
import { Clock, ChevronRight, Calendar, Users, AlignLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { EditTrack } from './EditTrack';

export function TrackTable() {
  const { tracks, selectTrack, selectedTrack } = useTrack();

  return (
    <div className="space-y-6">
      {/* Track List Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold dark:text-white">Track Schedule</h2>
      </div>

      {/* Track List */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse bg-white dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700">
              <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-left font-medium text-gray-500 dark:text-gray-400">
                Track Name
              </th>
              <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-left font-medium text-gray-500 dark:text-gray-400">
                Schedule
              </th>
              <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-left font-medium text-gray-500 dark:text-gray-400">
                Description
              </th>
              <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-left font-medium text-gray-500 dark:text-gray-400">
                Status
              </th>
              <th className="border-b border-gray-200 dark:border-gray-600 p-4 text-left font-medium text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tracks.map((track) => (
              <tr
                key={track.id}
                className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer ${
                  selectedTrack?.id === track.id
                    ? 'bg-blue-50 dark:bg-blue-900/20'
                    : ''
                }`}
                onClick={() => selectTrack(track.id)}
              >
                <td className="p-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {track.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Track #{track.id.slice(0, 8)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white">
                      {track.startTime} - {track.endTime}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center">
                    <AlignLeft className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-gray-900 dark:text-white line-clamp-2">
                      {track.description || 'No description provided'}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Active
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <EditTrack track={track} />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectTrack(track.id);
                      }}
                    >
                      <ChevronRight className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}