import React, { useState } from 'react';
import { History as HistoryIcon, Trash2, Copy, Share2, Check, Clock } from 'lucide-react';
import { CaptionOption, AppTheme } from '../types';

interface HistoryScreenProps {
  history: CaptionOption[];
  onClearHistory: () => void;
  currentLangUi: 'en' | 'bn';
  theme: AppTheme;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onClearHistory,
  currentLangUi,
  theme
}) => {
  const isDark = theme === 'dark';
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
      <div className="flex items-center justify-between mb-3 pt-1">
        <div>
          <h1 className="font-extrabold text-base tracking-tight">
            {currentLangUi === 'bn' ? 'জেনারেশন ইতিহাস' : 'History'}
          </h1>
          <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {currentLangUi === 'bn' ? 'সম্প্রতি তৈরি করা ক্যাপশন' : 'Recent on-device generations'}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1 text-[11px] text-rose-400 hover:text-rose-500 font-semibold px-2 py-1 rounded-lg"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{currentLangUi === 'bn' ? 'মুছুন' : 'Clear'}</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={`text-center py-12 px-4 rounded-2xl border ${
          isDark ? 'bg-[#211E3B]/60 border-[#343058]' : 'bg-white border-[#E9E5FF]'
        }`}>
          <div className="w-10 h-10 rounded-full bg-[#6D4AFF]/15 text-[#A78BFA] flex items-center justify-center mx-auto mb-2.5">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-xs mb-1">
            {currentLangUi === 'bn' ? 'কোনো ইতিহাস নেই' : 'No history yet'}
          </h3>
          <p className={`text-[11px] max-w-xs mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Captions you generate will automatically be logged here on your device.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((cap, idx) => (
            <div
              key={cap.id || idx}
              className={`rounded-2xl p-3.5 border transition-all ${
                isDark ? 'bg-[#211E3B] border-[#343058]' : 'bg-white border-[#E9E5FF]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#6D4AFF]/15 text-[#A78BFA]">
                    {cap.style || 'Option'}
                  </span>
                  {cap.platform && (
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      isDark ? 'bg-[#2C284E] text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {cap.platform}
                    </span>
                  )}
                </div>
                {cap.createdAt && (
                  <span className="text-[10px] text-slate-400">
                    {new Date(cap.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
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
