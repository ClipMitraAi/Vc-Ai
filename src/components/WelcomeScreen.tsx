import React from 'react';
import {
  Sparkles,
  Heart,
  Briefcase,
  Compass,
  Mic,
  MessageSquareHeart,
  Smile,
  HeartHandshake,
  Flame,
  Coffee,
  Code
} from 'lucide-react';
import { ModeId, UserProfile } from '../types';
import { WELCOME_QUICK_ACTIONS } from '../data/modes';

interface WelcomeScreenProps {
  onQuickAction: (prompt: string, mode: ModeId) => void;
  userProfile: UserProfile;
  onOpenVoice: () => void;
}

const ACTION_ICON_MAP: Record<string, React.ElementType> = {
  MessageSquareHeart: MessageSquareHeart,
  Heart: Heart,
  Compass: Compass,
  Briefcase: Briefcase,
  Sparkles: Sparkles,
  Mic: Mic,
};

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onQuickAction,
  userProfile,
  onOpenVoice,
}) => {
  const userName = userProfile.nickname || userProfile.name || '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center justify-center text-center">
      {/* Animated Orb Centerpiece */}
      <div className="relative mb-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-500 to-sky-400 p-[3px] animate-orb-pulse shadow-2xl shadow-violet-500/40 flex items-center justify-center">
          <div className="w-full h-full bg-[#0a0c16] rounded-full flex flex-col items-center justify-center">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-violet-300 drop-shadow" />
          </div>
        </div>
        <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-violet-600 border border-violet-400/50 text-[10px] font-bold text-white shadow-lg flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          VC AI 3.8
        </div>
      </div>

      {/* Welcoming Greeting from Master Prompt */}
      <div className="space-y-2 mb-8 max-w-2xl">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
          Hey{userName ? ` ${userName}` : ''}! Main VC AI hoon <span className="text-rose-400 animate-pulse inline-block">❤️</span>
        </h2>
        <p className="text-base sm:text-lg text-slate-300 font-medium">
          Batao, aaj hum kya karein — baatein, kaam, ya kuch naya?
        </p>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          Aapka personal companion: natural Hinglish & Hindi baatein, emotional understanding, romantic mode, productivity, aur real everyday help.
        </p>
      </div>

      {/* Mood Check-In Pills */}
      <div className="w-full mb-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Aapka Mood Kaisa Hai Aaj?
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
          <button
            onClick={() => onQuickAction('Hey VC AI, bas aisi hi casual baat karne ka mann hai. Kya haal chal?', 'normal')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-violet-600/20 hover:border-violet-500/40 border border-white/10 text-xs text-slate-300 hover:text-white transition active:scale-95"
          >
            <Smile className="w-3.5 h-3.5 text-emerald-400" />
            <span>Casual Baat 😊</span>
          </button>

          <button
            onClick={() => onQuickAction('VC AI, aaj dil thoda udaas aur tired hai. Dil ki baat share karni hai.', 'emotional_support')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-amber-600/20 hover:border-amber-500/40 border border-white/10 text-xs text-slate-300 hover:text-white transition active:scale-95"
          >
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            <span>Thoda Low Feel Ho Raha Hai 🥺</span>
          </button>

          <button
            onClick={() => onQuickAction('VC AI, aaj thoda romantic aur sweet mood hai ❤️ Ek pyaari si baat kaho na!', 'romantic')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-rose-600/20 hover:border-rose-500/40 border border-white/10 text-xs text-slate-300 hover:text-white transition active:scale-95"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Romantic Vibe ❤️</span>
          </button>

          <button
            onClick={() => onQuickAction('Office aur kaam ka kaafi load hai, structured plan banane mein help karo.', 'work')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/40 border border-white/10 text-xs text-slate-300 hover:text-white transition active:scale-95"
          >
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>Work & Productivity 💼</span>
          </button>

          <button
            onClick={() => onQuickAction('Mujhe ek coding problem solve karni hai, code helper mode on karo.', 'coding')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-purple-600/20 hover:border-purple-500/40 border border-white/10 text-xs text-slate-300 hover:text-white transition active:scale-95"
          >
            <Code className="w-3.5 h-3.5 text-purple-400" />
            <span>Coding / Tech 💻</span>
          </button>
        </div>
      </div>

      {/* 6 Quick Action Cards as per Master Prompt */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-left mb-6">
        {WELCOME_QUICK_ACTIONS.map((action, idx) => {
          const Icon = ACTION_ICON_MAP[action.icon] || Sparkles;
          const isVoice = action.mode === 'voice';

          return (
            <div
              key={idx}
              onClick={() => {
                if (isVoice) {
                  onOpenVoice();
                } else {
                  onQuickAction(action.prompt, action.mode);
                }
              }}
              className="group p-4 rounded-2xl glass-panel-subtle hover:bg-white/10 border border-white/10 hover:border-violet-500/40 transition duration-200 cursor-pointer shadow-lg hover:shadow-violet-500/10 flex flex-col justify-between active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 text-violet-300 group-hover:text-white group-hover:bg-violet-600 transition flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-300">
                  {action.hindi}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-violet-200 transition mb-1">
                  {action.title}
                </h3>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 line-clamp-2">
                  {action.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Hint */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Sparkles className="w-3.5 h-3.5 text-violet-400" />
        <span>Tip: You can switch between friendly, romantic, coding, and work modes anytime!</span>
      </div>
    </div>
  );
};
