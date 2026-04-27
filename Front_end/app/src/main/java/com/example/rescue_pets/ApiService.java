package com.example.rescue_pets;

import okhttp3.MultipartBody;
import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Multipart;
import retrofit2.http.POST;
import retrofit2.http.Part;

// ApiService.java
public interface ApiService {
    @Multipart
    @POST("/api/volunteer/rescue")
    Call<ResponseBody> uploadImage(@Part MultipartBody.Part image);
}
