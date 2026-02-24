package com.coils.demo.dto.hrai;


import java.util.List;

public class AiCandidateInput {
    private Long candidateUserId;
    private String username;
    private String email;
    private List<String> skills;
    private Integer experienceYears;
    private Integer cfRating;
    private Integer lcTotal;
    private Integer lcEasy;
    private Integer lcMedium;
    private Integer lcHard;
    private Integer ccStars;
    private Integer gfgTotal;
    private Integer projects;
    private Integer achievements;

    public Long getCandidateUserId() { return candidateUserId; }
    public void setCandidateUserId(Long candidateUserId) { this.candidateUserId = candidateUserId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public Integer getCfRating() { return cfRating; }
    public void setCfRating(Integer cfRating) { this.cfRating = cfRating; }
    public Integer getLcTotal() { return lcTotal; }
    public void setLcTotal(Integer lcTotal) { this.lcTotal = lcTotal; }
    public Integer getLcEasy() { return lcEasy; }
    public void setLcEasy(Integer lcEasy) { this.lcEasy = lcEasy; }
    public Integer getLcMedium() { return lcMedium; }
    public void setLcMedium(Integer lcMedium) { this.lcMedium = lcMedium; }
    public Integer getLcHard() { return lcHard; }
    public void setLcHard(Integer lcHard) { this.lcHard = lcHard; }
    public Integer getCcStars() { return ccStars; }
    public void setCcStars(Integer ccStars) { this.ccStars = ccStars; }
    public Integer getGfgTotal() { return gfgTotal; }
    public void setGfgTotal(Integer gfgTotal) { this.gfgTotal = gfgTotal; }
    public Integer getProjects() { return projects; }
    public void setProjects(Integer projects) { this.projects = projects; }
    public Integer getAchievements() { return achievements; }
    public void setAchievements(Integer achievements) { this.achievements = achievements; }
}
