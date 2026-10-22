package com.captioncraft.ai.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.captioncraft.ai.data.model.AppLanguage
import com.captioncraft.ai.data.model.AppPlatform
import com.captioncraft.ai.data.model.AppTone
import com.captioncraft.ai.ui.theme.*

@Composable
fun LanguageSelector(
    selectedLanguage: AppLanguage,
    onLanguageSelected: (AppLanguage) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(BrandPurpleSoft.copy(alpha = 0.5f))
            .padding(4.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        AppLanguage.values().forEach { lang ->
            val isSelected = lang == selectedLanguage
            val bgColor by animateColorAsState(
                targetValue = if (isSelected) BrandPurplePrimary else Color.Transparent,
                label = "lang_bg"
            )
            val textColor by animateColorAsState(
                targetValue = if (isSelected) PureWhite else NeutralTextDark,
                label = "lang_text"
            )

            Box(
                modifier = Modifier
                    .weight(1f)
                    .clip(RoundedCornerShape(12.dp))
                    .background(bgColor)
                    .clickable { onLanguageSelected(lang) }
                    .padding(vertical = 10.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = lang.title,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                        fontSize = 14.sp,
                        color = textColor
                    )
                }
            }
        }
    }
}

@Composable
fun PlatformSelector(
    selectedPlatform: AppPlatform,
    onPlatformSelected: (AppPlatform) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        AppPlatform.values().forEach { platform ->
            val isSelected = platform == selectedPlatform
            val bgColor by animateColorAsState(
                targetValue = if (isSelected) BrandPurplePrimary else PureWhite,
                label = "platform_bg"
            )
            val textColor by animateColorAsState(
                targetValue = if (isSelected) PureWhite else NeutralTextDark,
                label = "platform_text"
            )
            val borderColor = if (isSelected) BrandPurplePrimary else BorderSubtle

            Surface(
                shape = RoundedCornerShape(14.dp),
                color = bgColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier
                    .clip(RoundedCornerShape(14.dp))
                    .clickable { onPlatformSelected(platform) }
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = platform.label,
                        color = textColor,
                        fontSize = 13.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                    )
                }
            }
        }
    }
}

@Composable
fun ToneSelector(
    selectedTone: AppTone,
    onToneSelected: (AppTone) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .horizontalScroll(rememberScrollState()),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        AppTone.values().forEach { tone ->
            val isSelected = tone == selectedTone
            val bgColor by animateColorAsState(
                targetValue = if (isSelected) BrandPurplePrimary else PureWhite,
                label = "tone_bg"
            )
            val textColor by animateColorAsState(
                targetValue = if (isSelected) PureWhite else NeutralTextDark,
                label = "tone_text"
            )
            val borderColor = if (isSelected) BrandPurplePrimary else BorderSubtle

            Surface(
                shape = RoundedCornerShape(14.dp),
                color = bgColor,
                border = BorderStroke(1.dp, borderColor),
                modifier = Modifier
                    .clip(RoundedCornerShape(14.dp))
                    .clickable { onToneSelected(tone) }
            ) {
                Row(
                    modifier = Modifier.padding(horizontal = 12.dp, vertical = 9.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = tone.icon, fontSize = 14.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = tone.label,
                        color = textColor,
                        fontSize = 13.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                    )
                }
            }
        }
    }
}
