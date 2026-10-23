package com.vcai.commandcenter.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Mic
import androidx.compose.material.icons.filled.Send
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vcai.commandcenter.data.AgentMode
import com.vcai.commandcenter.ui.theme.CardDark
import com.vcai.commandcenter.ui.theme.CyanPrimary
import com.vcai.commandcenter.ui.theme.NeonEmerald
import com.vcai.commandcenter.ui.theme.SurfaceDark
import com.vcai.commandcenter.ui.theme.TextMuted
import com.vcai.commandcenter.ui.theme.TextPrimary

@Composable
fun VoiceBottomBar(
    text: String,
    onTextChange: (String) -> Unit,
    onSend: () -> Unit,
    onVoiceClick: () -> Unit,
    isListening: Boolean,
    currentMode: AgentMode,
    onSelectMode: (AgentMode) -> Unit,
    modifier: Modifier = Modifier
) {
    val transition = rememberInfiniteTransition(label = "MicTransition")
    val micScale by transition.animateFloat(
        initialValue = 1f,
        targetValue = 1.25f,
        animationSpec = infiniteRepeatable(
            animation = tween(600, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "micScale"
    )

    Column(
        modifier = modifier
            .fillMaxWidth()
            .background(SurfaceDark)
            .border(1.dp, Color(0x3300F0FF))
            .padding(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Mode Selector Chips
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(6.dp)
        ) {
            AgentMode.values().take(6).forEach { mode ->
                val selected = mode == currentMode
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(if (selected) CyanPrimary.copy(alpha = 0.2f) else CardDark)
                        .border(
                            1.dp,
                            if (selected) CyanPrimary else Color(0x2200F0FF),
                            RoundedCornerShape(8.dp)
                        )
                        .clickable { onSelectMode(mode) }
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(
                        text = mode.displayName,
                        color = if (selected) CyanPrimary else TextMuted,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = if (selected) FontWeight.Bold else FontWeight.Normal
                    )
                }
            }
        }

        // Input & Action Buttons
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Voice Input Trigger
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(if (isListening) Color(0xFFEF4444) else Color(0xFF0F2B48))
                    .border(
                        1.5.dp,
                        if (isListening) Color(0xFFFF8888) else CyanPrimary,
                        CircleShape
                    )
                    .scale(if (isListening) micScale else 1f)
                    .clickable { onVoiceClick() },
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Mic,
                    contentDescription = "Voice Input",
                    tint = if (isListening) Color.White else CyanPrimary,
                    modifier = Modifier.size(22.dp)
                )
            }

            // Text Input Box
            Box(
                modifier = Modifier
                    .weight(1f)
                    .height(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(CardDark)
                    .border(1.dp, Color(0x3300F0FF), RoundedCornerShape(12.dp))
                    .padding(horizontal = 12.dp, vertical = 12.dp)
            ) {
                if (text.isEmpty()) {
                    Text(
                        text = "VC AI se kuch bhi bolo ya pucho...",
                        color = TextMuted,
                        fontSize = 12.sp,
                        fontFamily = FontFamily.Default
                    )
                }
                BasicTextField(
                    value = text,
                    onValueChange = onTextChange,
                    textStyle = TextStyle(
                        color = TextPrimary,
                        fontSize = 13.sp,
                        fontFamily = FontFamily.Default
                    ),
                    cursorBrush = SolidColor(CyanPrimary),
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
            }

            // Send Button
            IconButton(
                onClick = onSend,
                enabled = text.isNotBlank(),
                modifier = Modifier
                    .size(44.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(if (text.isNotBlank()) CyanPrimary else Color(0xFF0B172E))
            ) {
                Icon(
                    imageVector = Icons.Default.Send,
                    contentDescription = "Send",
                    tint = if (text.isNotBlank()) Color(0xFF040812) else TextMuted,
                    modifier = Modifier.size(18.dp)
                )
            }
        }
    }
}
