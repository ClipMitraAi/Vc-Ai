/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Message,
  ChatThread,
  ModeId,
  UserProfile,
  MemoryItem,
  ReminderItem,
  LanguagePref
} from './types';
import { ALL_MODES } from './data/modes';
import { JarvisSidebar, JarvisTab } from './components/JarvisSidebar';
import { JarvisHeader } from './components/JarvisHeader';
import { JarvisHoloSphere } from './components/JarvisHoloSphere';
import { JarvisAgentsPanel } from './components/JarvisAgentsPanel';
import { JarvisTimelineAndCommands } from './components/JarvisTimelineAndCommands';
import { JarvisBottomHUD } from './components/JarvisBottomHUD';
import { JarvisIntelligenceFeed } from './components/JarvisIntelligenceFeed';
import { JarvisBottomBar } from './components/JarvisBottomBar';
import { JarvisChatDrawer } from './components/JarvisChatDrawer';
import { VoiceModal } from './components/VoiceModal';
import { MemoryModal } from './components/MemoryModal';
import { RemindersDrawer } from './components/RemindersDrawer';
import { FocusTimerModal } from './components/FocusTimerModal';
import { ImageStudioModal } from './components/ImageStudioModal';
import { SettingsModal } from './components/SettingsModal';
import { AndroidExportModal } from './components/AndroidExportModal';

const STORAGE_KEYS = {
  THREADS: 'vc_ai_threads',
  ACTIVE_THREAD: 'vc_ai_active_thread_id',
  PROFILE: 'vc_ai_user_profile',
  MEMORIES: 'vc_ai_memories',
  REMINDERS: 'vc_ai_reminders',
};

const DEFAULT_PROFILE: UserProfile = {
  name: 'Commander',
  nickname: 'Commander',
  languagePreference: 'hinglish',
  relationshipVibe: 'Warm & Attentive Companion',
  style: 'Warm & Conversational',
  customPersona: 'You are VC AI, an advanced Jarvis-like autonomous personal companion and command assistant.',
};

const DEFAULT_MEMORIES: MemoryItem[] = [
  {
    id: 'm-1',
    text: 'Prefers natural conversational Hinglish with warm Indian cultural expressions.',
    category: 'preference',
    createdAt: Date.now(),
  },
  {
    id: 'm-2',
    text: 'Command Center operations priority: deep-work, voice assistant, and live tracking.',
    category: 'personal',
    createdAt: Date.now(),
  },
];

export default function App() {
  // Persistence state
  const [threads, setThreads] = useState<ChatThread[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THREADS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ACTIVE_THREAD) || null;
    } catch {
      return null;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [memories, setMemories] = useState<MemoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      return saved ? JSON.parse(saved) : DEFAULT_MEMORIES;
    } catch {
      return DEFAULT_MEMORIES;
    }
  });

  const [reminders, setReminders] = useState<ReminderItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // App UI & HUD State
  const [activeTab, setActiveTab] = useState<JarvisTab>('command-center');
  const [currentMode, setCurrentMode] = useState<ModeId>('normal');
  const [useSearch, setUseSearch] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(() => {
    try {
      return localStorage.getItem('vc_ai_auto_speak') === 'true';
    } catch {
      return true; // Default to true for true Jarvis voice companion experience!
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('vc_ai_auto_speak', String(autoSpeak));
    } catch {}
  }, [autoSpeak]);

  // Modals
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [memoryModalOpen, setMemoryModalOpen] = useState(false);
  const [remindersDrawerOpen, setRemindersDrawerOpen] = useState(false);
  const [focusModalOpen, setFocusModalOpen] = useState(false);
  const [imageStudioOpen, setImageStudioOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [androidModalOpen, setAndroidModalOpen] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    if (activeThreadId) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_THREAD, activeThreadId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_THREAD);
    }
  }, [activeThreadId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }, [reminders]);

  // Current active thread and its messages
  const currentThread = threads.find((t) => t.id === activeThreadId) || null;
  const currentMessages = currentThread?.messages || [];

  // Periodic Reminder Checker
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      setReminders((prevReminders) => {
        let hasTriggered = false;
        const updated = prevReminders.map((rem) => {
          if (!rem.completed && !rem.notified) {
            const remTime = new Date(rem.datetime).getTime();
            if (now >= remTime) {
              hasTriggered = true;
              playAlertChime();
              return { ...rem, notified: true };
            }
          }
          return rem;
        });
        return hasTriggered ? updated : prevReminders;
      });
    }, 15000);

    return () => clearInterval(timer);
  }, []);

  const playAlertChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log(e);
    }
  };

  const playAudioVoice = async (textToSpeak: string) => {
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          voice: 'Kore',
        }),
      });
      if (res.ok) {
        const d = await res.json();
        if (d.audioData) {
          const audio = new Audio(d.audioData);
          await audio.play();
          return;
        }
      }
    } catch (e) {
      console.log('Server TTS fallback', e);
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(textToSpeak.slice(0, 300));
      window.speechSynthesis.speak(u);
    }
  };

  // Send message with autonomous assistant action execution
  const handleSendMessage = async (
    text: string,
    image?: { data: string; mimeType: string; preview: string },
    modeOverride?: ModeId,
    usedVoice: boolean = false
  ): Promise<string | undefined> => {
    setErrorMessage(null);
    const activeMode = modeOverride || currentMode;

    let targetThreadId = activeThreadId;
    let thread = threads.find((t) => t.id === targetThreadId);

    // If no active thread, create one
    if (!thread || !targetThreadId) {
      targetThreadId = `thread-${Date.now()}`;
      thread = {
        id: targetThreadId,
        title: text.slice(0, 32) || 'Mission Log',
        mode: activeMode,
        messages: [],
        updatedAt: Date.now(),
      };
      setThreads((prev) => [thread!, ...prev]);
      setActiveThreadId(targetThreadId);
    } else if (thread.messages.length === 0) {
      const generatedTitle = text.length > 32 ? text.slice(0, 32) + '...' : text;
      thread.title = generatedTitle;
    }

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
      imagePreview: image?.preview,
    };

    const updatedMessages = [...thread.messages, userMessage];

    // Update local state with user message
    setThreads((prev) =>
      prev.map((t) =>
        t.id === targetThreadId
          ? {
              ...t,
              title: t.messages.length === 0 ? text.slice(0, 30) : t.title,
              messages: updatedMessages,
              updatedAt: Date.now(),
            }
          : t
      )
    );

    setIsLoading(true);
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          mode: activeMode,
          languagePreference: userProfile.languagePreference,
          userProfile: {
            name: userProfile.name,
            nickname: userProfile.nickname,
            style: userProfile.style,
            relationshipVibe: userProfile.relationshipVibe,
            customPersona: userProfile.customPersona,
          },
          memories: memories.map((m) => m.text),
          useSearch: useSearch || activeMode === 'research',
          image: image ? { data: image.data, mimeType: image.mimeType } : null,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      const action = data.action;

      // Autonomous execution 1: Mode adaptation
      if (action?.switchMode && action.switchMode !== currentMode) {
        setCurrentMode(action.switchMode);
      }

      // Autonomous execution 2: Reminder Creation
      if (action?.createReminder?.title && action.createReminder.datetime) {
        const newRem: ReminderItem = {
          id: `rem-${Date.now()}`,
          title: action.createReminder.title,
          datetime: action.createReminder.datetime,
          completed: false,
        };
        setReminders((prev) => [newRem, ...prev]);
        playAlertChime();
      }

      // Autonomous execution 3: Memory Vault Addition
      if (action?.saveMemory?.text) {
        const newMem: MemoryItem = {
          id: `mem-${Date.now()}`,
          text: action.saveMemory.text,
          category: action.saveMemory.category || 'personal',
          createdAt: Date.now(),
        };
        setMemories((prev) => [newMem, ...prev]);
      }

      // Autonomous execution 4: Focus Timer
      if (action?.startFocusTimer) {
        setFocusModalOpen(true);
      }

      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.text || 'Command confirmed.',
        timestamp: Date.now(),
        emotionTag: data.emotionTag,
        groundings: data.groundings,
        action: data.action,
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === targetThreadId
            ? {
                ...t,
                mode: action?.switchMode || t.mode,
                messages: [...updatedMessages, assistantMessage],
                updatedAt: Date.now(),
              }
            : t
        )
      );

      // Autonomous execution 5: Voice Readout
      if (autoSpeak || usedVoice) {
        playAudioVoice(data.text);
      }

      return assistantMessage.content;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Generation stopped');
      } else {
        console.error('Chat error:', err);
        setErrorMessage(
          err.message || 'Failed to connect to VC AI. Check connection.'
        );
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsLoading(false);
  };

  // Executive Daily Briefing Trigger
  const handleExecutiveBriefing = () => {
    setIsChatDrawerOpen(true);
    handleSendMessage(
      'Commander requests an Executive Daily Briefing. Provide a sharp, confident status report in Hinglish covering our system readiness, key mission tasks, and motivational focus for today.',
      undefined,
      'work',
      true
    );
  };

  // Tab action routing
  const handleTabSelect = (tab: JarvisTab) => {
    setActiveTab(tab);
    if (tab === 'conversations') {
      setIsChatDrawerOpen(true);
    } else if (tab === 'calendar' || tab === 'tasks') {
      setRemindersDrawerOpen(true);
    } else if (tab === 'memory') {
      setMemoryModalOpen(true);
    } else if (tab === 'tools') {
      setImageStudioOpen(true);
    }
  };

  // Export chat
  const handleExportChat = () => {
    if (!currentThread || currentMessages.length === 0) return;
    let formatted = `# VC AI Command Center - ${currentThread.title}\nDate: ${new Date(currentThread.updatedAt).toLocaleString()}\nMode: ${currentThread.mode}\n\n`;
    currentMessages.forEach((m) => {
      formatted += `### ${m.role === 'user' ? 'Operator' : 'VC AI'} (${new Date(m.timestamp).toLocaleTimeString()}):\n${m.content}\n\n`;
    });

    const blob = new Blob([formatted], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vc-ai-hud-log-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#040812] hud-grid-bg text-[#e2f1fd] antialiased selection:bg-[#00f0ff] selection:text-[#040812]">
      {/* 1. Left Sidebar Navigation matching image */}
      <JarvisSidebar
        activeTab={activeTab}
        onSelectTab={handleTabSelect}
        tasksCount={reminders.filter((r) => !r.completed).length || 3}
        conversationsCount={threads.length || 12}
        toolsCount={18}
        isListening={isListeningVoice}
        onToggleVoice={() => {
          setIsListeningVoice(!isListeningVoice);
          setIsChatDrawerOpen(true);
        }}
        onOpenFocus={() => setFocusModalOpen(true)}
        onOpenAndroidExport={() => setAndroidModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Command Center Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative overflow-hidden">
        {/* Top Header Bar matching image */}
        <JarvisHeader
          onOpenSettings={() => setSettingsModalOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          userProfile={userProfile}
          onSearchFocus={() => setIsChatDrawerOpen(true)}
          onOpenNotifications={() => setRemindersDrawerOpen(true)}
          onOpenAndroidExport={() => setAndroidModalOpen(true)}
        />

        {/* HUD Main Scrollable Grid */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4">
          {/* Top Row: AI Core Overview + 3D Holo Sphere + Live Intelligence Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            {/* Center + Left: 3D Holographic AI Sphere & Overview */}
            <div className="lg:col-span-8 xl:col-span-8">
              <JarvisHoloSphere
                memoriesCount={memories.length}
                onTriggerVoice={() => setIsChatDrawerOpen(true)}
              />
            </div>

            {/* Right: Live Intelligence Feed */}
            <div className="lg:col-span-4 xl:col-span-4">
              <JarvisIntelligenceFeed
                onOpenTasks={() => setRemindersDrawerOpen(true)}
                onOpenFeed={() => setIsChatDrawerOpen(true)}
              />
            </div>
          </div>

          {/* Middle Row: Active Agents Cluster + Mission Timeline & Commands */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
            {/* Active Agents (6 connected agents with live waveforms) */}
            <div className="lg:col-span-7 xl:col-span-7">
              <JarvisAgentsPanel
                onSelectAgent={(mode, prompt) => {
                  setCurrentMode(mode);
                  setIsChatDrawerOpen(true);
                  if (prompt) {
                    handleSendMessage(prompt, undefined, mode);
                  }
                }}
              />
            </div>

            {/* Mission Timeline & Quick Commands */}
            <div className="lg:col-span-5 xl:col-span-5">
              <JarvisTimelineAndCommands
                reminders={reminders}
                onOpenReminders={() => setRemindersDrawerOpen(true)}
                onOpenVoice={() => setVoiceModalOpen(true)}
                onNewTask={() => setRemindersDrawerOpen(true)}
                onRunWorkflow={() => {
                  setIsChatDrawerOpen(true);
                  handleSendMessage('Initiate system diagnostic & multi-agent execution workflow.', undefined, 'work');
                }}
              />
            </div>
          </div>

          {/* Bottom Row: System Monitor Radial Gauges + Memory Constellation + LLM Status */}
          <JarvisBottomHUD
            memories={memories}
            onOpenMemory={() => setMemoryModalOpen(true)}
            onOpenProviders={() => setSettingsModalOpen(true)}
          />
        </main>

        {/* Bottom Fixed Bar matching image: Location, Weather, Network, Center TALK TO VC AI, Executive Briefing */}
        <JarvisBottomBar
          onTriggerVoice={() => setIsChatDrawerOpen(true)}
          onExecutiveBriefing={handleExecutiveBriefing}
          isListening={isListeningVoice}
        />

        {/* Interactive Holographic Chat Drawer Overlay */}
        <JarvisChatDrawer
          isOpen={isChatDrawerOpen}
          onClose={() => setIsChatDrawerOpen(false)}
          messages={currentMessages}
          onSendMessage={(text, img, usedVoice) => handleSendMessage(text, img, undefined, usedVoice)}
          isLoading={isLoading}
          onStop={handleStop}
          currentMode={currentMode}
          onSelectMode={(mode) => setCurrentMode(mode)}
          useSearch={useSearch}
          onToggleSearch={() => setUseSearch(!useSearch)}
          autoSpeak={autoSpeak}
          onToggleAutoSpeak={() => setAutoSpeak(!autoSpeak)}
          onClearMessages={() => {
            if (currentThread) {
              setThreads((prev) =>
                prev.map((t) => (t.id === currentThread.id ? { ...t, messages: [] } : t))
              );
            }
          }}
          onExportChat={handleExportChat}
          userProfile={userProfile}
        />
      </div>

      {/* Full-Screen Modals */}
      <VoiceModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onSendMessage={async (text) => {
          return await handleSendMessage(text, undefined, 'voice', true);
        }}
        userProfile={userProfile}
        currentMode={currentMode}
      />

      <MemoryModal
        isOpen={memoryModalOpen}
        onClose={() => setMemoryModalOpen(false)}
        memories={memories}
        onAddMemory={(text, category) => {
          const item: MemoryItem = {
            id: `mem-${Date.now()}`,
            text,
            category,
            createdAt: Date.now(),
          };
          setMemories((prev) => [item, ...prev]);
        }}
        onDeleteMemory={(id) => setMemories((prev) => prev.filter((m) => m.id !== id))}
        onClearAll={() => setMemories([])}
      />

      <RemindersDrawer
        isOpen={remindersDrawerOpen}
        onClose={() => setRemindersDrawerOpen(false)}
        reminders={reminders}
        onAddReminder={(title, datetime) => {
          const rem: ReminderItem = {
            id: `rem-${Date.now()}`,
            title,
            datetime,
            completed: false,
          };
          setReminders((prev) => [rem, ...prev]);
        }}
        onToggleComplete={(id) =>
          setReminders((prev) =>
            prev.map((r) => (r.id === id ? { ...r, completed: !r.completed } : r))
          )
        }
        onDeleteReminder={(id) =>
          setReminders((prev) => prev.filter((r) => r.id !== id))
        }
      />

      <FocusTimerModal
        isOpen={focusModalOpen}
        onClose={() => setFocusModalOpen(false)}
      />

      <ImageStudioModal
        isOpen={imageStudioOpen}
        onClose={() => setImageStudioOpen(false)}
        onSendToChat={(imageUrl, prompt) => {
          setIsChatDrawerOpen(true);
          handleSendMessage(`Generated Artwork for: "${prompt}"`, {
            data: imageUrl.split(',')[1],
            mimeType: 'image/png',
            preview: imageUrl,
          });
        }}
      />

      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        userProfile={userProfile}
        onSaveProfile={(prof) => setUserProfile(prof)}
        onResetAllData={() => {
          localStorage.clear();
          setThreads([]);
          setActiveThreadId(null);
          setUserProfile(DEFAULT_PROFILE);
          setMemories(DEFAULT_MEMORIES);
          setReminders([]);
        }}
      />

      <AndroidExportModal
        isOpen={androidModalOpen}
        onClose={() => setAndroidModalOpen(false)}
      />
    </div>
  );
}
