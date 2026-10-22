package com.captioncraft.ai

import android.app.Application
import com.captioncraft.ai.data.local.AppDatabase
import com.google.firebase.FirebaseApp
import com.google.firebase.appcheck.FirebaseAppCheck
import com.google.firebase.appcheck.debug.DebugAppCheckProviderFactory
import com.google.firebase.appcheck.playintegrity.PlayIntegrityAppCheckProviderFactory

/**
 * Main Application class for CaptionCraft AI.
 * Handles Firebase initialization and Firebase App Check for secure API access.
 * Secures requests to Firebase AI Logic without exposing sensitive credentials.
 */
class CaptionCraftApplication : Application() {

    lateinit var database: AppDatabase
        private set

    override fun onCreate() {
        super.onCreate()
        
        // 1. Initialize Firebase
        FirebaseApp.initializeApp(this)

        // 2. Configure Firebase App Check
        // In Debug mode, uses Debug provider for Android Studio emulator testing
        // In Release mode, uses Google Play Integrity to verify app authenticity
        val appCheck = FirebaseAppCheck.getInstance()
        if (BuildConfig.DEBUG) {
            appCheck.installAppCheckProviderFactory(DebugAppCheckProviderFactory.getInstance())
        } else {
            appCheck.installAppCheckProviderFactory(PlayIntegrityAppCheckProviderFactory.getInstance())
        }

        // 3. Initialize Room local SQLite database on-device
        database = AppDatabase.getInstance(this)
    }
}
