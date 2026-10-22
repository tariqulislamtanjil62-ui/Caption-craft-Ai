# CaptionCraft AI Proguard Rules
-keep class com.captioncraft.ai.data.model.** { *; }
-keep class com.captioncraft.ai.data.local.** { *; }
-keepclassmembers class * extends androidx.room.RoomDatabase { *; }
