package com.coils.demo.dto.hrai;

import java.util.List;

public class AiJobInput {
    private Long jobId;
    private String title;
    private String description;
    private List<String> requiredSkills;
    private Integer minExperienceYears;
    private String location;
    private String experienceLevel;
    private Integer minCfRating;
    private Integer minLcProblems;

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }
    public Integer getMinExperienceYears() { return minExperienceYears; }
    public void setMinExperienceYears(Integer minExperienceYears) { this.minExperienceYears = minExperienceYears; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }
    public Integer getMinCfRating() { return minCfRating; }
    public void setMinCfRating(Integer minCfRating) { this.minCfRating = minCfRating; }
    public Integer getMinLcProblems() { return minLcProblems; }
    public void setMinLcProblems(Integer minLcProblems) { this.minLcProblems = minLcProblems; }
}
