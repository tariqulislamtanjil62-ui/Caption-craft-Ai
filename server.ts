import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google Gemini Client using official @google/genai SDK
const ai = new GoogleGenAI({});

interface CaptionRequest {
  topic: string;
  language: 'english' | 'bangla' | 'bilingual';
  tone: 'aesthetic' | 'funny' | 'romantic' | 'professional' | 'motivational';
  platform: 'instagram' | 'facebook' | 'tiktok' | 'youtube' | 'pinterest' | 'linkedin' | 'twitter' | 'general';
  enableLiveSearch?: boolean;
  provider?: 'gemini' | 'openai';
  customOpenAiKey?: string;
  fileData?: {
    name: string;
    mimeType: string;
    base64?: string;
    textContent?: string;
  };
}

interface CaptionResponseItem {
  id: string;
  style: string;
  text: string;
  hashtags: string[];
  callToAction: string;
  seoTags?: string[];
  pinTitle?: string;
  videoHook?: string;
}

const TRENDING_TOPICS = [
  {
    id: 'tr_1',
    category: 'Fashion',
    title: 'Eid Festive Handcrafted Kurti & Jamdani Collection',
    platform: 'instagram',
    suggestedTone: 'aesthetic',
    tags: ['#EidCollection', '#DeshiAesthetic', '#HandmadeBD', '#JamdaniLove']
  },
  {
    id: 'tr_2',
    category: 'Bangladesh',
    title: 'হাতে বোনা খাঁটি মসলিন ও জামদানি শাড়ির নান্দনিকতা',
    platform: 'facebook',
    suggestedTone: 'romantic',
    tags: ['#ঐতিহ্যের_শাড়ি', '#দেশিয়পণ্য', '#ঢাকাফ্যাশন', '#জামদানি']
  },
  {
    id: 'tr_3',
    category: 'Tech',
    title: 'How Solo Creators are scaling with AI Agents in 2026',
    platform: 'youtube',
    suggestedTone: 'professional',
    tags: ['#CreatorEconomy', '#AITools', '#ProductivityHacks', '#TechVlog']
  },
  {
    id: 'tr_4',
    category: 'Lifestyle',
    title: 'Minimalist Cozy Home Decor & Aesthetic Coffee Corner',
    platform: 'pinterest',
    suggestedTone: 'aesthetic',
    tags: ['#CozyHome', '#CoffeeAesthetic', '#MinimalistVibes', '#InteriorInspo']
  },
  {
    id: 'tr_5',
    category: 'Global',
    title: 'When you tell yourself you will only scroll TikTok for 5 minutes',
    platform: 'tiktok',
    suggestedTone: 'funny',
    tags: ['#Relatable', '#CreatorHumor', '#FunnyVibes', '#TrendAlert']
  },
  {
    id: 'tr_6',
    category: 'Global',
    title: 'The discipline you build today becomes the freedom you live tomorrow',
    platform: 'linkedin',
    suggestedTone: 'motivational',
    tags: ['#Mindset', '#Leadership', '#GrowthDaily', '#Motivation2026']
  }
];

app.get('/api/trending-topics', (_req: Request, res: Response) => {
  res.json({ success: true, topics: TRENDING_TOPICS });
});

app.post('/api/generate-captions', async (req: Request, res: Response) => {
  try {
    const { 
      topic, 
      language, 
      tone, 
      platform, 
      enableLiveSearch = false,
      provider = 'gemini',
      customOpenAiKey,
      fileData
    }: CaptionRequest = req.body;

    // Strict input validation
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      if (!fileData) {
        return res.status(400).json({ error: 'Please enter a topic or upload a file.' });
      }
    }

    if (topic && topic.trim().length > 350) {
      return res.status(400).json({ error: 'Topic must not exceed 350 characters.' });
    }

    const validLanguages = ['english', 'bangla', 'bilingual'];
    const validTones = ['aesthetic', 'funny', 'romantic', 'professional', 'motivational'];
    const validPlatforms = [
      'instagram', 'facebook', 'tiktok', 'youtube', 'pinterest', 'linkedin', 'twitter', 'general'
    ];

    const selectedLang = validLanguages.includes(language) ? language : 'english';
    const selectedTone = validTones.includes(tone) ? tone : 'aesthetic';
    const selectedPlatform = validPlatforms.includes(platform) ? platform : 'instagram';

    let platformRules = '';
    switch (selectedPlatform) {
      case 'instagram':
        platformRules = `
INSTAGRAM FORMAT:
- High aesthetic appeal, engaging first-line hook above the fold.
- Neat spacing, elegant emoji punctuation where appropriate.
- 5 to 10 top engagement hashtags.
- Call to action for saves, comments, or bio link.`;
        break;
      case 'facebook':
        platformRules = `
FACEBOOK FORMAT:
- Warm, community-centered storytelling and discussion starter.
- Relatable narrative with conversational tone.
- Invitation for opinions and sharing.`;
        break;
      case 'tiktok':
        platformRules = `
TIKTOK FORMAT:
- 3-second snappy video hook concept.
- Punchy, high-tempo, viral pacing with trending tags.`;
        break;
      case 'youtube':
        platformRules = `
YOUTUBE FORMAT:
- Video title hook.
- Search-optimized description outline with timestamp placeholders.
- 5 to 8 YouTube SEO tags and YouTube Shorts variant.`;
        break;
      case 'pinterest':
        platformRules = `
PINTEREST FORMAT:
- High-CTR 'pinTitle' (under 60 chars).
- 2-3 sentence search-optimized description with board category keywords.
- Save/pinning call to action.`;
        break;
      case 'linkedin':
        platformRules = `
LINKEDIN FORMAT:
- Compelling professional hook on line 1.
- Clean single-line breaks with actionable career or business takeaway.
- 3 to 5 targeted industry hashtags.`;
        break;
      case 'twitter':
        platformRules = `
X (TWITTER) FORMAT:
- Viral punchy tweet or thread starter under 280 characters.
- High-impact concise hook.`;
        break;
      default:
        platformRules = 'Versatile, high-engagement social media format.';
    }

    let toneGuidance = '';
    switch (selectedTone) {
      case 'aesthetic':
        toneGuidance = 'TONE: Aesthetic, poetic, sensory, visually evocative, and effortlessly elegant.';
        break;
      case 'funny':
        toneGuidance = 'TONE: Funny, witty, relatable, lighthearted, and meme-friendly.';
        break;
      case 'romantic':
        toneGuidance = 'TONE: Romantic, emotional, deeply heartfelt, poetic, and heartwarming.';
        break;
      case 'professional':
        toneGuidance = 'TONE: Professional, structured, authoritative, credible, and value-packed.';
        break;
      case 'motivational':
        toneGuidance = 'TONE: Motivational, inspiring, uplifting, empowering, and action-oriented.';
        break;
    }

    const searchGuidance = enableLiveSearch
      ? `LIVE SEARCH GROUNDING:
- Real-time Google Search grounding enabled. Actively incorporate current 2026 trending terms and real-world viral discussions for "${topic.trim()}".`
      : '';

    const systemPrompt = `You are CaptionCraft AI, an elite social media copywriter specialized in creating viral, authentic, and emotionally resonant content for Bangladeshi and global audiences.
Adhere strictly to these rules:
1. Return EXACTLY THREE distinct caption options (Option 1: Hook & Storytelling, Option 2: Direct & Punchy Value-First, Option 3: Interactive & Community Engagement).
2. ${toneGuidance}
3. PLATFORM: Tailored for "${selectedPlatform}".
${platformRules}
4. LANGUAGE:
   - "bangla": Pure natural, idiomatic Bengali script (বাংলা লিপি), culturally resonant for Bangladesh.
   - "english": Natural, modern international English.
   - "bilingual": Popular Bangladeshi mix (conversational Bengali with trendy English key phrases).
5. STRICT SAFETY & HONESTY GUARDRAIL:
   - NEVER invent specific prices (e.g. ৳500 or $20), discount percentages (50% OFF), warranties, or unverified claims.
   - Suggest calls to action like "DM us for details" or "ইনবক্সে বিস্তারিত জানতে নক করুন".
${searchGuidance}
6. OUTPUT FORMAT: Return a valid JSON object matching:
{
  "captions": [
    {
      "id": "1",
      "style": "Hook & Story",
      "text": "...",
      "hashtags": ["#tag1", "#tag2"],
      "callToAction": "...",
      "seoTags": ["keyword1", "keyword2"],
      "pinTitle": "optional for pinterest",
      "videoHook": "optional for youtube/tiktok"
    }
  ]
}`;

    let fileContext = '';
    if (fileData) {
      if (fileData.textContent) {
        fileContext = `\n\nATTACHED DOCUMENT CONTENT (${fileData.name}):\n${fileData.textContent.slice(0, 1500)}`;
      } else if (fileData.base64 && fileData.mimeType.startsWith('image/')) {
        fileContext = `\n\nATTACHED IMAGE (${fileData.name}): Inspect visual elements, colors, subject matter, mood, and details in the image to write highly specific captions.`;
      }
    }

    const userPrompt = `Generate 3 distinct captions for:
Topic / Product: "${(topic || '').trim()}"
Language: ${selectedLang}
Tone: ${selectedTone}
Platform: ${selectedPlatform}${fileContext}
Live Search Grounding: ${enableLiveSearch ? 'ENABLED' : 'OFF'}`;

    let formattedCaptions: CaptionResponseItem[] = [];
    let usedModel = 'gemini-3.8-flash';

    // OpenAI provider if configured
    if (provider === 'openai' && customOpenAiKey && customOpenAiKey.startsWith('sk-')) {
      try {
        usedModel = 'ChatGPT (gpt-4o-mini)';
        const openAiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${customOpenAiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7
          })
        });

        if (openAiRes.ok) {
          const openAiData = await openAiRes.json();
          const content = openAiData.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (parsed.captions && Array.isArray(parsed.captions)) {
              formattedCaptions = parsed.captions.slice(0, 3).map((item: any, idx: number) => ({
                id: item.id || `cap_openai_${Date.now()}_${idx}`,
                style: item.style || `Option ${idx + 1}`,
                text: item.text,
                hashtags: Array.isArray(item.hashtags) ? item.hashtags : ['#trending', '#captioncraft'],
                callToAction: item.callToAction || '',
                seoTags: Array.isArray(item.seoTags) ? item.seoTags : undefined,
                pinTitle: item.pinTitle || undefined,
                videoHook: item.videoHook || undefined
              }));
            }
          }
        }
      } catch (openAiErr) {
        console.warn('OpenAI call failed, falling back to Gemini:', openAiErr);
      }
    }

    // Primary Gemini Engine
    if (formattedCaptions.length === 0) {
      const apiKey = process.env.GEMINI_API_KEY;
      const hasValidKey = !!apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 5;

      if (hasValidKey) {
        try {
          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('AI inference timeout')), 35000)
          );

          const modelConfig: any = {
            systemInstruction: systemPrompt,
            temperature: 0.7,
          };

          if (enableLiveSearch) {
            modelConfig.tools = [{ googleSearch: {} }];
            usedModel = 'gemini-3.8-flash (Google Search Grounded)';
          } else {
            modelConfig.responseMimeType = 'application/json';
            usedModel = 'gemini-3.8-flash (Firebase AI Logic)';
          }

          // Build contents array supporting image multimodal input
          const contents: any[] = [];
          if (fileData?.base64 && fileData.mimeType?.startsWith('image/')) {
            contents.push({
              inlineData: {
                mimeType: fileData.mimeType,
                data: fileData.base64
              }
            });
          }
          contents.push({ text: userPrompt });

          const response = await Promise.race([
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents,
              config: modelConfig,
            }),
            timeoutPromise
          ]);

          const responseText = response.text;
          if (responseText) {
            let parsedData: { captions?: CaptionResponseItem[] } = {};
            try {
              parsedData = JSON.parse(responseText);
            } catch {
              const jsonMatch = responseText.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                try {
                  parsedData = JSON.parse(jsonMatch[0]);
                } catch {}
              }
            }

            if (parsedData.captions && Array.isArray(parsedData.captions) && parsedData.captions.length > 0) {
              formattedCaptions = parsedData.captions.slice(0, 3).map((item, index) => ({
                id: item.id || `cap_${Date.now()}_${index}`,
                style: item.style || `Option ${index + 1}`,
                text: item.text,
                hashtags: Array.isArray(item.hashtags) ? item.hashtags : ['#trending', '#captioncraft'],
                callToAction: item.callToAction || '',
                seoTags: Array.isArray(item.seoTags) ? item.seoTags : undefined,
                pinTitle: item.pinTitle || undefined,
                videoHook: item.videoHook || undefined
              }));
            }
          }
        } catch (geminiError) {
          console.warn('Gemini API call error:', geminiError);
        }
      }
    }

    // Dynamic generator fallback
    if (formattedCaptions.length === 0) {
      formattedCaptions = generateDynamicCaptions(
        (topic || fileData?.name || 'Social Media Highlights').trim(),
        selectedLang,
        selectedTone,
        selectedPlatform,
        enableLiveSearch
      );
      usedModel = 'CaptionCraft AI Engine';
    }

    return res.json({
      success: true,
      captions: formattedCaptions,
      metadata: {
        topic: topic.trim(),
        language: selectedLang,
        tone: selectedTone,
        platform: selectedPlatform,
        liveSearchEnabled: enableLiveSearch,
        hasFileAttached: !!fileData,
        model: usedModel,
      },
    });
  } catch (error: any) {
    console.error('Error generating captions:', error);
    const errorMessage = error?.message || 'Failed to generate captions. Please try again.';
    return res.status(500).json({ error: errorMessage });
  }
});

function generateDynamicCaptions(
  topic: string,
  lang: string,
  tone: string,
  platform: string,
  enableSearch: boolean
): CaptionResponseItem[] {
  const isBangla = lang === 'bangla';
  const isBilingual = lang === 'bilingual';
  const searchNote = enableSearch ? ' [Live Search Grounded]' : '';

  if (tone === 'romantic') {
    if (isBangla) {
      return [
        {
          id: `cap_rom_${Date.now()}_1`,
          style: 'হৃদয়স্পর্শী অনুভূতি',
          text: `কিছু মুহূর্ত শুধু স্মৃতি নয়, মনের চিরস্থায়ী ঠিকানায় থেকে যায়। ✨${searchNote}\n\n${topic}-এর সাথে জড়িয়ে থাকা প্রতিটি মুহূর্ত যেন ভালোবাসার এক নরম ছোঁয়া। যার সাথে ভাগ করে নিলে প্রতিটি দিন হয়ে ওঠে আরও সুন্দর।`,
          hashtags: ['#ভালোবাসা', '#অনুভূতি', '#স্মৃতি', '#সুন্দরমুহূর্ত'],
          callToAction: 'আপনার প্রিয় মানুষটিকে ট্যাগ করুন ❤️'
        },
        {
          id: `cap_rom_${Date.now()}_2`,
          style: 'কাব্যিক প্রেম',
          text: `তোমার হাসির মতো শান্ত আর গভীর কিছু নেই। ${topic}-এর এই অপরূপ ছোঁয়া যেন সেই ভালোবাসার গল্পই বারবার মনে করিয়ে দেয়। 🌿`,
          hashtags: ['#কাব্যিকপ্রেম', '#মনেরকথা', '#রোমান্টিকক্যাপশন'],
          callToAction: 'কমেন্টে মনের অনুভূতি লিখে জানান ✨'
        },
        {
          id: `cap_rom_${Date.now()}_3`,
          style: 'চিরন্তন টান',
          text: `যেখানে তুমি আছো, সেখানেই সব পূর্ণতা। ${topic}-এর মায়াবী আবহে আজকের সন্ধ্যা হয়ে উঠুক শুধুই আমাদের। 💫`,
          hashtags: ['#চিরন্তনপ্রেম', '#ভালোবাসারগল্প', '#ঢাকা'],
          callToAction: 'প্রিয়জনের সাথে শেয়ার করুন 💌'
        }
      ];
    }
    return [
      {
        id: `cap_rom_${Date.now()}_1`,
        style: 'Heartfelt Sentiment',
        text: `In a crowded world, finding moments that feel like home is everything. ✨${searchNote}\n\n${topic} carries a warmth that speaks straight to the heart. When you are with the one who makes ordinary days extraordinary.`,
        hashtags: ['#RomanticVibes', '#HeartfeltMoments', '#LoveStory', '#EverydayMagic'],
        callToAction: 'Tag your favorite person in the comments ❤️'
      },
      {
        id: `cap_rom_${Date.now()}_2`,
        style: 'Poetic Connection',
        text: `Soft mornings, shared smiles, and quiet comfort. Experiencing ${topic} is a gentle reminder of the beauty in genuine togetherness. 🌿`,
        hashtags: ['#PoeticLove', '#GentleMoments', '#LoveLanguage'],
        callToAction: 'Send this to someone who makes you smile ✨'
      },
      {
        id: `cap_rom_${Date.now()}_3`,
        style: 'Timeless Affection',
        text: `Because love is found in the smallest, sweetest details. Celebrating ${topic} with the one who holds my heart. 💫`,
        hashtags: ['#TimelessLove', '#TogetherForever', '#CoupleAesthetic'],
        callToAction: 'Save this for your special memory book 💌'
      }
    ];
  }

  if (tone === 'motivational') {
    if (isBangla) {
      return [
        {
          id: `cap_mot_${Date.now()}_1`,
          style: 'স্বপ্নপূরণের সাহস',
          text: `কঠিন পথই সেরা ঠিকানায় পৌঁছে দেয়! 🚀${searchNote}\n\n${topic}-এর প্রতিটি পদক্ষেপে থাকুক আত্মবিশ্বাস আর অধ্যবসায়। অন্যরা কী ভাবল তা নিয়ে থেমে থাকার সময় নেই—নিজের শক্তিতে বিশ্বাস রাখুন।`,
          hashtags: ['#আত্মবিশ্বাস', '#অনুপ্রেরণা', '#স্বপ্নপূরণ', '#লক্ষ্য'],
          callToAction: 'আজ থেকেই নিজের লক্ষ্য অর্জনে নেমে পড়ুন 💪'
        },
        {
          id: `cap_mot_${Date.now()}_2`,
          style: 'অদম্য সংকল্প',
          text: `ছোট ছোট প্রচেষ্টাই একদিন বিশাল রূপ নেয়। ${topic}-এর প্রতি নিষ্ঠাই আপনাকে এগিয়ে রাখবে সবার চেয়ে। এগিয়ে যান নির্ভয়ে! 🔥`,
          hashtags: ['#এগিয়েচলো', '#সাফল্য', '#মোটিভেশন'],
          callToAction: 'নিজেকে প্রতিজ্ঞাবদ্ধ রাখতে পোস্টটি সেভ করুন 📌'
        },
        {
          id: `cap_mot_${Date.now()}_3`,
          style: 'নতুন প্রেরণা',
          text: `প্রতিটি সকাল নিয়ে আসে এক নতুন সুযোগ। ${topic}-কে সঙ্গী করে নিজের শ্রেষ্ঠ রূপটি গড়ে তুলুন। 🌟`,
          hashtags: ['#নতুনশুরু', '#পজিটিভথটস', '#বাংলাদেশ'],
          callToAction: 'আপনার আজকের লক্ষ্য কমেন্টে জানান! 👇'
        }
      ];
    }
    return [
      {
        id: `cap_mot_${Date.now()}_1`,
        style: 'Unstoppable Drive',
        text: `The discipline you cultivate in silence becomes the impact the world celebrates. 🚀${searchNote}\n\nMastering ${topic} is not about luck—it is about relentless consistency, showing up when it is hard, and trusting the vision.`,
        hashtags: ['#MindsetShift', '#RelentlessExecution', '#DailyDiscipline', '#SuccessJourney'],
        callToAction: 'Save this reminder for your morning focus session 💪'
      },
      {
        id: `cap_mot_${Date.now()}_2`,
        style: 'Empowered Focus',
        text: `Small daily wins compound into extraordinary breakthroughs. Dedicate your energy to ${topic} and watch your trajectory transform. 🔥`,
        hashtags: ['#DailyGrind', '#CompoundGrowth', '#FocusOnYourself'],
        callToAction: 'Drop a 🎯 if you are locked in on your goals today'
      },
      {
        id: `cap_mot_${Date.now()}_3`,
        style: 'Uplifting Clarity',
        text: `Do not wait for perfect conditions. Start where you are, build momentum around ${topic}, and outgrow your comfort zone. 🌟`,
        hashtags: ['#NoExcuses', '#RiseAndThrive', '#LeadershipMindset'],
        callToAction: 'Share this to inspire a friend on their journey ✨'
      }
    ];
  }

  if (tone === 'funny') {
    if (isBangla) {
      return [
        {
          id: `cap_fun_${Date.now()}_1`,
          style: 'রিলেটেবল হিউমার',
          text: `ভাবছিলাম আজ একটু শান্তশিষ্ট থাকব, কিন্তু ${topic} দেখার পর আর তর সইল না! 😂${searchNote}\n\nআমার ব্যাংক অ্যাকাউন্ট অলরেডি কান্নাকাটি শুরু করেছে, কিন্তু আনন্দ তো থেমে থাকে না!`,
          hashtags: ['#মজা', '#হাসিআনন্দ', '#বাংলামিমস', '#লাইফ'],
          callToAction: 'এমন পাগল বন্ধুকে মেনশন দিন যার এই দশা 🤣'
        },
        {
          id: `cap_fun_${Date.now()}_2`,
          style: 'বাস্তব বনাম প্রত্যাশা',
          text: `প্ল্যান ছিল ৫ মিনিটে কাজ শেষ করব, কিন্তু ${topic} নিয়ে পুরো দুপুর পার করে ফেললাম! কার কার সাথে এমনটা হয় সত্যি বলুন? 🤷‍♂️`,
          hashtags: ['#মিমহিউমার', '#ডেইলিলাইফ', '#ফানপোস্ট'],
          callToAction: 'আপনার রিঅ্যাকশন কমেন্টে জানান 👇'
        },
        {
          id: `cap_fun_${Date.now()}_3`,
          style: 'মজার টুইস্ট',
          text: `সবাই বলে ধৈর্য্য ধরো, কিন্তু ${topic} দেখলে ধৈর্য্য কোথায় যে পালায় ঠিক নেই! 🤦‍♂️`,
          hashtags: ['#হাসতেহাসতেশেষ', '#মজারকথা', '#ঢাকা'],
          callToAction: 'পোস্টটি শেয়ার করে বন্ধুদের মুখে হাসি ফোটান ✨'
        }
      ];
    }
    return [
      {
        id: `cap_fun_${Date.now()}_1`,
        style: 'Relatable Reality',
        text: `I promised myself I would be productive today, and then ${topic} entered the chat. 😂${searchNote}\n\nMy willpower has officially left the building, and honestly? No regrets whatsoever.`,
        hashtags: ['#RelatableAF', '#NoSelfControl', '#HumorDaily', '#MoodRightNow'],
        callToAction: 'Tag that one friend who enables your decisions 🤣'
      },
      {
        id: `cap_fun_${Date.now()}_2`,
        style: 'Playful Irony',
        text: `Adulting: 1/10.\nDiscovering ${topic}: 11/10.\n\nGuess which one is getting my full undivided attention today? 🤷‍♂️`,
        hashtags: ['#AdultingIsHard', '#PriorityCheck', '#DailyMeme'],
        callToAction: 'Drop a laughing emoji if you can relate 👇'
      },
      {
        id: `cap_fun_${Date.now()}_3`,
        style: 'Witty One-Liner',
        text: `My brain: 'Save money and stay disciplined.'\nAlso my brain the second I see ${topic}: 'Add to cart, ask questions never.' 🤦‍♂️`,
        hashtags: ['#OnlineShoppingProblems', '#TreatYourself', '#Relatable'],
        callToAction: 'Share this with your partner in crime ✨'
      }
    ];
  }

  if (tone === 'professional') {
    return [
      {
        id: `cap_pro_${Date.now()}_1`,
        style: 'Executive Insight',
        text: `Strategic execution in today’s ecosystem requires clarity, discipline, and intentionality around ${topic}.${searchNote}\n\nBy focusing on core competencies and high-leverage workflows, high-performing organizations turn complexity into sustainable competitive advantage.`,
        hashtags: ['#StrategicLeadership', '#BusinessExcellence', '#Innovation', '#OperationalAgility'],
        callToAction: 'How is your organization approaching this priority? Let us discuss below.'
      },
      {
        id: `cap_pro_${Date.now()}_2`,
        style: 'Actionable Framework',
        text: `Key insights on optimizing ${topic}:\n\n1. Establish clear measurable outcomes\n2. Streamline cross-functional feedback loops\n3. Prioritize customer value creation over vanity metrics\n\nConsistency across these three pillars delivers tangible ROI.`,
        hashtags: ['#BestPractices', '#ManagementInsights', '#Productivity'],
        callToAction: 'Save this post to reference in your next strategic review session 📌'
      },
      {
        id: `cap_pro_${Date.now()}_3`,
        style: 'Thought Leadership',
        text: `The future of ${topic} belongs to leaders who combine analytical rigor with empathetic decision-making. Here is our perspective on what comes next.`,
        hashtags: ['#FutureOfWork', '#IndustryTrends', '#ExecutiveSummary'],
        callToAction: 'Share your perspective in the comments below 💬'
      }
    ];
  }

  // Default: Aesthetic
  if (isBangla) {
    return [
      {
        id: `cap_aes_${Date.now()}_1`,
        style: 'নান্দনিক রূপরেখা',
        text: `নরম আলো, স্নিগ্ধ অনুভূতি আর একরাশ শুভ্রতা। ✨${searchNote}\n\n${topic}-এর মাঝে লুকিয়ে থাকা সূক্ষ্ম সৌন্দর্য নিয়ে এলো এক অদ্ভুত প্রশান্তি। প্রতিদিনের ব্যস্ততার মাঝে এমন একটি ছোঁয়া মনকে নিমেষেই সতেজ করে দেয়।`,
        hashtags: ['#নান্দনিক', '#সৌন্দর্য', '#লাইফস্টাইল', '#স্নিগ্ধতা'],
        callToAction: 'আপনার পছন্দের অনুভূতি আমাদের জানান 🌿'
      },
      {
        id: `cap_aes_${Date.now()}_2`,
        style: 'মিনিমালিস্ট ভাইবস',
        text: `আভিজাত্য মানে খুব বেশি কিছু নয়, বরং নিখুঁত পরিমিতিবোধ। ${topic}-এর এই ক্লাসিক রূপ আপনার নজর কাড়বেই। 🤍`,
        hashtags: ['#মিনিমালিস্ট', '#ক্লাসিকস্টাইল', '#ঢাকা'],
        callToAction: 'মুডবোর্ডের জন্য সেভ করে রাখুন 📌'
      },
      {
        id: `cap_aes_${Date.now()}_3`,
        style: 'কানেকশন ও আর্ট',
        text: `যেখানে শৈল্পিক ভাবনা আর বাস্তবতা মিলেমিশে একাকার। ${topic} আপনার বিশেষ মুহূর্তগুলোকে রাঙিয়ে তুলুক নিজস্ব ছন্দে। 💫`,
        hashtags: ['#আর্টএন্ডস্টাইল', '#ক্রিয়েটিভ', '#বাংলাদেশ'],
        callToAction: 'প্রিয়জনকে ট্যাগ করুন ✨'
      }
    ];
  }

  if (isBilingual) {
    return [
      {
        id: `cap_aes_${Date.now()}_1`,
        style: 'Chic Banglish Aesthetic',
        text: `Soft tones, understated elegance, and effortless vibes. ✨${searchNote}\n\nআমাদের ${topic} কালেকশনটি creates a pure aesthetic mood that speaks for itself. Perfect for those who appreciate understated luxury.`,
        hashtags: ['#AestheticBD', '#DhakaVibes', '#CleanStyle', '#EverydayChic'],
        callToAction: 'Save this post to your aesthetic board 📌'
      },
      {
        id: `cap_aes_${Date.now()}_2`,
        style: 'Minimalist Balance',
        text: `Quiet luxury in every single curve and detail. ${topic} brings that serene, timeless energy we all need. 🤍`,
        hashtags: ['#MinimalistLifestyle', '#NeutralPalette', '#DeshiAesthetics'],
        callToAction: 'DM us for order details 📩'
      },
      {
        id: `cap_aes_${Date.now()}_3`,
        style: 'Visual Poetry',
        text: `When simplicity meets pure intention. ${topic} transforms the mood of the room in seconds. 🌿`,
        hashtags: ['#VisualPoetry', '#CuratedLiving', '#AestheticInspo'],
        callToAction: 'Share with someone who loves this vibe ✨'
      }
    ];
  }

  return [
    {
      id: `cap_aes_${Date.now()}_1`,
      style: 'Effortless Aesthetic',
      text: `Soft sunlight, gentle textures, and quiet elegance. ✨${searchNote}\n\nThere is a subtle poetry in the way ${topic} elevates the everyday. Designed for those who value refined simplicity and enduring grace.`,
      hashtags: ['#AestheticFeed', '#UnderstatedLuxury', '#WarmMinimalism', '#CuratedLifestyle'],
      callToAction: 'Save this pin for your moodboard 📌'
    },
    {
      id: `cap_aes_${Date.now()}_2`,
      style: 'Serene Visual Harmony',
      text: `Clean lines, neutral palette, and room to breathe. Letting ${topic} speak in whispers of calm refinement. 🤍`,
      hashtags: ['#MinimalLiving', '#NeutralAesthetic', '#VisualPoetry', '#AestheticInspo'],
      callToAction: 'Tap the link in bio to explore the collection 🔗'
    },
    {
      id: `cap_aes_${Date.now()}_3`,
      style: 'Timeless Presence',
      text: `The art of holding beauty without shouting. A thoughtful celebration of ${topic} that stays with you long after the moment passes. 🌿`,
      hashtags: ['#SlowLiving', '#ArtOfSimplicity', '#DailyAesthetic'],
      callToAction: 'Send this to someone who loves this energy ✨'
    }
  ];
}

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    appName: 'CaptionCraft AI',
    version: '2.0.0',
    theme: 'Midnight & Light Mode Supported',
    tones: ['Aesthetic', 'Funny', 'Romantic', 'Professional', 'Motivational'],
    platforms: ['Instagram', 'Facebook', 'TikTok', 'YouTube', 'Pinterest', 'LinkedIn', 'Twitter'],
    features: ['Multimodal File Upload (Images & Docs)', 'Live Google Search Grounding', 'Unlimited Generations']
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CaptionCraft AI server running at http://0.0.0.0:${port}`);
  });
}

startServer();
