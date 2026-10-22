package com.captioncraft.ai.data.repository

import android.content.Context
import android.content.SharedPreferences
import com.captioncraft.ai.data.local.CaptionDao
import com.captioncraft.ai.data.local.CaptionEntity
import com.captioncraft.ai.data.model.AppLanguage
import com.captioncraft.ai.data.model.AppPlatform
import com.captioncraft.ai.data.model.AppTone
import com.captioncraft.ai.data.model.CaptionOption
import com.captioncraft.ai.data.model.DailyQuota
import com.captioncraft.ai.data.remote.FirebaseAiCaptionService
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/**
 * Single source of truth repository for captions, persistence, and free-tier daily usage tracking.
 */
class CaptionRepository(
    private val context: Context,
    private val captionDao: CaptionDao,
    private val remoteService: FirebaseAiCaptionService = FirebaseAiCaptionService()
) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("captioncraft_prefs", Context.MODE_PRIVATE)

    /**
     * Flow of saved favorite captions, sorted newest first.
     */
    val favoriteCaptions: Flow<List<CaptionOption>> =
        captionDao.getFavoriteCaptions().map { entities ->
            entities.map { it.toCaptionOption() }
        }

    /**
     * Flow of recent generation history on-device.
     */
    val recentHistory: Flow<List<CaptionOption>> =
        captionDao.getRecentHistory().map { entities ->
            entities.map { it.toCaptionOption() }
        }

    /**
     * Retrieves the current daily quota usage.
     */
    fun getDailyQuota(): DailyQuota {
        val todayKey = getTodayKey()
        val lastSavedDay = prefs.getString("quota_day_key", "") ?: ""
        val used = if (lastSavedDay == todayKey) {
            prefs.getInt("quota_used_count", 0)
        } else {
            0
        }
        return DailyQuota(usedToday = used, maxFree = 5)
    }

    /**
     * Increments the daily usage counter upon successful AI generation.
     */
    private fun incrementDailyUsage() {
        val todayKey = getTodayKey()
        val lastSavedDay = prefs.getString("quota_day_key", "") ?: ""
        var used = if (lastSavedDay == todayKey) {
            prefs.getInt("quota_used_count", 0)
        } else {
            0
        }
        used += 1
        prefs.edit()
            .putString("quota_day_key", todayKey)
            .putInt("quota_used_count", used)
            .apply()
    }

    private fun getTodayKey(): String {
        val sdf = SimpleDateFormat("yyyyMMdd", Locale.US)
        return sdf.format(Date())
    }

    /**
     * Generates 3 captions via Firebase AI Logic and logs them to local history.
     */
    suspend fun generateCaptions(
        topic: String,
        language: AppLanguage,
        tone: AppTone,
        platform: AppPlatform
    ): List<CaptionOption> {
        val quota = getDailyQuota()
        if (quota.isExhausted) {
            throw IllegalStateException("Daily free limit of ${quota.maxFree} generations reached. Upgrade to Pro for unlimited generation.")
        }

        // Call Firebase AI Logic
        val options = remoteService.generateCaptions(topic, language, tone, platform)

        // Save generated options to local history
        val entities = options.map { opt ->
            CaptionEntity(
                id = opt.id,
                topic = topic,
                style = opt.style,
                text = opt.text,
                hashtagsJoined = opt.hashtags.joinToString(","),
                callToAction = opt.callToAction,
                language = language.code,
                tone = tone.id,
                platform = platform.id,
                isFavorite = false,
                createdAt = opt.timestamp
            )
        }
        captionDao.insertCaptions(entities)

        // Update quota usage
        incrementDailyUsage()

        return options
    }

    suspend fun toggleFavorite(caption: CaptionOption) {
        val newFav = !caption.isFavorite
        captionDao.updateFavoriteStatus(caption.id, newFav)
    }

    suspend fun deleteCaption(id: String) {
        captionDao.deleteById(id)
    }

    suspend fun clearHistory() {
        captionDao.clearHistoryOnly()
    }

    private fun CaptionEntity.toCaptionOption(): CaptionOption {
        val tags = if (hashtagsJoined.isBlank()) {
            emptyList()
        } else {
            hashtagsJoined.split(",").map { it.trim() }
        }
        return CaptionOption(
            id = id,
            style = style,
            text = text,
            hashtags = tags,
            callToAction = callToAction,
            isFavorite = isFavorite,
            timestamp = createdAt
        )
    }
}
