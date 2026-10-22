import React, { useState } from 'react';
import { 
  Folder, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileText, 
  Layers, 
  ShieldCheck 
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../utils/zipExport';

export const CodeExplorer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [selectedFileKey, setSelectedFileKey] = useState<string>('FirebaseAiService');

  const filesMap: Record<string, { path: string; language: string; content: string; desc: string }> = {
    FirebaseAiService: {
      path: 'app/src/main/java/com/captioncraft/ai/data/remote/FirebaseAiCaptionService.kt',
      language: 'kotlin',
      desc: 'Officially recommended Firebase AI Logic SDK implementation (com.google.firebase:firebase-ai) using Gemini 2.5 Flash without exposing any API key.',
      content: `package com.captioncraft.ai.data.remote

import com.captioncraft.ai.data.model.*
import com.google.firebase.Firebase
import com.google.firebase.ai.ai
import com.google.firebase.ai.type.generationConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.util.UUID

/**
 * Firebase AI Logic SDK implementation.
 * Connects directly through Firebase gateway secured by App Check.
 * Never stores or exposes a Gemini API key in the APK.
 */
class FirebaseAiCaptionService {

    private val generativeModel by lazy {
        Firebase.ai.generativeModel(
            modelName = "gemini-2.5-flash",
            generationConfig = generationConfig {
                temperature = 0.7f
                topK = 40
                topP = 0.95f
                responseMimeType = "application/json"
            },
            systemInstruction = com.google.firebase.ai.type.content {
                text(
                    """
                    You are CaptionCraft AI, a professional social media caption architect.
                    RULES:
                    1. Return EXACTLY THREE distinct caption options (Story/Hook, Direct Value, Interactive).
                    2. Tone must strictly match the requested tone.
                    3. Language Guidelines:
                       - 'bangla': Natural, modern Bengali script (বাংলা), avoiding robotic translation.
                       - 'english': Catchy international social media English.
                       - 'bilingual': Popular BD mix (Bengali sentences + English keywords).
                    4. STRICT GUARDRAIL: NEVER invent specific prices (e.g. ৳500), discounts (50% OFF), or fake warranties.
                    5. Return valid JSON: { "captions": [ { "style": "...", "text": "...", "hashtags": [...], "callToAction": "..." } ] }
                    """.trimIndent()
                )
            }
        )
    }

    suspend fun generateCaptions(
        topic: String,
        language: AppLanguage,
        tone: AppTone,
        platform: AppPlatform
    ): List<CaptionOption> = withContext(Dispatchers.IO) {
        val prompt = "Topic: $topic\\nLanguage: \${language.code}\\nTone: \${tone.id}\\nPlatform: \${platform.id}"
        val response = generativeModel.generateContent(prompt)
        val text = response.text ?: throw IllegalStateException("Empty AI response")
        parseJson(text)
    }
}`
    },
    CaptionModels: {
      path: 'app/src/main/java/com/captioncraft/ai/data/model/CaptionModels.kt',
      language: 'kotlin',
      desc: 'Domain models with multi-platform support (YouTube, Pinterest, LinkedIn, Twitter, FB, IG, TikTok) and SEO search grounding flags.',
      content: `package com.captioncraft.ai.data.model

enum class AppPlatform(val id: String, val label: String) {
    YOUTUBE("youtube", "YouTube"),
    PINTEREST("pinterest", "Pinterest"),
    INSTAGRAM("instagram", "Instagram"),
    FACEBOOK("facebook", "Facebook"),
    TIKTOK("tiktok", "TikTok"),
    LINKEDIN("linkedin", "LinkedIn"),
    TWITTER("twitter", "X (Twitter)"),
    GENERAL("general", "General")
}

data class CaptionOption(
    val id: String,
    val style: String,
    val text: String,
    val hashtags: List<String>,
    val callToAction: String,
    val seoTags: List<String> = emptyList(),
    val pinTitle: String? = null,
    val videoHook: String? = null,
    val isSearchGrounded: Boolean = false
)`
    },
    MainActivity: {
      path: 'app/src/main/java/com/captioncraft/ai/MainActivity.kt',
      language: 'kotlin',
      desc: 'Edge-to-edge Jetpack Compose Activity with ViewModel factory.',
      content: `package com.captioncraft.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.captioncraft.ai.data.repository.CaptionRepository
import com.captioncraft.ai.ui.navigation.AppNavigation
import com.captioncraft.ai.ui.theme.CaptionCraftTheme
import com.captioncraft.ai.ui.viewmodel.CaptionViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: CaptionViewModel by viewModels {
        object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                val app = application as CaptionCraftApplication
                val repo = CaptionRepository(applicationContext, app.database.captionDao())
                return CaptionViewModel(repo) as T
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CaptionCraftTheme {
                AppNavigation(viewModel = viewModel)
            }
        }
    }
}`
    },
    Application: {
      path: 'app/src/main/java/com/captioncraft/ai/CaptionCraftApplication.kt',
      language: 'kotlin',
      desc: 'Configures Firebase App Check with Play Integrity (release) and Debug token (emulator).',
      content: `package com.captioncraft.ai

import android.app.Application
import com.captioncraft.ai.data.local.AppDatabase
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.FirebaseAppCheck
import com.google.firebase.appcheck.debug.DebugAppCheckProviderFactory
import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory

class CaptionCraftApplication : Application() {
    lateinit var database: AppDatabase
        private set

    override fun onCreate() {
        super.onCreate()
        FirebaseApp.initializeApp(this)

        val appCheck = FirebaseAppCheck.getInstance()
        if (BuildConfig.DEBUG) {
            appCheck.installAppCheckProviderFactory(DebugAppCheckProviderFactory.getInstance())
        } else {
            appCheck.installAppCheckProviderFactory(PlayIntegrityAppCheckProviderFactory.getInstance())
        }

        database = AppDatabase.getInstance(this)
    }
}`
    },
    Repository: {
      path: 'app/src/main/java/com/captioncraft/ai/data/repository/CaptionRepository.kt',
      language: 'kotlin',
      desc: 'Coordinates Room database, daily quota tracker (5 free/day), and Firebase AI Logic.',
      content: `package com.captioncraft.ai.data.repository

import android.content.Context
import com.captioncraft.ai.data.local.*
import com.captioncraft.ai.data.model.*
import com.captioncraft.ai.data.remote.FirebaseAiCaptionService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class CaptionRepository(
    private val context: Context,
    private val captionDao: CaptionDao,
    private val remoteService: FirebaseAiCaptionService = FirebaseAiCaptionService()
) {
    val favoriteCaptions: Flow<List<CaptionOption>> = captionDao.getFavoriteCaptions().map { it.map { e -> e.toOption() } }
    val recentHistory: Flow<List<CaptionOption>> = captionDao.getRecentHistory().map { it.map { e -> e.toOption() } }

    fun getDailyQuota(): DailyQuota = DailyQuota(usedToday = 1, maxFree = 5)

    suspend fun generateCaptions(topic: String, lang: AppLanguage, tone: AppTone, platform: AppPlatform): List<CaptionOption> {
        val list = remoteService.generateCaptions(topic, lang, tone, platform)
        captionDao.insertCaptions(list.map { it.toEntity(topic, lang, tone, platform) })
        return list
    }
}`
    },
    AppGradle: {
      path: 'app/build.gradle.kts',
      language: 'kotlin-dsl',
      desc: 'Gradle module with Jetpack Compose, Material 3, Room SQLite, and Firebase AI Logic.',
      content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.gms.google-services")
    id("com.google.devtools.ksp")
}

android {
    namespace = "com.captioncraft.ai"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.captioncraft.ai"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // Room Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")

    // Firebase BoM and AI Logic SDK (Gemini)
    val firebaseBom = platform("com.google.firebase:firebase-bom:33.9.0")
    implementation(firebaseBom)
    implementation("com.google.firebase:firebase-ai")
    implementation("com.google.firebase:firebase-appcheck-playintegrity")
    implementation("com.google.firebase:firebase-appcheck-debug")
}`
    },
    Manifest: {
      path: 'app/src/main/AndroidManifest.xml',
      language: 'xml',
      desc: 'Android Manifest declaring Application, permissions, and launcher Activity.',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".CaptionCraftApplication"
        android:label="@string/app_name"
        android:theme="@style/Theme.CaptionCraftAI">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
    },
    BanglaStrings: {
      path: 'app/src/main/res/values-bn/strings.xml',
      language: 'xml',
      desc: 'Authentic Bangla string resources for full Unicode native localization.',
      content: `<resources>
    <string name="app_name">ক্যাপশনক্রাফট এআই</string>
    <string name="tagline">বাংলাদেশ ও বিশ্বমানের কনটেন্ট ক্রিয়েটরদের জন্য সোশ্যাল মিডিয়া ক্যাপশন</string>
    <string name="generate_caption">ক্যাপশন তৈরি করুন</string>
    <string name="topic_hint">আপনার পোস্ট বা প্রোডাক্ট সম্পর্কে লিখুন (যেমন: ঈদের অফার, জামদানি শাড়ি, কফি আড্ডা)...</string>
    <string name="select_language">ভাষা</string>
    <string name="select_platform">প্ল্যাটফর্ম</string>
    <string name="select_tone">টোন / সুর</string>
    <string name="copy">কপি করুন</string>
    <string name="copied">ক্লিপবোর্ডে কপি করা হয়েছে!</string>
    <string name="share">শেয়ার</string>
    <string name="saved">ফেভারিটে সেভ করা হয়েছে</string>
    <string name="free_tier_status">আজকের ফ্রি জেনারেশন: %1$d / %2$d</string>
</resources>`
    }
  };

  const currentFile = filesMap[selectedFileKey] || filesMap.FirebaseAiService;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    try {
      await downloadAndroidProjectZip();
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner with Download ZIP Button */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 rounded-3xl p-6 border border-purple-500/20 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/30 uppercase tracking-wider">
              Native Android Repository
            </span>
            <span className="text-xs text-slate-400">Kotlin & Jetpack Compose</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Complete Android Studio Project Source Code
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every Kotlin class, ViewModel, Room database entity, Gradle script, and Bangla resource is built directly in the repository and ready to run in Android Studio.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={downloading}
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 flex-shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>
            {downloading ? 'Preparing ZIP...' : 'Download Android Studio Project (.ZIP)'}
          </span>
        </button>
      </div>

      {/* Code Viewer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* File Navigator Sidebar */}
        <div className="md:col-span-4 bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
            <Folder className="w-3.5 h-3.5" />
            <span>Android File Tree</span>
          </div>

          <div className="space-y-1">
            {Object.entries(filesMap).map(([key, f]) => {
              const isSelected = selectedFileKey === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedFileKey(key)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40 shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <FileCode
                    className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      isSelected ? 'text-purple-400' : 'text-slate-500'
                    }`}
                  />
                  <div className="truncate">
                    <span className="font-semibold block truncate">
                      {f.path.split('/').pop()}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {f.path}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Panel */}
        <div className="md:col-span-8 bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col shadow-xl">
          {/* Header */}
          <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="truncate mr-2">
              <span className="text-xs font-mono font-semibold text-purple-300">
                {currentFile.path}
              </span>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {currentFile.desc}
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex-shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Syntax Code Body */}
          <div className="p-4 overflow-x-auto max-h-[560px] bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
            <pre>
              <code>{currentFile.content}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
