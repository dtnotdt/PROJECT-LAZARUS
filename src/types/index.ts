export type PhilosopherState = 'THINKING' | 'HUNGRY' | 'EATING' | 'WAITING' | 'DEADLOCK' | 'STARVATION' | 'LIVELOCK';

export interface Philosopher {
  id: number;
  state: PhilosopherState;
  eatingTime: number; // total time spent eating
  thinkingTime: number; // total time spent thinking
  waitingTime: number; // current consecutive time spent waiting
  mealsCount: number;
  waitDuration: number; // For starvation tracking
}

export interface Fork {
  id: number;
  holderId: number | null; // null if on table, else philosopher id
}

export type ScenarioType =
  | 'NORMAL'
  | 'DEADLOCK'
  | 'STARVATION'
  | 'LIVELOCK'
  | 'SEMAPHORE'
  | 'WAITER'
  | 'RESOURCE_ORDERING'
  | 'RANDOM';

export interface SimulationLog {
  id: string; // unique ID for React keys
  time: number; // simulation step
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface SimulationState {
  status: 'IDLE' | 'RUNNING' | 'PAUSED' | 'TICKING';
  scenario: ScenarioType;
  philosophers: Philosopher[];
  forks: Fork[];
  logs: SimulationLog[];
  stepCount: number;
  speedMode: number; // e.g., ms per tick
  isDeadlocked: boolean;
  starvingPhilosophers: number[];
  isLivelocked: boolean;
  
  // Semaphore specific stats
  waiterAvailable: boolean;
  
  start: () => void;
  pause: () => void;
  reset: () => void;
  step: () => void;
  setScenario: (scenario: ScenarioType) => void;
  setSpeed: (speed: number) => void;
}
