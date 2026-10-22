import React, { useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  Trash2,
  Download,
  Mic,
  Send,
  Globe,
  Bot
} from 'lucide-react';
import { Message, ModeId, UserProfile } from '../types';
import { ALL_MODES } from '../data/modes';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface JarvisChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (text: string, image?: { data: string; mimeType: string; preview: string }, usedVoice?: boolean) => void;
  isLoading: boolean;
  onStop: () => void;
  currentMode: ModeId;
  onSelectMode: (mode: ModeId) => void;
  useSearch: boolean;
  onToggleSearch: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  onClearMessages: () => void;
  onExportChat: () => void;
  userProfile: UserProfile;
}

export const JarvisChatDrawer: React.FC<JarvisChatDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
  onStop,
  currentMode,
  onSelectMode,
  useSearch,
  onToggleSearch,
  autoSpeak,
  onToggleAutoSpeak,
  onClearMessages,
  onExportChat,
  userProfile,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  if (!isOpen) return null;

  const activeModeMeta = ALL_MODES.find((m) => m.id === currentMode) || ALL_MODES[0];

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-in-out flex flex-col bg-[#050b18]/95 backdrop-blur-2xl border-t lg:border-t-0 lg:border-l border-[#00f0ff]/30 shadow-[-10px_0_40px_rgba(0,0,0,0.8)] ${
        isExpanded
          ? 'inset-0'
          : 'bottom-0 right-0 top-0 w-full lg:w-[480px] xl:w-[540px]'
      }`}
    >
      {/* Drawer Header */}
      <div className="p-3.5 border-b border-[#00f0ff]/20 bg-[#030814]/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.3)]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono font-bold text-sm text-white">VC AI INTERFACE</h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-[#00f0ff]/15 text-[#00f0ff] border border-[#00f0ff]/30">
                {activeModeMeta.title}
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Autonomous Assistant & Neural Companion
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode Selector pills in header */}
          <select
            value={currentMode}
            onChange={(e) => onSelectMode(e.target.value as ModeId)}
            className="bg-[#081528] border border-[#00f0ff]/30 rounded-lg px-2 py-1 text-[11px] font-mono text-[#00f0ff] focus:outline-none"
          >
            {ALL_MODES.map((m) => (
              <option key={m.id} value={m.id} className="bg-[#050b18] text-white">
                {m.title}
              </option>
            ))}
          </select>

          {/* Export */}
          <button
            onClick={onExportChat}
            title="Export conversation to Markdown"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            onClick={onClearMessages}
            title="Clear current thread"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/5"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Dock Window' : 'Expand to Fullscreen'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#00f0ff] hover:bg-white/5 hidden lg:block"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 font-mono">
            <div className="w-16 h-16 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.25)] mb-4">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">VC AI Online & Listening</h4>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Type or tap the mic below. Try: "Kal subah 8 baje reminder lagao", "Cyberpunk Taj Mahal image banao", or chat casually!
            </p>
            <div className="flex flex-wrap justify-center gap-1.5">
              {[
                'Aao baatein karte hain!',
                'Ek reminder set karo kal ke liye',
                'Ek futuristic artwork generate karo',
                'Explain quantum physics in Hinglish',
              ].map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSendMessage(s)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-[#00f0ff]/20 border border-[#00f0ff]/20 text-[11px] text-slate-300 hover:text-white transition"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onRegenerate={() => {
                const lastUser = [...messages].reverse().find((m) => m.role === 'user');
                if (lastUser) onSendMessage(lastUser.content);
              }}
            />
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#081528] border border-[#00f0ff]/20 font-mono text-xs text-[#00f0ff] animate-pulse">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>VC AI is analyzing and generating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-2 border-t border-[#00f0ff]/20 bg-[#030814]/90">
        <ChatInput
          onSendMessage={(text, img, usedVoice) => onSendMessage(text, img, usedVoice)}
          isLoading={isLoading}
          onStop={onStop}
          currentMode={currentMode}
          useSearch={useSearch}
          onToggleSearch={onToggleSearch}
          autoSpeak={autoSpeak}
          onToggleAutoSpeak={onToggleAutoSpeak}
        />
      </div>
    </div>
  );
};
