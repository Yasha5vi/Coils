package com.coils.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "projects")
public class Projects {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "techStack")
    private String techStack;

    @Column(name = "githubUrl")
    private String githubUrl;

    @Column(name = "description")
    private String description;

    @Column(name = "toStr")
    private LocalDate toStr;

    @Column(name = "fromStr")
    private LocalDate fromStr;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    @JsonBackReference
    private Profile profile;

    public Projects() {
    }

    public Projects(Long id, String title, String techStack, String githubUrl, String description, LocalDate toStr, LocalDate fromStr, Profile profile) {
        this.id = id;
        this.title = title;
        this.techStack = techStack;
        this.githubUrl = githubUrl;
        this.description = description;
        this.toStr = toStr;
        this.fromStr = fromStr;
        this.profile = profile;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public Profile getProfile() {
        return profile;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTechStack() {
        return techStack;
    }

    public void setTechStack(String techStack) {
        this.techStack = techStack;
    }

    public String getGithubUrl() {
        return githubUrl;
    }

    public void setGithubUrl(String githubUrl) {
        this.githubUrl = githubUrl;
    }

    public LocalDate getToStr() {
        return toStr;
    }

    public void setToStr(LocalDate toStr) {
        this.toStr = toStr;
    }

    public LocalDate getFromStr() {
        return fromStr;
    }

    public void setFromStr(LocalDate fromStr) {
        this.fromStr = fromStr;
    }

    @Override
    public String toString() {
        return "Projects{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", techStack='" + techStack + '\'' +
                ", githubUrl='" + githubUrl + '\'' +
                ", description='" + description + '\'' +
                ", toStr='" + toStr + '\'' +
                ", fromStr='" + fromStr + '\'' +
                ", profile=" + profile +
                '}';
    }
}


