export enum AppState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  SIGNING_KEYS = 'SIGNING_KEYS', // New step for FHE key signature
  READY = 'READY',
  ENCRYPTING = 'ENCRYPTING',
  SUBMITTING = 'SUBMITTING',
  CONFIRMED = 'CONFIRMED',
  ERROR = 'ERROR'
}

export interface DailyStats {
  count: number;
  date: string;
}

export interface Quote {
  text: string;
  author: string;
}