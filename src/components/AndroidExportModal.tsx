import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Terminal,
  X,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Info
} from 'lucide-react';

interface AndroidExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidExportModal: React.FC<AndroidExportModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installStatus, setInstallStatus] = useState<string>('');

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setInstallStatus('VC AI installed successfully on your device!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handlePWAInstall = async () => {
    if (!deferredPrompt) {
      // In mobile Chrome without deferred prompt or if already viewed
      setInstallStatus('Mobile Chrome mein 3 dots ⋮ par click karein aur "Install app" ya "Add to Home screen" chunein!');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setInstallStatus('Installation accepted! App launcher mein add ho raha hai.');
    }
    setDeferredPrompt(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#050c1b] border border-[#00f0ff]/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] p-4 sm:p-7 text-slate-200 flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#00f0ff]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-mono text-white flex items-center gap-2">
                VC AI Native Android App & APK Hub
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Kotlin 2.0 • Jetpack Compose • Android Studio Package • Direct Mobile APK Install
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: Instant Mobile Install (PWA Standalone App) */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-[#00f0ff]/10 via-[#0099ff]/5 to-transparent border border-[#00f0ff]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#00f0ff]" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Option 1: Instant Install on Android Mobile (Bina Computer Ke)
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              Apne mobile Chrome mein direct install karein. Yeh standalone APK jaise home screen icon, full-screen HUD aur offline reactor ke sath turant chalta hai.
            </p>
            {installStatus && (
              <p className="text-xs text-emerald-400 font-mono mt-1">{installStatus}</p>
            )}
          </div>
          <button
            onClick={handlePWAInstall}
            className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#00f0ff] hover:bg-[#38bdf8] text-[#040812] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] transition cursor-pointer"
          >
            <Smartphone className="w-4 h-4" />
            {isInstalled ? 'App Already Installed' : 'Install on Android Phone'}
          </button>
        </div>

        {/* Option 2: Full Android Studio Kotlin/Compose Project ZIP */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#08152a] border border-[#00f0ff]/20 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                  Option 2: Native Android Studio Project (.ZIP)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Poora source code package: `MainActivity.kt`, Jetpack Compose HUD, `AndroidManifest.xml`, Gradle config, aur Retrofit API engine shamil hai.
              </p>
            </div>
            <a
              href="/api/download-android-project"
              download="vc-ai-android-project.zip"
              className="shrink-0 w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition"
            >
              <Download className="w-4 h-4" />
              Download Project ZIP (180 KB)
            </a>
          </div>

          {/* Quick 3-Step APK Build Instructions */}
          <div className="p-4 rounded-lg bg-[#040914] border border-white/5 space-y-3">
            <h4 className="text-xs font-bold text-[#00f0ff] font-mono uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5" />
              Android Studio Mein APK Generate Karne Ke 3 Aasan Kadam:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-[#00f0ff] font-bold">01. Open Project</span>
                <p className="text-slate-400 text-[11px] mt-1">
                  ZIP extract karein aur Android Studio mein <b>File &gt; Open</b> karke folder select karein.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-[#00f0ff] font-bold">02. 1-Click Build APK</span>
                <p className="text-slate-400 text-[11px] mt-1">
                  Top menu mein <b>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</b> par click karein.
                </p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <span className="text-emerald-400 font-bold">03. Install on Mobile</span>
                <p className="text-slate-400 text-[11px] mt-1">
                  `app/build/outputs/apk/debug/app-debug.apk` ban kar taiyar ho jayegi! Phone mein bhejein aur install karein.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications & Security */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#08152a] border border-white/10 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-bold block">100% Secure & Zero Leakage</span>
              <span className="text-slate-400 text-[11px]">
                API keys APK mein hardcode nahi hoti hain. Backend API proxy ke through encrypted HTTPS call hoti hai.
              </span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#08152a] border border-white/10 flex items-start gap-3">
            <Cpu className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
            <div>
              <span className="text-white font-bold block">Jetpack Compose UI Architecture</span>
              <span className="text-slate-400 text-[11px]">
                JARVIS HUD canvas, rotating HoloSphere rings, live agents, speech recognition listener and Hinglish voice stream.
              </span>
            </div>
          </div>
        </div>

        {/* Direct APK Compilation Status in Cloud Environment */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <b>Cloud Environment Build Note:</b> AI Studio ka cloud dev container lightweight Node.js container hota hai jisme multi-gigabyte Android SDK/Java tools pre-installed nahi hote. Isiliye humne poora <b>Native Android Studio project package (.ZIP)</b> tayar kiya hai jisse aap 1-click mein apna custom APK bana sakte hain, sath hi <b>Instant Mobile PWA Install</b> bhi active kar diya hai!
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs transition"
          >
            Close HUD
          </button>
        </div>
      </div>
    </div>
  );
};
