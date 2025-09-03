package com.coils.demo.dto;

import com.coils.demo.entity.Achievements;
import com.coils.demo.entity.Journey;
import com.coils.demo.entity.Projects;

import java.util.List;

public class ProfileUpdateData {
    private String firstName;
    private String lastName;
    private String bio;
    private String phone;
    private String email;
    private String education;
    private String experience;
    private String skills;
    private String linkedin;
    private String github;
    private String codeforcesHandle;
    private String codechefHandle;
    private String geeksforgeeksHandle;
    private String leetcodeHandle;
    private String coilsHandle;
    private List<Achievements> achievements;

    private List<Projects> projects;

    private List<Journey> journey;

    private String about;

    public ProfileUpdateData(){

    }

    public ProfileUpdateData(String firstName, String lastName, String phone, String email,
                             String education, String experience, String skills, String linkedin,
                             String github, String codeforcesHandle, String codechefHandle,
                             String geeksforgeeksHandle, String leetcodeHandle, String coilsHandle,
                             List<Achievements> achievements, List<Projects> projects, String bio,
                             String about, List<Journey> journey) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.email = email;
        this.education = education;
        this.experience = experience;
        this.skills = skills;
        this.linkedin = linkedin;
        this.github = github;
        this.codeforcesHandle = codeforcesHandle;
        this.codechefHandle = codechefHandle;
        this.geeksforgeeksHandle = geeksforgeeksHandle;
        this.leetcodeHandle = leetcodeHandle;
        this.coilsHandle = coilsHandle;
        this.achievements = achievements;
        this.projects = projects;
        this.bio = bio;
        this.about = about;
        this.journey = journey;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
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

    public String getCodeforcesHandle() {
        return codeforcesHandle;
    }

    public void setCodeforcesHandle(String codeforcesHandle) {
        this.codeforcesHandle = codeforcesHandle;
    }

    public String getCodechefHandle() {
        return codechefHandle;
    }

    public void setCodechefHandle(String codechefHandle) {
        this.codechefHandle = codechefHandle;
    }

    public String getGeeksforgeeksHandle() {
        return geeksforgeeksHandle;
    }

    public void setGeeksforgeeksHandle(String geeksforgeeksHandle) {
        this.geeksforgeeksHandle = geeksforgeeksHandle;
    }

    public String getLeetcodeHandle() {
        return leetcodeHandle;
    }

    public void setLeetcodeHandle(String leetcodeHandle) {
        this.leetcodeHandle = leetcodeHandle;
    }

    public String getCoilsHandle() {
        return coilsHandle;
    }

    public void setCoilsHandle(String coilsHandle) {
        this.coilsHandle = coilsHandle;
    }

    public List<Achievements> getAchievements() {
        return achievements;
    }

    public void setAchievements(List<Achievements> achievements) {
        this.achievements = achievements;
    }

    public List<Projects> getProjects() {
        return projects;
    }

    public void setProjects(List<Projects> projects) {
        this.projects = projects;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public List<Journey> getJourney() {
        return journey;
    }

    public void setJourney(List<Journey> journey) {
        this.journey = journey;
    }

    @Override
    public String toString() {
        return "ProfileUpdateData{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", bio='" + bio + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", education='" + education + '\'' +
                ", experience='" + experience + '\'' +
                ", skills='" + skills + '\'' +
                ", linkedin='" + linkedin + '\'' +
                ", github='" + github + '\'' +
                ", codeforcesHandle='" + codeforcesHandle + '\'' +
                ", codechefHandle='" + codechefHandle + '\'' +
                ", geeksforgeeksHandle='" + geeksforgeeksHandle + '\'' +
                ", leetcodeHandle='" + leetcodeHandle + '\'' +
                ", coilsHandle='" + coilsHandle + '\'' +
                ", achievements=" + achievements +
                ", projects=" + projects +
                ", journey=" + journey +
                ", about='" + about + '\'' +
                '}';
    }
}
