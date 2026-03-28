import { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import type { SimulationLog } from '../types';

export default function EventLog({ logs }: { logs: SimulationLog[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 flex flex-col shadow-xl overflow-hidden flex-1 min-h-[250px] max-h-[350px]">
      <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between z-10">
        <h2 className="text-md font-bold flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          System Event Log
        </h2>
        <span className="text-xs text-slate-500 font-mono">Live Sync</span>
      </div>

      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 font-mono scroll-smooth"
      >
        {logs.map((log) => {
          let textClass = 'text-slate-300';
          let bgClass = 'hover:bg-slate-800/50';
          
          if (log.type === 'error') {
            textClass = 'text-red-400 font-semibold';
            bgClass = 'bg-red-950/20 border-l-2 border-red-500';
          } else if (log.type === 'warning') {
            textClass = 'text-amber-400';
          } else if (log.type === 'success') {
            textClass = 'text-emerald-400';
          }

          return (
            <div key={log.id} className={`text-xs py-1.5 px-2 rounded -mx-2 transition-colors duration-300 flex gap-3 ${bgClass}`}>
              <span className="text-slate-600 w-8 shrink-0">[{log.time}]</span>
              <span className={textClass}>{log.message}</span>
            </div>
          );
        })}
        {logs.length === 0 && (
          <div className="text-slate-500 text-xs text-center mt-4">Waiting for events...</div>
        )}
      </div>
    </div>
  );
}
