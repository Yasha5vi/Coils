package com.coils.demo.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievements {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "skills")
    private String skills;

    @Column(name = "certificateUrl")
    private String certificateUrl;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    @JsonBackReference
    private Profile profile;

    public Achievements() {
    }

    public Achievements(Long id,String title, String skills, String url, Profile profile) {
        this.id = id;
        this.title = title;
        this.skills = skills;
        this.certificateUrl = url;
        this.profile = profile;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getCertificateUrl() {
        return certificateUrl;
    }

    public void setCertificateUrl(String url) {
        this.certificateUrl = url;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    @Override
    public String toString() {
        return "Achievements{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", skills='" + skills + '\'' +
                ", url='" + certificateUrl + '\'' +
                ", profile=" + profile +
                '}';
    }
}
