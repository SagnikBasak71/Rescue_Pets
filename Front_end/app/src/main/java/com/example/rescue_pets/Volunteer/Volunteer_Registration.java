package com.example.rescue_pets.Volunteer;

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

public class Volunteer_Registration extends AppCompatActivity {

    EditText vol_name, vol_email, vol_password, vol_contact, vol_address;
    Button vol_register_button;
    TextView already_have_an_acc_vol;

    String URL = "http://10.100.144.57:4000/volunteers/register"; // Replace with your backend API

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_volunteer_registration);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        vol_name = findViewById(R.id.vol_name);
        vol_email = findViewById(R.id.vol_email);
        vol_password = findViewById(R.id.vol_password);
        vol_contact = findViewById(R.id.vol_contact);
        vol_address = findViewById(R.id.vol_address);
        vol_register_button = findViewById(R.id.vol_register_button);
        already_have_an_acc_vol = findViewById(R.id.already_have_an_acc_vol);

        vol_register_button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String vn = vol_name.getText().toString().trim();
                String ve = vol_email.getText().toString().trim();
                String vp = vol_password.getText().toString().trim();
                String vc = vol_contact.getText().toString().trim();
                String va = vol_address.getText().toString().trim();

                if (vn.isEmpty() || ve.isEmpty() || vp.isEmpty() || vc.isEmpty() || va.isEmpty()) {
                    Toast.makeText(getApplicationContext(), "Please fill all fields", Toast.LENGTH_SHORT).show();
                    return;
                }

                registerVolunteer(vn, ve, vp, vc, va);
            }
        });
    }

    private void registerVolunteer(String name, String email, String password, String contact, String address) {
        StringRequest request = new StringRequest(Request.Method.POST, URL,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        Toast.makeText(getApplicationContext(), "Registration Successful", Toast.LENGTH_SHORT).show();
                        // Optionally finish activity or clear form
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        Toast.makeText(getApplicationContext(), "Registration Failed: " + error.toString(), Toast.LENGTH_LONG).show();
                    }
                }) {
            @Override
            protected Map<String, String> getParams() {
                Map<String, String> params = new HashMap<>();
                params.put("name", name);
                params.put("email", email);
                params.put("password", password);
                params.put("contact", contact);
                params.put("location", address);
                return params;
            }
        };

        RequestQueue queue = Volley.newRequestQueue(getApplicationContext());
        queue.add(request);
    }
}
