package com.example.rescue_pets;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;


import com.example.rescue_pets.Admin.Admin_Login;
import com.example.rescue_pets.Volunteer.Login_Volunteer;
import com.google.android.material.card.MaterialCardView;

import com.example.rescue_pets.User.User_Login_Activity;


public class ChooseActiity extends AppCompatActivity {

    MaterialCardView card_user,card_volunteer, card_admin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_choose_actiity);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        card_user = findViewById(R.id.card_user);


        card_user.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ChooseActiity.this, User_Login_Activity.class);
                startActivity(intent);
            }
        });
        card_volunteer = findViewById(R.id.card_volunteer);
        card_volunteer.setOnClickListener(v -> {
            Intent intent = new Intent(ChooseActiity.this, Login_Volunteer.class);
            startActivity(intent);
        });
        card_admin = findViewById(R.id.card_admin);
        card_admin.setOnClickListener(v -> {
            Intent intent = new Intent(ChooseActiity.this, Admin_Login.class);
            startActivity(intent);
        });
    }
}