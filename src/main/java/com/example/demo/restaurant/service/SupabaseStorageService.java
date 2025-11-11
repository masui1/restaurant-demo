package com.example.demo.restaurant.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SupabaseStorageService {

	@Value("${supabase.url}")
	private String supabaseUrl;

	@Value("${supabase.key}")
	private String supabaseKey;

	@Value("${supabase.bucket}")
	private String supabaseBucket;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Supabase Storage に画像をアップロードし、公開URLを返す
     */
    public String uploadFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Upload API endpoint
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + supabaseBucket + "/" + fileName;

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + supabaseKey);
        headers.set("apikey", supabaseKey);
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        HttpEntity<byte[]> entity = new HttpEntity<>(file.getBytes(), headers);
        ResponseEntity<String> response = restTemplate.exchange(uploadUrl, HttpMethod.POST, entity, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new IOException("Supabase upload failed: " + response.getStatusCode());
        }

        // Supabase Public URL
        return supabaseUrl + "/storage/v1/object/public/" + supabaseBucket + "/" + fileName;
    }
}
