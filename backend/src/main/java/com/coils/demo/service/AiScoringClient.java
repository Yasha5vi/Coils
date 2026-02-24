package com.coils.demo.service;

import com.coils.demo.dto.hrai.AiScoreBatchRequest;
import com.coils.demo.dto.hrai.AiScoreBatchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AiScoringClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.service.url:http://localhost:8000}")
    private String aiServiceUrl;

    public AiScoreBatchResponse scoreBatch(AiScoreBatchRequest request) {
        String url = aiServiceUrl + "/score-batch";
        ResponseEntity<AiScoreBatchResponse> response =
                restTemplate.postForEntity(url, request, AiScoreBatchResponse.class);
        return response.getBody();
    }
}
