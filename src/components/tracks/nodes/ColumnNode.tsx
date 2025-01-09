import { Handle, Position } from 'reactflow';
import { Clock, Plus } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useTrack } from '../../../context/TrackContext';

interface ColumnNodeProps {
  data: {
    id: string;
    label: string;
    startTime: string;
    endTime: string;
    type: string;
  };
}

export function ColumnNode({ data }: ColumnNodeProps) {
  const { 
    setSelectedColumnId, 
    setIsSubColumnModalOpen,
    setSelectedParentId 
  } = useTrack();

  const handleAddSubSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedColumnId(data.id);
    setSelectedParentId(data.id);
    setIsSubColumnModalOpen(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4 min-w-[600px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">{data.label}</h3>
            <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-1" />
              {data.startTime} - {data.endTime}
              <span className="mx-2">•</span>
              <span className="capitalize">{data.type}</span>
            </div>
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleAddSubSection}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Sub-section
          </Button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50">
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Time</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Speaker</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Notes</th>
            </tr>
          </thead>
        </table>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-blue-500" />
    </div>
  );
} 