import React from 'react';
import {
  Clock,
  CheckCircle2,
  Plus,
  Calendar,
  Mic,
  Play,
  ChevronDown
} from 'lucide-react';
import { ReminderItem } from '../types';

interface JarvisTimelineAndCommandsProps {
  reminders: ReminderItem[];
  onOpenReminders: () => void;
  onOpenVoice: () => void;
  onNewTask: () => void;
  onRunWorkflow: () => void;
}

export const JarvisTimelineAndCommands: React.FC<JarvisTimelineAndCommandsProps> = ({
  reminders,
  onOpenReminders,
  onOpenVoice,
  onNewTask,
  onRunWorkflow,
}) => {
  const defaultTimeline = [
    { time: '09:30 am', title: 'Daily Standup & AI Sync', status: 'Done', isDone: true },
    { time: '12:00 pm', title: 'Finalize HUD panel spacing', status: 'In 42 min', isDone: false },
    { time: '02:00 pm', title: 'Deep-work block: Voice pipeline', status: 'In 2h 42m', isDone: false },
    { time: '04:30 pm', title: 'Design Review — Command Center V1', status: 'In 5h 12m', isDone: false },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
      {/* Mission Timeline Card */}
      <div className="md:col-span-7 hud-card p-4 rounded-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
              Mission Timeline
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <span>Today</span>
            <ChevronDown className="w-3 h-3 text-[#00f0ff]" />
          </div>
        </div>

        {/* Timeline rows */}
        <div className="space-y-2.5">
          {defaultTimeline.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-[11px] text-slate-400 w-16 shrink-0">{item.time}</span>
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    item.isDone ? 'bg-[#00f0ff] shadow-[0_0_6px_#00f0ff]' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`truncate ${
                    item.isDone ? 'text-slate-300' : 'text-white font-medium'
                  }`}
                >
                  {item.title}
                </span>
              </div>
              <span
                className={`text-[10px] shrink-0 ml-2 ${
                  item.isDone ? 'text-slate-500' : 'text-[#00f0ff]'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onOpenReminders}
          className="mt-3 pt-2 border-t border-[#00f0ff]/10 text-left text-[11px] font-mono text-[#00f0ff] hover:underline"
        >
          View Full Schedule &gt;
        </button>
      </div>

      {/* Quick Commands Card */}
      <div className="md:col-span-5 hud-card p-4 rounded-2xl flex flex-col justify-between">
        <div className="border-b border-[#00f0ff]/15 pb-2 mb-3">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            Quick Commands
          </span>
        </div>

        <div className="space-y-2">
          {/* Start New Task */}
          <button
            onClick={onNewTask}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 text-white text-xs font-mono font-medium transition active:scale-98 shadow-[0_0_10px_rgba(0,240,255,0.1)]"
          >
            <Plus className="w-3.5 h-3.5 text-[#00f0ff]" />
            <span>Start New Task</span>
          </button>

          {/* Open Calendar */}
          <button
            onClick={onOpenReminders}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-mono font-medium transition active:scale-98"
          >
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Open Calendar</span>
          </button>

          {/* Start Voice Chat */}
          <button
            onClick={onOpenVoice}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-mono font-medium transition active:scale-98"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>Start Voice Chat</span>
          </button>

          {/* Run Workflow */}
          <button
            onClick={onRunWorkflow}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-mono font-medium transition active:scale-98"
          >
            <Play className="w-3.5 h-3.5 text-purple-400" />
            <span>Run Workflow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
