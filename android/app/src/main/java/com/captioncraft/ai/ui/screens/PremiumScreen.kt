package com.captioncraft.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.captioncraft.ai.ui.theme.*
import com.captioncraft.ai.ui.viewmodel.CaptionViewModel

@Composable
fun PremiumScreen(
    viewModel: CaptionViewModel,
    onBack: () -> Unit,
    modifier: Modifier = Modifier
) {
    val dailyQuota by viewModel.dailyQuota.collectAsState()
    val scrollState = rememberScrollState()

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BrandPurpleBackground)
            .verticalScroll(scrollState)
            .padding(20.dp)
    ) {
        // Top Back Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.Default.ArrowBack,
                    contentDescription = "Back",
                    tint = NeutralTextDark
                )
            }
            Text(
                text = "CaptionCraft Pro",
                fontWeight = FontWeight.Bold,
                fontSize = 18.sp,
                color = NeutralTextDark
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Hero Gradient Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.Transparent)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            listOf(BrandPurpleDark, BrandPurplePrimary)
                        )
                    )
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = PureWhite.copy(alpha = 0.2f),
                        modifier = Modifier.size(54.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.WorkspacePremium,
                                contentDescription = null,
                                tint = PureWhite,
                                modifier = Modifier.size(32.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    Text(
                        text = "Unlock Unlimited Creativity",
                        fontWeight = FontWeight.Bold,
                        fontSize = 20.sp,
                        color = PureWhite,
                        textAlign = TextAlign.Center
                    )

                    Spacer(modifier = Modifier.height(6.dp))

                    Text(
                        text = "Supercharge your Facebook, Instagram, and TikTok presence with elite AI copywriting.",
                        fontSize = 13.sp,
                        color = PureWhite.copy(alpha = 0.85f),
                        textAlign = TextAlign.Center,
                        lineHeight = 18.sp
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Free Tier Usage Meter
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(18.dp),
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
                        text = "Today's Free Tier Usage",
                        fontWeight = FontWeight.Bold,
                        fontSize = 14.sp,
                        color = NeutralTextDark
                    )
                    Text(
                        text = "${dailyQuota.usedToday} / ${dailyQuota.maxFree} Used",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = if (dailyQuota.isExhausted) ErrorRed else BrandPurplePrimary
                    )
                }

                Spacer(modifier = Modifier.height(10.dp))

                LinearProgressIndicator(
                    progress = { (dailyQuota.usedToday.toFloat() / dailyQuota.maxFree.toFloat()).coerceIn(0f, 1f) },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = if (dailyQuota.isExhausted) ErrorRed else BrandPurplePrimary,
                    trackColor = BrandPurpleSoft
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = if (dailyQuota.isExhausted)
                        "You have reached your daily quota of 5 free generations. Resets at midnight local time."
                    else
                        "You have ${dailyQuota.remaining} free generations remaining today.",
                    fontSize = 12.sp,
                    color = NeutralTextSecondary
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        Text(
            text = "Pro Features Included",
            fontWeight = FontWeight.Bold,
            fontSize = 15.sp,
            color = NeutralTextDark,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        ProFeatureItem(
            icon = Icons.Default.AllInclusive,
            title = "Unlimited Captions",
            desc = "No daily limits. Generate whenever inspiration strikes."
        )
        ProFeatureItem(
            icon = Icons.Default.Translate,
            title = "Advanced Bangla & Dialects",
            desc = "Specialized conversational Bengali for regional audiences."
        )
        ProFeatureItem(
            icon = Icons.Default.Tag,
            title = "Viral Hashtag Intelligence",
            desc = "High-performing tags tailored to engagement trends."
        )
        ProFeatureItem(
            icon = Icons.Default.Speed,
            title = "Priority Generation Speed",
            desc = "Ultra-fast response times via dedicated model pipeline."
        )

        Spacer(modifier = Modifier.height(20.dp))

        // Honest Policy & Billing Notice Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = BrandPurpleSoft.copy(alpha = 0.6f)),
            border = androidx.compose.foundation.BorderStroke(1.dp, BrandPurpleVibrant.copy(alpha = 0.3f))
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Construction,
                        contentDescription = null,
                        tint = BrandPurplePrimary,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Google Play Billing: In Development",
                        fontWeight = FontWeight.Bold,
                        fontSize = 13.sp,
                        color = BrandPurpleDark
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "To strictly comply with Google Play Store Commerce policies, in-app billing is currently in staging and not accepting transactions in this build. No charges will be made. Enjoy testing all generator features with the generous daily free tier!",
                    fontSize = 12.sp,
                    color = NeutralTextSecondary,
                    lineHeight = 17.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(30.dp))
    }
}

@Composable
private fun ProFeatureItem(
    icon: ImageVector,
    title: String,
    desc: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.Top
    ) {
        Surface(
            shape = RoundedCornerShape(10.dp),
            color = BrandPurpleSoft,
            modifier = Modifier.size(36.dp)
        ) {
            Box(contentAlignment = Alignment.Center) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = BrandPurplePrimary,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column {
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                fontSize = 14.sp,
                color = NeutralTextDark
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = desc,
                fontSize = 12.sp,
                color = NeutralTextSecondary,
                lineHeight = 16.sp
            )
        }
    }
}
