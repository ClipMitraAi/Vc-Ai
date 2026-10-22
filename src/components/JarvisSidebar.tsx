import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Bot,
  CheckSquare,
  Calendar,
  Database,
  MessageSquare,
  Network,
  Wrench,
  GitFork,
  Mic,
  MicOff,
  Zap
} from 'lucide-react';

export type JarvisTab =
  | 'command-center'
  | 'ai-core'
  | 'agents'
  | 'tasks'
  | 'calendar'
  | 'memory'
  | 'conversations'
  | 'knowledge'
  | 'tools'
  | 'workflows';

interface JarvisSidebarProps {
  activeTab: JarvisTab;
  onSelectTab: (tab: JarvisTab) => void;
  tasksCount: number;
  conversationsCount: number;
  toolsCount: number;
  isListening: boolean;
  onToggleVoice: () => void;
  onOpenFocus: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const JarvisSidebar: React.FC<JarvisSidebarProps> = ({
  activeTab,
  onSelectTab,
  tasksCount,
  conversationsCount,
  toolsCount,
  isListening,
  onToggleVoice,
  onOpenFocus,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'command-center' as const, label: 'Command Center', icon: LayoutDashboard },
    { id: 'ai-core' as const, label: 'AI Core', icon: Cpu },
    { id: 'agents' as const, label: 'Agents', icon: Bot },
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare, badge: tasksCount || 3 },
    { id: 'calendar' as const, label: 'Calendar', icon: Calendar },
    { id: 'memory' as const, label: 'Memory', icon: Database },
    { id: 'conversations' as const, label: 'Conversations', icon: MessageSquare, badge: conversationsCount || 12 },
    { id: 'knowledge' as const, label: 'Knowledge Base', icon: Network },
    { id: 'tools' as const, label: 'Tools & Skills', icon: Wrench, badge: toolsCount || 18 },
    { id: 'workflows' as const, label: 'Workflows', icon: GitFork },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-64 xl:w-72 bg-[#050b18]/95 lg:bg-[#050b18]/80 backdrop-blur-xl border-r border-[#00f0ff]/15 flex flex-col justify-between transition-transform duration-300 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Logo & System Title */}
        <div className="p-4 border-b border-[#00f0ff]/15">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full border border-[#00f0ff]/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <div className="w-6 h-6 rounded-full border border-[#00f0ff] animate-spin border-dashed" />
              <div className="absolute w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-widest text-sm text-white">VC AI</span>
                <span className="text-[9px] uppercase tracking-wider text-[#00f0ff] px-1 py-0.2 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded">
                  HUD
                </span>
              </div>
              <p className="text-[10px] tracking-wider text-slate-400 uppercase font-mono">
                Command Center
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (window.innerWidth < 1024) onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium tracking-wide transition duration-150 ${
                  isActive
                    ? 'bg-[#00f0ff]/12 text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00f0ff]' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold ${
                      isActive
                        ? 'bg-[#00f0ff] text-[#050b18]'
                        : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom: Voice Status Widget & Focus Mode */}
        <div className="p-3 border-t border-[#00f0ff]/15 space-y-2.5 bg-[#030712]/60">
          {/* Voice Status Box */}
          <div className="hud-card p-3 rounded-xl border border-[#00f0ff]/20">
            <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-mono mb-2">
              <span>Voice Status</span>
              <span className="text-[#00f0ff] animate-pulse">&gt;</span>
            </div>

            {/* Audio Wave Visualizer */}
            <div className="flex items-center justify-center gap-1 h-6 mb-3 px-2">
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-1" />
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-2" />
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-3" />
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-4" />
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-5" />
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-6" />
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-2" />
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-4" />
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-1" />
              <span className="w-1 bg-[#00f0ff] rounded-full animate-wave-3" />
            </div>

            {/* Tap to Speak Reactor Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={onToggleVoice}
                title="Toggle Voice Assistant"
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition active:scale-95 ${
                  isListening
                    ? 'bg-rose-500/20 border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
                    : 'bg-[#00f0ff]/10 border-2 border-[#00f0ff]/60 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:border-[#00f0ff] hover:bg-[#00f0ff]/20'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 text-rose-400" />
                ) : (
                  <Mic className="w-5 h-5 text-[#00f0ff]" />
                )}
              </button>
              <span className="text-[10px] text-slate-300 font-medium mt-1.5">
                {isListening ? 'Listening...' : 'Tap to Speak'}
              </span>
            </div>
          </div>

          {/* Focus Mode Button */}
          <button
            onClick={onOpenFocus}
            className="w-full py-2 px-3 rounded-xl bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/30 text-[#00f0ff] text-xs font-medium tracking-wide flex items-center justify-center gap-2 transition active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.15)]"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Focus Mode</span>
          </button>
        </div>
      </aside>
    </>
  );
};
