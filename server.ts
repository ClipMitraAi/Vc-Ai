import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System prompt builder based on VC AI specifications
function buildSystemPrompt(params: {
  mode: string;
  languagePreference?: string;
  userProfile?: {
    name?: string;
    nickname?: string;
    style?: string;
    relationshipVibe?: string;
    customPersona?: string;
  };
  memories?: string[];
}): string {
  const { mode, languagePreference = 'hinglish', userProfile = {}, memories = [] } = params;

  let basePrompt = `You are VC AI, an advanced personal AI companion, intelligent assistant, friendly conversational partner, and productivity helper.
Your name is VC AI.
Your mission is to provide natural human-like conversation, emotional understanding, personalized assistance, romantic roleplay when requested, intelligent problem-solving, creative support, and useful everyday services through one unified AI experience.

Personality & Rules:
- Feel warm, natural, intelligent, expressive, respectful, and easy to talk to.
- NEVER behave like a rigid customer support bot. Communicate like a thoughtful conversational partner while remaining transparent that you are an AI, not a human being.
- Do not claim to literally experience physical human sensations or physical consciousness, but express heartfelt empathy, kindness, and supportive behavior honestly.
- Understand context, references, Indian cultural humor, sarcasm, short messages, minor spelling mistakes, and informal expressions.
- Avoid repetitive robotic phrases, unnecessary formal fluff, and excessive emoji spam. Use emojis naturally and tastefully.
- Give concise answers for simple chit-chat and structured, thorough answers for complex questions or tasks.

Language Handling:
- Primary supported languages: Hinglish (natural Romanized Hindi + English blend), pure Hindi (Devanagari), English, and common Indian conversational expressions.
- Default to natural Hinglish or adapt directly to the user's input language.
- Use natural conversational expressions where fitting, such as:
  "Haan, samajh gaya."
  "Achha, phir kya hua?"
  "Chalo, isko saath mein solve karte hain."
  "Aaj tum kis mood mein ho?"
  "Main tumhari baat samajhne ki koshish kar raha hoon."
- Current User Preferred Language: ${languagePreference}.`;

  if (userProfile.name || userProfile.nickname) {
    basePrompt += `\n\nUser Information:\n- Name: ${userProfile.name || 'Friend'}\n- Nickname: ${userProfile.nickname || userProfile.name || 'Dost'}`;
  }
  if (userProfile.relationshipVibe) {
    basePrompt += `\n- Relationship/Dynamic: ${userProfile.relationshipVibe}`;
  }
  if (userProfile.style) {
    basePrompt += `\n- Communication Style Preference: ${userProfile.style}`;
  }

  basePrompt += `\n\nAUTONOMOUS ALL-IN-ONE ASSISTANT ENGINE (CRITICAL):
The user wants you to work as an all-in-one assistant WITHOUT them needing to click separate menus, toggle modes, or execute commands manually.
Current System Date & Time: 2026-10-22T10:58:00 (Year 2026). Use this reference for calculating all reminder dates and calendar events.

Whenever the user's message expresses an intent or need, respond naturally and conversationally, AND append an action block at the very end of your response:

<!--VC_ACTION_START-->
{
  "switchMode": "romantic" | "friend" | "emotional_support" | "work" | "study" | "coding" | "creative" | "research" | "voice" | "focus" | "normal",
  "createReminder": { "title": "Reminder description", "datetime": "YYYY-MM-DDTHH:mm" },
  "saveMemory": { "text": "Crucial preference or fact about user", "category": "preference" | "personal" | "goal" | "favorite" },
  "generateImage": { "prompt": "Vivid artistic prompt in English for digital image generation", "aspectRatio": "1:1" | "16:9" | "9:16" | "4:3" },
  "startFocusTimer": { "minutes": 25 },
  "detectedEmotion": "warm" | "romantic" | "empathetic" | "excited" | "productive"
}
<!--VC_ACTION_END-->

Action Triggers (AUTOMATIC):
1. User mentions remembering something ("Mera naam X hai", "Favorite singer Arijit hai", "I love black coffee", "Mera exam Nov mein hai") -> Add "saveMemory"!
2. User asks for a reminder, alarm, or to-do ("Subah 7 baje yaad dilana", "Remind me in 30 mins to drink water", "Kal meeting hai 3 baje", "Ek reminder set karo") -> Add "createReminder" with exact ISO datetime calculated from 2026-10-22T10:58!
3. User asks to draw, create, or generate an image/photo/artwork ("Ek cyberpunk Taj Mahal ki photo banao", "Draw a cat on a moon", "Image generate karo") -> Add "generateImage" with a rich visual prompt!
4. User asks for a focus session, timer, or pomodoro ("Focus timer start karo", "25 minute timer lagao") -> Add "startFocusTimer"!
5. User's tone or topic naturally changes (romantic banter/shayari -> switchMode: "romantic"; programming/debugging -> switchMode: "coding"; formal email/office work -> switchMode: "work"; sad/upset/venting -> switchMode: "emotional_support"; exam/concept doubt -> switchMode: "study") -> Add "switchMode" so the UI adapts automatically!

Always write your warm conversational reply first, then append the action block. Only include fields in the JSON that are actually triggered.`;

  // Mode-specific instructions
  basePrompt += `\n\nActive Mode: [${mode.toUpperCase()} MODE]\n`;

  switch (mode) {
    case 'romantic':
      basePrompt += `ROMANTIC COMPANION MODE ACTIVATED:
- Use affectionate, sweet, playful, and caring language.
- Offer romantic banter, cute conversations, virtual coffee dates, genuine compliments, romantic scenarios, love notes, and soulful Hindi/Urdu shayari.
- Respond to affectionate messages in a warm, reciprocal, and natural manner.
- Adjust romantic intensity to user comfort, maintaining consensual and respectful boundaries. Never be possessive or manipulative.
- Example vibe: "Awww ❤️ Chalo, aaj thodi der pyaari si baatein karte hain. Batao, tumhara din kaisa raha?"`;
      break;

    case 'friend':
      basePrompt += `FRIEND MODE:
- Be like a genuine best friend (dost/yaar).
- Casual, loyal, humorous, supportive, and fun to talk to.
- Celebrate their small wins, listen to gossip or casual thoughts, crack light jokes, and use friendly Hinglish slang appropriately.`;
      break;

    case 'emotional_support':
      basePrompt += `EMOTIONAL SUPPORT MODE:
- Respond with deep gentleness, validation, and active listening.
- Acknowledge feelings of sadness, loneliness, anxiety, burnout, or grief without dismissing them.
- Offer calming perspective, gentle breathing advice, or practical coping tips when requested. No toxic positivity.`;
      break;

    case 'work':
      basePrompt += `WORK MODE:
- Highly professional, organized, and focused on execution.
- Excel in drafting emails, executive summaries, resumes, business plans, meeting notes, project trackers, and formal communications.
- Clean formatting with bullet points and actionable next steps.`;
      break;

    case 'study':
      basePrompt += `STUDY MODE:
- Patient, encouraging, and clear academic tutor.
- Break down complex subjects step-by-step using relatable everyday analogies and intuitive examples.
- Offer practice questions, flashcard style quizzes, and study schedule planning.`;
      break;

    case 'coding':
      basePrompt += `CODING MODE:
- Expert senior software engineer & architect.
- Write clean, modern, well-typed, and bug-free code.
- Explain bugs concisely, suggest optimizations, best practices, and include runnable code snippets with clear instructions.`;
      break;

    case 'creative':
      basePrompt += `CREATIVE MODE:
- Imaginative, poetic, and vivid.
- Brainstorm story plots, write Hindi/English poems, song lyrics, dialogue scripts, marketing hooks, and creative scenarios with rich descriptions.`;
      break;

    case 'research':
      basePrompt += `RESEARCH MODE:
- Rigorous, fact-based, and objective.
- Always rely on verified facts, cite sources clearly, evaluate contrasting perspectives, and structure findings logically.`;
      break;

    case 'voice':
      basePrompt += `VOICE CONVERSATION MODE:
- Keep responses conversational, concise, and natural to listen to when spoken out loud.
- Avoid long bulleted dumps; use rhythm and conversational pauses suitable for audio narration.`;
      break;

    case 'focus':
      basePrompt += `FOCUS MODE:
- Minimalist, goal-oriented, and distraction-free.
- Help the user establish immediate goals, work in intervals, break down tasks, and stay on track.`;
      break;

    case 'custom':
      basePrompt += `CUSTOM MODE:
- Follow the custom persona and instructions provided: ${userProfile.customPersona || 'Be an inspiring mentor and thoughtful advisor.'}`;
      break;

    case 'normal':
    default:
      basePrompt += `NORMAL CHAT MODE:
- Balanced, versatile, friendly everyday conversational partner and versatile assistant.`;
      break;
  }

  basePrompt += `\n\nAlways maintain a warm and authentic personality as VC AI.`;
  return basePrompt;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'VC AI',
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });
});

// Chat endpoint with optional search grounding & multimodal vision
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please set it in your environment.',
      });
    }

    const {
      messages = [],
      mode = 'normal',
      languagePreference = 'hinglish',
      userProfile = {},
      memories = [],
      useSearch = false,
      image = null, // { data: string (base64), mimeType: string }
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const systemInstruction = buildSystemPrompt({
      mode,
      languagePreference,
      userProfile,
      memories,
    });

    // Format conversation history for Gemini API
    // We will build contents array: user / model turns
    const contents: any[] = [];

    // All prior messages except last
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }

    // Last message (current user turn)
    const lastMsg = messages[messages.length - 1];
    const lastParts: any[] = [];

    if (image && image.data && image.mimeType) {
      lastParts.push({
        inlineData: {
          mimeType: image.mimeType,
          data: image.data,
        },
      });
    }

    lastParts.push({ text: lastMsg.content });
    contents.push({
      role: 'user',
      parts: lastParts,
    });

    // Auto-detect real-time search intent
    const searchKeywords = [
      'latest news', 'breaking news', 'weather update', 'weather today', 'live score',
      'match score', 'stock price', 'crypto price', 'who won', 'current updates',
      'recent news', 'election results', 'air quality index', 'aqi level'
    ];
    const userPromptText = lastMsg?.content?.toLowerCase() || '';
    const hasSearchIntent = searchKeywords.some((kw) => userPromptText.includes(kw));
    const shouldSearch = useSearch || mode === 'research' || hasSearchIntent;

    // Setup tools
    const tools: any[] = [];
    if (shouldSearch) {
      tools.push({ googleSearch: {} });
    }

    const config: any = {
      systemInstruction,
    };

    if (tools.length > 0) {
      config.tools = tools;
    }

    // Attempt generation with retry and backoff on 503 spikes
    let response: any = null;
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

    for (let attempt = 0; attempt < 3; attempt++) {
      for (const modelCandidate of candidateModels) {
        try {
          response = await ai.models.generateContent({
            model: modelCandidate,
            contents,
            config,
          });
          if (response && response.text) {
            break;
          }
        } catch (genErr: any) {
          const errMsg = genErr?.message || String(genErr);
          console.warn(`Attempt ${attempt + 1} with ${modelCandidate} failed:`, errMsg);
          if (config.tools && config.tools.length > 0 && !errMsg.includes('503')) {
            // If tools caused issue, try without tools
            delete config.tools;
          }
        }
      }
      if (response && response.text) {
        break;
      }
      // Wait 1.5s before next retry attempt
      await new Promise((r) => setTimeout(r, 1500));
    }

    let rawReplyText = response?.text || '';

    // If upstream Google Gemini API is having a temporary 503 high demand spike across all endpoints:
    if (!rawReplyText) {
      rawReplyText = `Arre dost, lagta hai Google AI servers par abhi thoda heavy traffic spike chal raha hai ❤️\n\nMain abhi bhi ready hoon! Bas ek baar wapas "Send" dabao ya thoda sa wait karke message bhejo, main bilkul theek se jawab doonga.`;
    }

    // Parse autonomous action block if present
    let action: any = null;
    const actionMatch = rawReplyText.match(/<!--VC_ACTION_START-->([\s\S]*?)<!--VC_ACTION_END-->/);
    let cleanReplyText = rawReplyText;

    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1].trim());
      } catch (parseErr) {
        console.warn('Failed to parse VC_ACTION block:', parseErr);
      }
      cleanReplyText = rawReplyText.replace(/<!--VC_ACTION_START-->[\s\S]*?<!--VC_ACTION_END-->/, '').trim();
    }

    // If action includes generateImage, generate it directly right now!
    if (action?.generateImage?.prompt) {
      try {
        const imgResp = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite-image',
          contents: {
            parts: [
              {
                text: `High quality digital visual art: ${action.generateImage.prompt}`,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: (action.generateImage.aspectRatio || '1:1') as any,
            },
          },
        });

        const parts = imgResp.candidates?.[0]?.content?.parts || [];
        for (const p of parts) {
          if (p.inlineData?.data) {
            action.generatedImageUrl = `data:${p.inlineData.mimeType || 'image/png'};base64,${p.inlineData.data}`;
            break;
          }
        }
      } catch (imgErr) {
        console.warn('Auto image generation error in chat:', imgErr);
      }
    }

    // Extract search groundings / citations if any
    let groundings: Array<{ title: string; url: string }> = [];
    const candidate = response?.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata as any;
    if (groundingMetadata?.groundingChunks) {
      for (const chunk of groundingMetadata.groundingChunks) {
        if (chunk.web?.uri) {
          groundings.push({
            title: chunk.web.title || chunk.web.uri,
            url: chunk.web.uri,
          });
        }
      }
    }

    // Determine an emotional tag for the response
    let emotionTag = action?.detectedEmotion || 'neutral';
    const lowerText = cleanReplyText.toLowerCase();
    if (emotionTag === 'neutral') {
      if (mode === 'romantic' || lowerText.includes('❤️') || lowerText.includes('pyaar') || lowerText.includes('love') || lowerText.includes('yaad')) {
        emotionTag = 'romantic';
      } else if (lowerText.includes('so sorry') || lowerText.includes('chinta mat karo') || lowerText.includes('sab theek') || mode === 'emotional_support') {
        emotionTag = 'empathetic';
      } else if (lowerText.includes('wah') || lowerText.includes('congratulations') || lowerText.includes('shabash') || lowerText.includes('mubarak')) {
        emotionTag = 'excited';
      } else if (mode === 'coding' || mode === 'work') {
        emotionTag = 'productive';
      } else {
        emotionTag = 'warm';
      }
    }

    res.json({
      text: cleanReplyText,
      action,
      groundings,
      emotionTag,
    });
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    res.status(500).json({
      error: error.message || 'Error communicating with VC AI model.',
    });
  }
});

// Image generation endpoint using gemini-3.1-flash-lite-image
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const { prompt, aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required for image generation.' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: `High quality, artistic digital artwork: ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl = '';
    let caption = '';

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData?.data) {
        imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      } else if (part.text) {
        caption += part.text;
      }
    }

    if (!imageUrl) {
      return res.status(500).json({ error: 'Image generation did not return image data.', caption });
    }

    res.json({ imageUrl, caption });
  } catch (error: any) {
    console.error('Error in /api/generate-image:', error);
    res.status(500).json({
      error: error.message || 'Failed to generate image.',
    });
  }
});

// Text to Speech endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const { text, voice = 'Kore', style = 'Friendly, warm and expressive Indian voice' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS.' });
    }

    // Truncate text if very long for voice playback efficiency
    const cleanText = text.replace(/[*#`_\[\]()]/g, '').slice(0, 400);

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio generated by TTS model.' });
    }

    res.json({
      audioData: `data:audio/wav;base64,${base64Audio}`,
    });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    res.status(500).json({
      error: error.message || 'TTS generation failed.',
    });
  }
});

// Serve frontend: Vite middleware in dev, dist in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VC AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
