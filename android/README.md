# CaptionCraft AI - Native Android (Kotlin & Jetpack Compose)

**CaptionCraft AI** is a production-grade native Android social media caption generator built with **Kotlin**, **Jetpack Compose (Material 3)**, and powered by the officially recommended **Firebase AI Logic SDK** (`com.google.firebase:firebase-ai` / Gemini 2.5 Flash). Specially crafted for Bangladesh and international digital creators, marketers, and businesses.

---

## 🚀 Key Highlights & Architecture

- **100% Native Android**: Clean MVVM architecture, Kotlin Coroutines, StateFlow, Room Database, and Navigation Compose.
- **Modern Purple & White Design**: Strict Material 3 guidelines, rounded cards (16-24dp), accessible contrast, subtle elevation, and responsive layouts.
- **Bangla & International Support**:
  - English (Global creators)
  - বাংলা (Authentic Bengali with full Unicode typography)
  - Bilingual (Popular Bangladeshi mix: conversational Bengali + trendy English phrases)
- **Zero API Key Exposure in APK**: Uses Firebase AI Logic to connect directly through Google Cloud's secure backend gateway. No Gemini API key is ever compiled into the APK.
- **Firebase App Check Enabled**: Configured for Google Play Integrity (production) and Debug App Check Provider (local emulator testing).
- **Strict Guardrails**: Model system instructions strictly forbid hallucinating prices (e.g. ৳500), arbitrary discounts ("50% off"), or unverified warranties.
- **On-Device Privacy**: No mandatory sign-in. Favorites and history are saved strictly on-device in local SQLite via Room.
- **Play Store Monetization Ready**: Features an honest 5/day daily free quota tracker and a Pro screen clearly marked with a Google Play Billing compliance notice.

---

## 🛠️ Step-by-Step Setup Guide

### 1. Firebase Project Setup
1. Go to [Firebase Console](https://console.firebase.google.com).
2. Create a new Firebase project (or select an existing one).
3. Click **Add App** -> **Android**.
   - Package name: `com.captioncraft.ai`
   - App nickname: `CaptionCraft AI`
4. Download `google-services.json` and place it at:
   ```
   android/app/google-services.json
   ```

### 2. Enable Firebase AI Logic (Gemini API)
1. In Firebase Console, go to **Build** -> **AI Logic** (or **Vertex AI in Firebase**).
2. Click **Get Started** and select **Gemini Developer API** (or Vertex AI).
3. The SDK will automatically authenticate calls from your registered Android app using Firebase App Check.

### 3. Firebase App Check (Optional for Emulator, Recommended for Production)
- **For Emulator / Development**:
  In `CaptionCraftApplication.kt`, the `DebugAppCheckProviderFactory` is activated automatically in `DEBUG` mode.
  When you run the app on an emulator, look at Logcat for `DebugAppCheckProvider`:
  ```
  Enter this debug token into the Firebase Console: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  ```
  Paste that token in **Firebase Console -> App Check -> Apps -> Manage debug tokens**.
- **For Production**:
  Register your release SHA-256 fingerprint in Firebase Console and activate **Play Integrity**.

### 4. Open in Android Studio
1. Open Android Studio (Ladybug, Koala, or Hedgehog).
2. Select **Open an Existing Project** and choose the `android/` folder.
3. Allow Gradle to sync dependencies.
4. Run on your physical device or an Android 15 / 14 emulator (`Ctrl + R` or `Shift + F10`).

---

## 📱 Project Directory Tree

```
android/
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
└── app/
    ├── build.gradle.kts
    ├── proguard-rules.pro
    └── src/
        └── main/
            ├── AndroidManifest.xml
            ├── res/
            │   ├── values/
            │   │   ├── strings.xml (English)
            │   │   ├── colors.xml (Purple & White)
            │   │   └── themes.xml
            │   └── values-bn/
            │       └── strings.xml (বাংলা লোকালাইজেশন)
            └── java/com/captioncraft/ai/
                ├── CaptionCraftApplication.kt  # Firebase & App Check init
                ├── MainActivity.kt             # Edge-to-edge Compose entry
                ├── data/
                │   ├── model/CaptionModels.kt  # Enums, CaptionOption, Quota
                │   ├── local/                  # Room SQLite persistence
                │   │   ├── AppDatabase.kt
                │   │   ├── CaptionDao.kt
                │   │   └── CaptionEntity.kt
                │   ├── remote/
                │   │   └── FirebaseAiCaptionService.kt  # Firebase AI Logic (Gemini)
                │   └── repository/
                │       └── CaptionRepository.kt         # Single source of truth
                └── ui/
                    ├── theme/
                    │   ├── Color.kt
                    │   ├── Type.kt
                    │   └── Theme.kt
                    ├── components/
                    │   ├── CaptionCard.kt
                    │   ├── Selectors.kt
                    │   └── LoadingSkeleton.kt
                    ├── screens/
                    │   ├── HomeScreen.kt
                    │   ├── FavoritesScreen.kt
                    │   ├── HistoryScreen.kt
                    │   ├── SettingsScreen.kt
                    │   └── PremiumScreen.kt
                    ├── navigation/
                    │   └── AppNavigation.kt
                    └── viewmodel/
                        └── CaptionViewModel.kt
```
