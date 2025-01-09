export interface Track {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string;
}

export type Theme = 'light' | 'dark'; 