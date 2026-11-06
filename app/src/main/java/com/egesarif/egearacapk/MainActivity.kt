package com.egesarif.egearacapk

import android.app.Activity
import android.os.Bundle
import android.content.Intent
import android.net.Uri
import android.view.Gravity
import android.widget.*
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import com.android.apksig.ApkSigner
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.math.BigInteger
import java.security.KeyPairGenerator
import java.security.KeyStore
import java.security.PrivateKey
import java.security.cert.X509Certificate
import java.util.Calendar
import javax.security.auth.x500.X500Principal

class MainActivity : Activity() {
    private val pickApk = 10
    private val saveApk = 11
    private var sourceUri: Uri? = null
    private var tempSigned: File? = null
    private lateinit var status: TextView
    private lateinit var chooseButton: Button
    private lateinit var signButton: Button
    private val alias = "EgeAracAPK_SigningKey"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(28, 36, 28, 28)
            gravity = Gravity.CENTER_HORIZONTAL
        }
        val title = TextView(this).apply {
            text = "EgeAraçAPK"
            textSize = 28f
        }
        val info = TextView(this).apply {
            text = "APK imzalama aracı\\n\\nBir APK seç, cihazında imzalama anahtarı oluştur ve imzalı kopyayı kaydet. Orijinal dosya değiştirilmez."
            textSize = 16f
            setPadding(0, 20, 0, 24)
        }
        chooseButton = Button(this).apply {
            text = "APK SEÇ"
            setOnClickListener {
                val i = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "application/vnd.android.package-archive"
                }
                startActivityForResult(i, pickApk)
            }
        }
        signButton = Button(this).apply {
            text = "İMZALA VE KAYDET"
            isEnabled = false
            setOnClickListener { signSelectedApk() }
        }
        status = TextView(this).apply {
            text = "Henüz APK seçilmedi."
            textSize = 14f
            setPadding(0, 22, 0, 0)
        }
        root.addView(title)
        root.addView(info)
        root.addView(chooseButton)
        root.addView(signButton)
        root.addView(status)
        setContentView(root)
    }

    @Deprecated("Deprecated in Android API; kept for broad device compatibility")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (resultCode != Activity.RESULT_OK || data?.data == null) return
        if (requestCode == pickApk) {
            sourceUri = data.data
            signButton.isEnabled = true
            status.text = "APK seçildi: ${sourceUri?.lastPathSegment ?: "dosya"}"
            try { contentResolver.takePersistableUriPermission(data.data!!, Intent.FLAG_GRANT_READ_URI_PERMISSION) } catch (_: Exception) {}
        } else if (requestCode == saveApk) {
            val uri = data.data!!
            try {
                contentResolver.openOutputStream(uri)?.use { out ->
                    FileInputStream(tempSigned!!).use { input -> input.copyTo(out) }
                } ?: throw Exception("Kaydetme hedefi açılamadı")
                status.text = "İmzalı APK kaydedildi. Kurulumdan önce imza anahtarını güvenli sakla."
            } catch (e: Exception) {
                status.text = "Kaydetme hatası: ${e.message}"
            }
        }
    }

    private fun signSelectedApk() {
        val uri = sourceUri ?: return
        signButton.isEnabled = false
        status.text = "APK imzalanıyor…"
        Thread {
            try {
                val input = File(cacheDir, "input.apk")
                contentResolver.openInputStream(uri)!!.use { src -> FileOutputStream(input).use { src.copyTo(it) } }
                val output = File(cacheDir, "signed-${System.currentTimeMillis()}.apk")
                val (privateKey, certificate) = getOrCreateSigningKey()
                val signer = ApkSigner.SignerConfig.Builder("EgeAraçAPK", privateKey, listOf(certificate)).build()
                ApkSigner.Builder(listOf(signer))
                    .setInputApk(input)
                    .setOutputApk(output)
                    .setV1SigningEnabled(true)
                    .setV2SigningEnabled(true)
                    .setV3SigningEnabled(true)
                    .build()
                    .sign()
                tempSigned = output
                runOnUiThread {
                    status.text = "İmzalama tamamlandı. İmzalı APK'yı kaydetmek için konum seç."
                    val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                        addCategory(Intent.CATEGORY_OPENABLE)
                        type = "application/vnd.android.package-archive"
                        putExtra(Intent.EXTRA_TITLE, "EgeAracAPK-imzali.apk")
                    }
                    startActivityForResult(intent, saveApk)
                    signButton.isEnabled = true
                }
            } catch (e: Exception) {
                runOnUiThread {
                    status.text = "İmzalama başarısız: ${e.message}"
                    signButton.isEnabled = true
                }
            }
        }.start()
    }

    private fun getOrCreateSigningKey(): Pair<PrivateKey, X509Certificate> {
        val ks = KeyStore.getInstance("AndroidKeyStore").apply { load(null) }
        if (!ks.containsAlias(alias)) {
            val start = Calendar.getInstance()
            val end = Calendar.getInstance().apply { add(Calendar.YEAR, 25) }
            val spec = KeyGenParameterSpec.Builder(
                alias, KeyProperties.PURPOSE_SIGN or KeyProperties.PURPOSE_VERIFY
            )
                .setKeySize(2048)
                .setDigests(KeyProperties.DIGEST_SHA256, KeyProperties.DIGEST_SHA512)
                .setSignaturePaddings(KeyProperties.SIGNATURE_PADDING_RSA_PKCS1)
                .setCertificateSubject(X500Principal("CN=EgeAracAPK"))
                .setCertificateSerialNumber(BigInteger.ONE)
                .setCertificateNotBefore(start.time)
                .setCertificateNotAfter(end.time)
                .build()
            KeyPairGenerator.getInstance(KeyProperties.KEY_ALGORITHM_RSA, "AndroidKeyStore").apply {
                initialize(spec)
                generateKeyPair()
            }
        }
        val key = ks.getKey(alias, null) as PrivateKey
        val cert = ks.getCertificate(alias) as X509Certificate
        return Pair(key, cert)
    }
}
