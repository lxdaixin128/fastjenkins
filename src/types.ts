export interface Build {
  id: string;
  estimatedDuration: number;
  result: string;
  timestamp: number;
}

export interface Job {
  name: string;
  lastBuild: Build | null;
  properties: any[];
}

export interface Property {
  name: string;
  description: string;
  value: string;
}

export interface SettingSyncMsg {
  type: 'read' | 'update';
  key: string;
  data?: any;
}
