export type Track = {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
};

export type Column = {
  id: string;
  trackId: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'break' | 'session' | 'lunch' | 'registration' | 'other';
  subColumns: SubColumn[];
};

export type SubColumn = {
  id: string;
  columnId: string;
  parentId?: string;
  speaker?: string;
  duration: number;
  title: string;
  notes?: string;
  subColumns?: SubColumn[];
};

export type Theme = 'light' | 'dark';