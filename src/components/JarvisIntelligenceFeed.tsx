import React from 'react';
import {
  Calendar,
  AlertTriangle,
  GitPullRequest,
  Target,
  Cpu,
  ArrowRight
} from 'lucide-react';

interface JarvisIntelligenceFeedProps {
  onOpenTasks: () => void;
  onOpenFeed?: () => void;
}

export const JarvisIntelligenceFeed: React.FC<JarvisIntelligenceFeedProps> = ({
  onOpenTasks,
  onOpenFeed,
}) => {
  const feedItems = [
    {
      id: 'f1',
      title: 'Design review with the product team',
      category: 'Meeting',
      tag: 'INFO',
      tagColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      icon: Calendar,
      iconColor: 'text-sky-400',
    },
    {
      id: 'f2',
      title: '2 tasks are overdue — "Polish voice pipeline"',
      category: 'Overdue',
      tag: 'WARN',
      tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    {
      id: 'f3',
      title: '3 pull requests are awaiting your review',
      category: 'Github',
      tag: 'TIP',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: GitPullRequest,
      iconColor: 'text-emerald-400',
    },
    {
      id: 'f4',
      title: 'Your deep-work block is 2-4 PM. Notifications muted',
      category: 'Focus',
      tag: 'TIP',
      tagColor: 'bg-[#00f0ff]/20 text-[#00f0ff] border-[#00f0ff]/30',
      icon: Target,
      iconColor: 'text-[#00f0ff]',
    },
    {
      id: 'f5',
      title: 'CPU usage at 15%. System load nominal',
      category: 'System',
      tag: 'LIVE',
      tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Cpu,
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="hud-card p-4 rounded-2xl flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-2 mb-2.5">
        <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
          Live Intelligence Feed
        </span>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold tracking-wider border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          LIVE
        </span>
      </div>

      {/* Feed List */}
      <div className="space-y-2 flex-1 overflow-y-auto pr-1">
        {feedItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="p-2 rounded-xl bg-[#061224]/70 border border-white/5 hover:border-[#00f0ff]/30 transition flex items-start justify-between gap-2 text-xs"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-slate-200 text-[11px] leading-tight line-clamp-1">
                    {item.title}
                  </p>
                  <span className="text-[10px] font-mono text-slate-400">{item.category}</span>
                </div>
              </div>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase shrink-0 ${item.tagColor}`}
              >
                {item.tag}
              </span>
            </div>
          );
        })}

        {/* Action Callout */}
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <div className="min-w-0">
              <p className="text-[11px] font-mono font-bold text-white truncate">2 tasks overdue</p>
              <p className="text-[10px] font-mono text-slate-400 truncate">
                Review the board and reschedule...
              </p>
            </div>
          </div>
          <button
            onClick={onOpenTasks}
            className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-mono font-bold uppercase transition shrink-0"
          >
            View Tasks
          </button>
        </div>
      </div>

      {/* Footer */}
      <button
        onClick={onOpenFeed || onOpenTasks}
        className="pt-2 border-t border-[#00f0ff]/10 text-left text-[11px] font-mono text-[#00f0ff] hover:underline flex items-center gap-1 mt-2"
      >
        <span>View All Intelligence</span>
        <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  );
};
