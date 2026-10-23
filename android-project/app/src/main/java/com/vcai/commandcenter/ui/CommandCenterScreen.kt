package com.vcai.commandcenter.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.vcai.commandcenter.data.AgentMode
import com.vcai.commandcenter.data.AgentNode
import com.vcai.commandcenter.data.ChatMessage
import com.vcai.commandcenter.ui.components.AgentStatusCard
import com.vcai.commandcenter.ui.components.ChatBubbleItem
import com.vcai.commandcenter.ui.components.JarvisHoloSphereCompose
import com.vcai.commandcenter.ui.components.VoiceBottomBar
import com.vcai.commandcenter.ui.theme.BlackHud
import com.vcai.commandcenter.ui.theme.CyanPrimary
import com.vcai.commandcenter.ui.theme.NeonEmerald
import com.vcai.commandcenter.ui.theme.TextMuted
import com.vcai.commandcenter.ui.theme.TextPrimary
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Composable
fun CommandCenterScreen(
    messages: List<ChatMessage>,
    onSendMessage: (String) -> Unit,
    isThinking: Boolean,
    onVoiceClick: () -> Unit,
    isListening: Boolean,
    currentMode: AgentMode,
    onModeChange: (AgentMode) -> Unit
) {
    var inputText by remember { mutableStateOf("") }
    var currentTimeString by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        while (true) {
            val sdf = SimpleDateFormat("hh:mm:ss a", Locale.getDefault())
            currentTimeString = sdf.format(Date())
            kotlinx.coroutines.delay(1000)
        }
    }

    val sampleAgents = remember {
        listOf(
            AgentNode("1", "NEURAL SYNTHESIZER", "Processing Natural Voice & Text", 42, true),
            AgentNode("2", "AUTONOMOUS PLANNER", "Action & Intent Execution Core", 68, true),
            AgentNode("3", "EMOTION RADAR", "Calibrated to Empathetic Tone", 19, true),
            AgentNode("4", "MEMORY ENGINE", "Persistent User Context Synced", 31, true)
        )
    }

    Scaffold(
        containerColor = BlackHud,
        bottomBar = {
            VoiceBottomBar(
                text = inputText,
                onTextChange = { inputText = it },
                onSend = {
                    if (inputText.isNotBlank()) {
                        val toSend = inputText
                        inputText = ""
                        onSendMessage(toSend)
                    }
                },
                onVoiceClick = onVoiceClick,
                isListening = isListening,
                currentMode = currentMode,
                onSelectMode = onModeChange
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(BlackHud)
        ) {
            // 1. Cybernetic HUD Top Status Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFF06101E))
                    .border(1.dp, Color(0x3300F0FF))
                    .padding(horizontal = 14.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(NeonEmerald)
                    )
                    Text(
                        text = "SYSTEM STATUS: OPTIMAL",
                        color = CyanPrimary,
                        fontSize = 11.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold
                    )
                }

                Text(
                    text = currentTimeString.ifEmpty { "11:18:21 AM" },
                    color = CyanPrimary,
                    fontSize = 12.sp,
                    fontFamily = FontFamily.Monospace,
                    fontWeight = FontWeight.ExtraBold
                )
            }

            // 2. Main Content Stream (HoloSphere at top + Active Agents + Chat History)
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 12.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // HoloSphere Hologram Header
                item {
                    Spacer(modifier = Modifier.height(6.dp))
                    Box(
                        modifier = Modifier.fillMaxWidth(),
                        contentAlignment = Alignment.Center
                    ) {
                        JarvisHoloSphereCompose(
                            isThinking = isThinking,
                            currentModeName = currentMode.displayName
                        )
                    }
                }

                // Multi-Agent Cluster Title
                item {
                    Text(
                        text = "ACTIVE AGENT CLUSTER [4 CORES ONLINE]",
                        color = TextMuted,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 4.dp, bottom = 2.dp)
                    )
                }

                // Display 2 core agents for quick glance
                items(sampleAgents.take(2)) { agent ->
                    AgentStatusCard(agent = agent)
                }

                // Chat Log Section
                item {
                    Text(
                        text = "COMMUNICATION & AUTONOMOUS TIMELINE",
                        color = CyanPrimary,
                        fontSize = 10.sp,
                        fontFamily = FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(top = 6.dp)
                    )
                }

                // Messages
                items(messages, key = { it.id }) { msg ->
                    ChatBubbleItem(message = msg)
                }

                item {
                    Spacer(modifier = Modifier.height(16.dp))
                }
            }
        }
    }
}
