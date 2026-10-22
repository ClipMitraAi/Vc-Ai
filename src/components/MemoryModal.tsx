import React, { useState } from 'react';
import {
  Brain,
  X,
  Plus,
  Trash2,
  Download,
  ShieldCheck,
  Tag,
  Sparkles,
  Info
} from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
  onAddMemory: (text: string, category: MemoryItem['category']) => void;
  onDeleteMemory: (id: string) => void;
  onClearAll: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  isOpen,
  onClose,
  memories,
  onAddMemory,
  onDeleteMemory,
  onClearAll,
}) => {
  const [newText, setNewText] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('preference');

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    onAddMemory(newText.trim(), category);
    setNewText('');
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vc-ai-memory-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-white/15 p-5 sm:p-6 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                VC AI Memory Vault
              </h2>
              <p className="text-xs text-slate-400">
                Transparent & user-controlled persistent memory
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Note */}
        <div className="my-3 p-3 rounded-2xl bg-violet-950/40 border border-violet-500/20 text-xs text-violet-200 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">Your Privacy is Protected</p>
            <p className="text-[11px] text-violet-300/80">
              VC AI only remembers details you explicitly provide. You can review, add, edit, or delete them anytime.
            </p>
          </div>
        </div>

        {/* Add Memory Form */}
        <form onSubmit={handleAdd} className="mb-4 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="e.g. Preparing for React & System Design interviews, loves masala chai..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
            />
            <button
              type="submit"
              disabled={!newText.trim()}
              className="px-3 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Category:</span>
            {(['preference', 'personal', 'goal', 'favorite'] as const).map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wide transition ${
                  category === cat
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </form>

        {/* Memories List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {memories.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <Brain className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p>No memories saved yet.</p>
              <p className="text-[11px] text-slate-600">
                Add your favorite topics, nickname, or ongoing projects above!
              </p>
            </div>
          ) : (
            memories.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 group hover:border-violet-500/30 transition text-xs"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[9px] uppercase font-bold tracking-wider mt-0.5 shrink-0">
                    {m.category}
                  </span>
                  <p className="text-slate-200 leading-relaxed break-words">{m.text}</p>
                </div>
                <button
                  onClick={() => onDeleteMemory(m.id)}
                  title="Delete memory"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-white/5 transition shrink-0 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-xs">
          <button
            onClick={handleExport}
            disabled={memories.length === 0}
            className="flex items-center gap-1.5 text-slate-300 hover:text-white disabled:opacity-40 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Memory (JSON)</span>
          </button>

          {memories.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Are you sure you want to delete all saved memories?')) {
                  onClearAll();
                }
              }}
              className="text-rose-400 hover:text-rose-300 text-[11px] transition"
            >
              Clear All Memory
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
