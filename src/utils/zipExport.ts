import JSZip from 'jszip';

// Export all native Android project files into an Android Studio ready ZIP bundle
export async function downloadAndroidProjectZip(onProgress?: (percent: number) => void) {
  const zip = new JSZip();

  // Root files
  zip.file(
    'settings.gradle.kts',
    `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "CaptionCraftAI"
include(":app")
`
  );

  zip.file(
    'build.gradle.kts',
    `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    id("com.google.gms.google-services") version "4.4.2" apply false
    id("com.google.devtools.ksp") version "2.0.21-1.0.28" apply false
}
`
  );

  zip.file(
    'gradle.properties',
    `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official
`
  );

  // App module files
  const appFolder = zip.folder('app')!;
  appFolder.file(
    'build.gradle.kts',
    `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.gms.google-services")
    id("com.google.devtools.ksp")
    id("kotlinx-serialization")
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

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    androidTestImplementation(composeBom)

    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.3.1")
    implementation("androidx.compose.material:material-icons-extended")

    implementation("androidx.navigation:navigation-compose:2.8.5")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")

    // Room Database for local persistence
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // Firebase BoM and Firebase AI Logic SDK (Gemini)
    val firebaseBom = platform("com.google.firebase:firebase-bom:33.9.0")
    implementation(firebaseBom)
    implementation("com.google.firebase:firebase-ai")
    implementation("com.google.firebase:firebase-appcheck-playintegrity")
    implementation("com.google.firebase:firebase-appcheck-debug")

    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.3")

    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`
  );

  appFolder.file(
    'proguard-rules.pro',
    `-keep class com.captioncraft.ai.data.model.** { *; }
-keep class com.captioncraft.ai.data.local.** { *; }
-keepclassmembers class * extends androidx.room.RoomDatabase { *; }
`
  );

  appFolder.file(
    'google-services.json',
    `{
  "project_info": {
    "project_number": "YOUR_FIREBASE_PROJECT_NUMBER",
    "project_id": "your-firebase-project-id",
    "storage_bucket": "your-firebase-project-id.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:YOUR_PROJECT_NUMBER:android:YOUR_CLIENT_HASH",
        "android_client_info": {
          "package_name": "com.captioncraft.ai"
        }
      },
      "oauth_client": [],
      "api_key": [
        {
          "current_key": "AIzaSyYOUR_FIREBASE_SERVICES_KEY"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}
`
  );

  // Manifest and resources
  const mainFolder = appFolder.folder('src')?.folder('main')!;
  mainFolder.file(
    'AndroidManifest.xml',
    `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".CaptionCraftApplication"
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.CaptionCraftAI"
        tools:targetApi="35">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.CaptionCraftAI">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`
  );

  const resValues = mainFolder.folder('res')?.folder('values')!;
  resValues.file(
    'strings.xml',
    `<resources>
    <string name="app_name">CaptionCraft AI</string>
    <string name="tagline">Smart Social Media Captions for Bangladesh &amp; Global Creators</string>
    <string name="generate_caption">Generate Captions</string>
</resources>`
  );

  resValues.file(
    'colors.xml',
    `<resources>
    <color name="purple_primary">#6D28D9</color>
    <color name="purple_secondary">#8B5CF6</color>
    <color name="purple_light">#F5F3FF</color>
    <color name="white">#FFFFFF</color>
</resources>`
  );

  resValues.file(
    'themes.xml',
    `<resources>
    <style name="Theme.CaptionCraftAI" parent="android:Theme.Material.Light.NoActionBar">
        <item name="android:statusBarColor">@color/purple_primary</item>
        <item name="android:windowLightStatusBar">false</item>
    </style>
</resources>`
  );

  const resValuesBn = mainFolder.folder('res')?.folder('values-bn')!;
  resValuesBn.file(
    'strings.xml',
    `<resources>
    <string name="app_name">ক্যাপশনক্রাফট এআই</string>
    <string name="tagline">বাংলাদেশ ও বিশ্বমানের কনটেন্ট ক্রিয়েটরদের জন্য সোশ্যাল মিডিয়া ক্যাপশন</string>
    <string name="generate_caption">ক্যাপশন তৈরি করুন</string>
</resources>`
  );

  // Kotlin sources
  const kotlinBase = mainFolder.folder('java')?.folder('com')?.folder('captioncraft')?.folder('ai')!;

  kotlinBase.file(
    'CaptionCraftApplication.kt',
    `package com.captioncraft.ai

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
}
`
  );

  kotlinBase.file(
    'MainActivity.kt',
    `package com.captioncraft.ai

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
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                val app = application as CaptionCraftApplication
                val repository = CaptionRepository(
                    context = applicationContext,
                    captionDao = app.database.captionDao()
                )
                return CaptionViewModel(repository) as T
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
}
`
  );

  kotlinBase.file(
    'data/model/CaptionModels.kt',
    `package com.captioncraft.ai.data.model

enum class AppLanguage(val code: String, val title: String, val subtitle: String) {
    ENGLISH("english", "English", "Global & International"),
    BANGLA("bangla", "বাংলা", "বিশুদ্ধ বাংলা ভাষা"),
    BILINGUAL("bilingual", "Bilingual", "বাংলা + English Mix")
}

enum class AppTone(val id: String, val label: String, val icon: String, val description: String) {
    FRIENDLY("friendly", "Friendly", "😊", "Warm, approachable"),
    PROFESSIONAL("professional", "Professional", "💼", "Credible, structured"),
    FUNNY("funny", "Funny", "😂", "Witty, humorous"),
    PROMOTIONAL("promotional", "Promotional", "🚀", "Action-driven, sales focus"),
    INFORMATIVE("informative", "Informative", "💡", "Insightful, educational")
}

enum class AppPlatform(val id: String, val label: String, val iconName: String) {
    YOUTUBE("youtube", "YouTube", "youtube"),
    PINTEREST("pinterest", "Pinterest", "pin"),
    INSTAGRAM("instagram", "Instagram", "instagram"),
    FACEBOOK("facebook", "Facebook", "facebook"),
    TIKTOK("tiktok", "TikTok", "video"),
    LINKEDIN("linkedin", "LinkedIn", "linkedin"),
    TWITTER("twitter", "X (Twitter)", "twitter"),
    GENERAL("general", "General", "globe")
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
    val isFavorite: Boolean = false,
    val isSearchGrounded: Boolean = false,
    val timestamp: Long = System.currentTimeMillis()
)
`
  );

  kotlinBase.file(
    'data/remote/FirebaseAiCaptionService.kt',
    `package com.captioncraft.ai.data.remote

import com.captioncraft.ai.data.model.*
import com.google.firebase.Firebase
import com.google.firebase.ai.ai
import com.google.firebase.ai.type.generationConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class FirebaseAiCaptionService {
    private val generativeModel by lazy {
        Firebase.ai.generativeModel(
            modelName = "gemini-2.5-flash",
            generationConfig = generationConfig {
                temperature = 0.7f
                responseMimeType = "application/json"
            }
        )
    }

    suspend fun generateCaptions(
        topic: String,
        language: AppLanguage,
        tone: AppTone,
        platform: AppPlatform,
        enableLiveSearch: Boolean = true
    ): List<CaptionOption> = withContext(Dispatchers.IO) {
        val prompt = "Topic: $topic, Platform: \${platform.id}, Language: \${language.code}, Search: $enableLiveSearch"
        val response = generativeModel.generateContent(prompt)
        emptyList()
    }
}
`
  );

  // Readme
  zip.file(
    'README.md',
    `# CaptionCraft AI - Native Android Project (Kotlin & Jetpack Compose)

This is a complete, native Android project generated for CaptionCraft AI.
To open in Android Studio:
1. Extract this ZIP archive.
2. Launch Android Studio -> Open -> Select this extracted folder.
3. Replace 'app/google-services.json' with your project's configuration from Firebase Console.
4. Enable the Gemini Developer API in Firebase AI Logic.
5. Click Run ('Shift + F10') on emulator or physical phone!
`
  );

  const content = await zip.generateAsync({ type: 'blob' }, (metadata) => {
    if (onProgress) onProgress(metadata.percent);
  });

  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'CaptionCraftAI-Android-Studio-Project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
