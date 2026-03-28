import { BookOpen, Cpu, Settings2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
              Dining Philosophers Simulator
            </h1>
            <p className="text-sm text-slate-400 font-medium hidden sm:block">
              A Visual Demonstration of OS Synchronization & Deadlocks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 transition-colors text-sm font-medium text-slate-300">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Theory</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 transition-colors text-sm font-medium text-slate-300">
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Preferences</span>
          </button>
        </div>
      </div>
    </header>
  );
}
