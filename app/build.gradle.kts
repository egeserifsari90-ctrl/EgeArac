plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}
android {
    namespace = "com.egesarif.egearacapk"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.egesarif.egearacapk"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"
    }
}
dependencies {
    implementation("com.android.tools.build:apksig:8.7.3")
}
