import { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Plus, Clock, Users, ChevronRight, AlignLeft, Printer, Grid, Maximize2, Minimize2,
  Camera
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { useTrack } from '../../context/TrackContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import type { Column, SubColumn, Track } from '../../types';
import { TrackFlow } from './TrackFlow';

export function TrackDetails() {
  const { tracks, selectedTrack, columns, addColumn, addSubColumn, selectTrack, updateColumns } = useTrack();
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isSubColumnModalOpen, setIsSubColumnModalOpen] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [columnFormData, setColumnFormData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    type: 'session' as const
  });
  const [subColumnFormData, setSubColumnFormData] = useState({
    title: '',
    speaker: '',
    duration: 30,
    notes: ''
  });
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const printRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const trackContentRef = useRef<HTMLDivElement>(null);


  const trackColumns = columns.filter(col => col.trackId === selectedTrack?.id);

  const handleColumnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrack) return;
    
    addColumn(selectedTrack.id, columnFormData);
    setIsColumnModalOpen(false);
    setColumnFormData({
      title: '',
      startTime: '',
      endTime: '',
      type: 'session'
    });
  };

  const handleSubColumnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedColumnId) return;

    addSubColumn(selectedColumnId, {
      ...subColumnFormData,
      parentId: selectedParentId
    });
    setIsSubColumnModalOpen(false);
    setSelectedParentId(null);
    setSubColumnFormData({
      title: '',
      speaker: '',
      duration: 30,
      notes: ''
    });
  };

  const calculateEndTime = (startTime: string, durationMinutes: number) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
  };

  const renderSubColumns = (subColumns: SubColumn[], depth = 0, parentStartTime: string, parentId: string) => {
    return subColumns.map((subColumn, index) => {
      const startTime = index === 0 ? parentStartTime : 
        calculateEndTime(parentStartTime, 
          subColumns.slice(0, index).reduce((acc, curr) => acc + curr.duration, 0)
        );
      const endTime = calculateEndTime(startTime, subColumn.duration);

      // Calculate background color based on depth
      const getBgColor = (depth: number) => {
        switch (depth) {
          case 0: return 'hover:bg-blue-50/50 dark:hover:bg-blue-900/20';
          case 1: return 'hover:bg-purple-50/50 dark:hover:bg-purple-900/20';
          case 2: return 'hover:bg-pink-50/50 dark:hover:bg-pink-900/20';
          default: return 'hover:bg-gray-50/50 dark:hover:bg-gray-800/20';
        }
      };

      // Calculate border color based on depth
      const getBorderColor = (depth: number) => {
        switch (depth) {
          case 0: return 'border-l-4 border-l-blue-400';
          case 1: return 'border-l-4 border-l-purple-400';
          case 2: return 'border-l-4 border-l-pink-400';
          default: return 'border-l-4 border-l-gray-400';
        }
      };

      return (
        <tr 
          key={subColumn.id}
          className={`group transition-colors ${getBgColor(depth)} ${getBorderColor(depth)}`}
        >
          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span>{startTime} - {endTime}</span>
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center">
              <div style={{ width: `${depth * 24}px` }} className="flex-shrink-0" />
              <div className={`flex items-center p-2 rounded-md w-full ${
                depth === 0 ? 'bg-blue-50/30 dark:bg-blue-900/10' :
                depth === 1 ? 'bg-purple-50/30 dark:bg-purple-900/10' :
                depth === 2 ? 'bg-pink-50/30 dark:bg-pink-900/10' :
                'bg-gray-50/30 dark:bg-gray-900/10'
              }`}>
                <ChevronRight className={`h-4 w-4 mr-2 ${
                  depth === 0 ? 'text-blue-400' :
                  depth === 1 ? 'text-purple-400' :
                  depth === 2 ? 'text-pink-400' :
                  'text-gray-400'
                }`} />
                <span className="font-medium text-gray-900 dark:text-white">
                  {subColumn.title}
                </span>
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            {subColumn.speaker && (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-800/30 rounded-md p-2">
                <Users className="h-4 w-4 mr-2 text-gray-400" />
                {subColumn.speaker}
              </div>
            )}
          </td>
          <td className="px-4 py-3 text-sm">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              depth === 0 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
              depth === 1 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' :
              depth === 2 ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' :
              'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
            }`}>
              {subColumn.duration} min
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center justify-between">
              {subColumn.notes && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/30 rounded-md p-2">
                  <AlignLeft className="h-4 w-4 mr-2" />
                  <span className="truncate max-w-[200px]">{subColumn.notes}</span>
                </div>
              )}
              <Button
                size="sm"
                variant="ghost"
                className={`opacity-0 group-hover:opacity-100 transition-opacity ml-2 ${
                  depth === 0 ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20' :
                  depth === 1 ? 'hover:bg-purple-50 dark:hover:bg-purple-900/20' :
                  depth === 2 ? 'hover:bg-pink-50 dark:hover:bg-pink-900/20' :
                  'hover:bg-gray-50 dark:hover:bg-gray-800/20'
                }`}
                onClick={() => {
                  setSelectedParentId(subColumn.id);
                  setIsSubColumnModalOpen(true);
                }}
              >
                <Plus className={`h-4 w-4 mr-1 ${
                  depth === 0 ? 'text-blue-400' :
                  depth === 1 ? 'text-purple-400' :
                  depth === 2 ? 'text-pink-400' :
                  'text-gray-400'
                }`} />
                Add Sub-item
              </Button>
            </div>
          </td>
        </tr>
      );
    });
  };

  const handleScreenshot = async () => {
    const flowElement = document.getElementById('track-content');
    if (flowElement) {
      try {
        // Hide controls and background temporarily
        const controls = document.querySelectorAll('.react-flow__controls, .react-flow__background');
        controls.forEach(control => (control as HTMLElement).style.display = 'none');
        
        // Set white background for screenshot
        const reactFlowWrapper = document.querySelector('.react-flow__renderer');
        if (reactFlowWrapper) {
          (reactFlowWrapper as HTMLElement).style.background = 'white';
        }
        
        const canvas = await html2canvas(flowElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true,
          windowWidth: flowElement.scrollWidth,
          windowHeight: flowElement.scrollHeight,
          onclone: (clonedDoc) => {
            // Ensure dark mode elements are properly styled in screenshot
            const clonedFlow = clonedDoc.getElementById('track-content');
            if (clonedFlow) {
              clonedFlow.style.background = 'white';
              const nodes = clonedFlow.querySelectorAll('.react-flow__node');
              nodes.forEach(node => {
                (node as HTMLElement).style.background = 'white';
                (node as HTMLElement).style.color = 'black';
              });
            }
          }
        });
        
        // Restore controls and background
        controls.forEach(control => (control as HTMLElement).style.display = '');
        if (reactFlowWrapper) {
          (reactFlowWrapper as HTMLElement).style.background = '';
        }
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${selectedTrack?.name}-flow-${new Date().toISOString().split('T')[0]}.png`;
        link.href = image;
        link.click();
      } catch (error) {
        console.error('Screenshot failed:', error);
      }
    }
  };

  const handlePrint = useCallback(() => {
    const flowElement = document.getElementById('track-content');
    if (flowElement) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const printContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print Flow - ${selectedTrack?.name}</title>
              <style>
                @media print {
                  @page {
                    size: landscape;
                    margin: 1cm;
                  }
                  
                  body {
                    margin: 0;
                    padding: 20px;
                  }
                  
                  #print-content {
                    width: 100%;
                    height: 100vh;
                    background: white !important;
                  }
                  
                  .react-flow__node {
                    break-inside: avoid;
                    page-break-inside: avoid;
                    background: white !important;
                    border: 1px solid #e2e8f0 !important;
                    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1) !important;
                  }
                  
                  .react-flow__node-columnNode,
                  .react-flow__node-subColumnNode {
                    padding: 16px !important;
                    color: black !important;
                  }
                  
                  .react-flow__edge {
                    stroke: #64748b !important;
                  }
                  
                  .react-flow__edge-path {
                    stroke-width: 2 !important;
                  }
                  
                  .react-flow__controls,
                  .react-flow__background,
                  .react-flow__minimap,
                  .react-flow__panel {
                    display: none !important;
                  }
                  
                  .node-header {
                    border-bottom: 1px solid #e2e8f0 !important;
                    margin-bottom: 8px !important;
                  }
                  
                  .node-title {
                    font-weight: bold !important;
                    font-size: 16px !important;
                  }
                  
                  .node-time {
                    color: #64748b !important;
                    font-size: 14px !important;
                  }
                  
                  .node-content {
                    font-size: 14px !important;
                  }
                }
              </style>
            </head>
            <body>
              <div id="print-content">
                ${flowElement.outerHTML}
              </div>
              <script>
                window.onload = () => {
                  window.print();
                  window.onafterprint = () => window.close();
                };
              </script>
            </body>
          </html>
        `;
        
        printWindow.document.write(printContent);
        printWindow.document.close();
      }
    }
  }, [selectedTrack]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 h-screen overflow-hidden flex flex-col">
      <div className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsColumnModalOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
              >
                <Grid className="h-4 w-4 mr-2" />
                {layout === 'grid' ? 'List View' : 'Grid View'}
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleScreenshot}
              >
                <Camera className="h-4 w-4 mr-2" />
                Screenshot
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4 mr-2" />
                ) : (
                  <Maximize2 className="h-4 w-4 mr-2" />
                )}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
            </div>
          </div>
          <div className="flex space-x-3 overflow-x-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {tracks.map((track) => (
              <Button
                key={track.id}
                variant={selectedTrack?.id === track.id ? "default" : "outline"}
                onClick={() => selectTrack(track.id)}
                className={`flex-shrink-0 items-center whitespace-nowrap transition-all duration-200 ${
                  selectedTrack?.id === track.id 
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400 shadow-sm border-transparent' 
                    : 'hover:border-blue-300 dark:hover:border-blue-500'
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                {track.name}
                <span className="ml-2 text-xs opacity-60">
                  {track.startTime} - {track.endTime}
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {selectedTrack && (
        <div className="flex-1 relative overflow-hidden">
          <TrackFlow />
        </div>
      )}

      <Modal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        title="Add Program Section"
        className="max-h-[90vh] overflow-y-auto fixed inset-x-0 top-[5vh] mx-auto"
      >
        <form onSubmit={handleColumnSubmit} className="space-y-4 min-w-[320px] max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Section Title
            </label>
            <input
              type="text"
              required
              value={columnFormData.title}
              onChange={(e) => setColumnFormData({ ...columnFormData, title: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Start Time
            </label>
            <input
              type="time"
              required
              value={columnFormData.startTime}
              onChange={(e) => setColumnFormData({ ...columnFormData, startTime: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              End Time
            </label>
            <input
              type="time"
              required
              value={columnFormData.endTime}
              onChange={(e) => setColumnFormData({ ...columnFormData, endTime: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Section Type
            </label>
            <select
              value={columnFormData.type}
              onChange={(e) => setColumnFormData({ ...columnFormData, type: e.target.value as any })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            >
              <option value="break">Break</option>
              <option value="session">Session</option>
              <option value="lunch">Lunch</option>
              <option value="registration">Registration</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsColumnModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Section</Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isSubColumnModalOpen}
        onClose={() => setIsSubColumnModalOpen(false)}
        title="Add Sub-section"
        className="max-h-[90vh] overflow-y-auto fixed inset-x-0 top-[5vh] mx-auto"
      >
        <form onSubmit={handleSubColumnSubmit} className="space-y-4 min-w-[320px] max-w-md mx-auto">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Title
            </label>
            <input
              type="text"
              required
              value={subColumnFormData.title}
              onChange={(e) => setSubColumnFormData({ ...subColumnFormData, title: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Speaker
            </label>
            <input
              type="text"
              value={subColumnFormData.speaker}
              onChange={(e) => setSubColumnFormData({ ...subColumnFormData, speaker: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Duration (minutes)
            </label>
            <input
              type="number"
              required
              min="5"
              step="5"
              value={subColumnFormData.duration}
              onChange={(e) => setSubColumnFormData({ ...subColumnFormData, duration: parseInt(e.target.value) })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">
              Notes
            </label>
            <textarea
              value={subColumnFormData.notes}
              onChange={(e) => setSubColumnFormData({ ...subColumnFormData, notes: e.target.value })}
              className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600 dark:bg-gray-700"
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsSubColumnModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Details</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}