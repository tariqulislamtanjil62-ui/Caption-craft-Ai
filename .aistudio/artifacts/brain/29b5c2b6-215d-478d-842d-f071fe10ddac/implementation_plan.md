# Implementation Plan: Premium Jetpack Compose & Web Redesign for CaptionCraft AI

## 🎨 Design System Specifications

### 1. Color Palette & Theming
- **Primary**: Royal Purple `#6D4AFF` (Subtle gradients into `#5835E5` and `#8B5CF6`)
- **Dark Mode Background**: Midnight `#17152B` (Surface cards `#211E3B`, Elevated `#2C284E`)
- **Light Mode Background**: `#F8F7FF` (Surface cards `#FFFFFF`, Elevated `#F1EFFF`)
- **Accent**: Lavender `#A78BFA`
- **Success / Badge**: Mint `#20C997`
- **Theme Toggle**: Accessible in the top bar and in Profile/Settings (persisted on-device).

### 2. Typography & Layout Structure
- **Headline**: "Your words, your vibe." in bold, contemporary typography.
- **Card Geometry**: 18–24dp rounded corners, 1px subtle borders (`#343058` in dark, `#E9E5FF` in light).
- **Unicode Support**: Native support for Bangla (বাংলা লিপি) and English with balanced line-heights.

---

## 📱 Core Screen Architecture & Features

### 1. Home Screen (Generator)
- **Top Brand Header**:
  - Sparkle icon in a Royal Purple rounded square.
  - CaptionCraft AI branding.
  - One-tap Dark/Light theme toggle switch.
- **Headline**:
  - "Your words, your vibe." with subtitle "Craft viral captions tailored for your audience."
- **Multiline Topic Input**:
  - Clean rounded input field with character counter.
  - Minimal inspiration prompts (e.g. Handcrafted Jamdani, Artisanal coffee, Travel aesthetic).
- **File Attachment Dock**:
  - Attach images (product shots, photos) or documents (PDFs, notes) for multimodal visual analysis.
  - Minimal preview card with file type badge and remove action.
- **Target Platform Selector**:
  - Instagram, Facebook, TikTok, YouTube (with additional quick access to Pinterest, LinkedIn, X).
  - Clean brand glyphs with royal purple highlights.
- **Caption Tone Selector (Zero-Emoji, Minimalist)**:
  - `Aesthetic`, `Funny`, `Romantic`, `Professional`, `Motivational`.
  - Refined typographic micro-pills with 1px border.
- **Language Selector**:
  - বাংলা / English / Bilingual mix.
- **Live Search Grounding Toggle**:
  - Connects to Google Search for 2026 SEO signals and viral keywords.
- **Action Button**:
  - Prominent Royal Purple gradient button: **"Generate Caption"** with smooth loading animation.
- **Generated Caption Cards**:
  - Display 3 distinct creative options.
  - Actions: **Copy**, **Regenerate**, **Favorite** (heart toggle), and **Share Intent**.
  - Displays relevant hashtags, suggested call-to-action, and SEO keywords.

### 2. Bottom Navigation
- **Home** (Wand / Sparkle)
- **History** (Clock / History)
- **Favorites** (Heart / Bookmark with count badge)
- **Profile / Settings** (User / Sliders: Theme toggle, OpenAI key, Firebase architecture)

### 3. Backend & AI Integration (`/server.ts`)
- Maintain real-time Gemini generation via `@google/genai` (`gemini-3.8-flash`).
- Google Search Grounding tool support for live search trends.
- Multimodal file support (analyzing attached image/document content).
- Tones mapped to `Aesthetic`, `Funny`, `Romantic`, `Professional`, `Motivational`.

### 4. Native Kotlin & Jetpack Compose Codebase (`/android/...`)
- Update `Color.kt`, `Theme.kt`, `HomeScreen.kt`, `CaptionModels.kt`, and `strings.xml` to match the exact Royal Purple `#6D4AFF`, Midnight `#17152B`, and Lavender `#A78BFA` tokens.
- Keep the downloadable Android Studio ZIP in sync.

---

## 🔍 Verification Plan
1. Test switching between Midnight (`#17152B`) and Light (`#F8F7FF`) themes.
2. Test generating captions across all platforms with the new tones: Aesthetic, Funny, Romantic, Professional, Motivational.
3. Test file attachment (images and documents) generating contextual captions.
4. Verify Copy, Regenerate, Favorite, and Share on caption cards.
5. Compile and lint to ensure clean build with zero errors.
