package com.captioncraft.ai.data.local

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

/**
 * Data Access Object for local caption persistence.
 */
@Dao
interface CaptionDao {

    @Query("SELECT * FROM captions WHERE isFavorite = 1 ORDER BY createdAt DESC")
    fun getFavoriteCaptions(): Flow<List<CaptionEntity>>

    @Query("SELECT * FROM captions ORDER BY createdAt DESC LIMIT 50")
    fun getRecentHistory(): Flow<List<CaptionEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCaptions(captions: List<CaptionEntity>)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCaption(caption: CaptionEntity)

    @Update
    suspend fun updateCaption(caption: CaptionEntity)

    @Query("UPDATE captions SET isFavorite = :isFavorite WHERE id = :id")
    suspend fun updateFavoriteStatus(id: String, isFavorite: Boolean)

    @Query("DELETE FROM captions WHERE id = :id")
    suspend fun deleteById(id: String)

    @Query("DELETE FROM captions WHERE isFavorite = 0")
    suspend fun clearHistoryOnly()

    @Query("DELETE FROM captions")
    suspend fun clearAll()
}
