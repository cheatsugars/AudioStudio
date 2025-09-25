import { Script, Speaker, DialogueLine } from './types';

export const VOICES = [
  { name: 'Kore', value: 'Kore' },
  { name: 'Puck', value: 'Puck' },
  { name: 'Zephyr', value: 'Zephyr' },
  { name: 'Aria', value: 'Aria' },
  { name: 'Leo', value: 'Leo' },
  { name: 'Stella', value: 'Stella' },
  { name: 'Kai', value: 'Kai' },
];

export const SPEAKER_COLORS = [
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#3b82f6', // blue-500
  '#ec4899', // pink-500
  '#6366f1', // indigo-500
];

const parseMoviePrompt = (): Script => {
    const rawText = `Speaker 1 ("Scared & Dramatic, leans forward, whispering, eyes wide, fingers drumming nervously"): What if the market doesn’t bite? What if CHEAT is just another can gathering dust on some sad convenience-store shelf?
Speaker 2 ("Scared turning Defiant, snaps upright, voice sharp, hand slicing the air"): No. CHEAT isn’t a can—it’s a weapon. A loophole wrapped in black velvet and chrome. People won’t just drink it—they’ll conspire with it.
Speaker 1 ("Excited & Triumphant, sits back, grin spreading, throws hands up with sudden energy"): You’re saying it’s not a drink, it’s a movement?
Speaker 2 ("Excited, Rallying, paces the room, voice rising, chest puffed like a leader at a rally"): Exactly! Everyone else sells guilt. We sell permission. And nothing sells harder than rebellion.
Speaker 1 ("Playful & Sarcastic, mock-serious, wagging a finger, smirk tugging at lips"): So you’re telling me people will line up for a drink that makes bathroom stalls part of the brand experience?
Speaker 2 ("Playful, Conspiratorial, laughs, leans in close, winks with a sly grin"): They’ll worship it. The flush isn’t a side effect—it’s the feature. “Better out than in.” Watch—hashtags, rituals, memes. That’s how we cash in.
Speaker 1 ("Analytical & Persuasive, folds arms, eyebrow raised, tilts head as if cross-examining"): Alright, but effectiveness—come on. Does it actually deliver?
Speaker 2 ("Analytical, Precise, calm tone, counts on fingers with deliberate clarity"): Allulose base. EGCG. Tannic and chlorogenic acid. Encapsulation tech. It blocks sugar uptake, eases digestion, boosts fat burn. This isn’t smoke and mirrors—it’s engineered rebellion.
Speaker 1 ("Skeptical & Testing, narrows eyes, taps temple, paces slowly with doubt in voice"): Investors won’t buy bathroom graffiti. They want numbers. Where’s the lucrativeness?
Speaker 2 ("Commanding & Convincing, steps closer, voice booming, points firmly like delivering a verdict"): Red Bull hit $10B selling wings in a can. Imagine us—showing scales dropping and guilt evaporating. Not just sticky marketing—sticky market share.
Speaker 1 ("Dramatic & Intense, paces, lowers voice to a hush, hands clenched like holding a secret"): So CHEAT isn’t a savior—it’s the anti-hero. Corrupting just enough to make life fun again.
Speaker 2 ("Dramatic & Fierce, slams fist lightly on table, eyes blazing, voice thundering"): Exactly! And when the calorie cartel collapses, CHEAT will be the smug grin standing on its ruins.
Speaker 1 ("Calm & Resolute, inhales deeply, nods slow, gaze steady"): Then the real question isn’t if people buy into CHEAT—it’s how fast we can keep up with demand.
Speaker 2 ("Calm, Smug, Final, crosses arms, smirk curling, tilts head with quiet certainty"): That’s the only problem we’ll ever face. Scaling indulgence. And there’s no shortage of sinners to serve.`;

    const speakers: Speaker[] = [
        { id: 'speaker-1', name: 'Speaker 1', voice: VOICES[0].value },
        { id: 'speaker-2', name: 'Speaker 2', voice: VOICES[1].value },
    ];
    
    const dialogue: DialogueLine[] = rawText.split('\n').filter(line => line.trim() !== '').map((line, index) => {
        const speakerId = line.startsWith('Speaker 1') ? 'speaker-1' : 'speaker-2';
        const text = line.substring(line.indexOf(':') + 1).trim();
        return { id: `line-${index}`, speakerId, text };
    });

    return {
        styleInstructions: 'A dramatic, high-stakes conversation between two ambitious co-founders.',
        speakers,
        dialogue,
    };
};

export const MOVIE_SCENE_SCRIPT = parseMoviePrompt();

export const PODCAST_TRANSCRIPT: Script = {
    styleInstructions: 'Read aloud in a warm, welcoming, and conversational podcast tone.',
    speakers: [
        { id: 'speaker-1', name: 'Host', voice: VOICES[0].value },
        { id: 'speaker-2', name: 'Guest', voice: VOICES[2].value },
    ],
    dialogue: [
        { id: 'line-1', speakerId: 'speaker-1', text: "Welcome back to 'Tech Forward,' where we explore the bleeding edge of innovation. Today, we're thrilled to have Dr. Aris Thorne, a leading mind in neuro-computation." },
        { id: 'line-2', speakerId: 'speaker-2', text: "It's a pleasure to be here. Thanks for having me." },
        { id: 'line-3', speakerId: 'speaker-1', text: "So, Aris, your latest paper has been causing quite a stir. Can you break down the core concept for our listeners in simple terms?" },
        { id: 'line-4', speakerId: 'speaker-2', text: "Certainly. At its heart, we've developed a new type of algorithm that allows AI to learn from incredibly small data sets, much like a human child does. It's a shift from brute-force data consumption to intuitive pattern recognition." },
    ]
};

export const AUDIO_VOICE_ASSISTANT: Script = {
    styleInstructions: 'A helpful, clear, and friendly voice assistant interaction.',
    speakers: [
        { id: 'speaker-1', name: 'User', voice: VOICES[3].value },
        { id: 'speaker-2', name: 'Assistant', voice: VOICES[4].value },
    ],
    dialogue: [
        { id: 'line-1', speakerId: 'speaker-1', text: "Hey assistant, what's the weather like tomorrow?" },
        { id: 'line-2', speakerId: 'speaker-2', text: "Tomorrow in San Francisco, you can expect partly cloudy skies with a high of 65 degrees and a low of 52. There's a slight chance of morning drizzle." },
        { id: 'line-3', speakerId: 'speaker-1', text: "Okay, can you also set a reminder for me to call Mom at 7 PM?" },
        { id: 'line-4', speakerId: 'speaker-2', text: "Of course. I've set a reminder for you to call 'Mom' tomorrow at 7 PM. Is there anything else?" },
    ]
};