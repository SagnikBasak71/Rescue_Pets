package com.example.rescue_pets.Admin;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.android.volley.DefaultRetryPolicy;
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

public class Admin_Login extends AppCompatActivity {

    TextInputEditText admin_email, admin_password;
    Button admin_login_btn;
    ProgressDialog progressDialog;
    TextView admin_forget_password_;

    String LOGIN_URL = "http://192.168.0.101:4000/admins/login"; // Replace with your real API endpoint

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_admin_login);

        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        // Initialize views
        admin_email = findViewById(R.id.admin_email);
        admin_password = findViewById(R.id.admin_password);
        admin_login_btn = findViewById(R.id.admin_login_btn);
        admin_forget_password_ = findViewById(R.id.admin_forget_password);

        // Login button click
        admin_login_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String email = admin_email.getText().toString().trim();
                String password = admin_password.getText().toString().trim();

                if (email.isEmpty() || password.isEmpty()) {
                    Toast.makeText(Admin_Login.this, "Please fill all fields", Toast.LENGTH_SHORT).show();
                } else {
                    loginAdmin(email, password);
                }
            }
        });

        // Forgot password click -> open Admin_ForgotPassword screen
        admin_forget_password_.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(Admin_Login.this, Forgot_Password_Admin.class);
                startActivity(intent);
            }
        });
    }

    private void loginAdmin(String email, String password) {
        progressDialog = new ProgressDialog(this);
        progressDialog.setMessage("Logging in...");
        progressDialog.show();

        StringRequest request = new StringRequest(Request.Method.POST, LOGIN_URL,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        progressDialog.dismiss();
                        Toast.makeText(Admin_Login.this, "Admin Login Successful", Toast.LENGTH_SHORT).show();
                        // TODO: Navigate to Admin Dashboard
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        progressDialog.dismiss();
                        error.printStackTrace();
                        Toast.makeText(Admin_Login.this, "Login Failed: " + error.toString(), Toast.LENGTH_LONG).show();
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

        request.setRetryPolicy(new DefaultRetryPolicy(
                10000,
                DefaultRetryPolicy.DEFAULT_MAX_RETRIES,
                DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));

        RequestQueue queue = Volley.newRequestQueue(Admin_Login.this);
        queue.add(request);
    }
}
