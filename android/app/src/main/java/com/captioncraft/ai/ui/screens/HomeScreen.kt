package com.captioncraft.ai.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.captioncraft.ai.data.model.CaptionUiState
import com.captioncraft.ai.ui.components.*
import com.captioncraft.ai.ui.theme.*
import com.captioncraft.ai.ui.viewmodel.CaptionViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    viewModel: CaptionViewModel,
    onNavigateToPremium: () -> Unit,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val uiState by viewModel.uiState.collectAsState()
    val dailyQuota by viewModel.dailyQuota.collectAsState()
    val scrollState = rememberScrollState()

    val sampleTopics = listOf(
        "হাতে বোনা পিওর জামদানি শাড়ি কালেকশন",
        "New organic Arabica cold brew launch",
        "Eid festive shopping special combo"
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BrandPurpleBackground)
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // App Branding Top Bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = BrandPurplePrimary,
                    modifier = Modifier.size(40.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.AutoAwesome,
                            contentDescription = "Logo",
                            tint = PureWhite,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(
                        text = "CaptionCraft AI",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeutralTextDark
                    )
                    Text(
                        text = "Social Media Assistant",
                        fontSize = 12.sp,
                        color = NeutralTextSecondary
                    )
                }
            }

            // Daily Quota Badge & Pro trigger
            Surface(
                shape = RoundedCornerShape(20.dp),
                color = if (dailyQuota.isExhausted) BrandPurpleSoft else BrandPurpleSoft,
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .clickable { onNavigateToPremium() }
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Stars,
                        contentDescription = "Pro",
                        tint = BrandPurplePrimary,
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${dailyQuota.remaining} Free Left",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = BrandPurplePrimary
                    )
                }
            }
        }

        // Input Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = PureWhite),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Post Topic or Product",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = NeutralTextDark
                    )
                    Text(
                        text = "${viewModel.topic.length}/350",
                        fontSize = 12.sp,
                        color = if (viewModel.topic.length > 320) ErrorRed else NeutralTextSecondary
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                OutlinedTextField(
                    value = viewModel.topic,
                    onValueChange = { viewModel.updateTopic(it) },
                    placeholder = {
                        Text(
                            text = "Describe your product, promotion, or thoughts in English or বাংলা...",
                            color = NeutralTextSecondary.copy(alpha = 0.7f),
                            fontSize = 14.sp
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(110.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = BrandPurplePrimary,
                        unfocusedBorderColor = BorderSubtle
                    )
                )

                // Quick sample suggestions
                Spacer(modifier = Modifier.height(10.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    sampleTopics.take(2).forEach { sample ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = BrandPurpleBackground,
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .clickable { viewModel.updateTopic(sample) }
                        ) {
                            Text(
                                text = sample,
                                fontSize = 11.sp,
                                color = BrandPurplePrimary,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                maxLines = 1
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Language Options
        Text(
            text = "Language / ভাষা",
            fontWeight = FontWeight.SemiBold,
            fontSize = 13.sp,
            color = NeutralTextDark,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        LanguageSelector(
            selectedLanguage = viewModel.selectedLanguage,
            onLanguageSelected = { viewModel.selectLanguage(it) }
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Platform Options
        Text(
            text = "Target Platform",
            fontWeight = FontWeight.SemiBold,
            fontSize = 13.sp,
            color = NeutralTextDark,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        PlatformSelector(
            selectedPlatform = viewModel.selectedPlatform,
            onPlatformSelected = { viewModel.selectPlatform(it) }
        )

        Spacer(modifier = Modifier.height(14.dp))

        // Tone Options
        Text(
            text = "Tone of Voice",
            fontWeight = FontWeight.SemiBold,
            fontSize = 13.sp,
            color = NeutralTextDark,
            modifier = Modifier.padding(bottom = 6.dp)
        )
        ToneSelector(
            selectedTone = viewModel.selectedTone,
            onToneSelected = { viewModel.selectTone(it) }
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Generate Button
        Button(
            onClick = { viewModel.generateCaptions() },
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = BrandPurplePrimary
            ),
            enabled = uiState !is CaptionUiState.Loading
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(
                    imageVector = Icons.Default.Bolt,
                    contentDescription = null,
                    tint = PureWhite,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (uiState is CaptionUiState.Loading) "Crafting Captions..." else "Generate 3 Captions",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = PureWhite
                )
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Content Area based on UiState
        when (val state = uiState) {
            is CaptionUiState.Idle -> {
                // Friendly Empty State
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = PureWhite.copy(alpha = 0.7f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lightbulb,
                            contentDescription = null,
                            tint = BrandPurpleVibrant,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Ready to create engaging captions",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp,
                            color = NeutralTextDark
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Choose your platform, language (Bangla or English), and tone, then tap Generate to get 3 tailored options.",
                            fontSize = 13.sp,
                            color = NeutralTextSecondary,
                            lineHeight = 18.sp
                        )
                    }
                }
            }

            is CaptionUiState.Loading -> {
                ShimmerLoadingSkeleton()
            }

            is CaptionUiState.Error -> {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2)),
                    border = BorderStroke(1.dp, ErrorRed.copy(alpha = 0.3f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Default.ErrorOutline,
                                contentDescription = null,
                                tint = ErrorRed,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Notice",
                                fontWeight = FontWeight.Bold,
                                color = ErrorRed,
                                fontSize = 14.sp
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = state.message,
                            color = NeutralTextDark,
                            fontSize = 13.sp
                        )
                        if (state.canRetry) {
                            Spacer(modifier = Modifier.height(10.dp))
                            Button(
                                onClick = { viewModel.retry() },
                                shape = RoundedCornerShape(10.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = ErrorRed),
                                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                            ) {
                                Text(text = "Retry", fontSize = 12.sp, color = PureWhite)
                            }
                        }
                    }
                }
            }

            is CaptionUiState.Success -> {
                Text(
                    text = "Generated Captions (3 Options)",
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp,
                    color = NeutralTextDark,
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    state.captions.forEach { option ->
                        CaptionCard(
                            caption = option,
                            onCopy = { viewModel.copyCaptionToClipboard(context, option) },
                            onShare = { viewModel.shareCaptionViaIntent(context, option) },
                            onToggleFavorite = { viewModel.toggleFavorite(option) }
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(40.dp))
    }
}
