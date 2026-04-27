package com.example.rescue_pets.User;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
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

import java.util.HashMap;
import java.util.Map;

public class User_Registration_Activity extends AppCompatActivity {

    EditText user_name, user_email, user_passsword, user_contact, user_location;
    Button user_register_button;
    TextView already_have_an_acc_user;
    ProgressDialog progressDialog;

    String URL = "http://192.168.0.101:4000/users/register";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_user_registration);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        user_name = findViewById(R.id.user_name);
        user_email = findViewById(R.id.user_email);
        user_passsword = findViewById(R.id.user_password);
        user_contact = findViewById(R.id.user_contact);
        user_location = findViewById(R.id.user_location);
        user_register_button = findViewById(R.id.user_register_button);
        already_have_an_acc_user = findViewById(R.id.already_have_an_acc_user);

        user_register_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String un = user_name.getText().toString().trim();
                String ue = user_email.getText().toString().trim();
                String up = user_passsword.getText().toString().trim();
                String uc = user_contact.getText().toString().trim();
                String ul = user_location.getText().toString().trim();

                if (un.isEmpty() || ue.isEmpty() || up.isEmpty() || uc.isEmpty() || ul.isEmpty()) {
                    Toast.makeText(getApplicationContext(), "Please fill all fields", Toast.LENGTH_SHORT).show();
                    return;
                }

                registerUser(un, ue, up, uc, ul);
            }
        });

        already_have_an_acc_user.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(User_Registration_Activity.this, User_Login_Activity.class);
                startActivity(intent);
                finish();
            }
        });
    }

    private void registerUser(String name, String email, String password, String contact, String location) {
        StringRequest request = new StringRequest(Request.Method.POST, URL,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Toast.makeText(getApplicationContext(), "User Registered Successfully", Toast.LENGTH_SHORT).show();
                        // Optionally go to login directly
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(getApplicationContext(), "Error: " + error.toString(), Toast.LENGTH_LONG).show();
                    }
                }) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("name", name);
                params.put("email", email);
                params.put("password", password);
                params.put("contact", contact);
                params.put("location", location);
                return params;
            }
        };

        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        queue.add(request);
    }
}
