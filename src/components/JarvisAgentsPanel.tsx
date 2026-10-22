import React from 'react';
import {
  Code,
  Search,
  Database,
  Globe,
  CheckCircle2,
  Cpu,
  Sparkles
} from 'lucide-react';
import { ModeId } from '../types';

interface JarvisAgentsPanelProps {
  onSelectAgent: (mode: ModeId, initialPrompt?: string) => void;
}

export const JarvisAgentsPanel: React.FC<JarvisAgentsPanelProps> = ({ onSelectAgent }) => {
  const agents = [
    {
      id: 'coding-agent',
      name: 'Coding Agent',
      status: 'Active',
      statusColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400/60',
      waveColor: 'bg-emerald-400',
      icon: Code,
      mode: 'coding' as ModeId,
      prompt: 'Coding Agent ready. Paste your code or architectural challenge.',
    },
    {
      id: 'research-agent',
      name: 'Research Agent',
      status: 'Active',
      statusColor: 'text-[#00f0ff]',
      dotColor: 'bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]',
      borderColor: 'border-[#00f0ff]/30 hover:border-[#00f0ff]/60',
      waveColor: 'bg-[#00f0ff]',
      icon: Search,
      mode: 'research' as ModeId,
      prompt: 'Research Agent active. What topic or verification do you need?',
    },
    {
      id: 'memory-agent',
      name: 'Memory Agent',
      status: 'Standby',
      statusColor: 'text-purple-400',
      dotColor: 'bg-purple-400 shadow-[0_0_6px_#c084fc]',
      borderColor: 'border-purple-500/30 hover:border-purple-400/60',
      waveColor: 'bg-purple-400',
      icon: Database,
      mode: 'normal' as ModeId,
      prompt: 'Reviewing recent memory threads and user preferences.',
    },
    {
      id: 'browser-agent',
      name: 'Browser Agent',
      status: 'Standby',
      statusColor: 'text-amber-400',
      dotColor: 'bg-amber-400 shadow-[0_0_6px_#fbbf24]',
      borderColor: 'border-amber-500/30 hover:border-amber-400/60',
      waveColor: 'bg-amber-400',
      icon: Globe,
      mode: 'research' as ModeId,
      prompt: 'Browser Agent standing by for live web scraping and retrieval.',
    },
    {
      id: 'task-agent',
      name: 'Task Agent',
      status: 'Standby',
      statusColor: 'text-sky-400',
      dotColor: 'bg-sky-400 shadow-[0_0_6px_#38bdf8]',
      borderColor: 'border-sky-500/30 hover:border-sky-400/60',
      waveColor: 'bg-sky-400',
      icon: CheckCircle2,
      mode: 'work' as ModeId,
      prompt: 'Task & Scheduling Agent. What deliverables shall we organize?',
    },
    {
      id: 'system-agent',
      name: 'System Agent',
      status: 'Standby',
      statusColor: 'text-emerald-400',
      dotColor: 'bg-emerald-400 shadow-[0_0_6px_#34d399]',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400/60',
      waveColor: 'bg-emerald-400',
      icon: Cpu,
      mode: 'normal' as ModeId,
      prompt: 'System health nominal. All diagnostic modules optimal.',
    },
  ];

  return (
    <div className="hud-card p-4 rounded-2xl">
      <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            Active Agents
          </span>
          <span className="text-[10px] font-mono text-[#00f0ff] px-1.5 py-0.5 rounded bg-[#00f0ff]/10">
            6 Connected
          </span>
        </div>
        <button
          onClick={() => onSelectAgent('normal', 'Show full status report of all connected agents')}
          className="text-[11px] font-mono text-[#00f0ff] hover:underline flex items-center gap-1"
        >
          View All &gt;
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.id}
              onClick={() => onSelectAgent(agent.mode, agent.prompt)}
              className={`p-3 rounded-xl bg-[#061224]/80 border transition cursor-pointer flex items-center justify-between group active:scale-98 ${agent.borderColor}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 group-hover:text-white shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white font-mono truncate group-hover:text-[#00f0ff] transition">
                    {agent.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.dotColor}`} />
                    <span className={`text-[10px] font-mono font-medium ${agent.statusColor}`}>
                      {agent.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Animated mini audio/frequency wavebars */}
              <div className="flex items-center gap-0.5 h-5 px-1 shrink-0">
                <span className={`w-0.5 ${agent.waveColor} rounded-full animate-wave-1`} />
                <span className={`w-0.5 ${agent.waveColor} rounded-full animate-wave-2`} />
                <span className={`w-0.5 ${agent.waveColor} rounded-full animate-wave-3`} />
                <span className={`w-0.5 ${agent.waveColor} rounded-full animate-wave-4`} />
                <span className={`w-0.5 ${agent.waveColor} rounded-full animate-wave-5`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
