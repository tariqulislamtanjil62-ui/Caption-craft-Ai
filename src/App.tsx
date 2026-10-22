import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Smartphone, 
  Code2, 
  BookOpen, 
  Download, 
  Sun,
  Moon,
  Layers, 
  ShieldCheck,
  Globe2,
  CheckCircle
} from 'lucide-react';
import { AndroidFrame } from './components/AndroidFrame';
import { HomeScreen } from './components/HomeScreen';
import { FavoritesScreen } from './components/FavoritesScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { CodeExplorer } from './components/CodeExplorer';
import { FirebaseGuide } from './components/FirebaseGuide';
import { CaptionOption, AppTheme } from './types';
import { downloadAndroidProjectZip } from './utils/zipExport';

export default function App() {
  const [activeView, setActiveView] = useState<'app' | 'code' | 'guide'>('app');
  const [androidTab, setAndroidTab] = useState<'home' | 'history' | 'favorites' | 'profile'>('home');
  const [currentLangUi, setCurrentLangUi] = useState<'en' | 'bn'>('en');
  const [isExporting, setIsExporting] = useState(false);

  // Theme state: 'dark' (Midnight #17152B) or 'light' (#F8F7FF)
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('captioncraft_theme') as AppTheme) || 'dark';
  });

  const [aiProvider, setAiProvider] = useState<'gemini' | 'openai'>(() => {
    return (localStorage.getItem('captioncraft_ai_provider') as 'gemini' | 'openai') || 'gemini';
  });

  const [customOpenAiKey, setCustomOpenAiKey] = useState<string>(() => {
    return localStorage.getItem('captioncraft_openai_key') || '';
  });

  // Local persistence for favorites
  const [favorites, setFavorites] = useState<CaptionOption[]>(() => {
    try {
      const saved = localStorage.getItem('captioncraft_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Local persistence for history
  const [history, setHistory] = useState<CaptionOption[]>(() => {
    try {
      const saved = localStorage.getItem('captioncraft_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('captioncraft_theme', theme);
    } catch (e) {}
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('captioncraft_favorites', JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('captioncraft_history', JSON.stringify(history));
    } catch (e) {}
  }, [history]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSetTheme = (newTheme: AppTheme) => {
    setTheme(newTheme);
  };

  const handleSetAiProvider = (provider: 'gemini' | 'openai') => {
    setAiProvider(provider);
    try {
      localStorage.setItem('captioncraft_ai_provider', provider);
    } catch (e) {}
  };

  const handleSetCustomOpenAiKey = (key: string) => {
    setCustomOpenAiKey(key);
    try {
      localStorage.setItem('captioncraft_openai_key', key);
    } catch (e) {}
  };

  const handleToggleFavorite = (caption: CaptionOption) => {
    setFavorites((prev) => {
      const exists = prev.some((c) => c.id === caption.id);
      if (exists) {
        return prev.filter((c) => c.id !== caption.id);
      } else {
        return [{ ...caption, isFavorite: true }, ...prev];
      }
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((c) => c.id !== id));
  };

  const handleAddToHistory = (newCaptions: CaptionOption[]) => {
    setHistory((prev) => [...newCaptions, ...prev].slice(0, 50));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await downloadAndroidProjectZip();
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col font-sans ${
      isDark 
        ? 'bg-[#0E0C1C] text-slate-100 selection:bg-[#6D4AFF]/40' 
        : 'bg-[#F2F0FA] text-[#17152B] selection:bg-[#6D4AFF]/25'
    }`}>
      {/* Global Header */}
      <header className={`border-b sticky top-0 z-40 px-4 py-2.5 backdrop-blur-md transition-colors ${
        isDark 
          ? 'bg-[#17152B]/85 border-[#343058]' 
          : 'bg-white/85 border-[#E9E5FF] shadow-xs'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Headline */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#6D4AFF] via-[#5835E5] to-[#8B5CF6] flex items-center justify-center text-white shadow-md shadow-[#6D4AFF]/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">
                  CaptionCraft AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#6D4AFF]/15 text-[#A78BFA] border border-[#6D4AFF]/30">
                  Compose M3
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Royal Purple &amp; Midnight System • Multimodal Files &amp; Search
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl border transition-colors ${
            isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-[#F1EFFF] border-[#E9E5FF]'
          }`}>
            <button
              onClick={() => setActiveView('app')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'app'
                  ? 'bg-[#6D4AFF] text-white shadow-sm shadow-[#6D4AFF]/30'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>App Preview</span>
            </button>

            <button
              onClick={() => setActiveView('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'code'
                  ? 'bg-[#6D4AFF] text-white shadow-sm shadow-[#6D4AFF]/30'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Kotlin Codebase</span>
            </button>

            <button
              onClick={() => setActiveView('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeView === 'guide'
                  ? 'bg-[#6D4AFF] text-white shadow-sm shadow-[#6D4AFF]/30'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Firebase Guide</span>
            </button>
          </div>

          {/* Actions: Theme Toggle & Export ZIP */}
          <div className="flex items-center gap-2">
            {/* Quick Dark/White Theme Switcher */}
            <button
              onClick={handleToggleTheme}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center ${
                isDark 
                  ? 'bg-[#211E3B] border-[#343058] text-[#A78BFA] hover:text-white hover:border-[#6D4AFF]' 
                  : 'bg-white border-[#E9E5FF] text-[#6D4AFF] hover:bg-[#F1EFFF]'
              }`}
              title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isExporting}
              className="px-3.5 py-2 rounded-xl bg-[#6D4AFF] hover:bg-[#5835E5] text-white text-xs font-bold shadow-md shadow-[#6D4AFF]/25 transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isExporting ? 'Exporting...' : 'Export Android ZIP'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeView === 'app' && (
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 py-2">
            {/* The Android Phone Simulator */}
            <div className="w-full max-w-[420px] flex-shrink-0">
              <AndroidFrame
                activeTab={androidTab}
                onTabChange={(tab) => setAndroidTab(tab)}
                favoritesCount={favorites.length}
                currentLangUi={currentLangUi}
                theme={theme}
                onToggleTheme={handleToggleTheme}
              >
                {androidTab === 'home' && (
                  <HomeScreen
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onAddToHistory={handleAddToHistory}
                    currentLangUi={currentLangUi}
                    aiProvider={aiProvider}
                    customOpenAiKey={customOpenAiKey}
                    theme={theme}
                  />
                )}
                {androidTab === 'history' && (
                  <HistoryScreen
                    history={history}
                    onClearHistory={handleClearHistory}
                    currentLangUi={currentLangUi}
                    theme={theme}
                  />
                )}
                {androidTab === 'favorites' && (
                  <FavoritesScreen
                    favorites={favorites}
                    onRemoveFavorite={handleRemoveFavorite}
                    currentLangUi={currentLangUi}
                    theme={theme}
                  />
                )}
                {androidTab === 'profile' && (
                  <SettingsScreen
                    currentLangUi={currentLangUi}
                    onToggleLangUi={(lang) => setCurrentLangUi(lang)}
                    aiProvider={aiProvider}
                    onSetAiProvider={handleSetAiProvider}
                    customOpenAiKey={customOpenAiKey}
                    onSetCustomOpenAiKey={handleSetCustomOpenAiKey}
                    theme={theme}
                    onToggleTheme={handleSetTheme}
                  />
                )}
              </AndroidFrame>
            </div>

            {/* Side Companion Panel */}
            <div className="w-full max-w-lg space-y-4">
              {/* Design System Summary */}
              <div className={`rounded-3xl p-5 border transition-all ${
                isDark ? 'bg-[#17152B] border-[#343058]' : 'bg-white border-[#E9E5FF] shadow-xs'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-[#6D4AFF]" />
                  <h3 className="font-bold text-xs uppercase tracking-wider">
                    Design Tokens &amp; Theme Specs
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`p-2.5 rounded-2xl border ${
                    isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-[#F8F7FF] border-[#E9E5FF]'
                  }`}>
                    <span className="text-slate-400 block text-[10px] font-medium">Primary Token</span>
                    <span className="font-bold text-[#6D4AFF]">Royal Purple #6D4AFF</span>
                  </div>
                  <div className={`p-2.5 rounded-2xl border ${
                    isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-[#F8F7FF] border-[#E9E5FF]'
                  }`}>
                    <span className="text-slate-400 block text-[10px] font-medium">Dark Mode BG</span>
                    <span className="font-bold text-[#A78BFA]">Midnight #17152B</span>
                  </div>
                  <div className={`p-2.5 rounded-2xl border ${
                    isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-[#F8F7FF] border-[#E9E5FF]'
                  }`}>
                    <span className="text-slate-400 block text-[10px] font-medium">Light Mode BG</span>
                    <span className="font-bold text-[#6D4AFF]">Light #F8F7FF</span>
                  </div>
                  <div className={`p-2.5 rounded-2xl border ${
                    isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-[#F8F7FF] border-[#E9E5FF]'
                  }`}>
                    <span className="text-slate-400 block text-[10px] font-medium">Accent &amp; Badges</span>
                    <span className="font-bold text-[#20C997]">Mint #20C997 &amp; Lavender</span>
                  </div>
                </div>
              </div>

              {/* Multimodal & Real Search Capabilities */}
              <div className={`rounded-3xl p-5 border transition-all ${
                isDark ? 'bg-[#17152B] border-[#343058]' : 'bg-white border-[#E9E5FF] shadow-xs'
              }`}>
                <div className="flex items-center gap-2 mb-2 text-[#A78BFA]">
                  <Globe2 className="w-4 h-4 text-[#6D4AFF]" />
                  <h3 className="font-bold text-sm">
                    Multimodal Files &amp; Live Search Grounding
                  </h3>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Attach product photos, flyers, or documents (PDFs, scripts) and let Gemini analyze both text and visual details. Real-time Google Search grounding pulls 2026 trending keywords automatically.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded-lg bg-[#6D4AFF]/15 text-[#A78BFA] text-[11px] font-semibold border border-[#6D4AFF]/30">
                    Unlimited Generations
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#6D4AFF]/15 text-[#A78BFA] text-[11px] font-semibold border border-[#6D4AFF]/30">
                    Image &amp; PDF Multimodal
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-[#6D4AFF]/15 text-[#A78BFA] text-[11px] font-semibold border border-[#6D4AFF]/30">
                    Zero Emojis in Tones
                  </span>
                </div>
              </div>

              {/* Instructions */}
              <div className={`rounded-3xl p-5 border text-xs space-y-2 ${
                isDark 
                  ? 'bg-[#211E3B]/80 border-[#343058] text-slate-300' 
                  : 'bg-[#F1EFFF] border-[#E9E5FF] text-slate-700'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <CheckCircle className="w-4 h-4 text-[#20C997]" />
                  <span>How to Test</span>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  <li>Click the <strong>Sun / Moon</strong> toggle to test Midnight Dark and Clean White themes.</li>
                  <li>Type a topic or click <strong>Attach Photo or Document</strong> to test multimodal visual captions.</li>
                  <li>Select from the minimal tone pills: <em>Aesthetic, Funny, Romantic, Professional, Motivational</em>.</li>
                  <li>Click <strong>Generate Caption</strong>, then test <strong>Copy</strong>, <strong>Regenerate</strong>, or <strong>Share</strong>.</li>
                  <li>Navigate with the bottom bar: <strong>Home, History, Favorites, Profile</strong>.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeView === 'code' && <CodeExplorer />}

        {activeView === 'guide' && <FirebaseGuide />}
      </main>
    </div>
  );
}
