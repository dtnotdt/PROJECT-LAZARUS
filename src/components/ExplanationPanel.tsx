import { ScrollText, Info } from 'lucide-react';
import type { ScenarioType } from '../types';

export default function ExplanationPanel({ scenario }: { scenario: ScenarioType }) {
  const getExplanation = () => {
    switch (scenario) {
      case 'NORMAL':
        return {
          title: 'Normal Safe Execution',
          desc: 'Philosophers pick up both forks simultaneously when available. This prevents deadlocks but may not be possible in a strictly distributed system without a centralized lock.',
          issue: 'None immediately, but relies on atomic multi-resource acquisition.'
        };
      case 'DEADLOCK':
        return {
          title: 'Classic Deadlock',
          desc: 'All philosophers become hungry at the same time and pick up their left fork first. They then wait indefinitely for the right fork.',
          issue: 'Circular Wait, Hold and Wait, Mutual Exclusion, No Preemption.'
        };
      case 'STARVATION':
        return {
          title: 'Starvation',
          desc: 'A philosopher (P0) is repeatedly denied access to forks because its neighbors (P4 and P1) keep eating in an alternating pattern.',
          issue: 'Unfair scheduling algorithm / Thread starvation.'
        };
      case 'LIVELOCK':
        return {
          title: 'Livelock',
          desc: 'Philosophers are "polite". They pick the left fork, realize the right is taken, and put the left fork down. They all do this in sync.',
          issue: 'Active threads making no actual progress.'
        };
      case 'RESOURCE_ORDERING':
        return {
          title: 'Resource Hierarchy',
          desc: 'Forks are numbered 0-4. Philosophers must always pick up the lower numbered fork first. P4 picks fork 0 instead of 4 first.',
          issue: 'Breaks the Circular Wait condition of deadlock.'
        };
      case 'SEMAPHORE':
        return {
          title: 'Semaphore Solution',
          desc: 'A mutex semaphore protects the state array. A philosopher only proceeds to eat if both neighbors are not eating.',
          issue: 'Safe from deadlock and starvation if implemented with strict queues.'
        };
      case 'WAITER':
        return {
          title: 'Arbitrator / Waiter',
          desc: 'A central waiter node gives permission. A philosopher must ask the waiter before picking any forks. Only 4 out of 5 can sit at once.',
          issue: 'Introduces a single point of failure (the Waiter).'
        };
      case 'RANDOM':
        return {
          title: 'Randomized Execution',
          desc: 'Philosophers think, hunger, and eat at completely random intervals using normal atomic locks.',
          issue: 'Real-world unpredictable simulation.'
        };
      default:
        return { title: '', desc: '', issue: '' };
    }
  };

  const { title, desc, issue } = getExplanation();

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-xl">
      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <ScrollText className="w-5 h-5 text-indigo-400" />
        Educational Concept
      </h2>
      
      <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 flex flex-col gap-3">
        <h3 className="text-md font-semibold text-indigo-300">{title}</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          {desc}
        </p>
        
        <div className="mt-2 pt-3 border-t border-indigo-500/20 flex gap-2 items-start">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-indigo-200/80 font-medium">
            <span className="font-bold text-indigo-300">Key Concept: </span>
            {issue}
          </p>
        </div>
      </div>
    </div>
  );
}
