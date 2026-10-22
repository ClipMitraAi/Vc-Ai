import React, { useState } from 'react';
import {
  ImageIcon,
  Sparkles,
  Download,
  Send,
  X,
  Loader2,
  RefreshCw,
  Palette
} from 'lucide-react';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendToChat: (imageUrl: string, prompt: string) => void;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  onSendToChat,
}) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3'>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          aspectRatio,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate image');
      }

      const data = await res.json();
      setGeneratedImage(data.imageUrl);
      setCaption(data.caption || null);
    } catch (err: any) {
      setError(err.message || 'Error occurred while creating image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const a = document.createElement('a');
    a.href = generatedImage;
    a.download = `vc-ai-artwork-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const samplePrompts = [
    'A cybernetic Mughal garden in neon Mumbai at night, cinematic photorealistic lighting',
    'A cozy rainy evening in Himachal Pradesh with hot cutting chai and book',
    'Futuristic Indian AI companion avatar with glowing violet and holographic blue aura',
    'Romantic monsoon street under glowing streetlights with vintage reflections',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-white/15 p-5 sm:p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">VC AI Creative Image Studio</h2>
              <p className="text-xs text-slate-400">Generate digital art and visual scenes with Gemini</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleGenerate} className="space-y-3 mb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Describe what you want VC AI to create:
            </label>
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Glowing neon cyberpunk Taj Mahal under a starry sky, 4k digital render..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500/50 resize-none"
            />
          </div>

          {/* Quick inspiration chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">Ideas:</span>
            {samplePrompts.map((p, i) => (
              <button
                type="button"
                key={i}
                onClick={() => setPrompt(p)}
                className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-violet-600/20 text-slate-300 text-[11px] truncate max-w-xs transition shrink-0 border border-white/5"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Aspect Ratio & Generate Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Ratio:</span>
              {(['1:1', '16:9', '9:16', '4:3'] as const).map((ratio) => (
                <button
                  type="button"
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    aspectRatio === ratio
                      ? 'bg-violet-600 text-white shadow-xs'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-violet-600/30 transition active:scale-95"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Artwork...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Image</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        {/* Generated Image Result Card */}
        {generatedImage && (
          <div className="mt-2 p-3 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center">
            <div className="max-h-80 rounded-xl overflow-hidden mb-3 border border-violet-500/30 shadow-2xl">
              <img
                src={generatedImage}
                alt="Generated by VC AI"
                className="w-full h-auto object-contain max-h-80"
              />
            </div>

            {caption && <p className="text-xs text-slate-300 mb-3 italic">"{caption}"</p>}

            <div className="flex items-center gap-3">
              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-medium flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save to Device</span>
              </button>

              <button
                onClick={() => {
                  onSendToChat(generatedImage, prompt);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium flex items-center gap-1.5 transition shadow-md shadow-violet-600/30"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send into Conversation</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
