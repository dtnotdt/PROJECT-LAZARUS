import { useSimulation } from './hooks/useSimulation';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import StatusPanel from './components/StatusPanel';
import ExplanationPanel from './components/ExplanationPanel';
import EventLog from './components/EventLog';
import SimulationTable from './components/SimulationTable';
import Legend from './components/Legend';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const simulation = useSimulation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        {/* Left Column (Table & Controls) */}
        <div className="lg:col-span-8 flex flex-col gap-6 z-10 relative">
          
          {/* Main Simulation Area */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
             
             <AnimatePresence>
               {simulation.isDeadlocked && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8, y: -20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-red-500/90 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-red-400 flex items-center gap-2"
                 >
                   ⚠ DEADLOCK DETECTED
                 </motion.div>
               )}
               {simulation.isLivelocked && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8, y: -20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-pink-500/90 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(236,72,153,0.5)] border border-pink-400 flex items-center gap-2"
                 >
                   ⚠ LIVELOCK DETECTED
                 </motion.div>
               )}
               {simulation.starvingPhilosophers.length > 0 && !simulation.isDeadlocked && (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.8, y: -20 }}
                   animate={{ opacity: 1, scale: 1, y: 0 }}
                   exit={{ opacity: 0, scale: 0.8 }}
                   className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-orange-500/90 text-white px-6 py-3 rounded-full font-bold shadow-[0_0_30px_rgba(249,115,22,0.5)] border border-orange-400 flex items-center gap-2"
                 >
                   ⚠ STARVATION DETECTED for P{simulation.starvingPhilosophers.join(', P')}
                 </motion.div>
               )}
             </AnimatePresence>
             
             <SimulationTable simulation={simulation} />
          </div>

          <ControlPanel simulation={simulation} />
        </div>

        {/* Right Column (Info, Stats, Setup) */}
        <div className="lg:col-span-4 flex flex-col gap-6 z-10 relative">
          <StatusPanel simulation={simulation} />
          <ExplanationPanel scenario={simulation.scenario} />
          <Legend />
          <EventLog logs={simulation.logs} />
        </div>
      </main>

      <footer className="w-full border-t border-slate-800/60 py-6 mt-auto bg-slate-900/30 backdrop-blur-md text-center text-slate-500 text-sm">
        <p>A formal OS simulation for the Dining Philosophers Problem.</p>
        <p className="mt-1">Concept visualization emphasizing Deadlock, Starvation, and Synchronization.</p>
      </footer>
    </div>
  );
}

export default App;
