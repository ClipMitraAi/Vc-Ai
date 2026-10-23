import React, { useState, useEffect } from 'react';
import {
  Search,
  Maximize2,
  Grid,
  Bell,
  Settings,
  User,
  Menu,
  ShieldCheck,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { UserProfile } from '../types';

interface JarvisHeaderProps {
  onOpenSettings: () => void;
  onToggleMobileSidebar: () => void;
  userProfile: UserProfile;
  onSearchFocus?: () => void;
  onOpenNotifications?: () => void;
  onOpenAndroidExport?: () => void;
}

export const JarvisHeader: React.FC<JarvisHeaderProps> = ({
  onOpenSettings,
  onToggleMobileSidebar,
  userProfile,
  onSearchFocus,
  onOpenNotifications,
  onOpenAndroidExport,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format: 11:18:21 am
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'pm' : 'am';
      const formattedHours = hours % 12 || 12;
      setTimeStr(`${formattedHours}:${minutes}:${seconds} ${ampm}`);

      // Format: Monday, 15 June 2026
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      };
      setDateStr(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <header className="w-full bg-[#050b18]/90 backdrop-blur-xl border-b border-[#00f0ff]/15 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Left: Hamburger & SYSTEM STATUS OPTIMAL */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle Navigation"
          className="lg:hidden p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/10"
        >
          <Menu className="w-5 h-5 text-[#00f0ff]" />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 shadow-[0_0_12px_rgba(0,240,255,0.15)]">
          <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase">
            System Status
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#00f0ff] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
            Optimal
          </span>
        </div>
      </div>

      {/* Center: Real-Time HUD Digital Clock & Date */}
      <div className="flex flex-col items-center justify-center text-center">
        <span className="text-[11px] tracking-widest text-slate-400 font-mono hidden sm:block">
          {dateStr || 'Monday, 15 June 2026'}
        </span>
        <span className="text-sm sm:text-lg md:text-xl font-mono font-extrabold tracking-wider text-[#00f0ff] text-cyan-glow">
          {timeStr || '11:18:21 am'}
        </span>
      </div>

      {/* Right: Search, HUD Tools & Operator Badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick HUD Search */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-[#00f0ff]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            onClick={onSearchFocus}
            className="w-40 lg:w-56 pl-8 pr-3 py-1.5 rounded-xl bg-[#081528] border border-[#00f0ff]/20 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#00f0ff]/60 focus:ring-1 focus:ring-[#00f0ff]/30 font-mono transition"
          />
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={toggleFullScreen}
          title="Toggle Fullscreen HUD"
          className="p-2 rounded-xl text-slate-400 hover:text-[#00f0ff] hover:bg-white/5 border border-white/5 transition"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Layout Grid Button */}
        <button
          title="Grid Layout View"
          className="p-2 rounded-xl text-slate-400 hover:text-[#00f0ff] hover:bg-white/5 border border-white/5 transition hidden sm:block"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          title="Intelligence Notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-[#00f0ff] hover:bg-white/5 border border-white/5 transition"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_6px_#00f0ff] animate-ping" />
        </button>

        {/* Android APK & Project Export Button */}
        {onOpenAndroidExport && (
          <button
            onClick={onOpenAndroidExport}
            title="Android APK & Studio Project Export"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-[#00f0ff]/20 hover:from-emerald-500/30 hover:to-[#00f0ff]/30 border border-emerald-400/40 text-emerald-300 hover:text-white transition shadow-[0_0_12px_rgba(16,185,129,0.2)]"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono font-bold tracking-wider hidden sm:inline uppercase">
              Android APK
            </span>
          </button>
        )}

        {/* Settings Cog */}
        <button
          onClick={onOpenSettings}
          title="System Settings & Persona"
          className="p-2 rounded-xl text-slate-400 hover:text-[#00f0ff] hover:bg-white/5 border border-white/5 transition"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Operator / Commander Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#00f0ff]/20">
          <div className="w-8 h-8 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.25)]">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-white font-mono leading-none">
              {userProfile.nickname || userProfile.name || 'Operator'}
            </p>
            <p className="text-[10px] text-[#00f0ff] font-mono uppercase tracking-wider">
              Commander
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
