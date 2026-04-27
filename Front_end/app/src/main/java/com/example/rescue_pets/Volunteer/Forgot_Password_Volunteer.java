package com.example.rescue_pets.Volunteer;

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
import com.example.rescue_pets.Volunteer.Login_Volunteer;
import com.google.android.material.textfield.TextInputEditText;

public class Forgot_Password_Volunteer extends AppCompatActivity {

    TextInputEditText reset_email;
    Button send_reset_button;
    TextView back_to_login;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_forgot_password_user);

        // Handling edge insets
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Initialize views
        reset_email = findViewById(R.id.reset_email);
        send_reset_button = findViewById(R.id.send_reset_button);
        back_to_login = findViewById(R.id.back_to_login);

        // Go back to Login screen
        back_to_login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Forgot_Password_Volunteer.this, Forgot_Password_Volunteer.class);
                startActivity(intent);
                finish(); // optional, to close current screen
            }
        });
    }
}
