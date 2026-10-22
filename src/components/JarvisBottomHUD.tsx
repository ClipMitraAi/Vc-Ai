import React, { useEffect, useRef } from 'react';
import {
  Activity,
  Database,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';
import { MemoryItem } from '../types';

interface JarvisBottomHUDProps {
  memories: MemoryItem[];
  onOpenMemory: () => void;
  onOpenProviders?: () => void;
}

export const JarvisBottomHUD: React.FC<JarvisBottomHUDProps> = ({
  memories,
  onOpenMemory,
  onOpenProviders,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animate neural constellation nodes in Memory Insights
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const nodes = [
      { x: 30, y: 70, vx: 0.15, vy: 0.1 },
      { x: 75, y: 35, vx: -0.1, vy: 0.12 },
      { x: 130, y: 55, vx: 0.08, vy: -0.14 },
      { x: 90, y: 95, vx: -0.12, vy: -0.08 },
      { x: 160, y: 85, vx: 0.1, vy: 0.09 },
      { x: 200, y: 40, vx: -0.11, vy: -0.1 },
      { x: 220, y: 90, vx: 0.08, vy: 0.11 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Move nodes
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 15 || n.x > canvas.width - 15) n.vx *= -1;
        if (n.y < 15 || n.y > canvas.height - 15) n.vy *= -1;
      });

      // Draw connective lines
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 75) {
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
          }
        }
      }
      ctx.stroke();

      // Draw glowing node points
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
      {/* 1. System Monitor (Circular Gauges) */}
      <div className="md:col-span-3 hud-card p-4 rounded-2xl flex flex-col justify-between">
        <div className="border-b border-[#00f0ff]/15 pb-2 mb-2">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            System Monitor
          </span>
        </div>

        {/* 3 Circular Radial Progress Gauges */}
        <div className="grid grid-cols-3 gap-2 py-2">
          {/* CPU 15% */}
          <div className="flex flex-col items-center">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-slate-800"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-[#00f0ff]"
                  strokeWidth="4"
                  strokeDasharray="138"
                  strokeDashoffset={138 - (138 * 15) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold text-white">15%</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">CPU</span>
          </div>

          {/* RAM 54% */}
          <div className="flex flex-col items-center">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-slate-800"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-[#00f0ff]"
                  strokeWidth="4"
                  strokeDasharray="138"
                  strokeDashoffset={138 - (138 * 54) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold text-white">54%</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">RAM</span>
          </div>

          {/* DISK 40% */}
          <div className="flex flex-col items-center">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-slate-800"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="22"
                  className="stroke-[#00f0ff]"
                  strokeWidth="4"
                  strokeDasharray="138"
                  strokeDashoffset={138 - (138 * 40) / 100}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-bold text-white">40%</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">Disk</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-emerald-400 text-center tracking-wider mt-1">
          &bull; System Load Nominal
        </div>
      </div>

      {/* 2. Memory Insights (Constellation Graph) */}
      <div className="md:col-span-4 hud-card p-4 rounded-2xl flex flex-col justify-between">
        <div className="border-b border-[#00f0ff]/15 pb-2 mb-2 flex items-center justify-between">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            Memory Insights
          </span>
          <span className="text-[10px] font-mono text-[#00f0ff]">Live Node Map</span>
        </div>

        <div className="flex items-center justify-between gap-3 my-1">
          {/* Animated SVG/Canvas Constellation */}
          <div className="w-36 h-24 rounded-xl bg-black/40 border border-[#00f0ff]/20 overflow-hidden relative">
            <canvas ref={canvasRef} width={144} height={96} className="w-full h-full" />
          </div>

          {/* Stats Column */}
          <div className="space-y-1.5 text-right font-mono">
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Memories</p>
              <p className="text-sm font-bold text-white">
                {(3380 + memories.length).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Session Turns</p>
              <p className="text-sm font-bold text-[#00f0ff]">22</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Tool Calls</p>
              <p className="text-xs font-bold text-emerald-400">14</p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenMemory}
          className="pt-2 border-t border-[#00f0ff]/10 text-left text-[11px] font-mono text-[#00f0ff] hover:underline"
        >
          View Memory Map &gt;
        </button>
      </div>

      {/* 3. LLM Status Grid */}
      <div className="md:col-span-5 hud-card p-4 rounded-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-2 mb-2">
          <span className="text-xs font-mono font-bold tracking-widest text-slate-200 uppercase">
            LLM Status
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            4 Connected
          </span>
        </div>

        {/* 3x3 Provider Tiles matching Reference */}
        <div className="grid grid-cols-3 gap-1.5 py-1 text-[11px] font-mono">
          {/* Gemini - CONNECTED PRIMARY */}
          <div className="p-2 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-white">Gemini</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-[9px] text-[#00f0ff] uppercase">Connected (3.8)</span>
          </div>

          {/* Groq */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-slate-200">Groq</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[9px] text-emerald-400 uppercase">Connected</span>
          </div>

          {/* Claude Code */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-slate-200">Claude Code</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[9px] text-emerald-400 uppercase">Connected</span>
          </div>

          {/* Cursor */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-slate-200">Cursor</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-[9px] text-emerald-400 uppercase">Connected</span>
          </div>

          {/* OpenAI */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 opacity-60">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-slate-400">OpenAI</span>
            </div>
            <span className="text-[9px] text-slate-500 uppercase">Not Linked</span>
          </div>

          {/* Claude */}
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 opacity-60">
            <div className="flex items-center justify-between mb-0.5">
              <span className="font-bold text-slate-400">Claude</span>
            </div>
            <span className="text-[9px] text-slate-500 uppercase">Not Linked</span>
          </div>
        </div>

        <button
          onClick={onOpenProviders}
          className="pt-2 border-t border-[#00f0ff]/10 text-left text-[11px] font-mono text-[#00f0ff] hover:underline"
        >
          Manage Providers &gt;
        </button>
      </div>
    </div>
  );
};
