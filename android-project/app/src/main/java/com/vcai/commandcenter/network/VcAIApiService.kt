package com.vcai.commandcenter.network

import com.vcai.commandcenter.data.ChatRequest
import com.vcai.commandcenter.data.ChatResponse
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST
import java.util.concurrent.TimeUnit

interface VcAIApiService {

    @POST("/api/chat")
    suspend fun sendMessage(
        @Body request: ChatRequest
    ): Response<ChatResponse>

    companion object {
        // Default backend endpoint (can be configured in app settings)
        var BASE_URL = "https://ais-dev-nvsxrrtakmx4tta24qjbuw-145687362561.asia-east1.run.app/"

        fun create(baseUrl: String = BASE_URL): VcAIApiService {
            val logging = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            val client = OkHttpClient.Builder()
                .connectTimeout(60, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(60, TimeUnit.SECONDS)
                .addInterceptor(logging)
                .build()

            val normalizedUrl = if (baseUrl.endsWith("/")) baseUrl else "$baseUrl/"

            return Retrofit.Builder()
                .baseUrl(normalizedUrl)
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
                .create(VcAIApiService::class.java)
        }
    }
}
