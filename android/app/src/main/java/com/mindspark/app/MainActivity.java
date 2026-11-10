package com.mindspark.app;

import android.accounts.AccountManager;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import com.getcapacitor.BridgeActivity;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {
    private ActivityResultLauncher<Intent> accountPickerLauncher;
    private String pendingMode = "fill";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        accountPickerLauncher = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            result -> {
                if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                    String accountName = result.getData().getStringExtra(AccountManager.KEY_ACCOUNT_NAME);
                    if (accountName != null && !accountName.isEmpty()) {
                        sendAccountToWebView(accountName, pendingMode);
                    } else {
                        sendCancelToWebView();
                    }
                } else {
                    sendCancelToWebView();
                }
            }
        );

        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().addJavascriptInterface(new NativeAccountBridge(), "MindSparkNative");
        }
    }

    private void sendAccountToWebView(String email, String mode) {
        if (this.bridge == null || this.bridge.getWebView() == null) return;
        WebView webView = this.bridge.getWebView();
        webView.post(() -> {
            try {
                JSONObject payload = new JSONObject();
                payload.put("email", email);
                payload.put("mode", mode);
                String js = "window.dispatchEvent(new CustomEvent('mindspark:native-gmail', { detail: " + payload.toString() + " }));";
                webView.evaluateJavascript(js, null);
            } catch (Exception ignored) {}
        });
    }

    private void sendCancelToWebView() {
        if (this.bridge == null || this.bridge.getWebView() == null) return;
        WebView webView = this.bridge.getWebView();
        webView.post(() -> {
            String js = "window.dispatchEvent(new CustomEvent('mindspark:native-gmail-cancel'));";
            webView.evaluateJavascript(js, null);
        });
    }

    public class NativeAccountBridge {
        @JavascriptInterface
        public void pickGoogleAccount(String mode) {
            pendingMode = (mode != null && !mode.isEmpty()) ? mode : "fill";
            runOnUiThread(() -> {
                try {
                    @SuppressWarnings("deprecation")
                    Intent intent = AccountManager.newChooseAccountIntent(
                        null,
                        null,
                        new String[]{"com.google"},
                        false,
                        null,
                        null,
                        null,
                        null
                    );
                    accountPickerLauncher.launch(intent);
                } catch (Exception e) {
                    sendCancelToWebView();
                }
            });
        }
    }
}
