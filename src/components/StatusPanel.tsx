import type { SimulationState } from '../types';
import { BarChart3, Clock, AlertTriangle } from 'lucide-react';

export default function StatusPanel({ simulation }: { simulation: SimulationState }) {
  const { philosophers, status, isDeadlocked, isLivelocked, starvingPhilosophers, stepCount } = simulation;

  const thinkingCount = philosophers.filter(p => p.state === 'THINKING').length;
  const hungryCount = philosophers.filter(p => p.state === 'HUNGRY').length;
  const eatingCount = philosophers.filter(p => p.state === 'EATING').length;
  const waitingCount = philosophers.filter(p => p.state === 'WAITING').length;

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col gap-4 shadow-xl">
      <h2 className="text-lg font-bold flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        Live Statistics
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <StatBox label="System Status" value={isDeadlocked ? 'DEADLOCKED' : isLivelocked ? 'LIVELOCK' : status}
                 color={isDeadlocked ? 'text-red-400' : isLivelocked ? 'text-pink-400' : status === 'RUNNING' ? 'text-emerald-400' : 'text-slate-400'} />
        <StatBox label="Global Clock" value={`Tick ${stepCount}`} icon={<Clock className="w-4 h-4 text-slate-500" />} />
      </div>

      <div className="grid grid-cols-4 gap-2 mt-2">
         <MiniStat count={eatingCount} label="Eating" color="bg-emerald-500" />
         <MiniStat count={thinkingCount} label="Thinking" color="bg-blue-500" />
         <MiniStat count={hungryCount} label="Hungry" color="bg-amber-500" />
         <MiniStat count={waitingCount} label="Waiting" color="bg-purple-500" />
      </div>

      {(isDeadlocked || starvingPhilosophers.length > 0 || isLivelocked) && (
        <div className="mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm font-medium text-red-400">
            {isDeadlocked && "Mutual execution stopped completely."}
            {isLivelocked && "Processes active but stuck in infinite loop."}
            {!isDeadlocked && !isLivelocked && starvingPhilosophers.length > 0 && 
              `Unfair scheduling. P${starvingPhilosophers.join(', ')} is starved.`}
          </p>
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value, color = "text-white", icon }: { label: string, value: string | number, color?: string, icon?: React.ReactNode }) {
  return (
    <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
      <span className="text-xs text-slate-500 font-semibold uppercase">{label}</span>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold tracking-wide ${color}`}>{value}</span>
        {icon}
      </div>
    </div>
  );
}

function MiniStat({ count, label, color }: { count: number, label: string, color: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-2 bg-slate-950/50 rounded-lg border border-slate-800/80">
      <span className="text-lg font-black font-mono text-slate-200">{count}</span>
      <div className="flex items-center gap-1 mt-1">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-[10px] text-slate-400 font-semibold uppercase">{label}</span>
      </div>
    </div>
  );
}
