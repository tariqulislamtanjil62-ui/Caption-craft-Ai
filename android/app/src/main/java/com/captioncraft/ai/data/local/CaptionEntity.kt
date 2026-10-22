package com.captioncraft.ai.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * Room SQLite Entity for storing saved captions and generation history locally.
 * Adheres to privacy guidelines: zero personal telemetry, all history remains on device.
 */
@Entity(tableName = "captions")
data class CaptionEntity(
    @PrimaryKey
    val id: String,
    val topic: String,
    val style: String,
    val text: String,
    val hashtagsJoined: String, // Comma separated hashtags
    val callToAction: String,
    val language: String,
    val tone: String,
    val platform: String,
    val isFavorite: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)
