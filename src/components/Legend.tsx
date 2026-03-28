import React from 'react';
import type { PhilosopherState } from '../types';
import { Brain, Utensils, Clock, ShieldAlert, Cpu } from 'lucide-react';

const legendItems: { state: PhilosopherState; label: string; description: string; color: string; icon: React.ReactNode }[] = [
  { state: 'THINKING', label: 'Thinking', description: 'Process is performing independent work.', color: 'bg-blue-500', icon: <Brain className="w-3 h-3" /> },
  { state: 'HUNGRY', label: 'Hungry', description: 'Process requesting resources (forks).', color: 'bg-amber-500', icon: <Utensils className="w-3 h-3" /> },
  { state: 'EATING', label: 'Eating', description: 'Process using shared resources.', color: 'bg-emerald-500', icon: <Utensils className="w-3 h-3" /> },
  { state: 'WAITING', label: 'Waiting', description: 'Blocked, waiting for neighbors to release.', color: 'bg-purple-500', icon: <Clock className="w-3 h-3" /> },
  { state: 'DEADLOCK', label: 'Deadlock', description: 'Circular wait detected. System frozen.', color: 'bg-red-500', icon: <ShieldAlert className="w-3 h-3" /> },
  { state: 'STARVATION', label: 'Starvation', description: 'Process indefinitely denied resources.', color: 'bg-orange-600', icon: <ShieldAlert className="w-3 h-3" /> },
  { state: 'LIVELOCK', label: 'Livelock', description: 'Active but not progressing.', color: 'bg-pink-500', icon: <Cpu className="w-3 h-3" /> },
];

export default function Legend() {
  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <span className="w-5 h-5 flex items-center justify-center rounded bg-indigo-500/20 text-indigo-400 text-[10px] font-bold">?</span>
        State Legend
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-3">
        {legendItems.map((item) => (
          <div key={item.state} className="flex items-start gap-3 group">
            <div className={`mt-1 w-6 h-6 rounded-lg ${item.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110`}>
              {item.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200">{item.label}</span>
              <span className="text-[10px] text-slate-500 leading-tight">{item.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
