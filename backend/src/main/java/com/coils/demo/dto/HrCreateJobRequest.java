package com.coils.demo.dto;

public class HrCreateJobRequest {
    private String title;
    private String description;
    private String requiredSkills;
    private Integer minExperienceYears;
    private String location;

    public HrCreateJobRequest() {}

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }
    public Integer getMinExperienceYears() { return minExperienceYears; }
    public void setMinExperienceYears(Integer minExperienceYears) { this.minExperienceYears = minExperienceYears; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
}
