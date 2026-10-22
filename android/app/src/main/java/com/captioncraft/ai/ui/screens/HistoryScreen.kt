package com.captioncraft.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DeleteOutline
import androidx.compose.material.icons.filled.History
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.captioncraft.ai.ui.components.CaptionCard
import com.captioncraft.ai.ui.theme.*
import com.captioncraft.ai.ui.viewmodel.CaptionViewModel

@Composable
fun HistoryScreen(
    viewModel: CaptionViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val history by viewModel.history.collectAsState()
    var showClearDialog by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BrandPurpleBackground)
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = "Generation History",
                    fontWeight = FontWeight.Bold,
                    fontSize = 22.sp,
                    color = NeutralTextDark
                )
                Text(
                    text = "Stored locally on your device",
                    fontSize = 13.sp,
                    color = NeutralTextSecondary
                )
            }

            if (history.isNotEmpty()) {
                TextButton(
                    onClick = { showClearDialog = true },
                    colors = ButtonDefaults.textButtonColors(contentColor = ErrorRed)
                ) {
                    Icon(
                        imageVector = Icons.Default.DeleteOutline,
                        contentDescription = "Clear",
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(text = "Clear", fontSize = 13.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }

        if (history.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.History,
                        contentDescription = null,
                        tint = BrandPurpleVibrant,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = "No history recorded yet",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = NeutralTextDark
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Generated captions will automatically appear here so you can review and reuse them later.",
                        fontSize = 13.sp,
                        color = NeutralTextSecondary,
                        lineHeight = 18.sp
                    )
                }
            }
        } else {
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(16.dp),
                modifier = Modifier.fillMaxSize()
            ) {
                items(history, key = { it.id }) { option ->
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

    if (showClearDialog) {
        AlertDialog(
            onDismissRequest = { showClearDialog = false },
            title = { Text("Clear History?", fontWeight = FontWeight.Bold) },
            text = { Text("This will remove your un-favorited recent generations from local storage.") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.clearHistory()
                        showClearDialog = false
                    },
                    colors = ButtonDefaults.textButtonColors(contentColor = ErrorRed)
                ) {
                    Text("Clear")
                }
            },
            dismissButton = {
                TextButton(onClick = { showClearDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}
