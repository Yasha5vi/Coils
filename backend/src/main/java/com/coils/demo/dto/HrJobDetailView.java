package com.coils.demo.dto;

import com.coils.demo.entity.JobStatus;
import java.time.LocalDateTime;

public class HrJobDetailView {
    private Long id;
    private String title;
    private String description;
    private String requiredSkills;
    private Integer minExperienceYears;
    private String location;
    private JobStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public HrJobDetailView() {}

    public HrJobDetailView(Long id, String title, String description, String requiredSkills,
                           Integer minExperienceYears, String location, JobStatus status,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.requiredSkills = requiredSkills;
        this.minExperienceYears = minExperienceYears;
        this.location = location;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getRequiredSkills() { return requiredSkills; }
    public Integer getMinExperienceYears() { return minExperienceYears; }
    public String getLocation() { return location; }
    public JobStatus getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
