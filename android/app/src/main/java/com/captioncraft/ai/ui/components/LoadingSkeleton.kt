package com.captioncraft.ai.ui.components

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.captioncraft.ai.ui.theme.BrandPurpleSoft

/**
 * Shimmering loading skeleton for caption generation in progress.
 */
@Composable
fun ShimmerLoadingSkeleton(modifier: Modifier = Modifier) {
    val transition = rememberInfiniteTransition(label = "shimmer_transition")
    val translateAnim by transition.animateFloat(
        initialValue = 0f,
        targetValue = 1000f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "shimmer_translate"
    )

    val shimmerColors = listOf(
        Color(0xFFE2E8F0),
        Color(0xFFF1F5F9),
        Color(0xFFE2E8F0)
    )

    val brush = Brush.linearGradient(
        colors = shimmerColors,
        start = Offset(x = translateAnim - 300f, y = translateAnim - 300f),
        end = Offset(x = translateAnim, y = translateAnim)
    )

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        repeat(3) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Box(
                        modifier = Modifier
                            .size(width = 110.dp, height = 24.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(brush)
                    )
                    Spacer(modifier = Modifier.height(14.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(18.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(brush)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.85f)
                            .height(18.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(brush)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth(0.6f)
                            .height(18.dp)
                            .clip(RoundedCornerShape(6.dp))
                            .background(brush)
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Box(
                            modifier = Modifier
                                .size(width = 70.dp, height = 20.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(brush)
                        )
                        Box(
                            modifier = Modifier
                                .size(width = 85.dp, height = 20.dp)
                                .clip(RoundedCornerShape(6.dp))
                                .background(brush)
                        )
                    }
                }
            }
        }
    }
}
