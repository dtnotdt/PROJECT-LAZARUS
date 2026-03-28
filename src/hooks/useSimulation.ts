import { useState, useEffect, useCallback } from 'react';
import type { EngineState } from '../utils/scenarios';
import { INITIAL_PHILOSOPHERS, INITIAL_FORKS, advanceSimulationStep, createLog } from '../utils/scenarios';
import type { ScenarioType, SimulationState } from '../types';

export function useSimulation(): SimulationState {
  const [status, setStatus] = useState<SimulationState['status']>('IDLE');
  const [scenario, setScenarioState] = useState<ScenarioType>('NORMAL');
  const [speedMode, setSpeed] = useState<number>(1000); // ms per step
  const [stepCount, setStepCount] = useState<number>(0);
  
  const [engineState, setEngineState] = useState<EngineState>({
    philosophers: INITIAL_PHILOSOPHERS,
    forks: INITIAL_FORKS,
    logs: [createLog('Simulation ready.', 'info', 0)],
    isDeadlocked: false,
    starvingPhilosophers: [],
    isLivelocked: false,
  });

  const step = useCallback(() => {
    if (engineState.isDeadlocked || engineState.isLivelocked) return; // Stop advancing if perfectly deadlocked
    setStepCount((c) => {
      const nextC = c + 1;
      setEngineState((prev) => advanceSimulationStep(prev, scenario, nextC));
      return nextC;
    });
  }, [scenario, engineState.isDeadlocked, engineState.isLivelocked]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'RUNNING') {
      interval = setInterval(() => {
        step();
      }, speedMode);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, speedMode, step]);

  const start = useCallback(() => {
    if (status === 'IDLE' || status === 'PAUSED') {
      setStatus('RUNNING');
      setEngineState((prev) => ({
        ...prev,
        logs: [...prev.logs, createLog('Simulation stated.', 'success', stepCount)],
      }));
    }
  }, [status, stepCount]);

  const pause = useCallback(() => {
    if (status === 'RUNNING') {
      setStatus('PAUSED');
      setEngineState((prev) => ({
        ...prev,
        logs: [...prev.logs, createLog('Simulation paused.', 'warning', stepCount)],
      }));
    }
  }, [status, stepCount]);

  const reset = useCallback(() => {
    setStatus('IDLE');
    setStepCount(0);
    setEngineState({
      philosophers: INITIAL_PHILOSOPHERS,
      forks: INITIAL_FORKS,
      logs: [createLog(`Reset to ${scenario} scenario.`, 'info', 0)],
      isDeadlocked: false,
      starvingPhilosophers: [],
      isLivelocked: false,
    });
  }, [scenario]);

  const setScenario = useCallback((newScenario: ScenarioType) => {
    setScenarioState(newScenario);
    setStatus('IDLE');
    setStepCount(0);
    setEngineState({
      philosophers: INITIAL_PHILOSOPHERS,
      forks: INITIAL_FORKS,
      logs: [createLog(`Switched to scenario: ${newScenario}`, 'info', 0)],
      isDeadlocked: false,
      starvingPhilosophers: [],
      isLivelocked: false,
    });
  }, []);

  return {
    status,
    scenario,
    philosophers: engineState.philosophers,
    forks: engineState.forks,
    logs: engineState.logs,
    stepCount,
    speedMode,
    isDeadlocked: engineState.isDeadlocked,
    starvingPhilosophers: engineState.starvingPhilosophers,
    isLivelocked: engineState.isLivelocked,
    waiterAvailable: true,
    start,
    pause,
    reset,
    step,
    setScenario,
    setSpeed,
  };
}
