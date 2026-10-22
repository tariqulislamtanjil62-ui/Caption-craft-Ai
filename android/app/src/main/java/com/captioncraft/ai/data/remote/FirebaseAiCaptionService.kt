package com.captioncraft.ai.data.remote

import com.captioncraft.ai.data.model.AppLanguage
import com.captioncraft.ai.data.model.AppPlatform
import com.captioncraft.ai.data.model.AppTone
import com.captioncraft.ai.data.model.CaptionOption
import com.google.firebase.Firebase
import com.google.firebase.ai.ai
import com.google.firebase.ai.type.generationConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.util.UUID

/**
 * Remote Service communicating with Gemini via the officially recommended
 * Firebase AI Logic SDK for Android (com.google.firebase:firebase-ai).
 *
 * Supports YouTube SEO & Shorts, Pinterest Pin SEO, LinkedIn, X, FB, IG, TikTok,
 * and live Google Search grounding.
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
                    You are CaptionCraft AI, a professional social media caption and video SEO architect.
                    
                    RULES:
                    1. Return EXACTLY THREE distinct caption options (Hook/Storytelling, Direct Value, and Interactive/Question).
                    2. Tone must strictly reflect the requested tone.
                    3. Platform Guidelines:
                       - 'youtube': Rich video description with timestamps, 5-8 SEO tags, and a catchy Title Hook.
                       - 'pinterest': High-CTR Pin Title (under 60 chars), 2-3 sentence search-optimized description, and board keywords.
                       - 'linkedin': Thought leadership hook, single-line breaks, business insights, professional CTA.
                       - 'twitter': Punchy viral tweet or thread opener under 280 chars.
                       - 'facebook': Warm, community-centered storytelling.
                       - 'instagram': Visual hook, line breaks, emojis, top hashtags.
                       - 'tiktok': 3-second hook concept with viral tags.
                    4. Language Guidelines:
                       - 'bangla': Natural, idiomatic modern Bengali script (বাংলা), avoiding robotic translations.
                       - 'english': Catchy international social media English.
                       - 'bilingual': Popular Bangladeshi mix (Bangla conversational flow with English power words).
                    5. STRICT COMMERCIAL & FACTUAL SAFETY:
                       - NEVER invent specific prices (e.g. ৳500 or $20), discount percentages (50% OFF), warranties, or guarantees unless stated in user topic.
                    6. Return valid JSON matching schema:
                       {
                         "captions": [
                           {
                             "style": "Hook & Story",
                             "text": "...",
                             "hashtags": ["#tag1", "#tag2"],
                             "callToAction": "...",
                             "seoTags": ["keyword1", "keyword2"],
                             "pinTitle": "optional for pinterest",
                             "videoHook": "optional for youtube/tiktok"
                           }
                         ]
                       }
                    """.trimIndent()
                )
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
        val prompt = """
            Topic / Product: $topic
            Language: ${language.code}
            Tone: ${tone.id}
            Platform: ${platform.id}
            Live Web Search Grounding: ${if (enableLiveSearch) "ENABLED" else "OFF"}
            
            Generate exactly 3 tailored SEO options with hashtags and keywords.
        """.trimIndent()

        val response = generativeModel.generateContent(prompt)
        val responseText = response.text ?: throw IllegalStateException("Empty response from AI logic service")

        parseJsonResponse(responseText, enableLiveSearch)
    }

    private fun parseJsonResponse(jsonString: String, isSearchGrounded: Boolean): List<CaptionOption> {
        val cleanedJson = jsonString
            .replace("```json", "")
            .replace("```", "")
            .trim()

        val root = JSONObject(cleanedJson)
        val array = root.getJSONArray("captions")
        val result = mutableListOf<CaptionOption>()

        for (i in 0 until minOf(3, array.length())) {
            val item = array.getJSONObject(i)
            val style = item.optString("style", "Option ${i + 1}")
            val text = item.getString("text")
            val cta = item.optString("callToAction", "")
            val pinTitle = item.optString("pinTitle").takeIf { it.isNotBlank() }
            val videoHook = item.optString("videoHook").takeIf { it.isNotBlank() }

            val tagList = mutableListOf<String>()
            val tagsArray = item.optJSONArray("hashtags")
            if (tagsArray != null) {
                for (j in 0 until tagsArray.length()) {
                    var tag = tagsArray.getString(j).trim()
                    if (!tag.startsWith("#")) tag = "#$tag"
                    tagList.add(tag)
                }
            } else {
                tagList.addAll(listOf("#CaptionCraft", "#Trending", "#SocialMedia"))
            }

            val seoList = mutableListOf<String>()
            val seoArray = item.optJSONArray("seoTags")
            if (seoArray != null) {
                for (k in 0 until seoArray.length()) {
                    seoList.add(seoArray.getString(k).trim())
                }
            }

            result.add(
                CaptionOption(
                    id = UUID.randomUUID().toString(),
                    style = style,
                    text = text,
                    hashtags = tagList,
                    callToAction = cta,
                    seoTags = seoList,
                    pinTitle = pinTitle,
                    videoHook = videoHook,
                    isFavorite = false,
                    isSearchGrounded = isSearchGrounded,
                    timestamp = System.currentTimeMillis()
                )
            )
        }

        if (result.isEmpty()) {
            throw IllegalStateException("Failed to parse 3 distinct captions from model output.")
        }

        return result
    }
}
