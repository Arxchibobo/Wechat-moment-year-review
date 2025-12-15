export interface Moment {
  id: string;
  date: string;
  content: string;
  location?: string;
  imageCount?: number;
}

export interface AnalysisResult {
  summary: {
    totalPosts: number;
    topThemes: { theme: string; count: number }[];
    monthlyActivity: { month: string; count: number }[];
    sentiment: { positive: number; neutral: number; negative: number };
    highlights: string[];
    locations: string[];
  };
  drafts: {
    warm: string;
    funny: string;
    minimal: string;
  };
}

export enum AppStep {
  IMPORT = 'IMPORT',
  SYNCING = 'SYNCING', // New step for data synchronization simulation
  ANALYZING = 'ANALYZING',
  DASHBOARD = 'DASHBOARD',
  IMAGE_GEN = 'IMAGE_GEN',
  FINAL_EDIT = 'FINAL_EDIT'
}

export type ImageSize = '1K' | '2K' | '4K';

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export interface LocationInfo {
    name: string;
    uri?: string;
    address?: string;
    rating?: number;
}
