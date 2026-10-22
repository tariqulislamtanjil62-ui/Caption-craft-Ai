package com.captioncraft.ai

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.captioncraft.ai.data.repository.CaptionRepository
import com.captioncraft.ai.ui.navigation.AppNavigation
import com.captioncraft.ai.ui.theme.CaptionCraftTheme
import com.captioncraft.ai.ui.viewmodel.CaptionViewModel

/**
 * Main Activity launching CaptionCraft AI with Material 3 and Jetpack Compose.
 */
class MainActivity : ComponentActivity() {

    private val viewModel: CaptionViewModel by viewModels {
        object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                val app = application as CaptionCraftApplication
                val repository = CaptionRepository(
                    context = applicationContext,
                    captionDao = app.database.captionDao()
                )
                return CaptionViewModel(repository) as T
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CaptionCraftTheme {
                AppNavigation(viewModel = viewModel)
            }
        }
    }
}
