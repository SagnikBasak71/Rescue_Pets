package com.example.rescue_pets.User;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.rescue_pets.R;
import com.google.android.material.textfield.TextInputEditText;

import java.util.HashMap;
import java.util.Map;

public class User_Login_Activity extends AppCompatActivity {

    TextInputEditText email_user_login, password_user_login;
    CheckBox remember_me_user_login;
    Button user_login_button;
    TextView forgot_password_user_login, register_text;
    ProgressDialog progressDialog;

    String LOGIN_URL = "http://10.57.255.57:4000/users/login";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_user_login);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        email_user_login = findViewById(R.id.email_user_login);
        password_user_login = findViewById(R.id.password_user_login);
        remember_me_user_login = findViewById(R.id.remember_me_user_login);
        user_login_button = findViewById(R.id.user_login_button);
        forgot_password_user_login = findViewById(R.id.forgot_password_user_login);
        register_text = findViewById(R.id.register_text);

        progressDialog = new ProgressDialog(this);

        user_login_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = email_user_login.getText().toString().trim();
                String password = password_user_login.getText().toString().trim();

                if (email.isEmpty() || password.isEmpty()) {
                    Toast.makeText(User_Login_Activity.this, "Please fill all fields", Toast.LENGTH_SHORT).show();
                    return;
                }

                loginUser(email, password);
            }
        });

        forgot_password_user_login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(User_Login_Activity.this, Forgot_Password_User.class);
                startActivity(intent);
            }
        });

        register_text.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(User_Login_Activity.this, User_Registration_Activity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    private void loginUser(String email, String password) {
        progressDialog.setMessage("Logging in...");
        progressDialog.show();

        StringRequest request = new StringRequest(Request.Method.POST, LOGIN_URL,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        progressDialog.dismiss();
                        Toast.makeText(User_Login_Activity.this, "Login Successful", Toast.LENGTH_SHORT).show();

                        // 👉 Go to Dashboard
                        Intent intent = new Intent(User_Login_Activity.this, Dash_Board_User.class);
                        intent.putExtra("user_email", email); // optional
                        startActivity(intent);
                        finish(); // optional: close login screen
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        progressDialog.dismiss();
                        Toast.makeText(User_Login_Activity.this, "Error: " + error.toString(), Toast.LENGTH_LONG).show();
                    }
                }) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("email", email);
                params.put("password", password);
                return params;
            }
        };

        RequestQueue queue = Volley.newRequestQueue(User_Login_Activity.this);
        queue.add(request);
    }
}
