import React, { useState } from 'react';
import { 
  Sun,
  Moon,
  Sparkles,
  Cpu,
  CheckCircle2,
  Lock,
  Languages,
  Eye,
  EyeOff,
  Search,
  ExternalLink,
  Shield,
  Zap,
  KeyRound
} from 'lucide-react';
import { AiProvider, AppTheme } from '../types';

interface SettingsScreenProps {
  currentLangUi: 'en' | 'bn';
  onToggleLangUi: (lang: 'en' | 'bn') => void;
  aiProvider: AiProvider;
  onSetAiProvider: (provider: AiProvider) => void;
  customOpenAiKey: string;
  onSetCustomOpenAiKey: (key: string) => void;
  theme: AppTheme;
  onToggleTheme: (theme: AppTheme) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  currentLangUi,
  onToggleLangUi,
  aiProvider,
  onSetAiProvider,
  customOpenAiKey,
  onSetCustomOpenAiKey,
  theme,
  onToggleTheme
}) => {
  const isDark = theme === 'dark';
  const [showKey, setShowKey] = useState(false);
  const [keyInput, setKeyInput] = useState(customOpenAiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveKey = () => {
    onSetCustomOpenAiKey(keyInput.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className={`pb-20 space-y-3.5 transition-colors ${
      isDark ? 'text-slate-100' : 'text-[#17152B]'
    }`}>
      <div className="pt-1">
        <h1 className="font-extrabold text-base tracking-tight">
          {currentLangUi === 'bn' ? 'প্রোফাইল ও সেটিংস' : 'Profile & Settings'}
        </h1>
        <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {currentLangUi === 'bn'
            ? 'থিম, এআই ইঞ্জিন ও অন-ডিভাইস নিয়ন্ত্রণ'
            : 'Theme preferences, AI engine, and device controls'}
        </p>
      </div>

      {/* Unlimited Status Card */}
      <div className={`rounded-2xl p-3.5 border transition-all ${
        isDark 
          ? 'bg-gradient-to-r from-[#211E3B] to-[#2C284E] border-[#343058]' 
          : 'bg-gradient-to-r from-white to-[#F1EFFF] border-[#E9E5FF] shadow-xs'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#6D4AFF] text-white flex items-center justify-center shadow-md shadow-[#6D4AFF]/25">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block">Unlimited Pro Access</span>
              <span className="text-[10px] text-[#20C997] font-semibold">
                ● Active • No Daily Limits
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6D4AFF]/15 text-[#A78BFA] border border-[#6D4AFF]/30">
            Complimentary
          </span>
        </div>
      </div>

      {/* Dark & White Theme Switcher */}
      <div className={`rounded-2xl p-3.5 border transition-all ${
        isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-white border-[#E9E5FF] shadow-xs'
      }`}>
        <span className={`block text-[11px] font-bold uppercase tracking-wider mb-2.5 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {currentLangUi === 'bn' ? 'অ্যাপের থিম' : 'App Theme'}
        </span>

        <div className="grid grid-cols-2 gap-2">
          {/* Midnight Dark */}
          <button
            onClick={() => onToggleTheme('dark')}
            className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
              theme === 'dark'
                ? 'bg-[#17152B] border-[#6D4AFF] ring-1 ring-[#6D4AFF] text-white'
                : 'bg-[#17152B]/40 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-[#2C284E] flex items-center justify-center text-[#A78BFA]">
              <Moon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold block">Midnight Dark</span>
              <span className="text-[9px] text-slate-400">#17152B deep tone</span>
            </div>
          </button>

          {/* Clean White */}
          <button
            onClick={() => onToggleTheme('light')}
            className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-2 ${
              theme === 'light'
                ? 'bg-white border-[#6D4AFF] ring-1 ring-[#6D4AFF] text-[#17152B]'
                : 'bg-white/40 border-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="w-6 h-6 rounded-lg bg-[#F1EFFF] flex items-center justify-center text-[#6D4AFF]">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold block">Clean White</span>
              <span className="text-[9px] text-slate-400">#F8F7FF crisp light</span>
            </div>
          </button>
        </div>
      </div>

      {/* AI Provider & Engine Selector */}
      <div className={`rounded-2xl p-3.5 border transition-all ${
        isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-white border-[#E9E5FF] shadow-xs'
      }`}>
        <span className={`block text-[11px] font-bold uppercase tracking-wider mb-2.5 ${
          isDark ? 'text-slate-400' : 'text-slate-500'
        }`}>
          {currentLangUi === 'bn' ? 'এআই কপিরাইটিং ইঞ্জিন' : 'AI Copywriting Provider'}
        </span>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSetAiProvider('gemini')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              aiProvider === 'gemini'
                ? 'bg-[#6D4AFF]/15 border-[#6D4AFF] ring-1 ring-[#6D4AFF]'
                : isDark ? 'bg-[#17152B] border-[#343058]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                Gemini 3.8
              </span>
              {aiProvider === 'gemini' && <CheckCircle2 className="w-3.5 h-3.5 text-[#20C997]" />}
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Google Search Grounding &amp; Multimodal logic
            </p>
          </button>

          <button
            onClick={() => onSetAiProvider('openai')}
            className={`p-2.5 rounded-xl border text-left transition-all ${
              aiProvider === 'openai'
                ? 'bg-[#6D4AFF]/15 border-[#6D4AFF] ring-1 ring-[#6D4AFF]'
                : isDark ? 'bg-[#17152B] border-[#343058]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                ChatGPT
              </span>
              {aiProvider === 'openai' && <CheckCircle2 className="w-3.5 h-3.5 text-[#20C997]" />}
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              OpenAI GPT-4o with custom API Key
            </p>
          </button>
        </div>

        {aiProvider === 'openai' && (
          <div className="mt-3 pt-3 border-t border-[#343058]/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                OpenAI API Key
              </label>
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-[#A78BFA] flex items-center gap-0.5"
              >
                Get Key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="sk-proj-..."
                className={`w-full text-xs font-mono p-2 pr-16 rounded-xl border focus:outline-none focus:border-[#6D4AFF] ${
                  isDark ? 'bg-[#17152B] border-[#343058] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleSaveKey}
                className="px-3 py-1 rounded-lg bg-[#6D4AFF] text-white text-xs font-bold"
              >
                {savedSuccess ? 'Saved!' : 'Save Key'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Language UI Switcher */}
      <div className={`rounded-2xl p-3.5 border transition-all ${
        isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-white border-[#E9E5FF] shadow-xs'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#6D4AFF]/15 text-[#A78BFA]">
              <Languages className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold block">
                {currentLangUi === 'bn' ? 'ইন্টারফেস ভাষা' : 'App Interface'}
              </span>
              <span className="text-[10px] text-slate-400">
                {currentLangUi === 'bn' ? 'বাংলা ও ইংরেজি' : 'English & Bengali'}
              </span>
            </div>
          </div>

          <div className={`flex items-center p-1 rounded-xl border ${
            isDark ? 'bg-[#17152B] border-[#343058]' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => onToggleLangUi('en')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                currentLangUi === 'en' ? 'bg-[#6D4AFF] text-white' : 'text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onToggleLangUi('bn')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold transition-all ${
                currentLangUi === 'bn' ? 'bg-[#6D4AFF] text-white' : 'text-slate-400'
              }`}
            >
              বাং
            </button>
          </div>
        </div>
      </div>

      {/* On-Device Privacy Guarantee */}
      <div className={`rounded-2xl p-3.5 border transition-all ${
        isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-white border-[#E9E5FF] shadow-xs'
      }`}>
        <div className="flex items-center gap-2 mb-1.5">
          <div className="p-1.5 rounded-lg bg-[#20C997]/15 text-[#20C997]">
            <Lock className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold">On-Device Privacy (Room SQLite)</span>
        </div>
        <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Zero personal data collection. Your saved bookmarks, history logs, and file inputs remain private on your device.
        </p>
      </div>

      {/* Version Tag */}
      <div className="text-center pt-1">
        <p className="text-[11px] font-bold text-slate-400">CaptionCraft AI • Jetpack Compose 2.0</p>
        <p className="text-[10px] text-slate-500">Royal Purple &amp; Midnight Edition</p>
      </div>
    </div>
  );
};
