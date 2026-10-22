import React, { useState } from 'react';
import {
  MessageSquare,
  Search,
  Plus,
  Trash2,
  Pin,
  PinOff,
  X,
  Sparkles,
  Heart,
  Brain,
  Globe,
  Settings,
  Clock
} from 'lucide-react';
import { ChatThread, LanguagePref, ModeId } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelectThread: (id: string) => void;
  onNewThread: () => void;
  onDeleteThread: (id: string) => void;
  onTogglePin: (id: string) => void;
  languagePreference: LanguagePref;
  onChangeLanguage: (pref: LanguagePref) => void;
  memoriesCount: number;
  onOpenMemory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  threads,
  activeThreadId,
  onSelectThread,
  onNewThread,
  onDeleteThread,
  onTogglePin,
  languagePreference,
  onChangeLanguage,
  memoriesCount,
  onOpenMemory,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pinnedThreads = filteredThreads.filter((t) => t.isPinned);
  const recentThreads = filteredThreads.filter((t) => !t.isPinned);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 w-72 sm:w-80 glass-panel border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-72'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-md shadow-violet-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">VC AI Chats</h2>
              <p className="text-[11px] text-slate-400">Conversations & Memory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewThread();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs sm:text-sm shadow-lg shadow-violet-600/30 transition active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Nayi Baat Shuru Karein</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search chat history..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
            />
          </div>
        </div>

        {/* Language selector chips */}
        <div className="px-3 pb-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Language Style</span>
            <span className="text-violet-400 capitalize">{languagePreference}</span>
          </div>
          <div className="grid grid-cols-3 gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-xs">
            {(['hinglish', 'hindi', 'english'] as LanguagePref[]).map((lang) => (
              <button
                key={lang}
                onClick={() => onChangeLanguage(lang)}
                className={`py-1 rounded text-center font-medium capitalize text-[11px] transition ${
                  languagePreference === lang
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {lang === 'hinglish' ? 'Hinglish' : lang === 'hindi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3">
          {/* Pinned section */}
          {pinnedThreads.length > 0 && (
            <div>
              <p className="px-2 text-[10px] uppercase font-bold text-violet-400 tracking-wider mb-1 flex items-center gap-1">
                <Pin className="w-3 h-3" /> Pinned
              </p>
              <div className="space-y-0.5">
                {pinnedThreads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === activeThreadId}
                    onSelect={() => {
                      onSelectThread(thread.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    onDelete={() => onDeleteThread(thread.id)}
                    onTogglePin={() => onTogglePin(thread.id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recent chats */}
          <div>
            <p className="px-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">
              Recent Conversations ({recentThreads.length})
            </p>
            {recentThreads.length === 0 && pinnedThreads.length === 0 ? (
              <div className="text-center py-8 px-4 text-slate-500 text-xs">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                <p>Abhi koi chat nahi hai.</p>
                <p className="text-[11px] text-slate-600">Start talking to VC AI!</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {recentThreads.map((thread) => (
                  <ThreadItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === activeThreadId}
                    onSelect={() => {
                      onSelectThread(thread.id);
                      if (window.innerWidth < 1024) onClose();
                    }}
                    onDelete={() => onDeleteThread(thread.id)}
                    onTogglePin={() => onTogglePin(thread.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Snapshot Card: Memory & Security */}
        <div className="p-3 border-t border-white/10 bg-black/20">
          <button
            onClick={() => {
              onOpenMemory();
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-between p-2 rounded-xl glass-panel-subtle hover:bg-white/5 border border-white/10 transition text-left"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-300 flex items-center justify-center">
                <Brain className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">VC AI Memory</p>
                <p className="text-[10px] text-slate-400">
                  {memoriesCount} remembered {memoriesCount === 1 ? 'detail' : 'details'}
                </p>
              </div>
            </div>
            <span className="text-[10px] text-violet-400 hover:underline">Manage</span>
          </button>
        </div>
      </aside>
    </>
  );
};

interface ThreadItemProps {
  thread: ChatThread;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

const ThreadItem: React.FC<ThreadItemProps> = ({
  thread,
  isActive,
  onSelect,
  onDelete,
  onTogglePin,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition text-xs ${
        isActive
          ? 'bg-violet-600/25 text-white border border-violet-500/30'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-violet-400' : 'text-slate-500'}`} />
        <span className="truncate font-medium text-[12px]">{thread.title || 'New Conversation'}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePin();
          }}
          title={thread.isPinned ? 'Unpin' : 'Pin to top'}
          className="p-1 rounded text-slate-400 hover:text-amber-400 transition"
        >
          {thread.isPinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete chat"
          className="p-1 rounded text-slate-400 hover:text-rose-400 transition"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
