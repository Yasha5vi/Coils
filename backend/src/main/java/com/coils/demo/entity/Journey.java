package com.coils.demo.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "journey")
public class Journey {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "fromStr")
    private LocalDate fromStr;

    @Column(name = "toStr")
    private LocalDate toStr;

    @Column(name = "title")
    private String title;

    @Column(name = "organization")
    private String organization;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JoinColumn(name = "profile_id")
    @JsonBackReference
    private Profile profile;

    public Journey() {

    }

    public Journey(Long id, LocalDate fromstr, LocalDate toStr, String title, String organization, String description, Profile profile) {
        this.id = id;
        this.fromStr = fromstr;
        this.toStr = toStr;
        this.title = title;
        this.organization = organization;
        this.description = description;
        this.profile = profile;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getFromStr() {
        return fromStr;
    }

    public void setFromStr(LocalDate fromstr) {
        this.fromStr = fromstr;
    }

    public LocalDate getToStr() {
        return toStr;
    }

    public void setToStr(LocalDate toStr) {
        this.toStr = toStr;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOrganization() {
        return organization;
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    @Override
    public String toString() {
        return "Journey{" +
                "id=" + id +
                ", fromStr=" + fromStr +
                ", toStr=" + toStr +
                ", title='" + title + '\'' +
                ", organization='" + organization + '\'' +
                ", description='" + description + '\'' +
                ", profile=" + profile +
                '}';
    }
}
