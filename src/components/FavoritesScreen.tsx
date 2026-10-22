import React, { useState } from 'react';
import { Heart, Search, Copy, Share2, Trash2, Check, BookmarkCheck } from 'lucide-react';
import { CaptionOption, AppTheme } from '../types';

interface FavoritesScreenProps {
  favorites: CaptionOption[];
  onRemoveFavorite: (id: string) => void;
  currentLangUi: 'en' | 'bn';
  theme: AppTheme;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favorites,
  onRemoveFavorite,
  currentLangUi,
  theme
}) => {
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = favorites.filter((f) => {
    const q = search.toLowerCase();
    return (
      f.text.toLowerCase().includes(q) ||
      f.hashtags?.some((t) => t.toLowerCase().includes(q)) ||
      f.style?.toLowerCase().includes(q)
    );
  });

  const handleCopy = (caption: CaptionOption) => {
    let full = caption.text;
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
        await navigator.share({ title: 'CaptionCraft AI', text: full });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(full);
      setCopiedId(caption.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className={`pb-20 transition-colors ${isDark ? 'text-slate-100' : 'text-[#17152B]'}`}>
      <div className="mb-3 pt-1">
        <h1 className="font-extrabold text-base tracking-tight">
          {currentLangUi === 'bn' ? 'সংরক্ষিত ফেভারিট' : 'Saved Favorites'}
        </h1>
        <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {currentLangUi === 'bn'
            ? 'ডিভাইসে ব্যক্তিগতভাবে সংরক্ষিত ক্যাপশন'
            : 'Private on-device bookmarks from Room database'}
        </p>
      </div>

      {favorites.length > 0 && (
        <div className="relative mb-3.5">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={currentLangUi === 'bn' ? 'ফেভারিট খুঁজুন...' : 'Search in favorites...'}
            className={`w-full pl-8 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:border-[#6D4AFF] ${
              isDark 
                ? 'bg-[#211E3B] border-[#343058] text-white placeholder-slate-500' 
                : 'bg-white border-[#E9E5FF] text-slate-800 placeholder-slate-400'
            }`}
          />
        </div>
      )}

      {favorites.length === 0 ? (
        <div className={`text-center py-12 px-4 rounded-2xl border ${
          isDark ? 'bg-[#211E3B]/60 border-[#343058]' : 'bg-white border-[#E9E5FF]'
        }`}>
          <div className="w-10 h-10 rounded-full bg-[#6D4AFF]/15 text-[#A78BFA] flex items-center justify-center mx-auto mb-2.5">
            <BookmarkCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs mb-1">
            {currentLangUi === 'bn' ? 'কোনো ফেভারিট নেই' : 'No favorites saved yet'}
          </h3>
          <p className={`text-[11px] max-w-xs mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {currentLangUi === 'bn'
              ? 'যেকোনো জেনারেটেড ক্যাপশনের হার্ট আইকনে ট্যাপ করে এখানে সেভ করুন।'
              : 'Tap the heart icon on any generated caption to bookmark it for instant access.'}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400">
          No matching favorites found.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((cap) => (
            <div
              key={cap.id}
              className={`rounded-2xl p-3.5 border transition-all ${
                isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-white border-[#E9E5FF]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6D4AFF]/15 text-[#A78BFA]">
                  {cap.style || 'Favorite'}
                </span>
                <button
                  onClick={() => onRemoveFavorite(cap.id)}
                  className="text-rose-400 hover:text-rose-500 p-1"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs leading-relaxed whitespace-pre-line font-normal">
                {cap.text}
              </p>

              {cap.hashtags?.length && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {cap.hashtags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                        isDark ? 'bg-[#2C284E] text-[#A78BFA]' : 'bg-[#F1EFFF] text-[#6D4AFF]'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className={`mt-2.5 pt-2 border-t flex items-center justify-end gap-1.5 ${
                isDark ? 'border-[#343058]' : 'border-slate-100'
              }`}>
                <button
                  onClick={() => handleCopy(cap)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1 ${
                    isDark ? 'border-[#343058] text-slate-300' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  {copiedId === cap.id ? <Check className="w-3 h-3 text-[#20C997]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId === cap.id ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => handleShare(cap)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#6D4AFF] text-white flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
