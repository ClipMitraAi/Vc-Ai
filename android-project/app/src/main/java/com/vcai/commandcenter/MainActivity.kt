package com.vcai.commandcenter

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.vcai.commandcenter.data.AgentMode
import com.vcai.commandcenter.data.ChatMessage
import com.vcai.commandcenter.data.ChatRequest
import com.vcai.commandcenter.data.Role
import com.vcai.commandcenter.network.VcAIApiService
import com.vcai.commandcenter.ui.CommandCenterScreen
import com.vcai.commandcenter.ui.theme.VcAICyberneticTheme
import kotlinx.coroutines.launch
import java.util.Locale

class MainActivity : ComponentActivity() {

    private val apiService by lazy { VcAIApiService.create() }
    private var speechRecognizer: SpeechRecognizer? = null

    private val messages = mutableStateListOf<ChatMessage>()
    private var isThinking by mutableStateOf(false)
    private var isListening by mutableStateOf(false)
    private var currentMode by mutableStateOf(AgentMode.NORMAL)

    private val requestAudioPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            startVoiceInput()
        } else {
            Toast.makeText(this, "Microphone permission required for VC AI voice commands", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Seed with initial greeting
        if (messages.isEmpty()) {
            messages.add(
                ChatMessage(
                    role = Role.ASSISTANT,
                    content = "Namaste! Main VC AI hoon — aapka autonomous personal AI companion aur JARVIS command center. Kuch bhi command karein ya baat karein, main taiyar hoon!"
                )
            )
        }

        setupSpeechRecognizer()

        setContent {
            VcAICyberneticTheme {
                CommandCenterScreen(
                    messages = messages,
                    onSendMessage = { text -> handleSendMessage(text) },
                    isThinking = isThinking,
                    onVoiceClick = { handleVoiceButtonClick() },
                    isListening = isListening,
                    currentMode = currentMode,
                    onModeChange = { mode -> currentMode = mode }
                )
            }
        }
    }

    private fun setupSpeechRecognizer() {
        if (SpeechRecognizer.isRecognitionAvailable(this)) {
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(this).apply {
                setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        isListening = true
                    }
                    override fun onBeginningOfSpeech() {}
                    override fun onRmsChanged(rmsdB: Float) {}
                    override fun onBufferReceived(buffer: ByteArray?) {}
                    override fun onEndOfSpeech() {
                        isListening = false
                    }
                    override fun onError(error: Int) {
                        isListening = false
                    }
                    override fun onResults(results: Bundle?) {
                        isListening = false
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        if (!matches.isNullOrEmpty()) {
                            val recognizedText = matches[0]
                            handleSendMessage(recognizedText)
                        }
                    }
                    override fun onPartialResults(partialResults: Bundle?) {}
                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
            }
        }
    }

    private fun handleVoiceButtonClick() {
        if (isListening) {
            speechRecognizer?.stopListening()
            isListening = false
            return
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
            startVoiceInput()
        } else {
            requestAudioPermissionLauncher.launch(Manifest.permission.RECORD_AUDIO)
        }
    }

    private fun startVoiceInput() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault())
            putExtra(RecognizerIntent.EXTRA_PROMPT, "VC AI ko command karein...")
        }
        try {
            speechRecognizer?.startListening(intent)
            isListening = true
        } catch (e: Exception) {
            isListening = false
            Toast.makeText(this, "Voice input initialization failed: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun handleSendMessage(text: String) {
        if (text.isBlank()) return

        val userMsg = ChatMessage(
            role = Role.USER,
            content = text
        )
        messages.add(userMsg)
        isThinking = true

        lifecycleScope.launch {
            try {
                val historyPayload = messages.takeLast(6).map {
                    mapOf("role" to if (it.role == Role.USER) "user" else "assistant", "content" to it.content)
                }

                val request = ChatRequest(
                    message = text,
                    mode = currentMode.name.lowercase(),
                    history = historyPayload,
                    languagePreference = "hinglish"
                )

                val response = apiService.sendMessage(request)
                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    val aiMsg = ChatMessage(
                        role = Role.ASSISTANT,
                        content = body.text,
                        executedAction = body.executedAction
                    )
                    messages.add(aiMsg)

                    // Autonomously adapt mode if AI determined mode transition
                    body.executedAction?.switchMode?.let { newModeStr ->
                        AgentMode.values().find { it.name.equals(newModeStr, ignoreCase = true) }?.let {
                            currentMode = it
                        }
                    }
                } else {
                    messages.add(
                        ChatMessage(
                            role = Role.ASSISTANT,
                            content = "Maaf kijiye, server se connect karne mein problem aayi: ${response.code()} ${response.message()}"
                        )
                    )
                }
            } catch (e: Exception) {
                messages.add(
                    ChatMessage(
                        role = Role.ASSISTANT,
                        content = "Connection error: ${e.localizedMessage ?: "Network issue"}. Kripya internet connection check karein."
                    )
                )
            } finally {
                isThinking = false
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        speechRecognizer?.destroy()
    }
}
