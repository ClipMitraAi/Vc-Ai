import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  RefreshCw,
  Sliders,
  Check
} from 'lucide-react';
import { ModeId, UserProfile } from '../types';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (text: string) => Promise<string | undefined>;
  userProfile: UserProfile;
  currentMode: ModeId;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  isOpen,
  onClose,
  onSendMessage,
  userProfile,
  currentMode,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAiResponse, setLastAiResponse] = useState(
    'Hey! Main VC AI hoon ❤️ Kahiye, main sun raha hoon.'
  );
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Zephyr' | 'Fenrir'>('Kore');
  const [handsFree, setHandsFree] = useState(true);

  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (!isOpen) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Works for Indian English, Hindi & Hinglish

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = (e: any) => {
        console.error('Speech error', e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
    };
  }, [isOpen]);

  const startListening = () => {
    if (isSpeaking) {
      if (audioPlayerRef.current) audioPlayerRef.current.pause();
      setIsSpeaking(false);
    }
    if (recognitionRef.current) {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stopListeningAndProcess = async () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);

    if (!transcript.trim()) return;

    setIsProcessing(true);
    try {
      const aiReply = await onSendMessage(transcript.trim());
      if (aiReply) {
        setLastAiResponse(aiReply);
        playSpeech(aiReply);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  const playSpeech = async (text: string) => {
    try {
      setIsSpeaking(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voice: selectedVoice,
        }),
      });

      if (!res.ok) throw new Error('TTS failed');
      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(data.audioData);
        audioPlayerRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          // If hands-free mode is on, start listening again!
          if (handsFree) {
            setTimeout(() => startListening(), 800);
          }
        };
        audio.onerror = () => setIsSpeaking(false);
        await audio.play();
      } else {
        fallbackBrowserVoice(text);
      }
    } catch (e) {
      fallbackBrowserVoice(text);
    }
  };

  const fallbackBrowserVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
      utterance.onend = () => {
        setIsSpeaking(false);
        if (handsFree) {
          setTimeout(() => startListening(), 800);
        }
      };
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn">
      {/* Top Header */}
      <div className="w-full max-w-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <span className="text-xs uppercase font-bold tracking-wider text-slate-300">
            VC AI Voice Companion
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Hands-free mode toggle */}
          <button
            onClick={() => setHandsFree(!handsFree)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
              handsFree
                ? 'bg-violet-600/30 text-violet-300 border-violet-500/40'
                : 'bg-white/5 text-slate-400 border-white/10'
            }`}
          >
            Hands-Free: {handsFree ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Voice Orb & Waveforms */}
      <div className="flex flex-col items-center justify-center my-auto text-center px-4">
        {/* Animated Orb */}
        <div className="relative mb-8 cursor-pointer" onClick={isListening ? stopListeningAndProcess : startListening}>
          <div
            className={`w-40 h-40 sm:w-52 sm:h-52 rounded-full p-1.5 transition-all duration-500 flex items-center justify-center ${
              isSpeaking
                ? 'bg-gradient-to-tr from-rose-500 via-fuchsia-500 to-sky-400 shadow-[0_0_80px_rgba(244,63,94,0.6)] animate-pulse'
                : isListening
                ? 'bg-gradient-to-tr from-violet-600 via-indigo-500 to-emerald-400 shadow-[0_0_80px_rgba(139,92,246,0.6)] scale-105'
                : isProcessing
                ? 'bg-gradient-to-tr from-amber-500 via-violet-600 to-cyan-500 shadow-[0_0_60px_rgba(245,158,11,0.5)] animate-spin'
                : 'bg-gradient-to-tr from-violet-600 to-sky-500 shadow-[0_0_40px_rgba(139,92,246,0.3)]'
            }`}
          >
            <div className="w-full h-full bg-[#0a0c16] rounded-full flex flex-col items-center justify-center relative overflow-hidden">
              {/* Dynamic waveform bars inside orb */}
              <div className="flex items-center gap-1.5 h-12">
                <span className={`w-1.5 bg-violet-400 rounded-full transition-all ${isSpeaking ? 'wave-bar-1' : isListening ? 'h-8' : 'h-2'}`} />
                <span className={`w-1.5 bg-fuchsia-400 rounded-full transition-all ${isSpeaking ? 'wave-bar-2' : isListening ? 'h-10' : 'h-3'}`} />
                <span className={`w-1.5 bg-sky-400 rounded-full transition-all ${isSpeaking ? 'wave-bar-3' : isListening ? 'h-6' : 'h-4'}`} />
                <span className={`w-1.5 bg-rose-400 rounded-full transition-all ${isSpeaking ? 'wave-bar-4' : isListening ? 'h-12' : 'h-3'}`} />
                <span className={`w-1.5 bg-emerald-400 rounded-full transition-all ${isSpeaking ? 'wave-bar-5' : isListening ? 'h-8' : 'h-2'}`} />
              </div>
              <p className="text-[11px] font-semibold text-slate-300 mt-2">
                {isSpeaking
                  ? 'VC AI is Speaking...'
                  : isListening
                  ? 'Listening to you...'
                  : isProcessing
                  ? 'Thinking...'
                  : 'Tap Orb to Speak'}
              </p>
            </div>
          </div>
        </div>

        {/* Live User Transcript */}
        {transcript && (
          <div className="max-w-lg mb-4 p-3 rounded-2xl glass-panel text-violet-200 text-sm italic border border-violet-500/30">
            "{transcript}"
          </div>
        )}

        {/* AI Response Display */}
        <div className="max-w-lg text-slate-200 text-sm sm:text-base leading-relaxed px-4 max-h-40 overflow-y-auto">
          {lastAiResponse}
        </div>
      </div>

      {/* Bottom Voice Controls & Selectors */}
      <div className="w-full max-w-xl space-y-4">
        {/* Voice Character Selectors */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Voice:</span>
          {(['Kore', 'Puck', 'Zephyr', 'Fenrir'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setSelectedVoice(v)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                selectedVoice === v
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              {v === 'Kore' && 'Kore (Warm)'}
              {v === 'Puck' && 'Puck (Playful)'}
              {v === 'Zephyr' && 'Zephyr (Calm)'}
              {v === 'Fenrir' && 'Fenrir (Deep)'}
            </button>
          ))}
        </div>

        {/* Big Tap to Speak button */}
        <div className="flex items-center justify-center gap-4">
          {isListening ? (
            <button
              onClick={stopListeningAndProcess}
              className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 active:scale-95 transition"
            >
              <MicOff className="w-5 h-5" />
              <span>Done Speaking</span>
            </button>
          ) : (
            <button
              onClick={startListening}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold flex items-center gap-2 shadow-xl shadow-violet-600/40 active:scale-95 transition"
            >
              <Mic className="w-5 h-5" />
              <span>Tap to Speak (Hindi / Hinglish / Eng)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
