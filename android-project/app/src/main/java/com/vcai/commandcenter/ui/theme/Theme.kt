package com.vcai.commandcenter.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = CyanPrimary,
    secondary = CyanGlow,
    tertiary = NeonEmerald,
    background = BlackHud,
    surface = SurfaceDark,
    onPrimary = BlackHud,
    onSecondary = BlackHud,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun VcAICyberneticTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
