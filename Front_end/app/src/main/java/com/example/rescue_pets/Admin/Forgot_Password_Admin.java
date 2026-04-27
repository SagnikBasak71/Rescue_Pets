package com.example.rescue_pets.Admin;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.rescue_pets.R;
import com.google.android.material.textfield.TextInputEditText;

public class Forgot_Password_Admin extends AppCompatActivity {

    TextInputEditText reset_email_admin;
    Button send_reset_button_admin;
    TextView back_to_login_admin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.forgot_password_admin);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Initialize views
        reset_email_admin = findViewById(R.id.reset_email_admin);
        send_reset_button_admin = findViewById(R.id.send_reset_button_admin);
        back_to_login_admin = findViewById(R.id.back_to_login_admin);

        // Set click listener to go back to login screen
        back_to_login_admin.setOnClickListener(v -> {
            Intent intent = new Intent(Forgot_Password_Admin.this, Admin_Login.class);
            startActivity(intent);
            finish(); // Optional: prevent going back to forgot screen via back button
        });
    }
}
