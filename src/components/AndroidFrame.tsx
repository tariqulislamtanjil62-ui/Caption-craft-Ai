import React from 'react';
import { 
  Wifi, 
  Battery, 
  Sparkles, 
  Heart, 
  History as HistoryIcon, 
  User,
  Sun,
  Moon
} from 'lucide-react';
import { AppTheme } from '../types';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeTab: 'home' | 'history' | 'favorites' | 'profile';
  onTabChange: (tab: 'home' | 'history' | 'favorites' | 'profile') => void;
  favoritesCount: number;
  currentLangUi: 'en' | 'bn';
  theme: AppTheme;
  onToggleTheme: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  activeTab,
  onTabChange,
  favoritesCount,
  currentLangUi,
  theme,
  onToggleTheme
}) => {
  const isDark = theme === 'dark';

  return (
    <div className={`relative mx-auto w-full max-w-[420px] h-[840px] rounded-[48px] p-3 shadow-2xl transition-all duration-300 select-none flex flex-col ${
      isDark 
        ? 'bg-[#0B0918] shadow-[#6D4AFF]/15 ring-1 ring-[#6D4AFF]/30' 
        : 'bg-slate-300/80 shadow-slate-400/20 ring-1 ring-slate-300'
    }`}>
      {/* Phone Screen Container */}
      <div className={`relative w-full h-full rounded-[40px] overflow-hidden flex flex-col transition-colors duration-300 border ${
        isDark 
          ? 'bg-[#17152B] border-[#343058] text-[#FAFAFA]' 
          : 'bg-[#F8F7FF] border-[#E9E5FF] text-[#17152B]'
      }`}>
        
        {/* Android Status Bar */}
        <div className={`h-10 px-6 flex items-center justify-between text-xs font-semibold select-none flex-shrink-0 z-30 transition-colors ${
          isDark ? 'bg-[#17152B] text-slate-300' : 'bg-[#F8F7FF] text-slate-700'
        }`}>
          <span className="text-[12px] font-bold tracking-tight">09:41</span>
          
          {/* Centered Camera Punch Hole */}
          <div className="w-4 h-4 rounded-full bg-black ring-2 ring-white/10 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-[#6D4AFF]">5G</span>
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-0.5">
              <span className="text-[10px]">98%</span>
              <Battery className={`w-4 h-4 ${isDark ? 'fill-white' : 'fill-slate-800'}`} />
            </div>
          </div>
        </div>

        {/* Scrollable Screen Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-1 no-scrollbar">
          {children}
        </div>

        {/* Jetpack Compose Material 3 Bottom Navigation Bar */}
        <div className={`h-16 px-4 flex items-center justify-around z-20 flex-shrink-0 border-t transition-colors duration-300 ${
          isDark 
            ? 'bg-[#211E3B]/95 backdrop-blur-md border-[#343058]' 
            : 'bg-white/95 backdrop-blur-md border-[#E9E5FF]'
        }`}>
          {[
            {
              id: 'home' as const,
              label: currentLangUi === 'bn' ? 'হোম' : 'Home',
              icon: <Sparkles className="w-4 h-4 stroke-[1.8]" />
            },
            {
              id: 'history' as const,
              label: currentLangUi === 'bn' ? 'ইতিহাস' : 'History',
              icon: <HistoryIcon className="w-4 h-4 stroke-[1.8]" />
            },
            {
              id: 'favorites' as const,
              label: currentLangUi === 'bn' ? 'ফেভারিট' : 'Favorites',
              icon: (
                <div className="relative">
                  <Heart className="w-4 h-4 stroke-[1.8]" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#6D4AFF] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                      {favoritesCount}
                    </span>
                  )}
                </div>
              )
            },
            {
              id: 'profile' as const,
              label: currentLangUi === 'bn' ? 'প্রোফাইল' : 'Profile',
              icon: <User className="w-4 h-4 stroke-[1.8]" />
            }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? isDark ? 'text-white' : 'text-[#6D4AFF]'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <div
                  className={`p-1.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-[#6D4AFF] text-white shadow-md shadow-[#6D4AFF]/30 scale-105' 
                      : ''
                  }`}
                >
                  {tab.icon}
                </div>
                <span
                  className={`text-[10px] mt-0.5 tracking-tight ${
                    isActive ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Android Gesture Navigation Home Bar */}
        <div className={`h-4 flex items-center justify-center flex-shrink-0 pb-1 transition-colors ${
          isDark ? 'bg-[#211E3B]' : 'bg-white'
        }`}>
          <div className={`w-32 h-1 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
        </div>

      </div>
    </div>
  );
};
