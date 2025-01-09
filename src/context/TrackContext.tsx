import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Track, Column, SubColumn } from '../types';

interface TrackContextType {
  tracks: Track[];
  columns: Column[];
  selectedTrack: Track | null;
  setSelectedTrack: (track: Track | null) => void;
  selectedParentId: string | null;
  setSelectedParentId: (id: string | null) => void;
  selectedColumnId: string | null;
  setSelectedColumnId: (id: string | null) => void;
  isSubColumnModalOpen: boolean;
  setIsSubColumnModalOpen: (open: boolean) => void;
  addSubColumn: (parentId: string, data: Partial<SubColumn>) => void;
  addColumn: (trackId: string, data: Partial<Column>) => void;
  selectTrack: (id: string) => void;
  addTrack: (data: Partial<Track>) => void;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export function TrackProvider({ children }: { children: React.ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [columns, setColumns] = useState<Column[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const [isSubColumnModalOpen, setIsSubColumnModalOpen] = useState(false);

  // Initialize with some default data
  useEffect(() => {
    setTracks([
      {
        id: '1',
        name: 'Main Track',
        startTime: '09:00',
        endTime: '17:00',
        description: 'Main conference track'
      }
    ]);
    setColumns([]);
  }, []);

  const selectTrack = useCallback((id: string) => {
    const track = tracks.find(t => t.id === id);
    setSelectedTrack(track || null);
  }, [tracks]);

  const addColumn = useCallback((trackId: string, data: Partial<Column>) => {
    setColumns(prevColumns => [
      ...prevColumns,
      {
        id: crypto.randomUUID(),
        trackId,
        subColumns: [],
        ...data
      } as Column
    ]);
  }, []);

  const addSubColumn = useCallback((parentId: string, data: Partial<SubColumn>) => {
    setColumns(prevColumns => {
      const updateSubColumns = (subColumns: SubColumn[]): SubColumn[] => {
        return subColumns.map(subColumn => {
          if (subColumn.id === parentId) {
            return {
              ...subColumn,
              subColumns: [
                ...(subColumn.subColumns || []),
                {
                  id: crypto.randomUUID(),
                  trackId: selectedTrack?.id || '',
                  parentId: subColumn.id,
                  ...data
                } as SubColumn
              ]
            };
          }
          if (subColumn.subColumns?.length) {
            return {
              ...subColumn,
              subColumns: updateSubColumns(subColumn.subColumns)
            };
          }
          return subColumn;
        });
      };

      return prevColumns.map(column => {
        if (column.id === parentId) {
          return {
            ...column,
            subColumns: [
              ...(column.subColumns || []),
              {
                id: crypto.randomUUID(),
                trackId: selectedTrack?.id || '',
                parentId: column.id,
                ...data
              } as SubColumn
            ]
          };
        }
        if (column.subColumns?.length) {
          return {
            ...column,
            subColumns: updateSubColumns(column.subColumns)
          };
        }
        return column;
      });
    });
    
    setIsSubColumnModalOpen(false);
    setSelectedParentId(null);
  }, [selectedTrack]);

  const addTrack = useCallback((data: Partial<Track>) => {
    setTracks(prevTracks => [
      ...prevTracks,
      {
        id: crypto.randomUUID(),
        name: data.name || '',
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        description: data.description || ''
      } as Track
    ]);
  }, []);

  const value = {
    tracks,
    columns,
    selectedTrack,
    setSelectedTrack,
    selectedParentId,
    setSelectedParentId,
    selectedColumnId,
    setSelectedColumnId,
    isSubColumnModalOpen,
    setIsSubColumnModalOpen,
    addSubColumn,
    addColumn,
    selectTrack,
    addTrack
  };

  return (
    <TrackContext.Provider value={value}>
      {children}
    </TrackContext.Provider>
  );
}

export function useTrack() {
  const context = useContext(TrackContext);
  if (context === undefined) {
    throw new Error('useTrack must be used within a TrackProvider');
  }
  return context;
}