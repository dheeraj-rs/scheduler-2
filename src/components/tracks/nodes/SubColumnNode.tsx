import { Handle, Position } from 'reactflow';
import { AlignLeft, Users, Plus, ChevronRight } from 'lucide-react';
import { Button } from '../../ui/Button';
import { useTrack } from '../../../context/TrackContext';

interface SubColumnNodeProps {
  data: {
    id: string;
    label: string;
    speaker?: string;
    duration: number;
    notes?: string;
    depth: number;
    startTime?: string;
    hasChildren: boolean;
  };
}

export function SubColumnNode({ data }: SubColumnNodeProps) {
  const { 
    setSelectedParentId, 
    setIsSubColumnModalOpen,
    selectedParentId,
    addSubColumn
  } = useTrack();

  const getColorsByDepth = (depth: number) => ({
    bg: depth === 0 ? 'bg-blue-50/30 dark:bg-blue-900/10' :
        depth === 1 ? 'bg-purple-50/30 dark:bg-purple-900/10' :
        depth === 2 ? 'bg-pink-50/30 dark:bg-pink-900/10' :
        'bg-gray-50/30 dark:bg-gray-900/10',
    hover: depth === 0 ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20' :
           depth === 1 ? 'hover:bg-purple-50 dark:hover:bg-purple-900/20' :
           depth === 2 ? 'hover:bg-pink-50 dark:hover:bg-pink-900/20' :
           'hover:bg-gray-50 dark:hover:bg-gray-800/20',
    text: depth === 0 ? 'text-blue-400' :
          depth === 1 ? 'text-purple-400' :
          depth === 2 ? 'text-pink-400' :
          'text-gray-400'
  });

  const colors = getColorsByDepth(data.depth || 0);

  const handleAddSubSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedParentId(data.id);
    setIsSubColumnModalOpen(true);
  };

  return (
    <div className={`group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 min-w-[600px] ${
      data.hasChildren ? 'mb-4' : ''
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="p-2">
        <table className="min-w-full">
          <tbody>
            <tr className={`group ${colors.hover}`}>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 w-24">
                {data.startTime}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center">
                  <div style={{ width: `${data.depth * 24}px` }} className="flex-shrink-0" />
                  <div className={`flex items-center p-2 rounded-md w-full ${colors.bg}`}>
                    <ChevronRight className={`h-4 w-4 mr-2 ${colors.text}`} />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {data.label}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">({data.duration} min)</span>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                {data.speaker && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    {data.speaker}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-between">
                  {data.notes && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-md p-2">
                      <AlignLeft className="h-4 w-4 mr-2" />
                      <span className="truncate max-w-[200px]">{data.notes}</span>
                    </div>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`opacity-0 group-hover:opacity-100 transition-opacity ml-2 ${colors.hover}`}
                    onClick={handleAddSubSection}
                  >
                    <Plus className={`h-4 w-4 mr-1 ${colors.text}`} />
                    Add Sub-item
                  </Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={`!bg-gray-400 ${!data.hasChildren ? 'opacity-0' : ''}`} 
      />
    </div>
  );
} 