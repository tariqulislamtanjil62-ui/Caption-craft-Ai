package com.captioncraft.ai.data.model

/**
 * Supported caption languages.
 */
enum class AppLanguage(val code: String, val title: String, val subtitle: String) {
    ENGLISH("english", "English", "Global & International"),
    BANGLA("bangla", "বাংলা", "বিশুদ্ধ বাংলা ভাষা"),
    BILINGUAL("bilingual", "Bilingual", "বাংলা + English Mix")
}

/**
 * Minimalist, luxury caption tones without emojis.
 */
enum class AppTone(val id: String, val labelEn: String, val labelBn: String, val description: String) {
    AESTHETIC("aesthetic", "Aesthetic", "নান্দনিক", "Poetic visual harmony"),
    FUNNY("funny", "Funny", "মজার", "Witty, relatable humor"),
    ROMANTIC("romantic", "Romantic", "রোমান্টিক", "Heartfelt sentiment"),
    PROFESSIONAL("professional", "Professional", "পেশাদার", "Authoritative, structured"),
    MOTIVATIONAL("motivational", "Motivational", "প্রেরণাদায়ক", "Uplifting, goal-driven")
}

/**
 * Target social media platforms.
 */
enum class AppPlatform(val id: String, val label: String, val iconName: String) {
    INSTAGRAM("instagram", "Instagram", "instagram"),
    FACEBOOK("facebook", "Facebook", "facebook"),
    TIKTOK("tiktok", "TikTok", "tiktok"),
    YOUTUBE("youtube", "YouTube", "youtube"),
    PINTEREST("pinterest", "Pinterest", "pinterest"),
    LINKEDIN("linkedin", "LinkedIn", "linkedin"),
    TWITTER("twitter", "X", "twitter"),
    GENERAL("general", "General", "globe")
}

/**
 * Single generated caption option with relevant hashtags, SEO tags, and CTA.
 */
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

/**
 * Generation UI State.
 */
sealed interface CaptionUiState {
    object Idle : CaptionUiState
    object Loading : CaptionUiState
    data class Success(val captions: List<CaptionOption>) : CaptionUiState
    data class Error(val message: String, val canRetry: Boolean = true) : CaptionUiState
}
