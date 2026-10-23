package com.vcai.commandcenter.data

import com.google.gson.annotations.SerializedName

enum class Role {
    USER, ASSISTANT, SYSTEM
}

enum class AgentMode(val displayName: String, val badgeColor: Long) {
    NORMAL("Command HUD", 0xFF00F0FF),
    ROMANTIC("Romantic Companion", 0xFFEC4899),
    FRIEND("Close Friend", 0xFF10B981),
    EMOTIONAL("Emotional Support", 0xFFA855F7),
    WORK("Executive Work", 0xFF3B82F6),
    STUDY("Academic Study", 0xFFF59E0B),
    CODING("System Architect", 0xFF06B6D4),
    CREATIVE("Creative Studio", 0xFFF43F5E),
    RESEARCH("Deep Research", 0xFF8B5CF6),
    VOICE("Voice Reactor", 0xFF00F0FF),
    FOCUS("Focus Protocol", 0xFF10B981)
}

data class ActionData(
    @SerializedName("switchMode") val switchMode: String? = null,
    @SerializedName("createReminder") val createReminder: ReminderData? = null,
    @SerializedName("saveMemory") val saveMemory: MemoryData? = null,
    @SerializedName("generateImage") val generateImage: ImageGenData? = null,
    @SerializedName("startFocusTimer") val startFocusTimer: TimerData? = null,
    @SerializedName("detectedEmotion") val detectedEmotion: String? = null
)

data class ReminderData(
    @SerializedName("title") val title: String,
    @SerializedName("datetime") val datetime: String
)

data class MemoryData(
    @SerializedName("text") val text: String,
    @SerializedName("category") val category: String? = "preference"
)

data class ImageGenData(
    @SerializedName("prompt") val prompt: String,
    @SerializedName("aspectRatio") val aspectRatio: String? = "1:1"
)

data class TimerData(
    @SerializedName("minutes") val minutes: Int = 25
)

data class ChatMessage(
    val id: String = java.util.UUID.randomUUID().toString(),
    val role: Role,
    val content: String,
    val timestamp: Long = System.currentTimeMillis(),
    val executedAction: ActionData? = null,
    val imageUrl: String? = null,
    val sources: List<WebSource> = emptyList()
)

data class WebSource(
    val title: String,
    val uri: String
)

data class ChatRequest(
    @SerializedName("message") val message: String,
    @SerializedName("mode") val mode: String = "normal",
    @SerializedName("history") val history: List<Map<String, String>> = emptyList(),
    @SerializedName("languagePreference") val languagePreference: String = "hinglish"
)

data class ChatResponse(
    @SerializedName("text") val text: String,
    @SerializedName("executedAction") val executedAction: ActionData? = null,
    @SerializedName("sources") val sources: List<WebSource>? = null,
    @SerializedName("mode") val mode: String? = null
)

data class AgentNode(
    val id: String,
    val name: String,
    val status: String,
    val loadPercent: Int,
    val active: Boolean
)
