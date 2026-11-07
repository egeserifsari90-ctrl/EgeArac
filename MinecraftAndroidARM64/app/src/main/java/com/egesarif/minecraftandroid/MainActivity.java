package com.egesarif.minecraftandroid;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

/** Original companion app; contains no Mojang game code. */
public class MainActivity extends Activity {
    private static final String MC = "com.mojang.minecraftpe";
    private TextView status;
    private int dp(float v) { return (int)(v * getResources().getDisplayMetrics().density + .5f); }
    private TextView label(String s, int size) {
        TextView t = new TextView(this); t.setText(s); t.setTextSize(size); t.setTextColor(Color.WHITE);
        t.setGravity(Gravity.CENTER); t.setPadding(dp(12), dp(12), dp(12), dp(12)); return t;
    }
    private Button action(String s, Runnable r) {
        Button b = new Button(this); b.setText(s); b.setAllCaps(false); b.setOnClickListener(v -> r.run()); return b;
    }
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        LinearLayout root = new LinearLayout(this); root.setOrientation(1); root.setGravity(Gravity.CENTER);
        root.setPadding(dp(20), dp(24), dp(20), dp(24)); root.setBackgroundColor(Color.rgb(20, 43, 27));
        root.addView(label("EGE MINECRAFT", 26)); root.addView(label("Android ARM64 Companion", 15));
        status = label("", 15); root.addView(status);
        root.addView(action("Uyumluluğu kontrol et", this::refresh));
        root.addView(action("Yüklü Minecraft'ı aç", this::launchMinecraft));
        root.addView(label("Bu yardımcı uygulama Minecraft oyun motorunu içermez. Linux x86-64 dosyasını Android'e dönüştürmez. Resmî Android Minecraft kurulumunu açabilir.", 13));
        setContentView(root); refresh();
    }
    private boolean installed() {
        try {
            if (Build.VERSION.SDK_INT >= 33) getPackageManager().getPackageInfo(MC, PackageManager.PackageInfoFlags.of(0));
            else getPackageManager().getPackageInfo(MC, 0);
            return true;
        } catch (PackageManager.NameNotFoundException e) { return false; }
    }
    private void refresh() {
        StringBuilder s = new StringBuilder("Android ").append(Build.VERSION.RELEASE).append(" / API ").append(Build.VERSION.SDK_INT).append("\nABI: ");
        for (int i = 0; i < Build.SUPPORTED_ABIS.length; i++) { if (i > 0) s.append(", "); s.append(Build.SUPPORTED_ABIS[i]); }
        boolean arm64 = false; for (String abi : Build.SUPPORTED_ABIS) if ("arm64-v8a".equals(abi)) arm64 = true;
        s.append("\nARM64 cihaz desteği: ").append(arm64 ? "Var" : "Yok").append("\nMinecraft kurulu: ").append(installed() ? "Evet" : "Hayır");
        status.setText(s.toString());
    }
    private void launchMinecraft() {
        Intent i = getPackageManager().getLaunchIntentForPackage(MC);
        if (i == null) { status.setText(status.getText() + "\nMinecraft bulunamadı; resmî Android sürümünü yükle."); return; }
        startActivity(i);
    }
}
