# Ege Minecraft Android Companion (ARM64)

Original Android Java companion app. It checks the device ABI and can launch the official Android Minecraft package when installed. It is not Minecraft and does not translate or execute the supplied Linux binary.

## Build
Open this folder in Android Studio or run `:app:assembleDebug`. GitHub Actions builds and uploads a debug APK automatically.

## Limitations
The supplied Linux x86-64 executable is not Android ARM64 code. A real port needs the original launcher source and Android-compatible dependencies. The app only inspects device compatibility and launches an already-installed official Minecraft app.
