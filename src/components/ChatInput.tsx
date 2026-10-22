import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Mic,
  MicOff,
  Globe,
  X,
  Sparkles,
  StopCircle,
  HelpCircle,
  Volume2,
  VolumeX
} from 'lucide-react';
import { ModeId } from '../types';
import { ALL_MODES } from '../data/modes';

interface ChatInputProps {
  onSendMessage: (text: string, image?: { data: string; mimeType: string; preview: string }, usedVoice?: boolean) => void;
  isLoading: boolean;
  onStop?: () => void;
  currentMode: ModeId;
  useSearch: boolean;
  onToggleSearch: () => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onStop,
  currentMode,
  useSearch,
  onToggleSearch,
  autoSpeak,
  onToggleAutoSpeak,
}) => {
  const [text, setText] = useState('');
  const [attachedImage, setAttachedImage] = useState<{
    data: string;
    mimeType: string;
    preview: string;
  } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  const activeModeMeta = ALL_MODES.find((m) => m.id === currentMode) || ALL_MODES[0];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  // Speech to text initialization
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Works great for Indian English, Hindi & Hinglish

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
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
    };
  }, []);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Voice dictation is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Image size exceeds 8MB limit. Please upload a smaller image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setAttachedImage({
        data: base64Data,
        mimeType: file.type || 'image/jpeg',
        preview: result,
      });
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e?: React.FormEvent, usedVoice: boolean = false) => {
    if (e) e.preventDefault();
    if ((!text.trim() && !attachedImage) || isLoading) return;

    onSendMessage(text.trim(), attachedImage || undefined, usedVoice || isListening);
    setText('');
    setAttachedImage(null);
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-4">
      {/* Quick Suggestion Chips */}
      {activeModeMeta.quickStarters && activeModeMeta.quickStarters.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 mb-1 text-[11px]">
          <span className="text-slate-400 shrink-0 font-medium hidden sm:inline">Try:</span>
          {activeModeMeta.quickStarters.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => {
                setText(prompt);
                if (textareaRef.current) textareaRef.current.focus();
              }}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-violet-600/20 hover:border-violet-500/30 border border-white/10 text-slate-300 hover:text-white transition whitespace-nowrap shrink-0 active:scale-95"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Main Input Box */}
      <div className="glass-panel rounded-2xl border border-white/10 p-2 sm:p-2.5 shadow-2xl relative focus-within:border-violet-500/50 transition">
        {/* Attached image preview banner */}
        {attachedImage && (
          <div className="relative inline-block mb-2 ml-2">
            <img
              src={attachedImage.preview}
              alt="Attached preview"
              className="w-16 h-16 object-cover rounded-xl border border-violet-500/50"
            />
            <button
              onClick={() => setAttachedImage(null)}
              className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-rose-600 text-white shadow hover:bg-rose-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Text input area */}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isListening
                ? 'VC AI is listening... bolo...'
                : activeModeMeta.placeholder || 'Ask VC AI anything...'
            }
            className="w-full resize-none bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none max-h-44"
          />

          {/* Right Action buttons */}
          <div className="flex items-center gap-1 shrink-0 pb-1">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />

            {/* Attach Image button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach image or screenshot for VC AI to inspect"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition active:scale-95"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Auto-Speak / Assistant Voice Read Aloud Toggle */}
            <button
              type="button"
              onClick={onToggleAutoSpeak}
              title={autoSpeak ? 'Assistant Voice Spoken Answers: ON' : 'Assistant Voice Spoken Answers: OFF'}
              className={`p-2 rounded-xl transition active:scale-95 ${
                autoSpeak
                  ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4 text-violet-300 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Voice Dictation Button */}
            <button
              type="button"
              onClick={toggleVoiceRecording}
              title={isListening ? 'Stop listening & Send' : 'Speak to VC AI (Hindi / Hinglish / English)'}
              className={`p-2 rounded-xl transition active:scale-95 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse shadow-md shadow-rose-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Google Search Grounding toggle */}
            <button
              type="button"
              onClick={onToggleSearch}
              title={useSearch ? 'Web Search Grounding ON (Live facts & links)' : 'Web Search Grounding Auto/Manual'}
              className={`p-2 rounded-xl transition active:scale-95 ${
                useSearch || currentMode === 'research'
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Send / Stop Button */}
            {isLoading ? (
              <button
                type="button"
                onClick={onStop}
                title="Stop generation"
                className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white transition active:scale-95 shadow-md shadow-rose-600/30"
              >
                <StopCircle className="w-4 h-4 animate-spin" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={!text.trim() && !attachedImage}
                title="Send message (Enter)"
                className="p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-md shadow-violet-600/30 transition active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom bar indicator */}
        <div className="flex items-center justify-between px-3 pt-1 text-[10px] text-slate-500 border-t border-white/5 mt-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-medium text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400"></span>
              {activeModeMeta.title}
            </span>
            {useSearch && (
              <span className="text-sky-400 flex items-center gap-0.5">
                • Web Grounding Active
              </span>
            )}
          </div>
          <span className="hidden sm:inline">Press Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};
