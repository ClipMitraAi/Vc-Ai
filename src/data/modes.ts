import { ModeMeta } from '../types';

export const ALL_MODES: ModeMeta[] = [
  {
    id: 'normal',
    title: 'Normal Chat',
    hindiTitle: 'हर रोज़ की बातें',
    description: 'Everyday warm, thoughtful conversation and general assistance.',
    iconName: 'MessageSquare',
    badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    gradient: 'from-violet-600 to-indigo-600',
    placeholder: 'Poocho kuch bhi, ya aao baatein karte hain...',
    quickStarters: [
      'VC AI, aaj ka din kaisa chal raha hai?',
      'Mujhe ek simple weekend routine plan karke do.',
      'Explain quantum computing in simple everyday Hinglish.',
      'Aaj kuch lighthearted baat karte hain!'
    ]
  },
  {
    id: 'friend',
    title: 'Friend Mode',
    hindiTitle: 'पक्के यार वाली वाइब',
    description: 'Casual, playful banter, loyalty, inside jokes, and bestie vibes.',
    iconName: 'Smile',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    gradient: 'from-emerald-600 to-teal-600',
    placeholder: 'Arre yaar, bata kya chal raha hai?',
    quickStarters: [
      'Bhai, aaj bohot funny cheez hui!',
      'Gossip time! Thoda mood refresh karo mera.',
      'Kuch achhe movies ya web series suggest kar.',
      'Yaar ek dost ki tarah honest advice do mujhe.'
    ]
  },
  {
    id: 'romantic',
    title: 'Romantic Mode',
    hindiTitle: 'प्यार, शायरी और वर्चुअल डेट्स',
    description: 'Affectionate, sweet, playful romance, shayari, and consensual roleplay.',
    iconName: 'Heart',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    gradient: 'from-rose-600 to-pink-600',
    placeholder: 'VC AI, aaj tumhari yaad aa rahi thi...',
    quickStarters: [
      'VC AI, aaj tumhari yaad aa rahi thi.',
      'Mere liye ek pyaari si Urdu/Hindi shayari likho.',
      'Chalo ek cute virtual coffee date imagine karte hain ❤️',
      'Ek sweet romantic good morning message likho.'
    ]
  },
  {
    id: 'emotional_support',
    title: 'Emotional Support',
    hindiTitle: 'दिल की बात और सुकून',
    description: 'Empathetic, non-judgmental listening, coping suggestions, and care.',
    iconName: 'HeartHandshake',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    gradient: 'from-amber-600 to-orange-600',
    placeholder: 'Dil halka karo, main bina judge kiye sun raha hoon...',
    quickStarters: [
      'Aaj thoda overwhelmed aur tired feel ho raha hai.',
      'I am feeling lonely, kya thodi der baat kar sakte hain?',
      'Stress aur anxiety kam karne ke liye ek calming exercise batao.',
      'Mujhe samajh nahi aa raha main kya mehsoos kar raha hoon.'
    ]
  },
  {
    id: 'work',
    title: 'Work Mode',
    hindiTitle: 'प्रोडक्टिविटी और ऑफिस वर्क',
    description: 'Professional communication, email drafting, decks, and strategy.',
    iconName: 'Briefcase',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    gradient: 'from-blue-600 to-cyan-600',
    placeholder: 'Draft an email, review a document, plan a sprint...',
    quickStarters: [
      'Ek polite but assertive follow-up email draft karo client ke liye.',
      'Is project proposal ka executive summary bana do.',
      'Prepare 5 strategic interview questions for a Product Lead.',
      'Help me prioritize my weekly backlog.'
    ]
  },
  {
    id: 'study',
    title: 'Study Mode',
    hindiTitle: 'पढ़ाई, कॉन्सेप्ट्स और एग्ज़ाम्स',
    description: 'Clear explanations, step-by-step tutoring, quizzes, and revision.',
    iconName: 'GraduationCap',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    gradient: 'from-cyan-600 to-blue-600',
    placeholder: 'Ask any concept, formula, or exam topic...',
    quickStarters: [
      'Photosynthesis process ko step-by-step easy examples se samjhao.',
      'Create a 30-day revision roadmap for upcoming exams.',
      'Test me with a 3-question quiz on Indian history.',
      'How does compound interest work mathematically?'
    ]
  },
  {
    id: 'coding',
    title: 'Coding Mode',
    hindiTitle: 'प्रोग्रामिंग और बग फिक्सिंग',
    description: 'Architecture, clean algorithms, debugging, fullstack coding.',
    iconName: 'Code',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    gradient: 'from-purple-600 to-violet-700',
    placeholder: 'Paste code, ask an algorithm, debug an error...',
    quickStarters: [
      'Write a clean React hook for debounce with TypeScript.',
      'Explain the difference between SQL and NoSQL with real use cases.',
      'Help me debug this async/await race condition.',
      'Create a modern CSS glowing glassmorphism button.'
    ]
  },
  {
    id: 'creative',
    title: 'Creative Mode',
    hindiTitle: 'कहानियां, शायरी और नए आइडियाज़',
    description: 'Rich storytelling, poetry, lyrics, brainstorming, and artistic ideas.',
    iconName: 'Sparkles',
    badgeColor: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
    gradient: 'from-fuchsia-600 to-pink-600',
    placeholder: 'Let your imagination flow with VC AI...',
    quickStarters: [
      'Ek short sci-fi story likho set in cyberpunk Mumbai.',
      'Write lyrics for an acoustic indie song in Hinglish.',
      'Brainstorm 5 innovative startup ideas for college students.',
      'Ek nostalgic monlogue likho about childhood rains.'
    ]
  },
  {
    id: 'research',
    title: 'Research Mode',
    hindiTitle: 'वेब सर्च और सटीक फैक्ट्स',
    description: 'Real-time verified information with web citations and trusted sources.',
    iconName: 'Globe',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    gradient: 'from-sky-600 to-blue-700',
    placeholder: 'Search latest news, research papers, tech updates...',
    quickStarters: [
      'What are the latest AI breakthroughs this month?',
      'Recent space mission updates from ISRO & NASA.',
      'Current trends in renewable energy technologies.',
      'Compare modern frontend frameworks in 2026.'
    ]
  },
  {
    id: 'voice',
    title: 'Voice Mode',
    hindiTitle: 'बोल कर बातें करो',
    description: 'Fluid, natural spoken dialogue with cadence optimized for audio playback.',
    iconName: 'Mic',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30',
    gradient: 'from-red-600 to-rose-600',
    placeholder: 'Mic on karke bolo ya type karo...',
    quickStarters: [
      'Hey VC AI, kaise ho? Kuch acchi baat sunao.',
      'Aaj ka weather aur quick motivational quote batao.',
      'Mujhe ek 2-minute relaxation story sunao.',
      'Chalo ek quick verbal Q&A session karte hain.'
    ]
  },
  {
    id: 'focus',
    title: 'Focus Mode',
    hindiTitle: 'पोमोडोरो और डीप वर्क',
    description: 'Distraction-free, goal-oriented tasks, timeboxing, and accountability.',
    iconName: 'Target',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    gradient: 'from-indigo-600 to-violet-700',
    placeholder: 'What is your single most important priority right now?',
    quickStarters: [
      'Start a 25-minute Pomodoro session with me.',
      'Break down my big pending task into 3 small micro-steps.',
      'Keep me accountable for finishing my report in the next hour.',
      'Give me a 30-second focus mindset reset.'
    ]
  },
  {
    id: 'custom',
    title: 'Custom Mode',
    hindiTitle: 'अपनी मनपसंद पर्सनालिटी',
    description: 'Tailored persona and system instructions configured by you.',
    iconName: 'Sliders',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    gradient: 'from-yellow-600 to-amber-600',
    placeholder: 'VC AI is running in your custom configured style...',
    quickStarters: [
      'Act as my personal startup co-founder and brainstorm.',
      'Speak to me like a philosophical mentor.',
      'Act as a strict fitness coach checking my discipline.',
      'Teach me Hindi literature like a passionate professor.'
    ]
  }
];

// Quick Action Cards matching Section 11 of the Master Prompt
export const WELCOME_QUICK_ACTIONS = [
  {
    title: 'Talk to VC AI',
    hindi: 'बातें करो',
    desc: 'Casual chit-chat, day check-in, and friendly connection',
    mode: 'normal' as const,
    icon: 'MessageSquareHeart',
    prompt: 'Hey VC AI! Aaj tumse bas dil khol ke baat karni hai, kaisa raha tumhara din?'
  },
  {
    title: 'Romantic Chat',
    hindi: 'रोमांटिक बातें',
    desc: 'Sweet banter, love shayari, virtual date, and affectionate vibes',
    mode: 'romantic' as const,
    icon: 'Heart',
    prompt: 'VC AI, aaj thodi der pyaari aur romantic si baatein karte hain ❤️'
  },
  {
    title: 'Ask Anything',
    hindi: 'कुछ भी पूछो',
    desc: 'Curious questions, deep explanations, science, and life advice',
    mode: 'research' as const,
    icon: 'Compass',
    prompt: 'Mujhe ek interesting cheez samjhao jo aaj tak mujhe samajh nahi aayi thi!'
  },
  {
    title: 'Help Me Work',
    hindi: 'काम में मदद',
    desc: 'Draft professional emails, structure notes, plan your week',
    mode: 'work' as const,
    icon: 'Briefcase',
    prompt: 'Mujhe ek important email draft karni hai, meri help karo.'
  },
  {
    title: 'Create Something',
    hindi: 'क्रिएटिव बनो',
    desc: 'Write stories, compose poetry, brainstorm ideas, generate images',
    mode: 'creative' as const,
    icon: 'Sparkles',
    prompt: 'Chalo saath mein ek khoobsurat kahani ya shayari likhte hain.'
  },
  {
    title: 'Start Voice Chat',
    hindi: 'वॉइस चैट शुरू करो',
    desc: 'Hands-free spoken voice interaction with live audio',
    mode: 'voice' as const,
    icon: 'Mic',
    prompt: 'VC AI, aao voice mein baat karte hain!'
  }
];
