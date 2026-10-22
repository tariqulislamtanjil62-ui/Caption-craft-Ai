package com.captioncraft.ai.ui.viewmodel

import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.widget.Toast
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.captioncraft.ai.data.model.AppLanguage
import com.captioncraft.ai.data.model.AppPlatform
import com.captioncraft.ai.data.model.AppTone
import com.captioncraft.ai.data.model.CaptionOption
import com.captioncraft.ai.data.model.CaptionUiState
import com.captioncraft.ai.data.model.DailyQuota
import com.captioncraft.ai.data.repository.CaptionRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

/**
 * ViewModel governing CaptionCraft AI generation lifecycle, input validation,
 * sharing intents, clipboard interaction, and local favorites/history.
 */
class CaptionViewModel(
    private val repository: CaptionRepository
) : ViewModel() {

    // Input States
    var topic by mutableStateOf("")
        private set

    var selectedLanguage by mutableStateOf(AppLanguage.ENGLISH)
        private set

    var selectedTone by mutableStateOf(AppTone.FRIENDLY)
        private set

    var selectedPlatform by mutableStateOf(AppPlatform.GENERAL)
        private set

    // Generation UI State
    private val _uiState = MutableStateFlow<CaptionUiState>(CaptionUiState.Idle)
    val uiState: StateFlow<CaptionUiState> = _uiState.asStateFlow()

    // Quota tracking
    private val _dailyQuota = MutableStateFlow(repository.getDailyQuota())
    val dailyQuota: StateFlow<DailyQuota> = _dailyQuota.asStateFlow()

    // Local Persistence Streams (Favorites & History)
    val favorites: StateFlow<List<CaptionOption>> = repository.favoriteCaptions
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val history: StateFlow<List<CaptionOption>> = repository.recentHistory
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun updateTopic(newTopic: String) {
        if (newTopic.length <= 350) {
            topic = newTopic
        }
    }

    fun selectLanguage(lang: AppLanguage) {
        selectedLanguage = lang
    }

    fun selectTone(tone: AppTone) {
        selectedTone = tone
    }

    fun selectPlatform(platform: AppPlatform) {
        selectedPlatform = platform
    }

    /**
     * Executes AI generation using Firebase AI Logic.
     */
    fun generateCaptions() {
        val cleanTopic = topic.trim()
        if (cleanTopic.isEmpty()) {
            _uiState.value = CaptionUiState.Error("Please enter what your post is about.")
            return
        }

        if (cleanTopic.length < 3) {
            _uiState.value = CaptionUiState.Error("Topic is too short. Add a few more details.")
            return
        }

        val quota = repository.getDailyQuota()
        if (quota.isExhausted) {
            _uiState.value = CaptionUiState.Error(
                "Daily free limit (${quota.maxFree} generations) reached. Check Pro for unlimited access.",
                canRetry = false
            )
            return
        }

        viewModelScope.launch {
            _uiState.value = CaptionUiState.Loading
            try {
                val results = repository.generateCaptions(
                    topic = cleanTopic,
                    language = selectedLanguage,
                    tone = selectedTone,
                    platform = selectedPlatform
                )
                _uiState.value = CaptionUiState.Success(results)
                _dailyQuota.value = repository.getDailyQuota()
            } catch (e: Exception) {
                val msg = when {
                    e.message?.contains("Unable to resolve host", ignoreCase = true) == true ||
                    e.message?.contains("network", ignoreCase = true) == true ->
                        "No internet connection. Please verify your Wi-Fi or mobile data."
                    e.message?.contains("quota", ignoreCase = true) == true ->
                        "AI request limit reached. Please wait a moment before trying again."
                    else -> e.message ?: "Failed to generate captions. Please try again."
                }
                _uiState.value = CaptionUiState.Error(msg, canRetry = true)
            }
        }
    }

    fun retry() {
        generateCaptions()
    }

    fun toggleFavorite(caption: CaptionOption) {
        viewModelScope.launch {
            repository.toggleFavorite(caption)
            // If currently showing success state, update the option in-place
            val current = _uiState.value
            if (current is CaptionUiState.Success) {
                val updated = current.captions.map {
                    if (it.id == caption.id) it.copy(isFavorite = !it.isFavorite) else it
                }
                _uiState.value = CaptionUiState.Success(updated)
            }
        }
    }

    fun deleteFavorite(id: String) {
        viewModelScope.launch {
            repository.deleteCaption(id)
        }
    }

    fun clearHistory() {
        viewModelScope.launch {
            repository.clearHistory()
        }
    }

    /**
     * Copies caption text and hashtags to Android Clipboard.
     */
    fun copyCaptionToClipboard(context: Context, caption: CaptionOption) {
        val fullContent = buildString {
            append(caption.text)
            if (caption.hashtags.isNotEmpty()) {
                append("\n\n")
                append(caption.hashtags.joinToString(" "))
            }
        }
        val clipboard = context.getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("CaptionCraft AI", fullContent)
        clipboard.setPrimaryClip(clip)
        Toast.makeText(context, "Caption copied to clipboard!", Toast.LENGTH_SHORT).show()
    }

    /**
     * Dispatches native Android Share Intent to Facebook, Instagram, WhatsApp, etc.
     */
    fun shareCaptionViaIntent(context: Context, caption: CaptionOption) {
        val fullContent = buildString {
            append(caption.text)
            if (caption.hashtags.isNotEmpty()) {
                append("\n\n")
                append(caption.hashtags.joinToString(" "))
            }
        }
        val sendIntent = Intent().apply {
            action = Intent.ACTION_SEND
            putExtra(Intent.EXTRA_TEXT, fullContent)
            type = "text/plain"
        }
        val shareIntent = Intent.createChooser(sendIntent, "Share caption via")
        context.startActivity(shareIntent)
    }
}
