import React, { useState } from 'react';
import {
  Settings,
  X,
  User,
  Heart,
  Globe,
  Sliders,
  Shield,
  Trash2,
  Check,
  Sparkles
} from 'lucide-react';
import { LanguagePref, UserProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
  onResetAllData,
}) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(profile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-white/15 p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-600/20 text-violet-300 flex items-center justify-center border border-violet-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">VC AI Personalization</h2>
              <p className="text-xs text-slate-400">Customize how VC AI addresses and connects with you</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name & Nickname */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="e.g. Rahul"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nickname (How VC AI calls you)</label>
              <input
                type="text"
                value={profile.nickname}
                onChange={(e) => setProfile({ ...profile, nickname: e.target.value })}
                placeholder="e.g. Dost, Jaan, Boss"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
              />
            </div>
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Primary Language Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'hinglish', label: 'Hinglish (Natural)' },
                { id: 'hindi', label: 'हिंदी (Pure Hindi)' },
                { id: 'english', label: 'English (Fluent)' },
              ].map((lang) => (
                <button
                  type="button"
                  key={lang.id}
                  onClick={() => setProfile({ ...profile, languagePreference: lang.id as LanguagePref })}
                  className={`p-2 rounded-xl text-center font-medium transition border ${
                    profile.languagePreference === lang.id
                      ? 'bg-violet-600/30 text-white border-violet-500/50 shadow-xs'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Relationship Dynamic & Vibe */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              Relationship Tone & Dynamic
            </label>
            <select
              value={profile.relationshipVibe}
              onChange={(e) => setProfile({ ...profile, relationshipVibe: e.target.value })}
              className="w-full bg-[#131625] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-500/50"
            >
              <option value="Warm & Attentive Companion">Warm & Attentive Companion (Balanced)</option>
              <option value="Affectionate & Sweet (Romantic Vibe)">Affectionate & Sweet (Romantic Vibe ❤️)</option>
              <option value="Loyal Best Friend (Pakka Dost)">Loyal Best Friend (Pakka Dost / Yaar 🤝)</option>
              <option value="Professional Productivity Partner">Professional Productivity Partner 💼</option>
              <option value="Inspiring Coach & Mentor">Inspiring Coach & Mentor 🎯</option>
            </select>
          </div>

          {/* Communication Style */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Communication Style</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Warm & Conversational',
                'Crisp & Direct',
                'Playful & Humorous',
                'Poetic & Deep',
              ].map((style) => (
                <button
                  type="button"
                  key={style}
                  onClick={() => setProfile({ ...profile, style })}
                  className={`p-2 rounded-xl text-left transition border ${
                    profile.style === style
                      ? 'bg-violet-600/30 text-white border-violet-500/50'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Persona Instruction */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Custom Persona Prompt (For Custom Mode)
            </label>
            <textarea
              rows={2}
              value={profile.customPersona}
              onChange={(e) => setProfile({ ...profile, customPersona: e.target.value })}
              placeholder="e.g. Act as a strict code reviewer who gives tough love and optimization tips..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none"
            />
          </div>

          {/* Privacy & Transparency statement */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-violet-400" />
              <span>Transparency & Privacy Guarantee</span>
            </p>
            <p>
              VC AI is an AI companion designed for respectful, empathetic, and productivity-focused conversations. VC AI is transparent that it is an artificial intelligence.
            </p>
          </div>

          {/* Save & Reset Actions */}
          <div className="pt-2 flex items-center justify-between border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all chat threads, memories, and settings? This cannot be undone.')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Data</span>
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-violet-600/30 transition active:scale-95"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
