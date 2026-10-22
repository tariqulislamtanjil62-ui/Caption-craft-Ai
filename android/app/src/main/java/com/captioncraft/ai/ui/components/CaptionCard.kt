package com.captioncraft.ai.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContentCopy
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.captioncraft.ai.data.model.CaptionOption
import com.captioncraft.ai.ui.theme.*

@Composable
fun CaptionCard(
    caption: CaptionOption,
    onCopy: () -> Unit,
    onShare: () -> Unit,
    onToggleFavorite: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
        border = BorderStroke(1.dp, MaterialTheme.colorScheme.outline.copy(alpha = 0.5f))
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(18.dp)
        ) {
            // Header with Style Badge, Search badge & Favorite button
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = BrandPurpleSoft
                    ) {
                        Text(
                            text = caption.style,
                            color = BrandPurpleDark,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 5.dp)
                        )
                    }
                    if (caption.isSearchGrounded) {
                        Spacer(modifier = Modifier.width(6.dp))
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFFD1FAE5)
                        ) {
                            Text(
                                text = "SEO Grounded",
                                color = Color(0xFF065F46),
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                            )
                        }
                    }
                }

                val favColor by animateColorAsState(
                    targetValue = if (caption.isFavorite) ErrorRed else NeutralTextSecondary,
                    label = "fav_color"
                )

                IconButton(
                    onClick = onToggleFavorite,
                    modifier = Modifier.size(36.dp)
                ) {
                    Icon(
                        imageVector = if (caption.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = if (caption.isFavorite) "Remove from favorites" else "Add to favorites",
                        tint = favColor
                    )
                }
            }

            // Pinterest Pin Title if available
            caption.pinTitle?.let { title ->
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color(0xFFFFF1F2),
                    border = BorderStroke(1.dp, Color(0xFFFECDD3))
                ) {
                    Text(
                        text = "📌 Pin Title: $title",
                        color = Color(0xFF9F1239),
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                    )
                }
            }

            // Video Hook if available
            caption.videoHook?.let { hook ->
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = BrandPurpleSoft,
                    border = BorderStroke(1.dp, BrandPurpleSoft)
                ) {
                    Text(
                        text = "🎬 Hook: $hook",
                        color = BrandPurpleDark,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Caption Text
            Text(
                text = caption.text,
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurface,
                lineHeight = 24.sp
            )

            // Hashtags
            if (caption.hashtags.isNotEmpty()) {
                Spacer(modifier = Modifier.height(12.dp))
                OptInFlowRow {
                    caption.hashtags.forEach { tag ->
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f),
                            modifier = Modifier.padding(end = 6.dp, bottom = 6.dp)
                        ) {
                            Text(
                                text = tag,
                                color = BrandPurplePrimary,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }
                }
            }

            // SEO Keywords if available
            if (caption.seoTags.isNotEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Search & SEO Tags: " + caption.seoTags.joinToString(", "),
                    fontSize = 11.sp,
                    color = Color(0xFF047857),
                    fontWeight = FontWeight.Medium
                )
            }

            // Call to Action suggestion
            if (caption.callToAction.isNotBlank()) {
                Spacer(modifier = Modifier.height(10.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Suggested CTA: ",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = NeutralTextSecondary
                    )
                    Text(
                        text = caption.callToAction,
                        fontSize = 12.sp,
                        color = BrandPurpleVibrant,
                        fontWeight = FontWeight.Medium
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))
            Divider(color = BorderSubtle.copy(alpha = 0.6f))
            Spacer(modifier = Modifier.height(12.dp))

            // Action Buttons: Copy and Native Android Share Intent
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedButton(
                    onClick = onCopy,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = BrandPurplePrimary
                    ),
                    border = BorderStroke(1.dp, BrandPurpleSoft),
                    contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.ContentCopy,
                        contentDescription = "Copy",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Copy", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }

                Spacer(modifier = Modifier.width(8.dp))

                Button(
                    onClick = onShare,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = BrandPurplePrimary
                    ),
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Share,
                        contentDescription = "Share",
                        tint = PureWhite,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Share",
                        color = PureWhite,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun OptInFlowRow(content: @Composable () -> Unit) {
    FlowRow(
        horizontalArrangement = Arrangement.Start,
        verticalArrangement = Arrangement.Center
    ) {
        content()
    }
}
