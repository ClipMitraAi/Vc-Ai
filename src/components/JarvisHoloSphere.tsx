import React, { useEffect, useRef } from 'react';
import {
  Cpu,
  Database,
  Mic,
  Bot,
  Layers,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface JarvisHoloSphereProps {
  onTriggerVoice?: () => void;
  memoriesCount: number;
}

export const JarvisHoloSphere: React.FC<JarvisHoloSphereProps> = ({
  onTriggerVoice,
  memoriesCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    // Generate 3D sphere points
    const numPoints = 160;
    const points: Array<{ x: number; y: number; z: number }> = [];
    const radius = 95;

    for (let i = 0; i < numPoints; i++) {
      const theta = Math.acos(-1 + (2 * i) / numPoints);
      const phi = Math.sqrt(numPoints * Math.PI) * theta;
      points.push({
        x: radius * Math.cos(phi) * Math.sin(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(theta),
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      angle += 0.008;

      // Draw Orbit Rings
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 0.4);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.5, radius * 0.45, Math.PI / 6, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 6]);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-angle * 0.3);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius * 1.4, radius * 0.35, -Math.PI / 4, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Project & draw 3D Sphere points & lines
      const projected: Array<{ x: number; y: number; z: number; scale: number }> = [];

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        // Rotate around Y axis
        const cosY = Math.cos(angle);
        const sinY = Math.sin(angle);
        const x1 = p.x * cosY - p.z * sinY;
        const z1 = p.z * cosY + p.x * sinY;

        // Rotate slightly around X axis
        const cosX = Math.cos(0.3);
        const sinX = Math.sin(0.3);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + p.y * sinX;

        const fov = 280;
        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y2 * scale;

        projected.push({ x: projX, y: projY, z: z2, scale });
      }

      // Draw connective wireframe lines between nearby points
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i += 2) {
        for (let j = i + 1; j < projected.length; j += 6) {
          const dx = projected[i].x - projected[j].x;
          const dy = projected[i].y - projected[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 38) {
            ctx.moveTo(projected[i].x, projected[i].y);
            ctx.lineTo(projected[j].x, projected[j].y);
          }
        }
      }
      ctx.stroke();

      // Draw points with glow
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        const alpha = Math.max(0.1, (p.z + radius) / (2 * radius));
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${alpha * 0.85})`;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
      {/* Left: AI Core Overview Card */}
      <div className="lg:col-span-3 hud-card p-4 rounded-2xl flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-[#00f0ff]/15 pb-2 mb-3">
          <span className="text-[11px] font-mono tracking-widest text-slate-300 uppercase">
            AI Core Overview
          </span>
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
        </div>

        <div className="space-y-2 text-xs">
          {/* Core State */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#00f0ff]" />
              <span className="text-slate-300 font-medium">AI Core</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">Active</span>
          </div>

          {/* Memory */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-sky-400" />
              <span className="text-slate-300 font-medium">Memory</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-slate-200">
              {(3380 + memoriesCount).toLocaleString()} Stored
            </span>
          </div>

          {/* Voice */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <Mic className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">Voice</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">Online</span>
          </div>

          {/* Agents */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-violet-400" />
              <span className="text-slate-300 font-medium">Agents</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#00f0ff]">2 Running</span>
          </div>

          {/* LLMs */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-medium">LLMs</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400">4 Connected</span>
          </div>

          {/* System */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-medium">System</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-400">Optimal</span>
          </div>
        </div>
      </div>

      {/* Center: 3D Holographic AI Sphere */}
      <div
        onClick={onTriggerVoice}
        className="lg:col-span-9 hud-card p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer border border-[#00f0ff]/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] min-h-[260px] sm:min-h-[290px]"
      >
        {/* Holographic Wireframe Canvas */}
        <canvas
          ref={canvasRef}
          width={480}
          height={280}
          className="absolute inset-0 m-auto pointer-events-none"
        />

        {/* Center Futuristic Text Overlay matching Reference Image */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-[0.25em] text-[#00f0ff] font-mono drop-shadow-[0_0_20px_rgba(0,240,255,0.9)]">
            JARVIS
          </h2>
          <div className="flex items-center gap-2 my-1">
            <span className="w-6 h-[1px] bg-[#00f0ff]/40" />
            <span className="text-xs sm:text-sm font-mono tracking-[0.3em] text-slate-200 font-bold uppercase">
              AI CORE
            </span>
            <span className="w-6 h-[1px] bg-[#00f0ff]/40" />
          </div>
          <span className="text-[10px] font-mono tracking-widest text-[#00f0ff]/80 uppercase mt-0.5">
            v3.8.0 • AUTONOMOUS
          </span>
        </div>

        {/* Subtle corner HUD reticle brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]/40 pointer-events-none" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#00f0ff]/40 pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#00f0ff]/40 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff]/40 pointer-events-none" />
      </div>
    </div>
  );
};
