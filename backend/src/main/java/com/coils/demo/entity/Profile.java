package com.coils.demo.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "user_profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "codeforces")
    private String codeforcesHandle;

    @Column(name = "leetcode")
    private String leetcodeHandle;

    @Column(name = "codechef")
    private String codechefHandle;

    @Column(name = "geeksforgeeks")
    private String geeksforgeeksHandle;

    @Column(name = "coils")
    private String coilsHandle;

    @Column(name = "bio")
    private String bio;

    @Column(name = "about")
    private String about;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Achievements> achievements = new ArrayList<>();

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Journey> journey = new ArrayList<>();

    @Column(name = "skills", columnDefinition = "TEXT")
    private String skills; // JSON array

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Projects> projects = new ArrayList<>();

    @Column(name = "education", columnDefinition = "TEXT")
    private String education; // JSON array

    @Column(name = "experience", columnDefinition = "TEXT")
    private String experience; // JSON array

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private String phone;

    @Column(name = "linkedin")
    private String linkedin;

    @Column(name = "github")
    private String github;

    // One-to-one relationship with User
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true) // unique ensures one profile per user
    @JsonBackReference
    private User user;

    @Column(name = "platform_data_json", columnDefinition = "jsonb")
    @JdbcTypeCode(SqlTypes.JSON)
    private JsonNode platformDataJson;


    public Profile(){

    }

    public Profile(Long id, String firstName, String lastName, String codeforcesHandle,
                   String leetcodeHandle, String codechefHandle, String geeksforgeeksHandle,
                   String coilsHandle, String bio, String about, List<Achievements> achievements,
                   List<Journey> journey, String skills, List<Projects> projects, String education,
                   String experience, String email, String phone, String linkedin, String github,
                   User user,JsonNode platformDataJson) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.codeforcesHandle = codeforcesHandle;
        this.leetcodeHandle = leetcodeHandle;
        this.codechefHandle = codechefHandle;
        this.geeksforgeeksHandle = geeksforgeeksHandle;
        this.coilsHandle = coilsHandle;
        this.bio = bio;
        this.about = about;
        this.achievements = achievements;
        this.journey = journey;
        this.skills = skills;
        this.projects = projects;
        this.education = education;
        this.experience = experience;
        this.email = email;
        this.phone = phone;
        this.linkedin = linkedin;
        this.github = github;
        this.user = user;
        this.platformDataJson = platformDataJson;
    }

    // getters and setters...



    public Long getId(){
        return id;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getCodeforcesHandle() {
        return codeforcesHandle;
    }

    public void setCodeforcesHandle(String codeforces) {
        this.codeforcesHandle = codeforces;
    }

    public String getLeetcodeHandle() {
        return leetcodeHandle;
    }

    public void setLeetcodeHandle(String leetcode) {
        this.leetcodeHandle = leetcode;
    }

    public String getCodechefHandle() {
        return codechefHandle;
    }

    public void setCodechefHandle(String codechef) {
        this.codechefHandle = codechef;
    }

    public String getGeeksforgeeksHandle() {
        return geeksforgeeksHandle;
    }

    public void setGeeksforgeeksHandle(String geeksforgeeks) {
        this.geeksforgeeksHandle = geeksforgeeks;
    }

    public String getCoilsHandle() {
        return coilsHandle;
    }

    public void setCoilsHandle(String coils) {
        this.coilsHandle = coils;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<Projects> getProjects() {
        return projects;
    }

    public void setProjects(List<Projects> projects) {
        this.projects = projects;
    }

    public List<Achievements> getAchievements() {
        return achievements;
    }

    public void setAchievements(List<Achievements> achievements) {
        this.achievements = achievements;
    }

    public List<Journey> getJourney() {
        return journey;
    }

    public void setJourney(List<Journey> journey) {
        this.journey = journey;
    }

    public JsonNode getPlatformDataJson() {
        return platformDataJson;
    }

    public void setPlatformDataJson(JsonNode platformDataJson) {
        this.platformDataJson = platformDataJson;
    }

    @Override
    public String toString() {
        return "Profile{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", codeforcesHandle='" + codeforcesHandle + '\'' +
                ", leetcodeHandle='" + leetcodeHandle + '\'' +
                ", codechefHandle='" + codechefHandle + '\'' +
                ", geeksforgeeksHandle='" + geeksforgeeksHandle + '\'' +
                ", coilsHandle='" + coilsHandle + '\'' +
                ", bio='" + bio + '\'' +
                ", about='" + about + '\'' +
                ", achievements=" + achievements +
                ", journey=" + journey +
                ", skills='" + skills + '\'' +
                ", projects=" + projects +
                ", education='" + education + '\'' +
                ", experience='" + experience + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", linkedin='" + linkedin + '\'' +
                ", github='" + github + '\'' +
                ", user=" + user +
                ", platformDataJson='" + platformDataJson + '\'' +
                '}';
    }
}
