import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  Terminal, 
  FileCode, 
  Play, 
  AlertCircle 
} from 'lucide-react';

export const FirebaseGuide: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(id);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-950 p-6 rounded-3xl border border-purple-500/20 shadow-xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30 mb-3">
          <ShieldAlert className="w-3.5 h-3.5" />
          Official Firebase AI Logic Integration
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Firebase Setup & Configuration Walkthrough
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Follow these simple steps in the Firebase Console to link your Android app. The app uses the officially recommended Firebase AI Logic SDK, so your Gemini API key is completely protected and never exposed in the compiled APK.
        </p>
      </div>

      {/* Step 1: Create Firebase Project */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="font-bold text-sm text-white">
              Create / Select Firebase Project
            </h3>
          </div>
          <a
            href="https://console.firebase.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
          >
            Open Firebase Console <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Go to the Firebase Console and create a project named <strong className="text-slate-200">CaptionCraft AI</strong>.
        </p>
      </div>

      {/* Step 2: Register Android App */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
            2
          </span>
          <h3 className="font-bold text-sm text-white">
            Register Android Application
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          In Project Overview, click <span className="text-slate-200 font-semibold">+ Add app</span> and choose <span className="text-slate-200 font-semibold">Android</span>.
        </p>
        <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block font-mono">
              Android Package Name
            </span>
            <code className="text-xs text-purple-300 font-bold font-mono">
              com.captioncraft.ai
            </code>
          </div>
          <button
            onClick={() => copyText('com.captioncraft.ai', 'pkg')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
          >
            {copiedStep === 'pkg' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Step 3: Download google-services.json */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
            3
          </span>
          <h3 className="font-bold text-sm text-white">
            Place google-services.json in the App Module
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Download <code className="text-purple-300 font-mono">google-services.json</code> from step 2 of the Firebase setup wizard and place it in your local directory:
        </p>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
          android/app/google-services.json
        </div>
      </div>

      {/* Step 4: Enable Firebase AI Logic (Gemini API) */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
            4
          </span>
          <h3 className="font-bold text-sm text-white">
            Enable Firebase AI Logic (Gemini Developer API)
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          In the Firebase Console sidebar, expand <strong className="text-slate-200">Build</strong> &rarr; click <strong className="text-slate-200">AI Logic</strong> (or <strong className="text-slate-200">Vertex AI in Firebase</strong>). Click <em>Get Started</em> to activate the Gemini Developer API.
        </p>
        <div className="p-3 bg-purple-950/40 rounded-xl border border-purple-500/20 text-xs text-purple-200 leading-relaxed">
          This grants your Android app direct access to Gemini 2.5 Flash through Google's managed backend gateway without ever embedding an API key in your Kotlin code or APK.
        </div>
      </div>

      {/* Step 5: Run in Android Studio */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
            5
          </span>
          <h3 className="font-bold text-sm text-white">
            Open &amp; Run in Android Studio
          </h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Open Android Studio, select <strong className="text-slate-200">Open</strong> &rarr; choose the <strong className="text-slate-200">/android</strong> directory, let Gradle sync, and click <strong className="text-emerald-400">Run (Shift + F10)</strong> on your emulator or connected device!
        </p>
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-300">./gradlew assembleDebug</span>
          <button
            onClick={() => copyText('./gradlew assembleDebug', 'cmd')}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            {copiedStep === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
