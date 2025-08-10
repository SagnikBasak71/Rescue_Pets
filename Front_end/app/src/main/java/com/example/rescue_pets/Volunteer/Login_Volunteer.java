package com.example.rescue_pets.Volunteer;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.rescue_pets.R;
import com.google.android.material.textfield.TextInputEditText;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class Login_Volunteer extends AppCompatActivity {

    TextInputEditText volunteer_email_login, volunteer_password_login;

    Button volunteer_login_btn;
    TextView volunteer_forgot_password_login, volunteer_register;

    private static final String LOGIN_URL = "http://your_ip:3000/volunteer/login"; // 🔁 Replace with actual IP

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_volunteer);

        // Bind views
        volunteer_email_login = findViewById(R.id.volunteer_email_login);
        volunteer_password_login = findViewById(R.id.volunteer_password_login);

        volunteer_login_btn = findViewById(R.id.volunteer_login_btn);
        volunteer_forgot_password_login = findViewById(R.id.volunteer_forgot_password_login);
        volunteer_register = findViewById(R.id.volunteer_register);

        // Login Button
        volunteer_login_btn.setOnClickListener(v -> loginVolunteer());

        // Forgot Password Click
        volunteer_forgot_password_login.setOnClickListener(v -> {
            Intent intent = new Intent(Login_Volunteer.this, Forgot_Password_Volunteer.class);
            startActivity(intent);
        });

        // Register Click
        volunteer_register.setOnClickListener(v -> {
            Intent intent = new Intent(Login_Volunteer.this, Volunteer_Registration.class);
            startActivity(intent);
        });
    }

    private void loginVolunteer() {
        String email = volunteer_email_login.getText().toString().trim();
        String password = volunteer_password_login.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show();
            return;
        }

        StringRequest stringRequest = new StringRequest(Request.Method.POST, LOGIN_URL,
                response -> {
                    try {
                        JSONObject jsonResponse = new JSONObject(response);
                        boolean success = jsonResponse.getBoolean("success");
                        String message = jsonResponse.getString("message");

                        if (success) {
                            Toast.makeText(Login_Volunteer.this, "Login Successful", Toast.LENGTH_SHORT).show();
                            startActivity(new Intent(Login_Volunteer.this, Volunteer_Dashboard.class));
                            finish();
                        } else {
                            Toast.makeText(Login_Volunteer.this, message, Toast.LENGTH_SHORT).show();
                        }
                    } catch (JSONException e) {
                        e.printStackTrace();
                        Toast.makeText(Login_Volunteer.this, "Invalid response", Toast.LENGTH_SHORT).show();
                    }
                },
                error -> {
                    error.printStackTrace();
                    Toast.makeText(Login_Volunteer.this, "Login Failed: " + error.getMessage(), Toast.LENGTH_LONG).show();
                }) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("email", email);
                params.put("password", password);
                return params;
            }
        };

        RequestQueue requestQueue = Volley.newRequestQueue(this);
        requestQueue.add(stringRequest);
    }
}
