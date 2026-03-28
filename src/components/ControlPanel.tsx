import { Play, Pause, RotateCcw, FastForward, Activity } from 'lucide-react';
import type { SimulationState, ScenarioType } from '../types';

export default function ControlPanel({ simulation }: { simulation: SimulationState }) {
  const isRunning = simulation.status === 'RUNNING';

  const scenarios: { value: ScenarioType; label: string }[] = [
    { value: 'NORMAL', label: 'Normal Safe Execution' },
    { value: 'DEADLOCK', label: 'Classic Deadlock' },
    { value: 'STARVATION', label: 'Starvation (P0 Left Behind)' },
    { value: 'LIVELOCK', label: 'Livelock (Polite Philosophers)' },
    { value: 'RESOURCE_ORDERING', label: 'Resource Hierarchy Solution' },
    { value: 'SEMAPHORE', label: 'Semaphore Mutex Solution' },
    { value: 'WAITER', label: 'Arbitrator / Waiter Solution' },
    { value: 'RANDOM', label: 'Random Execution' }
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-400" />
        Simulation Controls
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Playback Controls */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Playback</label>
          <div className="flex items-center gap-3">
            {isRunning ? (
              <button
                onClick={simulation.pause}
                className="flex-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 border border-amber-500/50 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.1)] hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]"
              >
                <Pause className="w-4 h-4 fill-current" /> Pause
              </button>
            ) : (
              <button
                onClick={simulation.start}
                className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 font-medium py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <Play className="w-4 h-4 fill-current" /> Start
              </button>
            )}
            
            <button
              onClick={simulation.step}
              disabled={isRunning || simulation.isDeadlocked || simulation.isLivelocked}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700 text-slate-300 p-2.5 rounded-xl transition-colors"
              title="Step Forward"
            >
              <FastForward className="w-5 h-5" />
            </button>
            
            <button
              onClick={simulation.reset}
              className="bg-slate-800 hover:bg-slate-700 hover:text-red-400 border border-slate-700 text-slate-300 p-2.5 rounded-xl transition-colors"
              title="Reset Simulation"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
          
          <div className="mt-2 flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider min-w-[50px]">Speed</span>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="100" 
              value={2100 - simulation.speedMode} // invert visual scale
              onChange={(e) => simulation.setSpeed(2100 - parseInt(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Scenario Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scenario Mode</label>
          <div className="relative">
            <select
              value={simulation.scenario}
              onChange={(e) => simulation.setScenario(e.target.value as ScenarioType)}
              className="w-full appearance-none bg-slate-950 border border-slate-700 text-slate-200 text-sm font-medium rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-inner"
            >
              {scenarios.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
             Select a predefined conditions set to observe different behaviors and problems.
          </p>
        </div>

      </div>
    </div>
  );
}
