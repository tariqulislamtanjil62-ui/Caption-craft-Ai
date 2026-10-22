import React from 'react';
import { 
  ArrowLeft, 
  Crown, 
  Infinity, 
  Languages, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Construction 
} from 'lucide-react';
import { DailyQuota } from '../types';

interface PremiumScreenProps {
  quota: DailyQuota;
  onBack: () => void;
  currentLangUi: 'en' | 'bn';
}

export const PremiumScreen: React.FC<PremiumScreenProps> = ({
  quota,
  onBack,
  currentLangUi
}) => {
  const perks = [
    {
      icon: <Infinity className="w-4 h-4 text-purple-600" />,
      title: currentLangUi === 'bn' ? 'আনলিমিটেড ক্যাপশন জেনারেশন' : 'Unlimited Daily Captions',
      desc: currentLangUi === 'bn' ? 'কোনো দৈনিক সীমা নেই' : 'No 5-per-day restriction. Create anytime.'
    },
    {
      icon: <Languages className="w-4 h-4 text-purple-600" />,
      title: currentLangUi === 'bn' ? 'উন্নত বাংলা আঞ্চলিক শৈলী' : 'Advanced Regional Bangla Nuances',
      desc: currentLangUi === 'bn' ? 'লোকাল ই-কমার্স ও ভাইরাল স্টাইল' : 'Custom colloquial Bangla tailored for BD marketing.'
    },
    {
      icon: <Sparkles className="w-4 h-4 text-purple-600" />,
      title: currentLangUi === 'bn' ? 'হ্যাশট্যাগ অ্যানালিটিক্স' : 'High-Engagement Hashtag Bank',
      desc: currentLangUi === 'bn' ? 'সর্বাধিক কার্যকর হ্যাশট্যাগ' : 'Trending tags researched for reach and visibility.'
    },
    {
      icon: <Zap className="w-4 h-4 text-purple-600" />,
      title: currentLangUi === 'bn' ? 'সর্বোচ্চ স্পিড ও প্রায়োরিটি' : 'Priority AI Inference',
      desc: currentLangUi === 'bn' ? 'দ্রুততম রেসপন্স টাইম' : 'Dedicated capacity via Firebase AI Logic.'
    }
  ];

  const percentUsed = Math.min(100, Math.round((quota.usedToday / quota.maxFree) * 100));

  return (
    <div className="pb-16 text-slate-800">
      {/* Top Back Row */}
      <div className="flex items-center gap-2 mb-4 pt-1">
        <button
          onClick={onBack}
          className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-bold text-base text-slate-900">CaptionCraft Pro</h1>
      </div>

      {/* Hero Card */}
      <div className="rounded-2xl bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 text-white p-5 shadow-md shadow-purple-900/20 mb-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 shadow-inner">
          <Crown className="w-6 h-6 text-amber-300" />
        </div>
        <h2 className="text-base font-extrabold tracking-tight mb-1">
          {currentLangUi === 'bn' ? 'সীমাহীন ক্রিয়েটিভিটি আনলক করুন' : 'Unlock Unlimited Captions'}
        </h2>
        <p className="text-xs text-purple-100 max-w-xs mx-auto leading-relaxed">
          {currentLangUi === 'bn'
            ? 'ফেসবুক, ইনস্টাগ্রাম ও টিকটক কনটেন্টের জন্য প্রো লেভেল এআই কপিরাইটিং'
            : 'Supercharge your social presence with unlimited generation, viral hooks, and hashtag intelligence.'}
        </p>
      </div>

      {/* Free Tier Usage Meter */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800">
            {currentLangUi === 'bn' ? 'আজকের ফ্রি ব্যবহারের কোটা' : "Today's Free Tier Usage"}
          </span>
          <span
            className={`text-xs font-bold ${
              quota.usedToday >= quota.maxFree ? 'text-red-600' : 'text-purple-700'
            }`}
          >
            {quota.usedToday} / {quota.maxFree} {currentLangUi === 'bn' ? 'ব্যবহৃত' : 'Used'}
          </span>
        </div>

        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              quota.usedToday >= quota.maxFree
                ? 'bg-red-500'
                : 'bg-gradient-to-r from-purple-600 to-violet-500'
            }`}
            style={{ width: `${percentUsed}%` }}
          />
        </div>

        <p className="text-[11px] text-slate-500">
          {quota.usedToday >= quota.maxFree
            ? currentLangUi === 'bn'
              ? 'আজকের ৫টি ফ্রি জেনারেশন শেষ হয়েছে। আগামীকাল আবার রিসেট হবে।'
              : 'You reached the 5 daily free generations. Counter resets at midnight.'
            : currentLangUi === 'bn'
            ? `আজকে আরও ${quota.maxFree - quota.usedToday}টি ফ্রি জেনারেশন বাকি আছে।`
            : `You have ${quota.maxFree - quota.usedToday} free generations left today.`}
        </p>
      </div>

      {/* Pro Perks List */}
      <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-2xs mb-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          {currentLangUi === 'bn' ? 'প্রো ফিচারের সুবিধা' : 'Pro Features Included'}
        </h3>
        <div className="space-y-3">
          {perks.map((p, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-purple-50 flex-shrink-0 mt-0.5">
                {p.icon}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">{p.title}</h4>
                <p className="text-[11px] text-slate-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Honest Google Play Billing Compliance Notice */}
      <div className="bg-purple-50/80 rounded-2xl p-4 border border-purple-200/80">
        <div className="flex items-center gap-2 mb-2 text-purple-900">
          <Construction className="w-4 h-4 text-purple-700" />
          <h4 className="text-xs font-bold">
            {currentLangUi === 'bn'
              ? 'গুগল প্লে বিলিং ইন্টিগ্রেশন চলমান'
              : 'Google Play Billing: Staging Mode'}
          </h4>
        </div>
        <p className="text-[11px] text-purple-950/80 leading-relaxed">
          {currentLangUi === 'bn'
            ? 'গুগল প্লে স্টোর নীতিমালা অনুসারে, অফিশিয়াল Google Play Billing API লাইভ ভেরিফিকেশনের পর পেমেন্ট সক্রিয় হবে। এই প্রিভিউতে কোনো ভুয়া চার্জ বা পেমেন্ট গেটওয়ে রাখা হয়নি।'
            : 'In strict compliance with Google Play Store Commerce policies, subscriptions will be enabled once your Play Console In-App Products are linked. No mock payments or unauthorized payment methods are implemented.'}
        </p>
      </div>
    </div>
  );
};
