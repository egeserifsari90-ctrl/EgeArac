plugins { id("com.android.application") }

android {
    namespace = "com.egesarif.minecraftandroid"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.egesarif.minecraftandroid"
        minSdk = 23
        targetSdk = 35
        versionCode = 2
        versionName = "0.2.0"
        ndk { abiFilters += listOf("arm64-v8a") }
    }
}
