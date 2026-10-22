import React from 'react';
import {
  MapPin,
  CloudSun,
  Wifi,
  Mic,
  Play,
  Volume2
} from 'lucide-react';

interface JarvisBottomBarProps {
  onTriggerVoice: () => void;
  onExecutiveBriefing: () => void;
  isListening: boolean;
}

export const JarvisBottomBar: React.FC<JarvisBottomBarProps> = ({
  onTriggerVoice,
  onExecutiveBriefing,
  isListening,
}) => {
  return (
    <footer className="w-full bg-[#030712]/95 backdrop-blur-xl border-t border-[#00f0ff]/15 px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 z-30">
      {/* Left: Location, Weather, Network Pills */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
        {/* Location */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-[#00f0ff]" />
          <div className="text-[11px] leading-none">
            <span className="text-[9px] text-slate-400 block uppercase">Location</span>
            <span className="font-semibold text-white">Bhimber, Pakistan</span>
          </div>
        </div>

        {/* Weather */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-slate-300 hidden sm:flex">
          <CloudSun className="w-3.5 h-3.5 text-amber-400" />
          <div className="text-[11px] leading-none">
            <span className="text-[9px] text-slate-400 block uppercase">Weather</span>
            <span className="font-semibold text-white">28&deg;C Overcast</span>
          </div>
        </div>

        {/* Network */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/5 text-slate-300 hidden md:flex">
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <div className="text-[11px] leading-none">
            <span className="text-[9px] text-slate-400 block uppercase">Network</span>
            <span className="font-semibold text-emerald-400">Excellent</span>
          </div>
        </div>
      </div>

      {/* Center: Glowing "TALK TO VC AI" Capsule matching Reference */}
      <div className="flex-1 flex items-center justify-center max-w-sm mx-auto">
        <button
          onClick={onTriggerVoice}
          className={`relative group px-5 py-2 rounded-full border transition duration-300 flex items-center gap-3 active:scale-95 shadow-[0_0_25px_rgba(0,240,255,0.3)] ${
            isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse'
              : 'bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border-[#00f0ff]/50 text-white hover:border-[#00f0ff]'
          }`}
        >
          {/* Animated wave dots on left */}
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-0.5 h-2 bg-[#00f0ff] rounded-full animate-wave-1" />
            <span className="w-0.5 h-3 bg-[#00f0ff] rounded-full animate-wave-2" />
            <span className="w-0.5 h-4 bg-[#00f0ff] rounded-full animate-wave-3" />
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-white group-hover:text-[#00f0ff] transition">
              {isListening ? 'LISTENING TO YOU...' : 'TALK TO VC AI'}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {isListening ? 'Speak naturally in Hindi/Eng' : 'I am listening...'}
            </span>
          </div>

          {/* Animated wave dots on right */}
          <div className="flex items-center gap-0.5 h-4">
            <span className="w-0.5 h-4 bg-[#00f0ff] rounded-full animate-wave-3" />
            <span className="w-0.5 h-3 bg-[#00f0ff] rounded-full animate-wave-2" />
            <span className="w-0.5 h-2 bg-[#00f0ff] rounded-full animate-wave-1" />
          </div>
        </button>
      </div>

      {/* Right: Executive Briefing Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={onExecutiveBriefing}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/40 text-[#00f0ff] text-xs font-mono font-bold uppercase tracking-wider transition active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.15)]"
        >
          <Play className="w-3.5 h-3.5 fill-[#00f0ff]" />
          <span className="hidden sm:inline">Executive Briefing</span>
          <span className="sm:hidden">Briefing</span>
        </button>
      </div>
    </footer>
  );
};
