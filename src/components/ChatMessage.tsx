import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  ExternalLink,
  Code,
  Eye,
  Heart,
  Brain,
  Share2,
  Clock,
  Target,
  Download
} from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
  onRate?: (rating: 'like' | 'dislike') => void;
  onSaveToMemory?: (text: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onRegenerate,
  onRate,
  onSaveToMemory,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeAudio, setActiveAudio] = useState<HTMLAudioElement | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayVoice = async () => {
    if (isPlayingAudio && activeAudio) {
      activeAudio.pause();
      setIsPlayingAudio(false);
      return;
    }

    try {
      setIsPlayingAudio(true);
      // Call /api/tts endpoint
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: message.content,
          voice: 'Kore',
        }),
      });

      if (!res.ok) {
        throw new Error('TTS server failed');
      }

      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(data.audioData);
        setActiveAudio(audio);
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
      } else {
        fallbackBrowserTTS();
      }
    } catch (e) {
      // Fallback to browser SpeechSynthesis
      fallbackBrowserTTS();
    }
  };

  const fallbackBrowserTTS = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content.slice(0, 300));
      // Try to find Hindi/English voice
      const voices = window.speechSynthesis.getVoices();
      const hindiOrIndianVoice = voices.find(
        (v) => v.lang.includes('hi') || v.lang.includes('en-IN')
      );
      if (hindiOrIndianVoice) utterance.voice = hindiOrIndianVoice;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlayingAudio(false);
    }
  };

  const formatTimestamp = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render markdown-like text with formatting & code blocks
  const renderFormattedContent = (content: string) => {
    // Check if contains code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim();
        const firstLineEnd = lines.indexOf('\n');
        const language = firstLineEnd > 0 ? lines.slice(0, firstLineEnd).trim() : 'text';
        const codeContent = firstLineEnd > 0 ? lines.slice(firstLineEnd + 1) : lines;
        const isWebCode = ['html', 'svg', 'javascript', 'js'].includes(language.toLowerCase());

        return (
          <div key={index} className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#0d0f17] text-xs">
            <div className="flex items-center justify-between px-3 py-1.5 bg-white/5 border-b border-white/5 text-slate-400">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <Code className="w-3.5 h-3.5 text-violet-400" />
                <span>{language}</span>
              </div>
              <div className="flex items-center gap-2">
                {isWebCode && (
                  <button
                    onClick={() => setPreviewHtml(previewHtml ? null : codeContent)}
                    className="flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 transition"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{previewHtml ? 'Close Preview' : 'Run / Preview'}</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(codeContent);
                  }}
                  className="hover:text-white transition flex items-center gap-1 text-[11px]"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {previewHtml && (
              <div className="p-3 bg-white text-black border-b border-white/10 overflow-auto max-h-60">
                <div dangerouslySetInnerHTML={{ __html: codeContent }} />
              </div>
            )}

            <pre className="p-3 overflow-x-auto font-mono text-slate-200 leading-relaxed text-[12px]">
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      }

      // Regular text with basic formatting (bold, italics, line breaks, bullet points)
      return (
        <span key={index} className="whitespace-pre-wrap leading-relaxed text-sm">
          {part}
        </span>
      );
    });
  };

  return (
    <div className={`flex gap-3 my-4 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <User className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-sky-400 p-[2px] shadow-md shadow-violet-500/25">
            <div className="w-full h-full bg-[#0d0f1a] rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-violet-300" />
            </div>
          </div>
        )}
      </div>

      {/* Bubble Container */}
      <div className={`max-w-[88%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Author & Emotion Tag */}
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-xs font-semibold text-slate-300">
            {isUser ? 'You' : 'VC AI'}
          </span>
          <span className="text-[10px] text-slate-500">
            {formatTimestamp(message.timestamp)}
          </span>
          {!isUser && message.emotionTag && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-violet-500/15 text-violet-300 border border-violet-500/20">
              {message.emotionTag === 'romantic' && '❤️ Romantic'}
              {message.emotionTag === 'empathetic' && '🤗 Empathetic'}
              {message.emotionTag === 'excited' && '🎉 Excited'}
              {message.emotionTag === 'productive' && '⚡ Productive'}
              {message.emotionTag === 'warm' && '✨ Warm'}
              {message.emotionTag === 'neutral' && '🤝 Attentive'}
            </span>
          )}
        </div>

        {/* Message Card */}
        <div
          className={`rounded-2xl px-4 py-3 shadow-lg ${
            isUser
              ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-xs'
              : 'glass-panel text-slate-100 rounded-tl-xs border border-white/10'
          }`}
        >
          {/* Attached image if any */}
          {message.imagePreview && (
            <div className="mb-2 rounded-xl overflow-hidden max-w-sm border border-white/15">
              <img
                src={message.imagePreview}
                alt="User attached"
                className="w-full h-auto object-cover max-h-64"
              />
            </div>
          )}

          {/* Body Content */}
          <div className="break-words">
            {renderFormattedContent(message.content)}
          </div>

          {/* Automated Action Cards executed by VC AI */}
          {message.action && (
            <div className="mt-3 space-y-2">
              {/* Auto Generated Image Card */}
              {message.action.generatedImageUrl && (
                <div className="rounded-2xl overflow-hidden border border-violet-500/40 shadow-2xl bg-black/50 p-2">
                  <img
                    src={message.action.generatedImageUrl}
                    alt={message.action.generateImage?.prompt || 'Generated by VC AI'}
                    className="w-full h-auto rounded-xl object-contain max-h-80 hover:scale-[1.01] transition duration-200"
                  />
                  <div className="flex items-center justify-between pt-2 px-1 text-xs">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 truncate max-w-[200px]">
                      <Sparkles className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                      <span>{message.action.generateImage?.prompt || 'Auto-created artwork'}</span>
                    </span>
                    <a
                      href={message.action.generatedImageUrl}
                      download={`vc-ai-art-${Date.now()}.png`}
                      className="text-violet-300 hover:text-white flex items-center gap-1 text-[11px] shrink-0 font-medium bg-white/5 px-2 py-1 rounded-lg"
                    >
                      <Download className="w-3 h-3" />
                      <span>Save</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Auto Reminder Card */}
              {message.action.createReminder && (
                <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/30 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-violet-600/30 text-violet-300 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white flex items-center gap-1">
                        <span>Reminder Set Automatically</span>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </p>
                      <p className="text-[11px] text-slate-300 truncate">
                        {message.action.createReminder.title} &bull; {new Date(message.action.createReminder.datetime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Auto Memory Card */}
              {message.action.saveMemory && (
                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white flex items-center gap-1">
                      <span>Saved to Memory Vault</span>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    </p>
                    <p className="text-[11px] text-slate-300 italic">
                      "{message.action.saveMemory.text}"
                    </p>
                  </div>
                </div>
              )}

              {/* Auto Focus Timer Card */}
              {message.action.startFocusTimer && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2.5 text-xs">
                  <div className="w-7 h-7 rounded-lg bg-amber-600/30 text-amber-300 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Focus Session Started</p>
                    <p className="text-[11px] text-slate-300">
                      {message.action.startFocusTimer.minutes || 25} minutes timer active
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Web Search Grounding Citations */}
          {message.groundings && message.groundings.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-white/10">
              <p className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                <ExternalLink className="w-3 h-3 text-sky-400" />
                <span>Verified Web Sources ({message.groundings.length})</span>
              </p>
              <div className="flex flex-wrap gap-1.5">
                {message.groundings.map((g, i) => (
                  <a
                    key={i}
                    href={g.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-sky-500/20 hover:text-sky-300 border border-white/10 text-[11px] text-slate-300 transition"
                  >
                    <span className="truncate max-w-[200px]">{g.title}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60 shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions Toolbar */}
        <div className="flex items-center gap-1 mt-1.5 px-1 opacity-80 group-hover:opacity-100 transition text-slate-400">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy message"
            className="p-1 rounded-md hover:text-white hover:bg-white/5 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Audio Speak Button */}
          {!isUser && (
            <button
              onClick={handlePlayVoice}
              title={isPlayingAudio ? 'Stop audio' : 'Listen to VC AI voice'}
              className={`p-1 rounded-md transition ${isPlayingAudio ? 'text-violet-400 bg-violet-500/20' : 'hover:text-white hover:bg-white/5'}`}
            >
              {isPlayingAudio ? (
                <div className="flex items-center gap-0.5">
                  <span className="w-1 h-3 bg-violet-400 rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-violet-400 rounded-full animate-pulse delay-75" />
                  <VolumeX className="w-3.5 h-3.5 ml-1" />
                </div>
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Thumbs up / down rating */}
          {!isUser && onRate && (
            <>
              <button
                onClick={() => onRate('like')}
                title="Helpful response"
                className={`p-1 rounded-md hover:text-white hover:bg-white/5 transition ${
                  message.rating === 'like' ? 'text-emerald-400 bg-emerald-500/15' : ''
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onRate('dislike')}
                title="Needs improvement"
                className={`p-1 rounded-md hover:text-white hover:bg-white/5 transition ${
                  message.rating === 'dislike' ? 'text-rose-400 bg-rose-500/15' : ''
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {/* Save to memory */}
          {!isUser && onSaveToMemory && (
            <button
              onClick={() => onSaveToMemory(message.content)}
              title="Save insight to VC AI Memory Bank"
              className="p-1 rounded-md hover:text-violet-300 hover:bg-white/5 transition"
            >
              <Brain className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Regenerate button */}
          {!isUser && onRegenerate && (
            <button
              onClick={onRegenerate}
              title="Regenerate response"
              className="p-1 rounded-md hover:text-white hover:bg-white/5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
