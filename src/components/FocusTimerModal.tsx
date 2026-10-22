import React, { useState, useEffect, useRef } from 'react';
import {
  Target,
  Play,
  Pause,
  RotateCcw,
  X,
  Volume2,
  VolumeX,
  CheckCircle,
  Plus
} from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({ isOpen, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [ambientSound, setAmbientSound] = useState(false);
  const [tasks, setTasks] = useState<string[]>([
    'Focus on current priority task without distractions',
  ]);
  const [newTask, setNewTask] = useState('');

  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<any>(null);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      // Play soft chime
      playChime();
      if (mode === 'work') {
        alert('Pomodoro completed! Great focus. Take a 5-minute break.');
        setMode('break');
        setSecondsLeft(5 * 60);
      } else {
        alert('Break ended! Ready to focus again?');
        setMode('work');
        setSecondsLeft(25 * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft, mode]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      console.log(e);
    }
  };

  const toggleAmbientSound = () => {
    if (ambientSound) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setAmbientSound(false);
    } else {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        audioCtxRef.current = ctx;

        // Create pink/brown ambient noise buffer
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.04;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        const gainNode = ctx.createGain();
        gainNode.gain.value = 0.15;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        whiteNoise.start();
        noiseNodeRef.current = whiteNoise;
        setAmbientSound(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const resetTimer = (newMode: 'work' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setSecondsLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, newTask.trim()]);
    setNewTask('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel rounded-3xl border border-white/15 p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              VC AI Focus Hub
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Work / Break Switcher */}
        <div className="flex rounded-full bg-white/5 p-1 border border-white/10 mb-6 text-xs font-medium">
          <button
            onClick={() => resetTimer('work')}
            className={`px-4 py-1.5 rounded-full transition ${
              mode === 'work' ? 'bg-violet-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => resetTimer('break')}
            className={`px-4 py-1.5 rounded-full transition ${
              mode === 'break' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            5m Rest
          </button>
        </div>

        {/* Big Timer Display */}
        <div className="relative mb-6">
          <div className="w-44 h-44 rounded-full border-4 border-violet-500/30 flex flex-col items-center justify-center bg-[#090b14] shadow-[0_0_50px_rgba(139,92,246,0.2)]">
            <span className="font-mono text-4xl sm:text-5xl font-extrabold text-white tracking-wider">
              {timeFormatted}
            </span>
            <span className="text-xs uppercase tracking-widest text-violet-400 mt-1 font-semibold">
              {mode === 'work' ? 'Deep Work' : 'Break Time'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm flex items-center gap-2 shadow-lg shadow-violet-600/30 active:scale-95 transition"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={() => resetTimer(mode)}
            title="Reset timer"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleAmbientSound}
            title={ambientSound ? 'Stop ambient rain hum' : 'Play ambient focus noise'}
            className={`p-2.5 rounded-xl border transition active:scale-95 ${
              ambientSound
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                : 'bg-white/5 text-slate-400 border-white/10 hover:text-white'
            }`}
          >
            {ambientSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Task Focus Checklist */}
        <div className="w-full text-left border-t border-white/10 pt-4">
          <p className="text-xs font-semibold text-slate-400 mb-2">Focus Target Checklist</p>
          <div className="space-y-1.5 max-h-32 overflow-y-auto mb-2 pr-1">
            {tasks.map((task, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-xs text-slate-300 p-2 rounded-lg bg-white/5 border border-white/5"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-violet-400" />
                  <span>{task}</span>
                </div>
                <button
                  onClick={() => setTasks(tasks.filter((_, idx) => idx !== i))}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add micro-task..."
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newTask.trim()}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
