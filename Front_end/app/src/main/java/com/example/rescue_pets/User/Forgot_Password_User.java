package com.example.rescue_pets.User;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.rescue_pets.R;

import com.google.android.material.textfield.TextInputEditText;

public class Forgot_Password_User extends AppCompatActivity {

    TextInputEditText reset_email;
    Button send_reset_button;
    TextView back_to_login;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_forgot_password_user);

        // Handling window insets
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Linking UI components
        reset_email = findViewById(R.id.reset_email);
        send_reset_button = findViewById(R.id.send_reset_button);
        back_to_login = findViewById(R.id.back_to_login);

        // Go back to login screen on "Remember your password?" click
        back_to_login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Forgot_Password_User.this, User_Login_Activity.class);
                startActivity(intent);
                finish(); // Optional: finish this activity to prevent back stack
            }
        });

        // Add action for sending reset email (optional for now)
        send_reset_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = reset_email.getText().toString().trim();

                if (!email.isEmpty()) {
                    // TODO: Add your password reset logic here (e.g., Firebase)
                } else {
                    reset_email.setError("Please enter your email");
                }
            }
        });
    }
}
