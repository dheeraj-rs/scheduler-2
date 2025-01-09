import { useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  NodeDragHandler,
  useViewport
} from 'reactflow';
import { useTrack } from '../../context/TrackContext';
import { Button } from '../ui/Button';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import 'reactflow/dist/style.css';
import { ColumnNode, SubColumnNode } from './nodes';

const MIN_DISTANCE = 300;
const NODE_WIDTH = 500;
const NODE_HEIGHT = 100;

const nodeTypes = {
  columnNode: ColumnNode,
  subColumnNode: SubColumnNode
};

const calculateStartTime = (
  columnStartTime: string,
  currentSubColumn: SubColumn,
  index: number,
  allSubColumns: SubColumn[]
) => {
  if (index === 0) return columnStartTime;
  
  const previousDurations = allSubColumns
    .slice(0, index)
    .reduce((acc, curr) => acc + curr.duration, 0);
  
  const [hours, minutes] = columnStartTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + previousDurations;
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;
  
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

function FlowContent() {
  const { selectedTrack, columns } = useTrack();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { fitView } = useReactFlow();

  const createInitialLayout = useCallback(() => {
    if (!selectedTrack) return;

    const trackColumns = columns.filter(col => col.trackId === selectedTrack.id);
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];

    // Calculate total width needed for all columns
    const totalWidth = trackColumns.length * (NODE_WIDTH + MIN_DISTANCE);
    const startX = -(totalWidth / 2); // Center the columns horizontally

    trackColumns.forEach((column, columnIndex) => {
      const columnX = startX + (columnIndex * (NODE_WIDTH + MIN_DISTANCE));
      
      // Create main column node
      const columnNode: Node = {
        id: column.id,
        type: 'columnNode',
        position: { x: columnX, y: 0 },
        data: {
          id: column.id,
          label: column.title,
          startTime: column.startTime,
          endTime: column.endTime,
          type: column.type
        },
        style: {
          width: NODE_WIDTH
        }
      };
      newNodes.push(columnNode);

      // Layout subcolumns with proper spacing
      if (column.subColumns) {
        let currentY = NODE_HEIGHT + 50; // Initial vertical offset from column node
        
        const layoutSubColumns = (
          subColumns: SubColumn[], 
          parentId: string, 
          level: number,
          startTime: string,
          xOffset: number = 0
        ): { nodes: Node[], edges: Edge[], maxY: number } => {
          const result = {
            nodes: [] as Node[],
            edges: [] as Edge[],
            maxY: currentY
          };

          subColumns.forEach((subColumn, index) => {
            // Calculate horizontal offset based on depth
            const nodeX = columnX + (xOffset * level * 50); // Adjust multiplier for desired spacing

            const subColumnNode: Node = {
              id: subColumn.id,
              type: 'subColumnNode',
              position: {
                x: nodeX,
                y: currentY
              },
              data: {
                id: subColumn.id,
                label: subColumn.title,
                speaker: subColumn.speaker,
                duration: subColumn.duration,
                notes: subColumn.notes,
                depth: level - 1,
                startTime: calculateStartTime(startTime, subColumn, index, subColumns),
                hasChildren: subColumn.subColumns?.length > 0
              },
              style: {
                width: NODE_WIDTH - (level * 20) // Slightly decrease width for nested nodes
              }
            };
            result.nodes.push(subColumnNode);

            // Create edge from parent to this node
            result.edges.push({
              id: `${parentId}-${subColumn.id}`,
              source: parentId,
              target: subColumn.id,
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#94a3b8' }
            });

            currentY += NODE_HEIGHT + 30; // Increase vertical spacing
            result.maxY = currentY;

            // Process nested subcolumns with increased offset
            if (subColumn.subColumns?.length > 0) {
              const nested = layoutSubColumns(
                subColumn.subColumns,
                subColumn.id,
                level + 1,
                calculateStartTime(startTime, subColumn, index, subColumns),
                xOffset + 1
              );
              result.nodes.push(...nested.nodes);
              result.edges.push(...nested.edges);
              currentY = nested.maxY + 30; // Add extra spacing after nested groups
              result.maxY = currentY;
            }
          });

          return result;
        };

        const { nodes, edges } = layoutSubColumns(column.subColumns, column.id, 1, column.startTime);
        newNodes.push(...nodes);
        newEdges.push(...edges);
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);

    // Center the view with animation
    setTimeout(() => {
      fitView({ 
        padding: 0.2, 
        duration: 800,
        minZoom: 0.5,
        maxZoom: 1.5
      });
    }, 100);
  }, [selectedTrack, columns, setNodes, setEdges, fitView]);

  useEffect(() => {
    createInitialLayout();
  }, [selectedTrack, columns, createInitialLayout]);

  return (
    <div id="track-content" className="w-full h-full bg-white dark:bg-gray-900 print:bg-white">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="print:!bg-white"
        proOptions={{ hideAttribution: true }}
      >
        <Background className="print:hidden" />
        <Controls className="print:hidden" />
        <Panel position="top-right" className="print:hidden">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fitView({ duration: 800 })}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function TrackFlow() {
  return (
    <ReactFlowProvider>
      <FlowContent />
    </ReactFlowProvider>
  );
} 