import React, { useState } from 'react';
import {
  Clock,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar,
  Download,
  BellRing
} from 'lucide-react';
import { ReminderItem } from '../types';

interface RemindersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: ReminderItem[];
  onAddReminder: (title: string, datetime: string) => void;
  onToggleComplete: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

export const RemindersDrawer: React.FC<RemindersDrawerProps> = ({
  isOpen,
  onClose,
  reminders,
  onAddReminder,
  onToggleComplete,
  onDeleteReminder,
}) => {
  const [title, setTitle] = useState('');
  const [datetime, setDatetime] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !datetime) return;
    onAddReminder(title.trim(), datetime);
    setTitle('');
    setDatetime('');
  };

  // Export all pending reminders to .ics file for Google Calendar / Apple Calendar
  const handleExportICS = () => {
    if (reminders.length === 0) return;

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VC AI//Reminders//EN',
    ];

    reminders.forEach((r, idx) => {
      const dt = new Date(r.datetime);
      const dtStr = dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:vc-ai-${r.id}-${idx}@vc-ai.app`,
        `DTSTAMP:${dtStr}`,
        `DTSTART:${dtStr}`,
        `SUMMARY:${r.title}`,
        'DESCRIPTION:Created with VC AI Personal Assistant',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vc-ai-reminders-${Date.now()}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md h-full glass-panel border-l border-white/10 p-5 flex flex-col animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-300 flex items-center justify-center border border-violet-500/30">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">VC AI Reminders & Tasks</h3>
              <p className="text-[11px] text-slate-400">Timely alerts & calendar schedule</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add Reminder Form */}
        <form onSubmit={handleSubmit} className="my-4 p-3 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
          <p className="text-xs font-semibold text-slate-300">Set New Reminder</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Call Mom, Finish Project Report, Water Plants"
            className="w-full bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50"
          />
          <div className="flex gap-2">
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500/50"
            />
            <button
              type="submit"
              disabled={!title.trim() || !datetime}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 text-white font-medium text-xs flex items-center gap-1 transition shadow-md shadow-violet-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Reminders List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {reminders.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <BellRing className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p>Koi reminder pending nahi hai.</p>
              <p className="text-[11px] text-slate-600">Add tasks to stay organized!</p>
            </div>
          ) : (
            reminders.map((rem) => {
              const formattedDate = new Date(rem.datetime).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={rem.id}
                  className={`p-3 rounded-xl border transition flex items-center justify-between text-xs ${
                    rem.completed
                      ? 'bg-white/5 border-white/5 opacity-50'
                      : 'glass-panel-subtle border-white/10 hover:border-violet-500/30'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleComplete(rem.id)}
                      className="text-violet-400 hover:text-violet-300 shrink-0"
                    >
                      {rem.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`font-medium truncate ${
                          rem.completed ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {rem.title}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{formattedDate}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteReminder(rem.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-white/5 transition ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          <button
            onClick={handleExportICS}
            disabled={reminders.length === 0}
            className="flex items-center gap-1.5 text-violet-300 hover:text-violet-200 disabled:opacity-40 transition font-medium"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to Google/Apple Calendar (.ics)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
