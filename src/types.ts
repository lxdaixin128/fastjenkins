export interface Build {
  id: string;
  estimatedDuration: number;
  result: string;
  timestamp: number;
}

export interface Job {
  name: string;
  alia?: string;
  lastBuild?: Build | null;
  properties: any[];
}

export interface Property {
  name: string;
  description: string;
  value: string;
  isHidden?: boolean;
}

export interface StorageMsg {
  type: 'read' | 'update';
  key: string;
  data?: any;
}
