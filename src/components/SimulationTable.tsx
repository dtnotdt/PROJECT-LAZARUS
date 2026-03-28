import { motion } from 'framer-motion';
import type { SimulationState, PhilosopherState } from '../types';
import { Utensils, Brain, Clock, ShieldAlert, Cpu } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Fixed dimensions
const PHILOSOPHER_RADIUS = 260;
const FORK_RADIUS = 130;
const HOLD_RADIUS = 220; // Radius where fork goes when held

function getCoordinates(radius: number, index: number, total: number, offsetAngle: number = -90) {
  const angle = (index * (360 / total) + offsetAngle) * (Math.PI / 180);
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

const StateColors: Record<PhilosopherState, { bg: string, border: string, text: string, shadow: string, icon: React.ReactNode }> = {
  THINKING: { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', shadow: 'shadow-blue-500/20', icon: <Brain className="w-6 h-6" /> },
  HUNGRY: { bg: 'bg-amber-500/20', border: 'border-amber-500', text: 'text-amber-400', shadow: 'shadow-amber-500/40', icon: <Utensils className="w-6 h-6 animate-pulse" /> },
  EATING: { bg: 'bg-emerald-500/30', border: 'border-emerald-400', text: 'text-emerald-400', shadow: 'shadow-[0_0_30px_rgba(16,185,129,0.5)]', icon: <Utensils className="w-6 h-6" /> },
  WAITING: { bg: 'bg-purple-500/20', border: 'border-purple-500', text: 'text-purple-400', shadow: 'shadow-purple-500/30', icon: <Clock className="w-6 h-6 animate-pulse" /> },
  DEADLOCK: { bg: 'bg-red-500/30', border: 'border-red-500', text: 'text-red-400', shadow: 'shadow-[0_0_40px_rgba(239,68,68,0.7)]', icon: <ShieldAlert className="w-6 h-6" /> },
  STARVATION: { bg: 'bg-orange-600/30', border: 'border-orange-500', text: 'text-orange-400', shadow: 'shadow-[0_0_30px_rgba(234,88,12,0.6)]', icon: <ShieldAlert className="w-6 h-6" /> },
  LIVELOCK: { bg: 'bg-pink-500/30', border: 'border-pink-500', text: 'text-pink-400', shadow: 'shadow-[0_0_30px_rgba(236,72,153,0.6)]', icon: <Cpu className="w-6 h-6 animate-spin-slow" /> },
};

export default function SimulationTable({ simulation }: { simulation: SimulationState }) {
  const { philosophers, forks } = simulation;

  return (
    <div className="relative w-full aspect-square max-w-[700px] flex items-center justify-center">
      
      {/* Table Graphic */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
           className="w-[320px] h-[320px] rounded-full bg-slate-900 border-[8px] border-slate-800 shadow-2xl flex items-center justify-center relative z-0"
           animate={{ rotate: simulation.status === 'RUNNING' ? 360 : 0 }}
           transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-[180px] h-[180px] rounded-full border border-slate-700/50 flex items-center justify-center">
             <span className="text-slate-700 font-bold tracking-widest uppercase rotate-45 select-none opacity-50">Dining Table</span>
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 w-full h-full flex items-center justify-center translate-y-4">
        
        {/* Render Forks */}
        {forks.map((fork, index) => {
          // Normal position on table between philosophers
          const tablePos = getCoordinates(FORK_RADIUS, index, 5, -54);
          
          let targetX = tablePos.x;
          let targetY = tablePos.y;
          let rotation = index * 72 - 54;
          let isHeld = fork.holderId !== null;

          if (isHeld) {
            // Fork is held by a philosopher. Move it closer to them.
            // A philosopher holds forks on their left or right.
            // If fork ID === holder ID, it's their left fork.
            // If fork ID === (holder ID - 1)%5, it's their right fork.
            const pIndex = fork.holderId!;
            const isLeft = fork.id === pIndex;
            
            // Philosopher angle
            const pAngle = (pIndex * 72 - 90);
            // Offset slightly to left or right of the philosopher
            const holdAngleOffset = isLeft ? -15 : 15;
            
            const holdPos = getCoordinates(HOLD_RADIUS, 0, 1, pAngle + holdAngleOffset);
            targetX = holdPos.x;
            targetY = holdPos.y;
            rotation = pAngle + holdAngleOffset + 90; // point towards table
          }

          return (
            <motion.div
              key={`fork-${fork.id}`}
              className={cn(
                "absolute w-2 h-16 origin-bottom rounded-full z-20 transition-colors duration-300",
                isHeld ? "bg-emerald-400/80 shadow-[0_0_10px_rgba(52,211,153,0.8)]" : "bg-slate-600/80"
              )}
              initial={false}
              animate={{
                x: targetX - 4, // center adjustment
                y: targetY - 32, // bottom origin adjustment
                rotate: rotation,
                scale: isHeld ? 1.2 : 1,
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
               <div className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/50">{fork.id}</div>
            </motion.div>
          );
        })}

        {/* Render Philosophers */}
        {philosophers.map((p, index) => {
          const pos = getCoordinates(PHILOSOPHER_RADIUS, index, 5);
          const colors = StateColors[p.state];
          const isActive = p.state !== 'THINKING';

          return (
            <motion.div
              key={`philosopher-${p.id}`}
              className={cn(
                "absolute flex flex-col items-center justify-center gap-2 z-30 transition-all duration-500",
              )}
              initial={{ x: pos.x, y: pos.y, opacity: 0, scale: 0.8 }}
              animate={{
                x: pos.x,
                y: pos.y,
                opacity: 1,
                scale: isActive ? 1.05 : 1,
              }}
              style={{ transform: 'translate(-50%, -50%)' }}
            >
              <motion.div
                className={cn(
                  "relative w-24 h-24 rounded-2xl flex items-center justify-center text-white border-2 backdrop-blur-md transition-all duration-300 group cursor-pointer",
                  colors.bg,
                  colors.border,
                  colors.shadow
                )}
                whileHover={{ scale: 1.1 }}
                layout
              >
                {/* Status Icon */}
                <div className={cn("transition-colors duration-300", colors.text)}>
                  {colors.icon}
                </div>
                
                {/* ID Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 font-bold flex items-center justify-center text-sm shadow-xl">
                  P{p.id}
                </div>
                
                {/* State Label Below Avatar inside box slightly */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase text-slate-300 whitespace-nowrap">
                  {p.state}
                </div>
                
                {/* Tooltip on Hover */}
                <div className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 flex flex-col gap-1">
                   <div className="text-xs font-bold text-white mb-1 border-b border-slate-800 pb-1">Philosopher {p.id} Details</div>
                   <StatRow label="Meals Eaten" value={p.mealsCount} />
                   <StatRow label="Thinking Time" value={p.thinkingTime + ' ticks'} />
                   <StatRow label="Waiting Time" value={p.waitingTime > 0 ? p.waitingTime + ' ticks' : 'None'} />
                </div>
              </motion.div>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex justify-between text-[10px] font-mono">
      <span className="text-slate-400">{label}:</span>
      <span className="text-slate-200 font-semibold">{value}</span>
    </div>
  );
}
