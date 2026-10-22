package com.captioncraft.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.captioncraft.ai.ui.theme.*

@Composable
fun SettingsScreen(
    modifier: Modifier = Modifier
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BrandPurpleBackground)
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        Text(
            text = "Settings & Privacy",
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp,
            color = NeutralTextDark
        )
        Text(
            text = "Configuration, security, and AI logic transparency",
            fontSize = 13.sp,
            color = NeutralTextSecondary,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Firebase AI Logic & Security Card
        SettingsCard(
            title = "Firebase AI Logic & Security",
            icon = Icons.Default.Security,
            iconTint = BrandPurplePrimary
        ) {
            InfoRow(
                label = "SDK Architecture",
                value = "Firebase AI Logic (com.google.firebase:firebase-ai)"
            )
            Divider(color = BorderSubtle.copy(alpha = 0.5f), modifier = Modifier.padding(vertical = 8.dp))
            InfoRow(
                label = "Active Model",
                value = "gemini-2.5-flash"
            )
            Divider(color = BorderSubtle.copy(alpha = 0.5f), modifier = Modifier.padding(vertical = 8.dp))
            InfoRow(
                label = "API Key Status",
                value = "Zero hardcoded keys in APK (Secured via Firebase Gateway)"
            )
            Divider(color = BorderSubtle.copy(alpha = 0.5f), modifier = Modifier.padding(vertical = 8.dp))
            InfoRow(
                label = "App Check Defense",
                value = "Play Integrity (Release) / Debug Provider (Local)"
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Privacy & Local Storage Card
        SettingsCard(
            title = "Privacy & Local Data",
            icon = Icons.Default.Lock,
            iconTint = SuccessGreen
        ) {
            Text(
                text = "CaptionCraft AI does not require account creation for basic usage. Your saved favorites, generation history, and daily counter remain strictly on your Android device in local SQLite (Room Database).",
                fontSize = 13.sp,
                color = NeutralTextSecondary,
                lineHeight = 18.sp
            )
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = "We do not track or store personal identifiers, device contacts, or browsing history.",
                fontSize = 13.sp,
                color = NeutralTextSecondary,
                lineHeight = 18.sp
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // AI Usage & Cost Disclaimer
        SettingsCard(
            title = "AI Usage & Billing Disclaimer",
            icon = Icons.Default.Info,
            iconTint = WarningAmber
        ) {
            Text(
                text = "Generative AI calls connect to Google's Gemini models through your linked Firebase project. While the Firebase AI Logic tier offers substantial free testing credits, excessive production API usage may incur standard Google Cloud/Firebase charges. Always monitor your usage quotas in the Google Cloud or Firebase Console.",
                fontSize = 13.sp,
                color = NeutralTextSecondary,
                lineHeight = 18.sp
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Setup Checklist
        SettingsCard(
            title = "Firebase Project Setup Checklist",
            icon = Icons.Default.CheckCircle,
            iconTint = BrandPurpleVibrant
        ) {
            ChecklistStep(
                number = "1",
                text = "Create project at console.firebase.google.com"
            )
            ChecklistStep(
                number = "2",
                text = "Register Android App (Package: com.captioncraft.ai)"
            )
            ChecklistStep(
                number = "3",
                text = "Place downloaded google-services.json in /android/app/"
            )
            ChecklistStep(
                number = "4",
                text = "Enable Gemini Developer API in Firebase AI Logic tab"
            )
            ChecklistStep(
                number = "5",
                text = "Register SHA-256 fingerprint for App Check"
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // App Version
        Column(
            modifier = Modifier.fillMaxWidth(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "CaptionCraft AI v1.0.0 (Build 1)",
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = NeutralTextSecondary
            )
            Text(
                text = "Designed for Bangladesh & Global Content Creators",
                fontSize = 11.sp,
                color = NeutralTextSecondary.copy(alpha = 0.8f)
            )
        }

        Spacer(modifier = Modifier.height(30.dp))
    }
}

@Composable
private fun SettingsCard(
    title: String,
    icon: ImageVector,
    iconTint: Color,
    content: @Composable ColumnScope.() -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = PureWhite),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(bottom = 12.dp)
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconTint,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = NeutralTextDark
                )
            }
            content()
        }
    }
}

@Composable
private fun InfoRow(label: String, value: String) {
    Column {
        Text(
            text = label,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = NeutralTextSecondary
        )
        Spacer(modifier = Modifier.height(2.dp))
        Text(
            text = value,
            fontSize = 13.sp,
            color = NeutralTextDark
        )
    }
}

@Composable
private fun ChecklistStep(number: String, text: String) {
    Row(
        modifier = Modifier.padding(vertical = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Surface(
            shape = RoundedCornerShape(6.dp),
            color = BrandPurpleSoft,
            modifier = Modifier.size(20.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Text(
                    text = number,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    color = BrandPurplePrimary
                )
            }
        }
        Spacer(modifier = Modifier.width(10.dp))
        Text(
            text = text,
            fontSize = 13.sp,
            color = NeutralTextDark
        )
    }
}
