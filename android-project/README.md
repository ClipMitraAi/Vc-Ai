# VC AI Command Center — Native Android App (Kotlin & Jetpack Compose)

Yeh VC AI ka official Native Android Studio project hai, jo Google ke modern **Jetpack Compose**, **Kotlin Coroutines**, aur **Retrofit 2** architecture par banaya gaya hai.

---

## 🚀 APK Build Karne Ke Kadam (How to Build APK)

### 1. Android Studio Mein Open Karein:
1. Apne computer par [Android Studio Iguana / Jellyfish / Koala](https://developer.android.com/studio) open karein.
2. **File > Open** par click karein aur is unzipped folder (`android-project`) ko select karein.
3. Gradle sync automatically start ho jayega. (Internet connection zaroori hai pehle sync ke liye).

### 2. Debug APK Generate Karein (1-Click Build):
1. Android Studio ke top menu mein **Build** par click karein.
2. **Build Bundle(s) / APK(s) > Build APK(s)** chunein.
3. Kuch hi seconds mein build complete ho jayegi aur niche ek notification aayega: `APK(s) generated successfully`.
4. **locate** par click karein. Aapko file mil jayegi:
   `app/build/outputs/apk/debug/app-debug.apk`

### 3. Signed Release APK Banana (Play Store & Direct Share ke liye):
1. **Build > Generate Signed Bundle / APK...** par click karein.
2. **APK** select karein aur **Next** dabayein.
3. Apni Keystore create karein ya existing select karein.
4. **release** build variant chunein aur **Finish** dabayein.
5. Aapki signed release APK taiyar ho jayegi:
   `app/build/outputs/apk/release/app-release.apk`

---

## 📱 Android Mobile Mein Install Karne Ke Instructions:
1. `app-debug.apk` ya `app-release.apk` ko WhatsApp, Google Drive, ya USB cable se apne Android phone mein transfer karein.
2. Phone ke File Manager mein jaakar APK file par tap karein.
3. Agar prompt aaye, toh **"Install from unknown sources"** allow karein.
4. **Install** dabayein aur app open karein!

---

## 🛡️ Security & API Keys:
- Is Native App mein koi bhi Gemini API key hardcode nahi ki gayi hai.
- Yeh app direct backend API proxy ke sath secure HTTPS connection se communicate karta hai.
- Aapki API keys cloud server mein surakshit rehti hain.

---

## ⚡ Instant Mobile Install (Bina Computer Ke):
Aap is web version ko bhi direct apne Android mobile ke Chrome browser se **"Install App"** ya **"Add to Home Screen"** karke turant native app ki tarah chala sakte hain!
