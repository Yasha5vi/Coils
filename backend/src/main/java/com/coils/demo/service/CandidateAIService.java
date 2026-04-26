package com.coils.demo.service;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class CandidateAIService {

    private static final List<String> GOOD_KEYWORDS = Arrays.asList(
            "java", "spring", "react", "node", "sql", "aws",
            "microservices", "rest", "api", "machine learning"
    );

    public Map<String, Object> analyze(Map<String, Object> profile) {

        String resumeText = ((String) profile.getOrDefault("resumeText", "")).toLowerCase();
        String jobDesc = ((String) profile.getOrDefault("jobDescription", "")).toLowerCase();

        
        Set<String> resumeWords = new HashSet<>(Arrays.asList(resumeText.split("\\s+")));
        Set<String> jdWords = new HashSet<>(Arrays.asList(jobDesc.split("\\s+")));

        
        int matchedKeywords = 0;
        for (String keyword : GOOD_KEYWORDS) {
            if (resumeText.contains(keyword)) {
                matchedKeywords++;
            }
        }

        int atsScore = (matchedKeywords * 100) / GOOD_KEYWORDS.size();

      
        int jdMatches = 0;
        for (String word : jdWords) {
            if (resumeWords.contains(word)) {
                jdMatches++;
            }
        }

        int jdScore = jdWords.size() == 0 ? 0 : (jdMatches * 100) / jdWords.size();

        
        List<String> suggestions = new ArrayList<>();

        if (atsScore < 50) {
            suggestions.add("Improve technical keywords in your resume");
        }

        if (jdScore < 50) {
            suggestions.add("Align resume with job description keywords");
        }

        if (!resumeText.contains("project")) {
            suggestions.add("Add project experience");
        }

        if (!resumeText.contains("experience")) {
            suggestions.add("Mention work experience clearly");
        }

        if (resumeText.length() < 200) {
            suggestions.add("Increase resume content for better ATS ranking");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("ats_score", atsScore);
        result.put("jd_score", jdScore);
        result.put("suggestions", suggestions);

        return result;
    }
}
