package com.captioncraft.ai.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.*
import com.captioncraft.ai.ui.screens.*
import com.captioncraft.ai.ui.theme.*
import com.captioncraft.ai.ui.viewmodel.CaptionViewModel

enum class Screen(val route: String, val title: String, val icon: ImageVector) {
    HOME("home", "Home", Icons.Default.AutoAwesome),
    HISTORY("history", "History", Icons.Default.History),
    FAVORITES("favorites", "Favorites", Icons.Default.Favorite),
    PROFILE("profile", "Profile", Icons.Default.Person)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AppNavigation(
    viewModel: CaptionViewModel,
    modifier: Modifier = Modifier
) {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route
    val favorites by viewModel.favorites.collectAsState()

    val bottomNavItems = listOf(
        Screen.HOME,
        Screen.HISTORY,
        Screen.FAVORITES,
        Screen.PROFILE
    )

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface,
                tonalElevation = 4.dp,
                modifier = Modifier.clip(RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp))
            ) {
                bottomNavItems.forEach { screen ->
                    val isSelected = currentRoute == screen.route
                    NavigationBarItem(
                        selected = isSelected,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            if (screen == Screen.FAVORITES && favorites.isNotEmpty()) {
                                BadgedBox(
                                    badge = {
                                        Badge(
                                            containerColor = RoyalPurplePrimary,
                                            contentColor = androidx.compose.ui.graphics.Color.White
                                        ) {
                                            Text(text = "${favorites.size}", fontSize = 10.sp)
                                        }
                                    }
                                ) {
                                    Icon(imageVector = screen.icon, contentDescription = screen.title)
                                }
                            } else {
                                Icon(imageVector = screen.icon, contentDescription = screen.title)
                            }
                        },
                        label = { Text(screen.title, fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = androidx.compose.ui.graphics.Color.White,
                            selectedTextColor = RoyalPurplePrimary,
                            indicatorColor = RoyalPurplePrimary,
                            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
                            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.HOME.route,
            modifier = modifier.padding(innerPadding)
        ) {
            composable(Screen.HOME.route) {
                HomeScreen(viewModel = viewModel, onNavigateToProfile = { navController.navigate(Screen.PROFILE.route) })
            }
            composable(Screen.HISTORY.route) {
                HistoryScreen(viewModel = viewModel)
            }
            composable(Screen.FAVORITES.route) {
                FavoritesScreen(viewModel = viewModel)
            }
            composable(Screen.PROFILE.route) {
                SettingsScreen()
            }
        }
    }
}
