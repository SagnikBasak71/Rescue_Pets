package com.example.rescue_pets.Volunteer;

import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import com.example.rescue_pets.ApiClient;
import com.example.rescue_pets.ApiService;
import com.example.rescue_pets.R;
import com.google.android.material.textfield.TextInputEditText;


import java.io.File;

import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.RequestBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class Rescue_Field_Acivity extends AppCompatActivity {

    private static final int PICK_IMAGE_REQUEST = 1;

    TextInputEditText PetType,PetDescription,PetAddress;
    Button btnUploadPet,btnSubmitPet;
    ImageView imagePreview;

    String url_link = "http://10.255.138.57:4000/api/volunteers/rescue";


    private Uri imageUri;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_rescue_field_acivity);

        // Initialize views
        PetType = findViewById(R.id.PetType);
        PetDescription = findViewById(R.id.PetDescription);
        PetAddress = findViewById(R.id.PetAddress);
        imagePreview = findViewById(R.id.imagePreview);
        btnUploadPet = findViewById(R.id.btnUploadPet);
        btnSubmitPet = findViewById(R.id.btnSubmitPet);

        // Open gallery
        btnUploadPet.setOnClickListener(v -> chooseImage());

        // Submit (upload) image
        btnSubmitPet.setOnClickListener(v -> {
            if (imageUri != null) {
                uploadImageToServer();
            } else {
                Toast.makeText(this, "Please select an image first", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void chooseImage() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("image/*");
        startActivityForResult(intent, PICK_IMAGE_REQUEST);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == PICK_IMAGE_REQUEST && resultCode == RESULT_OK && data != null && data.getData() != null) {
            imageUri = data.getData();
            imagePreview.setImageURI(imageUri);
            imagePreview.setVisibility(ImageView.VISIBLE);
        }
    }

    private String getRealPathFromURI(Uri uri) {
        String[] projection = {MediaStore.Images.Media.DATA};
        Cursor cursor = getContentResolver().query(uri, projection, null, null, null);
        if (cursor == null) return null;
        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();
        String filePath = cursor.getString(column_index);
        cursor.close();
        return filePath;
    }

    private void uploadImageToServer() {
        String filePath = getRealPathFromURI(imageUri);
        if (filePath == null) {
            Toast.makeText(this, "Unable to get image path", Toast.LENGTH_SHORT).show();
            return;
        }

        File file = new File(filePath);
        RequestBody requestFile = RequestBody.create(MediaType.parse("image/*"), file);
        MultipartBody.Part imagePart = MultipartBody.Part.createFormData("image", file.getName(), requestFile);

        ApiService apiService = ApiClient.getClient().create(ApiService.class);
        apiService.uploadImage(imagePart).enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(Rescue_Field_Acivity.this, "Image uploaded successfully!", Toast.LENGTH_SHORT).show();
                    Log.d("UPLOAD", "Response: " + response.message());
                } else {
                    Toast.makeText(Rescue_Field_Acivity.this, "Upload failed: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(Rescue_Field_Acivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e("UPLOAD", "Error: ", t);
            }
        });
    }
}
