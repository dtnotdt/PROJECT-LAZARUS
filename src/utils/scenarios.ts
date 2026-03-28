import type { Philosopher, Fork, ScenarioType, SimulationLog } from '../types';

export const INITIAL_PHILOSOPHERS: Philosopher[] = Array.from({ length: 5 }).map((_, i) => ({
  id: i,
  state: 'THINKING',
  eatingTime: 0,
  thinkingTime: 0,
  waitingTime: 0,
  mealsCount: 0,
  waitDuration: 0,
}));

export const INITIAL_FORKS: Fork[] = Array.from({ length: 5 }).map((_, i) => ({
  id: i,
  holderId: null,
}));

// Helper to add logs
export const createLog = (message: string, type: SimulationLog['type'] = 'info', time: number): SimulationLog => ({
  id: `${time}-${Math.random().toString(36).substr(2, 9)}`,
  time,
  message,
  type,
});

export interface EngineState {
  philosophers: Philosopher[];
  forks: Fork[];
  logs: SimulationLog[];
  isDeadlocked: boolean;
  starvingPhilosophers: number[];
  isLivelocked: boolean;
  
  // Custom scenario internal states
  scenarioState?: any;
}

export function advanceSimulationStep(
  state: EngineState,
  scenario: ScenarioType,
  stepCount: number
): EngineState {
  switch (scenario) {
    case 'NORMAL':
      return stepNormalOrRandom(state, stepCount, false);
    case 'DEADLOCK':
      return stepDeadlock(state, stepCount);
    case 'STARVATION':
      return stepStarvation(state, stepCount);
    case 'LIVELOCK':
      return stepLivelock(state, stepCount);
    case 'SEMAPHORE':
      return stepSemaphore(state, stepCount);
    case 'WAITER':
      return stepWaiter(state, stepCount);
    case 'RESOURCE_ORDERING':
      return stepResourceOrdering(state, stepCount);
    case 'RANDOM':
      return stepNormalOrRandom(state, stepCount, true);
    default:
      return state;
  }
}

function cloneState(state: EngineState): EngineState {
  return {
    ...state,
    philosophers: state.philosophers.map((p) => ({ ...p })),
    forks: state.forks.map((f) => ({ ...f })),
    logs: [...state.logs],
    starvingPhilosophers: [...state.starvingPhilosophers],
    scenarioState: state.scenarioState ? { ...state.scenarioState } : undefined,
  };
}

const FORK_LEFT = (i: number) => i;
const FORK_RIGHT = (i: number) => (i + 1) % 5;

// Shared common transitions
function handleTimeouts(newState: EngineState, stepCount: number) {
  // Update times based on states
  newState.philosophers.forEach(p => {
    if (p.state === 'THINKING') {
      p.thinkingTime++;
      // Randomly become hungry
      if (Math.random() > 0.7) {
        p.state = 'HUNGRY';
        newState.logs.push(createLog(`P${p.id} is now HUNGRY`, 'info', stepCount));
      }
    } else if (p.state === 'EATING') {
      p.eatingTime++;
      if (p.eatingTime >= 3) { // Eats for 3 ticks
        p.state = 'THINKING';
        p.eatingTime = 0;
        p.mealsCount++;
        p.waitingTime = 0;
        
        const leftFork = FORK_LEFT(p.id);
        const rightFork = FORK_RIGHT(p.id);
        
        if (newState.forks[leftFork].holderId === p.id) newState.forks[leftFork].holderId = null;
        if (newState.forks[rightFork].holderId === p.id) newState.forks[rightFork].holderId = null;
        
        newState.logs.push(createLog(`P${p.id} finished EATING and released forks.`, 'success', stepCount));
      }
    } else if (['HUNGRY', 'WAITING', 'DEADLOCK', 'STARVATION'].includes(p.state)) {
      p.waitingTime++;
    }
  });
}

function stepNormalOrRandom(state: EngineState, stepCount: number, _randomMode: boolean): EngineState {
  const next = cloneState(state);
  handleTimeouts(next, stepCount);
  // Implementation of normal Safe execution (try both locks atomically or wait)
  next.philosophers.forEach(p => {
    if (p.state === 'HUNGRY' || p.state === 'WAITING') {
      const lf = FORK_LEFT(p.id);
      const rf = FORK_RIGHT(p.id);
      if (next.forks[lf].holderId === null && next.forks[rf].holderId === null) {
        // Can eat
        next.forks[lf].holderId = p.id;
        next.forks[rf].holderId = p.id;
        p.state = 'EATING';
        p.waitingTime = 0;
        next.logs.push(createLog(`P${p.id} picked both forks and started EATING.`, 'success', stepCount));
      } else {
        if (p.state !== 'WAITING') {
          p.state = 'WAITING';
          next.logs.push(createLog(`P${p.id} is WAITING for forks.`, 'warning', stepCount));
        }
      }
    }
  });
  return next;
}

// ---------------------------------------------------------
// DEADLOCK SCENARIO: Everyone gets left fork, waits for right
// ---------------------------------------------------------
function stepDeadlock(state: EngineState, stepCount: number): EngineState {
  const next = cloneState(state);
  
  // Force everyone hungry
  if (stepCount === 1) {
    next.philosophers.forEach(p => p.state = 'HUNGRY');
    next.logs.push(createLog('All philosophers became HUNGRY (Deadlock Scenario initiated).', 'info', stepCount));
    return next;
  }
  
  // Everyone picks left fork
  next.philosophers.forEach(p => {
    if (p.state === 'HUNGRY' || p.state === 'WAITING') {
      const lf = FORK_LEFT(p.id);
      if (next.forks[lf].holderId === null) {
        next.forks[lf].holderId = p.id;
        p.state = 'WAITING';
        next.logs.push(createLog(`P${p.id} picked left fork (${lf}).`, 'warning', stepCount));
      }
    }
  });

  // Check deadlock condition
  const allHoldingLeft = next.philosophers.every(p => next.forks[FORK_LEFT(p.id)].holderId === p.id);
  const noneEating = next.philosophers.every(p => p.state !== 'EATING');
  
  if (allHoldingLeft && noneEating && !next.isDeadlocked && stepCount > 2) {
    next.isDeadlocked = true;
    next.philosophers.forEach(p => p.state = 'DEADLOCK');
    next.logs.push(createLog('⚠ DEADLOCK DETECTED! Circular wait formed. No progress possible.', 'error', stepCount));
  } else if (!next.isDeadlocked) {
    // If not deadlocked yet, just wait and increment wait times
    next.philosophers.forEach(p => {
       if (p.state === 'WAITING' || p.state === 'HUNGRY') p.waitingTime++;
    });
  }
  
  return next;
}

// ---------------------------------------------------------
// STARVATION SCENARIO: P0 is constantly skipped
// ---------------------------------------------------------
function stepStarvation(state: EngineState, stepCount: number): EngineState {
  const next = cloneState(state);
  handleTimeouts(next, stepCount);
  
  // P0 is always starved by P1 and P4
  // If P0 is hungry, let P4 and P1 quickly eat
  next.philosophers.forEach(p => {
    if (p.state === 'HUNGRY' || p.state === 'WAITING') {
       if (p.id === 0) {
          // P0 tries to eat but we artificially allow P1 or P4 to snatch forks
          p.state = 'STARVATION';
          if (!next.starvingPhilosophers.includes(0)) {
            next.starvingPhilosophers.push(0);
          }
          if (p.waitingTime > 10 && p.waitingTime % 5 === 0) {
             next.logs.push(createLog(`⚠ STARVATION DETECTED: P0 has been waiting too long!`, 'error', stepCount));
          }
       } else {
         const lf = FORK_LEFT(p.id);
         const rf = FORK_RIGHT(p.id);
         if (next.forks[lf].holderId === null && next.forks[rf].holderId === null) {
           next.forks[lf].holderId = p.id;
           next.forks[rf].holderId = p.id;
           p.state = 'EATING';
           p.waitingTime = 0;
           next.logs.push(createLog(`P${p.id} picked forks and started EATING.`, 'success', stepCount));
         } else {
           p.state = 'WAITING';
         }
       }
    }
  });
  
  return next;
}

// ---------------------------------------------------------
// LIVELOCK SCENARIO: Pick left, pick right, if fail release left
// ---------------------------------------------------------
function stepLivelock(state: EngineState, stepCount: number): EngineState {
  const next = cloneState(state);
  
  if (stepCount === 1) {
    next.philosophers.forEach(p => p.state = 'HUNGRY');
    next.logs.push(createLog('All philosophers became HUNGRY (Livelock Scenario initiated).', 'info', stepCount));
    return next;
  }
  
  // Everyone picks left, then if right not available, releases left and waits.
  // This causes infinite activity but no progress.
  
  next.philosophers.forEach(p => {
      p.waitingTime++;
      p.state = 'LIVELOCK';
  });
  
  const tickModulo = stepCount % 4;
  
  if (tickModulo === 0) {
    // Pick left
    next.philosophers.forEach(p => {
        const lf = FORK_LEFT(p.id);
        next.forks[lf].holderId = p.id;
        next.logs.push(createLog(`P${p.id} picked left fork (${lf}).`, 'warning', stepCount));
    });
  } else if (tickModulo === 2) {
    // Cannot pick right, release left
    next.philosophers.forEach(p => {
        const lf = FORK_LEFT(p.id);
        next.forks[lf].holderId = null;
        next.logs.push(createLog(`P${p.id} cannot pick right fork, releasing left fork (${lf}).`, 'info', stepCount));
    });
  }
  
  if (stepCount === 10 && !next.isLivelocked) {
     next.isLivelocked = true;
     next.logs.push(createLog('⚠ LIVELOCK DETECTED! Active but no progress.', 'error', stepCount));
  }
  
  return next;
}

// ---------------------------------------------------------
// RESOURCE ORDERING: Pick lower ID fork first
// ---------------------------------------------------------
function stepResourceOrdering(state: EngineState, stepCount: number): EngineState {
  const next = cloneState(state);
  handleTimeouts(next, stepCount);
  
  next.philosophers.forEach(p => {
    if (p.state === 'HUNGRY' || p.state === 'WAITING') {
      const f1 = Math.min(FORK_LEFT(p.id), FORK_RIGHT(p.id));
      const f2 = Math.max(FORK_LEFT(p.id), FORK_RIGHT(p.id));
      
      // If we don't have f1, try f1
      if (next.forks[f1].holderId === null && next.forks[f2].holderId !== p.id) {
         next.forks[f1].holderId = p.id;
         p.state = 'WAITING';
         next.logs.push(createLog(`P${p.id} picked lower fork (${f1}).`, 'info', stepCount));
      } else if (next.forks[f1].holderId === p.id && next.forks[f2].holderId === null) {
         // Have f1, get f2
         next.forks[f2].holderId = p.id;
         p.state = 'EATING';
         p.waitingTime = 0;
         next.logs.push(createLog(`P${p.id} picked higher fork (${f2}) and started EATING.`, 'success', stepCount));
      } else if (next.forks[f1].holderId === p.id && next.forks[f2].holderId !== null) {
         p.state = 'WAITING';
      }
    }
  });
  
  return next;
}

// ---------------------------------------------------------
// SEMAPHORE & WAITER
// ---------------------------------------------------------
// For visual purposes, these can function similar to Normal Safe mode
// but with logging explaining the lock/arbitrator.
function stepSemaphore(state: EngineState, stepCount: number): EngineState {
   const next = stepNormalOrRandom(state, stepCount, false);
   // Inject semaphore logs
   const newEating = next.philosophers.filter(p => p.state === 'EATING' && state.philosophers[p.id].state !== 'EATING');
   newEating.forEach(p => {
       next.logs.push(createLog(`[Semaphore] wait(mutex) - P${p.id} acquired both forks lock`, 'info', stepCount));
   });
   return next;
}

function stepWaiter(state: EngineState, stepCount: number): EngineState {
   const next = stepNormalOrRandom(state, stepCount, false);
   const newEating = next.philosophers.filter(p => p.state === 'EATING' && state.philosophers[p.id].state !== 'EATING');
   newEating.forEach(p => {
       next.logs.push(createLog(`[Waiter] Arbitrator granted permission to P${p.id}`, 'info', stepCount));
   });
   return next;
}
