import React, { useState } from 'react';
import {
  Sparkles,
  Mic,
  Brain,
  Clock,
  Settings,
  Plus,
  Menu,
  ChevronDown,
  Check,
  Heart,
  ImageIcon,
  Compass,
  Smile,
  HeartHandshake,
  Briefcase,
  GraduationCap,
  Code,
  Globe,
  Target,
  Sliders,
  MessageSquare
} from 'lucide-react';
import { ModeId, UserProfile } from '../types';
import { ALL_MODES } from '../data/modes';

interface HeaderProps {
  currentMode: ModeId;
  onSelectMode: (mode: ModeId) => void;
  onNewChat: () => void;
  onOpenVoice: () => void;
  onOpenMemory: () => void;
  onOpenReminders: () => void;
  onOpenFocus: () => void;
  onOpenImageStudio: () => void;
  onOpenSettings: () => void;
  onToggleSidebar: () => void;
  userProfile: UserProfile;
  remindersCount: number;
}

const MODE_ICON_MAP: Record<string, React.ElementType> = {
  normal: MessageSquare,
  friend: Smile,
  romantic: Heart,
  emotional_support: HeartHandshake,
  work: Briefcase,
  study: GraduationCap,
  coding: Code,
  creative: Sparkles,
  research: Globe,
  voice: Mic,
  focus: Target,
  custom: Sliders,
};

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onNewChat,
  onOpenVoice,
  onOpenMemory,
  onOpenReminders,
  onOpenFocus,
  onOpenImageStudio,
  onOpenSettings,
  onToggleSidebar,
  userProfile,
  remindersCount,
}) => {
  const [modeMenuOpen, setModeMenuOpen] = useState(false);
  const activeModeMeta = ALL_MODES.find((m) => m.id === currentMode) || ALL_MODES[0];
  const CurrentIcon = MODE_ICON_MAP[currentMode] || Sparkles;

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-white/10 px-3 sm:px-5 py-2.5 flex items-center justify-between gap-2">
      {/* Left: Hamburger & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle chat history"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition active:scale-95"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          {/* Animated Glowing AI Orb */}
          <div className="relative group cursor-pointer" onClick={onOpenVoice}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-sky-400 p-[2px] animate-orb-pulse shadow-lg shadow-violet-500/25 flex items-center justify-center">
              <div className="w-full h-full bg-[#0d0f1a] rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-violet-300 group-hover:scale-110 transition duration-300" />
              </div>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-[#090a0f] rounded-full"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-violet-300 bg-clip-text text-transparent">
                VC AI
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Companion
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block truncate max-w-[140px] md:max-w-none">
              {userProfile.nickname ? `With ${userProfile.nickname}` : 'Attentive & Ready ❤️'}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Mode Selector Dropdown */}
      <div className="relative">
        <button
          onClick={() => setModeMenuOpen(!modeMenuOpen)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition shadow-sm ${activeModeMeta.badgeColor} hover:brightness-110 active:scale-95`}
        >
          <CurrentIcon className="w-3.5 h-3.5" />
          <span className="font-semibold">{activeModeMeta.title}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition duration-200 ${modeMenuOpen ? 'rotate-180' : ''}`} />
        </button>

        {modeMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
              onClick={() => setModeMenuOpen(false)}
            />
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 sm:w-80 rounded-2xl glass-panel p-2 shadow-2xl z-50 border border-white/15 max-h-[70vh] overflow-y-auto">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Select Smart Mode (12 Modes)
                </p>
                <p className="text-[11px] text-slate-400">
                  VC AI adapts speech style, reasoning and empathy
                </p>
              </div>

              <div className="space-y-1">
                {ALL_MODES.map((mode) => {
                  const ModeIcon = MODE_ICON_MAP[mode.id] || Sparkles;
                  const isSelected = mode.id === currentMode;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => {
                        onSelectMode(mode.id);
                        setModeMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl flex items-start gap-2.5 transition text-xs ${
                        isSelected
                          ? 'bg-violet-600/30 text-white border border-violet-500/40'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${mode.badgeColor} mt-0.5`}>
                        <ModeIcon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white">{mode.title}</span>
                          <span className="text-[10px] text-slate-400">{mode.hindiTitle}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{mode.description}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-violet-400 shrink-0 self-center" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Voice Chat Orb button */}
        <button
          onClick={onOpenVoice}
          title="Start Spoken Voice Conversation"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-medium shadow-md shadow-violet-500/20 active:scale-95 transition"
        >
          <Mic className="w-3.5 h-3.5 animate-pulse" />
          <span className="hidden sm:inline">Voice</span>
        </button>

        {/* AI Image Studio */}
        <button
          onClick={onOpenImageStudio}
          title="AI Image Studio"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition active:scale-95"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        {/* Focus Timer / Pomodoro */}
        <button
          onClick={onOpenFocus}
          title="Focus & Pomodoro Timer"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition active:scale-95 hidden md:block"
        >
          <Target className="w-4 h-4" />
        </button>

        {/* Reminders / To-dos */}
        <button
          onClick={onOpenReminders}
          title="Reminders & To-Dos"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition active:scale-95 relative"
        >
          <Clock className="w-4 h-4" />
          {remindersCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          )}
        </button>

        {/* Memory Vault */}
        <button
          onClick={onOpenMemory}
          title="VC AI Memory Bank"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition active:scale-95 hidden sm:block"
        >
          <Brain className="w-4 h-4 text-violet-300" />
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Settings & Personalization"
          className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition active:scale-95"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          title="New Conversation"
          className="ml-1 p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition active:scale-95 border border-white/10"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
