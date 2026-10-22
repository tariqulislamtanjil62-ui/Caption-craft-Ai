import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Copy, 
  Share2, 
  Heart, 
  Check, 
  AlertCircle, 
  RefreshCw,
  Lightbulb,
  Globe2,
  TrendingUp,
  Search,
  Tag,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  RotateCcw
} from 'lucide-react';
import { 
  AppLanguage, 
  AppPlatform, 
  AppTone, 
  CaptionOption, 
  TrendingTopic, 
  AiProvider, 
  AppTheme,
  UploadedFile
} from '../types';
import { 
  ModernInstagramIcon, 
  ModernFacebookIcon, 
  ModernTikTokIcon, 
  ModernYouTubeIcon, 
  ModernPinterestIcon, 
  ModernLinkedInIcon, 
  ModernXIcon 
} from './SocialIcons';

interface HomeScreenProps {
  favorites: CaptionOption[];
  onToggleFavorite: (caption: CaptionOption) => void;
  onAddToHistory: (captions: CaptionOption[]) => void;
  currentLangUi: 'en' | 'bn';
  aiProvider: AiProvider;
  customOpenAiKey?: string;
  theme: AppTheme;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  favorites,
  onToggleFavorite,
  onAddToHistory,
  currentLangUi,
  aiProvider,
  customOpenAiKey,
  theme
}) => {
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState<AppLanguage>('english');
  const [platform, setPlatform] = useState<AppPlatform>('instagram');
  const [tone, setTone] = useState<AppTone>('aesthetic');
  const [enableLiveSearch, setEnableLiveSearch] = useState<boolean>(true);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<CaptionOption[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);
  const [trendingList, setTrendingList] = useState<TrendingTopic[]>([]);

  useEffect(() => {
    fetch('/api/trending-topics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.topics)) {
          setTrendingList(data.topics);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Zero-Emoji minimal tone selectors
  const tonesList: { id: AppTone; labelEn: string; labelBn: string; desc: string }[] = [
    { id: 'aesthetic', labelEn: 'Aesthetic', labelBn: 'নান্দনিক', desc: 'Poetic, visual harmony' },
    { id: 'funny', labelEn: 'Funny', labelBn: 'মজার', desc: 'Witty, relatable humor' },
    { id: 'romantic', labelEn: 'Romantic', labelBn: 'রোমান্টিক', desc: 'Heartfelt sentiment' },
    { id: 'professional', labelEn: 'Professional', labelBn: 'পেশাদার', desc: 'Authoritative, structured' },
    { id: 'motivational', labelEn: 'Motivational', labelBn: 'প্রেরণাদায়ক', desc: 'Uplifting, goal-driven' }
  ];

  const platformsList: { id: AppPlatform; label: string; icon: React.ReactNode }[] = [
    { id: 'instagram', label: 'Instagram', icon: <ModernInstagramIcon className="w-3.5 h-3.5" /> },
    { id: 'facebook', label: 'Facebook', icon: <ModernFacebookIcon className="w-3.5 h-3.5" /> },
    { id: 'tiktok', label: 'TikTok', icon: <ModernTikTokIcon className="w-3.5 h-3.5" /> },
    { id: 'youtube', label: 'YouTube', icon: <ModernYouTubeIcon className="w-3.5 h-3.5" /> },
    { id: 'pinterest', label: 'Pinterest', icon: <ModernPinterestIcon className="w-3.5 h-3.5" /> },
    { id: 'linkedin', label: 'LinkedIn', icon: <ModernLinkedInIcon className="w-3.5 h-3.5" /> },
    { id: 'twitter', label: 'X', icon: <ModernXIcon className="w-3.5 h-3.5" /> },
    { id: 'general', label: 'General', icon: <Globe2 className="w-3.5 h-3.5" /> }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be under 10MB.');
      return;
    }

    const isImage = file.type.startsWith('image/');

    if (isImage) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        setUploadedFile({
          name: file.name,
          type: file.type,
          size: file.size,
          previewUrl: URL.createObjectURL(file),
          base64: base64Data
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Document (PDF or text)
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedFile({
          name: file.name,
          type: file.type,
          size: file.size,
          textContent: typeof reader.result === 'string' ? reader.result : ''
        });
      };
      reader.readAsText(file);
    }
    setError(null);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    const cleanTopic = topic.trim();
    if (!cleanTopic && !uploadedFile) {
      setError(currentLangUi === 'bn' ? 'অনুগ্রহ করে কিছু লিখুন বা ফাইল সংযুক্ত করুন।' : 'Please enter a topic or attach a file.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const payload: any = {
        topic: cleanTopic,
        language,
        tone,
        platform,
        enableLiveSearch,
        provider: aiProvider,
        customOpenAiKey
      };

      if (uploadedFile) {
        payload.fileData = {
          name: uploadedFile.name,
          mimeType: uploadedFile.type,
          base64: uploadedFile.base64,
          textContent: uploadedFile.textContent
        };
      }

      const response = await fetch('/api/generate-captions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate captions');
      }

      const generated: CaptionOption[] = data.captions.map((item: any) => ({
        ...item,
        topic: cleanTopic || uploadedFile?.name,
        platform,
        language,
        tone,
        groundedWithSearch: enableLiveSearch,
        createdAt: new Date().toISOString()
      }));

      setCaptions(generated);
      onAddToHistory(generated);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with AI engine. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (caption: CaptionOption) => {
    let full = caption.text;
    if (caption.pinTitle) full = `📌 ${caption.pinTitle}\n\n${full}`;
    if (caption.videoHook) full = `🎬 ${caption.videoHook}\n\n${full}`;
    if (caption.hashtags?.length) full += `\n\n${caption.hashtags.join(' ')}`;
    navigator.clipboard.writeText(full);
    setCopiedId(caption.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = async (caption: CaptionOption) => {
    let full = caption.text;
    if (caption.hashtags?.length) full += `\n\n${caption.hashtags.join(' ')}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `CaptionCraft AI`, text: full });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(full);
      setShareFeedback(caption.id);
      setTimeout(() => setShareFeedback(null), 2000);
    }
  };

  const isFavorited = (id: string) => favorites.some((f) => f.id === id);

  return (
    <div className={`pb-20 transition-colors duration-300 ${
      isDark ? 'text-slate-100' : 'text-[#17152B]'
    }`}>
      {/* Top Branding Bar */}
      <div className="flex items-center justify-between mb-3 pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6D4AFF] via-[#5835E5] to-[#8B5CF6] flex items-center justify-center text-white shadow-md shadow-[#6D4AFF]/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5 leading-none">
              CaptionCraft AI
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#6D4AFF]/15 text-[#A78BFA] border border-[#6D4AFF]/30 uppercase">
                Pro
              </span>
            </h1>
          </div>
        </div>

        {/* Live Search Badge / Toggle */}
        <button
          onClick={() => setEnableLiveSearch(!enableLiveSearch)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
            enableLiveSearch
              ? 'bg-[#20C997]/15 border-[#20C997]/40 text-[#20C997]'
              : isDark
              ? 'bg-[#211E3B] border-[#343058] text-slate-400'
              : 'bg-white border-slate-200 text-slate-500'
          }`}
          title="Toggle Google Search Grounding"
        >
          <Search className="w-3 h-3" />
          <span>{enableLiveSearch ? 'Live Search On' : 'Search Off'}</span>
        </button>
      </div>

      {/* Welcome Headline */}
      <div className="mb-4">
        <h2 className="text-xl font-extrabold tracking-tight leading-tight">
          Your words, your vibe.
        </h2>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {currentLangUi === 'bn' 
            ? 'সোশ্যাল মিডিয়া ও ভিডিও কনটেন্টের জন্য নিখুঁত ক্যাপশন' 
            : 'Craft captivating captions tailored for your audience'}
        </p>
      </div>

      {/* Multiline Topic Input Card */}
      <div className={`rounded-2xl p-3.5 border transition-all mb-3.5 ${
        isDark 
          ? 'bg-[#211E3B] border-[#343058] focus-within:border-[#6D4AFF]' 
          : 'bg-white border-[#E9E5FF] focus-within:border-[#6D4AFF] shadow-xs'
      }`}>
        <div className="flex items-center justify-between mb-1.5">
          <label className={`text-[11px] font-bold uppercase tracking-wider ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {currentLangUi === 'bn' ? 'টপিক বা বিবরণ' : 'Topic / Concept'}
          </label>
          <span className="text-[10px] text-slate-400 font-mono">
            {topic.length}/350
          </span>
        </div>

        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value.slice(0, 350))}
          placeholder={
            currentLangUi === 'bn'
              ? 'আপনার পোস্ট বা ভাবনার বিবরণ লিখুন (বা নিচে ফটো/ডকুমেন্ট যুক্ত করুন)...'
              : 'Describe your post, occasion, or product (or attach photos below)...'
          }
          rows={3}
          className={`w-full text-xs bg-transparent resize-none focus:outline-none leading-relaxed ${
            isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
          }`}
        />

        {/* Attached File Preview or Attach Button */}
        <div className="mt-2 pt-2 border-t flex items-center justify-between flex-wrap gap-2 ${isDark ? 'border-[#343058]' : 'border-slate-100'}">
          {uploadedFile ? (
            <div className={`flex items-center gap-2 p-1.5 px-2.5 rounded-xl text-xs border max-w-full truncate ${
              isDark ? 'bg-[#2C284E] border-[#6D4AFF]/40 text-purple-200' : 'bg-[#F1EFFF] border-[#6D4AFF]/30 text-[#6D4AFF]'
            }`}>
              {uploadedFile.previewUrl ? (
                <img src={uploadedFile.previewUrl} alt="preview" className="w-5 h-5 rounded object-cover flex-shrink-0" />
              ) : (
                <FileText className="w-4 h-4 flex-shrink-0" />
              )}
              <span className="text-[11px] font-medium truncate max-w-[170px]">{uploadedFile.name}</span>
              <button onClick={handleRemoveFile} className="p-0.5 rounded-md hover:bg-black/10">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-xl border transition-colors ${
                isDark 
                  ? 'border-[#343058] text-slate-300 hover:border-[#6D4AFF] hover:text-white bg-[#17152B]' 
                  : 'border-[#E9E5FF] text-slate-600 hover:border-[#6D4AFF] hover:text-[#6D4AFF] bg-[#F8F7FF]'
              }`}
            >
              <Paperclip className="w-3 h-3 text-[#A78BFA]" />
              <span>{currentLangUi === 'bn' ? 'ফটো বা ডকুমেন্ট যুক্ত করুন' : 'Attach Photo or Document'}</span>
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf,.txt"
            className="hidden"
          />

          {/* Language Switch */}
          <div className="flex items-center gap-1">
            {(['english', 'bangla', 'bilingual'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all ${
                  language === l
                    ? 'bg-[#6D4AFF] text-white shadow-2xs'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {l === 'english' ? 'EN' : l === 'bangla' ? 'বাংলা' : 'Mix'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Target Platform Selector (Instagram, Facebook, TikTok, YouTube, etc.) */}
      <div className="mb-3.5">
        <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {currentLangUi === 'bn' ? 'প্ল্যাটফর্ম' : 'Platform'}
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          {platformsList.map((p) => {
            const isSelected = platform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`py-2 px-1.5 rounded-xl text-xs font-semibold border transition-all flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'bg-[#6D4AFF] text-white border-[#6D4AFF] shadow-sm shadow-[#6D4AFF]/25'
                    : isDark
                    ? 'bg-[#211E3B] border-[#343058] text-slate-300 hover:border-[#6D4AFF]/50'
                    : 'bg-white border-[#E9E5FF] text-slate-700 hover:border-[#6D4AFF]/40'
                }`}
              >
                <div className={isSelected ? 'text-white' : isDark ? 'text-slate-300' : 'text-slate-600'}>
                  {p.icon}
                </div>
                <span className="text-[10px] truncate w-full text-center tracking-tight">
                  {p.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Caption Tone Selectors: Aesthetic, Funny, Romantic, Professional, Motivational (ZERO EMOJIS) */}
      <div className="mb-4">
        <span className={`block text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {currentLangUi === 'bn' ? 'ক্যাপশন টোন' : 'Caption Tone'}
        </span>
        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {tonesList.map((t) => {
            const isSelected = tone === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all tracking-tight ${
                  isSelected
                    ? 'bg-[#6D4AFF] text-white border-[#6D4AFF] shadow-2xs'
                    : isDark
                    ? 'bg-[#211E3B] border-[#343058] text-slate-300 hover:border-[#6D4AFF]/40'
                    : 'bg-white border-[#E9E5FF] text-slate-700 hover:border-[#6D4AFF]/40'
                }`}
              >
                {currentLangUi === 'bn' ? t.labelBn : t.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prominent Gradient "Generate Caption" Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#6D4AFF] via-[#5835E5] to-[#8B5CF6] hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-[#6D4AFF]/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>{currentLangUi === 'bn' ? 'ক্যাপশন তৈরি হচ্ছে...' : 'Crafting Captions...'}</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            <span>{currentLangUi === 'bn' ? 'ক্যাপশন তৈরি করুন' : 'Generate Caption'}</span>
          </>
        )}
      </button>

      {/* Error Banner */}
      {error && (
        <div className="mt-3.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={handleGenerate} className="underline font-bold ml-2">Retry</button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`rounded-2xl p-4 border animate-pulse ${
                isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-white border-[#E9E5FF]'
              }`}
            >
              <div className="h-4 w-24 bg-purple-500/20 rounded mb-3" />
              <div className="space-y-2 mb-3">
                <div className="h-3.5 w-full bg-slate-500/10 rounded" />
                <div className="h-3.5 w-5/6 bg-slate-500/10 rounded" />
              </div>
              <div className="h-3 w-1/2 bg-slate-500/10 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Generated Captions List */}
      {!isLoading && captions.length > 0 && (
        <div className="mt-5 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {currentLangUi === 'bn' ? '৩টি বিকল্প ক্যাপশন' : 'Generated Captions'}
            </span>
            <span className="text-[10px] font-bold text-[#A78BFA] bg-[#6D4AFF]/10 px-2 py-0.5 rounded-full border border-[#6D4AFF]/20">
              {platform.toUpperCase()} • {tone.toUpperCase()}
            </span>
          </div>

          {captions.map((cap, idx) => {
            const fav = isFavorited(cap.id);
            const isCopied = copiedId === cap.id;

            return (
              <div
                key={cap.id || idx}
                className={`rounded-2xl p-4 border transition-all ${
                  isDark 
                    ? 'bg-[#211E3B] border-[#343058] shadow-xs' 
                    : 'bg-white border-[#E9E5FF] shadow-xs'
                }`}
              >
                {/* Header Style Badge & Favorite */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#6D4AFF]/15 text-[#A78BFA] border border-[#6D4AFF]/30">
                    {cap.style || `Option ${idx + 1}`}
                  </span>
                  <button
                    onClick={() => onToggleFavorite(cap)}
                    className="p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        fav ? 'fill-rose-500 text-rose-500' : 'text-slate-400 hover:text-rose-400'
                      }`}
                    />
                  </button>
                </div>

                {/* Pin Title or Video Hook */}
                {cap.pinTitle && (
                  <div className="mb-2 p-1.5 px-2.5 rounded-lg bg-[#6D4AFF]/10 text-xs font-semibold text-[#A78BFA]">
                    📌 {cap.pinTitle}
                  </div>
                )}
                {cap.videoHook && (
                  <div className="mb-2 p-1.5 px-2.5 rounded-lg bg-[#6D4AFF]/10 text-xs font-semibold text-[#A78BFA]">
                    🎬 {cap.videoHook}
                  </div>
                )}

                {/* Caption Text */}
                <p className="text-xs leading-relaxed whitespace-pre-line font-normal">
                  {cap.text}
                </p>

                {/* Hashtags */}
                {cap.hashtags && cap.hashtags.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {cap.hashtags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                          isDark 
                            ? 'bg-[#2C284E] border-[#343058] text-[#A78BFA]' 
                            : 'bg-[#F1EFFF] border-[#E9E5FF] text-[#6D4AFF]'
                        }`}
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action Buttons: Copy, Regenerate, Share */}
                <div className={`mt-3 pt-2.5 border-t flex items-center justify-end gap-1.5 ${
                  isDark ? 'border-[#343058]' : 'border-slate-100'
                }`}>
                  <button
                    onClick={handleGenerate}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-colors ${
                      isDark ? 'border-[#343058] text-slate-300 hover:bg-[#2C284E]' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                    title="Regenerate this caption"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Regenerate</span>
                  </button>

                  <button
                    onClick={() => handleCopy(cap)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#6D4AFF]/15 text-[#A78BFA] border border-[#6D4AFF]/30 hover:bg-[#6D4AFF]/25 transition-colors flex items-center gap-1"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-[#20C997]" /> : <Copy className="w-3 h-3" />}
                    <span>{isCopied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handleShare(cap)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#6D4AFF] hover:bg-[#5835E5] text-white flex items-center gap-1 transition-colors shadow-2xs"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Initial Empty State */}
      {!isLoading && captions.length === 0 && !error && (
        <div className={`mt-5 p-4 rounded-2xl border text-center transition-colors ${
          isDark ? 'bg-[#211E3B]/60 border-[#343058]' : 'bg-white border-[#E9E5FF]'
        }`}>
          <div className="w-8 h-8 rounded-full bg-[#6D4AFF]/15 text-[#A78BFA] flex items-center justify-center mx-auto mb-2">
            <Lightbulb className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold mb-1">
            {currentLangUi === 'bn' ? 'ক্যাপশন তৈরির জন্য প্রস্তুত' : 'Ready to Craft'}
          </h3>
          <p className={`text-[11px] leading-relaxed max-w-xs mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {currentLangUi === 'bn'
              ? 'টপিক লিখুন বা ফটো যুক্ত করে "ক্যাপশন তৈরি করুন" বাটনে ট্যাপ করুন।'
              : 'Type your topic or attach photos, choose your platform and tone, and tap Generate.'}
          </p>
        </div>
      )}
    </div>
  );
};
