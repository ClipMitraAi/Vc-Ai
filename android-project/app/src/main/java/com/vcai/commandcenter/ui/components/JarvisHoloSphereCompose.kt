package com.vcai.commandcenter.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vcai.commandcenter.ui.theme.CyanGlow
import com.vcai.commandcenter.ui.theme.CyanPrimary
import kotlin.math.cos
import kotlin.math.sin

@Composable
fun JarvisHoloSphereCompose(
    modifier: Modifier = Modifier,
    isThinking: Boolean = false,
    currentModeName: String = "COMMAND HUD"
) {
    val transition = rememberInfiniteTransition(label = "HoloTransition")

    val outerAngle by transition.animateFloat(
        initialValue = 0f,
        targetValue = 360f,
        animationSpec = infiniteRepeatable(
            animation = tween(12000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "outerAngle"
    )

    val innerAngle by transition.animateFloat(
        initialValue = 360f,
        targetValue = 0f,
        animationSpec = infiniteRepeatable(
            animation = tween(8000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "innerAngle"
    )

    val pulseScale by transition.animateFloat(
        initialValue = 0.92f,
        targetValue = 1.08f,
        animationSpec = infiniteRepeatable(
            animation = tween(if (isThinking) 600 else 1800, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulseScale"
    )

    Box(
        modifier = modifier.size(240.dp),
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val center = Offset(size.width / 2f, size.height / 2f)
            val baseRadius = size.minDimension / 2f - 16.dp.toPx()

            // 1. Glowing Radial Center Gradient
            drawCircle(
                brush = Brush.radialGradient(
                    colors = listOf(
                        CyanPrimary.copy(alpha = if (isThinking) 0.35f else 0.18f),
                        CyanGlow.copy(alpha = 0.08f),
                        Color.Transparent
                    ),
                    center = center,
                    radius = baseRadius * pulseScale
                ),
                radius = baseRadius * pulseScale,
                center = center
            )

            // 2. Outer Rotating Segmented Track
            rotate(outerAngle, pivot = center) {
                drawCircle(
                    color = CyanPrimary.copy(alpha = 0.45f),
                    radius = baseRadius,
                    center = center,
                    style = Stroke(
                        width = 2.dp.toPx(),
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(18f, 14f), 0f)
                    )
                )

                // Outer decorative ticks
                val tickCount = 24
                for (i in 0 until tickCount) {
                    val angleRad = Math.toRadians((i * (360.0 / tickCount))).toFloat()
                    val r1 = baseRadius - 4.dp.toPx()
                    val r2 = baseRadius + 4.dp.toPx()
                    val start = Offset(center.x + r1 * cos(angleRad), center.y + r1 * sin(angleRad))
                    val end = Offset(center.x + r2 * cos(angleRad), center.y + r2 * sin(angleRad))
                    drawLine(
                        color = CyanPrimary.copy(alpha = if (i % 4 == 0) 0.8f else 0.3f),
                        start = start,
                        end = end,
                        strokeWidth = if (i % 4 == 0) 2.5.dp.toPx() else 1.dp.toPx()
                    )
                }
            }

            // 3. Middle Counter-Rotating Elliptical Rings
            rotate(innerAngle, pivot = center) {
                drawCircle(
                    color = CyanGlow.copy(alpha = 0.6f),
                    radius = baseRadius * 0.75f,
                    center = center,
                    style = Stroke(
                        width = 1.5.dp.toPx(),
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(30f, 20f), 0f)
                    )
                )
            }

            // 4. Core Inner Ring
            drawCircle(
                color = CyanPrimary.copy(alpha = 0.85f),
                radius = baseRadius * 0.45f * pulseScale,
                center = center,
                style = Stroke(width = 2.dp.toPx(), cap = StrokeCap.Round)
            )

            // 5. Core Center Dot
            drawCircle(
                color = CyanPrimary,
                radius = 6.dp.toPx() * pulseScale,
                center = center
            )
        }

        // Center HUD Text Overlay
        Box(
            modifier = Modifier.size(140.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = if (isThinking) "PROCESSING" else currentModeName.uppercase(),
                color = CyanPrimary,
                fontSize = 10.sp,
                fontFamily = FontFamily.Monospace,
                fontWeight = FontWeight.Bold,
                letterSpacing = 1.sp
            )
        }
    }
}
