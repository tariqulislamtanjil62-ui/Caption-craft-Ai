package com.captioncraft.ai.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BookmarkBorder
import androidx.compose.material.icons.filled.Search
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FavoritesScreen(
    viewModel: CaptionViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val favorites by viewModel.favorites.collectAsState()
    var searchQuery by remember { mutableStateOf("") }

    val filteredList = remember(favorites, searchQuery) {
        if (searchQuery.isBlank()) favorites
        else favorites.filter {
            it.text.contains(searchQuery, ignoreCase = true) ||
            it.hashtags.any { tag -> tag.contains(searchQuery, ignoreCase = true) }
        }
    }

    Column(
        modifier = modifier
            .fillMaxSize()
            .background(BrandPurpleBackground)
            .padding(16.dp)
    ) {
        Text(
            text = "Saved Favorites",
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp,
            color = NeutralTextDark
        )
        Text(
            text = "Your bookmarked captions stored privately on-device",
            fontSize = 13.sp,
            color = NeutralTextSecondary,
            modifier = Modifier.padding(bottom = 14.dp)
        )

        // Search Bar
        if (favorites.isNotEmpty()) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search your favorites...", fontSize = 13.sp) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Search,
                        contentDescription = null,
                        tint = NeutralTextSecondary,
                        modifier = Modifier.size(20.dp)
                    )
                },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 16.dp),
                shape = RoundedCornerShape(14.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = BrandPurplePrimary,
                    unfocusedBorderColor = BorderSubtle
                )
            )
        }

        if (filteredList.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(
                        imageVector = Icons.Default.BookmarkBorder,
                        contentDescription = null,
                        tint = BrandPurpleVibrant,
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = if (favorites.isEmpty()) "No saved captions yet" else "No matching captions",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp,
                        color = NeutralTextDark
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Tap the heart icon on any generated caption to save it here for quick access anytime.",
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
                items(filteredList, key = { it.id }) { option ->
                    CaptionCard(
                        caption = option.copy(isFavorite = true),
                        onCopy = { viewModel.copyCaptionToClipboard(context, option) },
                        onShare = { viewModel.shareCaptionViaIntent(context, option) },
                        onToggleFavorite = { viewModel.deleteFavorite(option.id) }
                    )
                }
            }
        }
    }
}
