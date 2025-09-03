package com.coils.demo.service;

import com.coils.demo.dto.ProfileUpdateData;
import com.coils.demo.entity.*;
import com.coils.demo.repository.ProfileRepository;
import com.coils.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ProfileServiceImpl implements ProfileService{

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProfileServiceImpl(ProfileRepository profileRepository, UserRepository userRepository){
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Profile saveProfile(Profile profile) {
        return profileRepository.save(profile);
    }

    @Override
    @Transactional
    public Profile updateProfileByUsername(ProfileUpdateData dto){
        User user = userRepository.findByUsername(dto.getCoilsHandle())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Profile profile = user.getProfile();
        if (profile == null) {
            profile = new Profile();
            // link both sides
            profile.setUser(user);
            user.setProfile(profile);
        }

        if (dto.getFirstName() != null)   profile.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null)    profile.setLastName(dto.getLastName());
        if (dto.getBio() != null)         profile.setBio(dto.getBio());
        if (dto.getPhone() != null)       profile.setPhone(dto.getPhone());
        if (dto.getEmail() != null)       profile.setEmail(dto.getEmail());
        if (dto.getEducation() != null)   profile.setEducation(dto.getEducation());
        if (dto.getExperience() != null)  profile.setExperience(dto.getExperience());
        if (dto.getSkills() != null)      profile.setSkills(dto.getSkills());
        if (dto.getLinkedin() != null)    profile.setLinkedin(dto.getLinkedin());
        if (dto.getGithub() != null)      profile.setGithub(dto.getGithub());

        // Because User.profile has cascade = CascadeType.ALL, saving user persists profile changes.
        userRepository.save(user);

        return profile;
    }

    @Transactional
    @Override
    public List<Achievements> updateAchievements(ProfileUpdateData profileUpdateData){
        String username = profileUpdateData.getCoilsHandle();

        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new NoSuchElementException("User not found"));

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new RuntimeException("Profile not found for user: " + username);
        }

        List<Achievements> newAchievements = profileUpdateData.getAchievements()
                .stream()
                .map(dto -> {
                    Achievements ach = new Achievements();
                    ach.setTitle(dto.getTitle());
                    ach.setCertificateUrl(dto.getCertificateUrl());
                    ach.setSkills(dto.getSkills());
                    ach.setProfile(profile);
                    return ach;
                })
                .collect(Collectors.toList());

        // Clear existing achievements (orphanRemoval=true will handle deletes)
        profile.getAchievements().clear();

        for (Achievements achievement : newAchievements) {
            // profile is set in newAchievements upr
            profile.getAchievements().add(achievement);
        }

        profileRepository.save(profile);

        return profile.getAchievements();
    }

    @Transactional
    @Override
    public List<Projects> updateProjects(ProfileUpdateData profileUpdateData){
        String username = profileUpdateData.getCoilsHandle();

        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new NoSuchElementException("User not found"));

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new RuntimeException("Profile not found for user: " + username);
        }

        List<Projects> newProjects = profileUpdateData.getProjects()
                .stream()
                .map(dto -> {
                    Projects ach = new Projects();
                    ach.setTitle(dto.getTitle());
                    ach.setFromStr(dto.getFromStr());
                    ach.setToStr(dto.getToStr());
                    ach.setDescription(dto.getDescription());
                    ach.setTechStack(dto.getTechStack());
                    ach.setGithubUrl(dto.getGithubUrl());
                    ach.setProfile(profile);
                    return ach;
                })
                .collect(Collectors.toList());

        // Clear existing achievements (orphanRemoval=true will handle deletes)
        profile.getProjects().clear();

        for (Projects project : newProjects) {
            // profile is set in newProjects upr
            profile.getProjects().add(project);
        }

        profileRepository.save(profile);

        return profile.getProjects();
    }

    @Override
    @Transactional
    public List<Journey> updateJourney(ProfileUpdateData profileUpdateData) {
        String username = profileUpdateData.getCoilsHandle();

        User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new NoSuchElementException("User not found"));

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new RuntimeException("Profile not found for user: " + username);
        }

        List<Journey> newJourney = profileUpdateData.getJourney()
                .stream()
                .map(dto -> {
                    Journey ach = new Journey();
                    ach.setTitle(dto.getTitle());
                    ach.setFromStr(dto.getFromStr());
                    ach.setToStr(dto.getToStr());
                    ach.setDescription(dto.getDescription());
                    ach.setOrganization(dto.getOrganization());
                    ach.setProfile(profile);
                    return ach;
                })
                .collect(Collectors.toList());

        profile.getJourney().clear();

        for (Journey journey : newJourney) {
            // profile is set in newJourney upr
            profile.getJourney().add(journey);
        }

        profileRepository.save(profile);

        return profile.getJourney();
    }

    @Override
    @Transactional
    public Profile updateAbout(ProfileUpdateData profileUpdateData) {
        String username = profileUpdateData.getCoilsHandle();

        User user = userRepository.findByUsername(username)
                .orElseThrow(()-> new NoSuchElementException("User not found"));

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new RuntimeException("Profile not found for user: " + username);
        }
        profile.setAbout(profileUpdateData.getAbout());

        userRepository.save(user);

        return profile;
    }

    @Override
    @Transactional
    public Profile updateHandles(ProfileUpdateData profileUpdateData){

        User user = userRepository.findByUsername(profileUpdateData.getCoilsHandle())
                .orElseThrow(() -> new NoSuchElementException("User not found"));

        Profile profile = user.getProfile();
        if (profile == null) {
            throw new RuntimeException("Profile not found for user: " + profileUpdateData.getCoilsHandle());
        }

        if(profileUpdateData.getCodechefHandle() != null){
            profile.setCodechefHandle(profileUpdateData.getCodechefHandle());
        }
        if(profileUpdateData.getCodeforcesHandle() != null){
            profile.setCodeforcesHandle(profileUpdateData.getCodeforcesHandle());
        }
        if(profileUpdateData.getLeetcodeHandle() != null){
            profile.setLeetcodeHandle(profileUpdateData.getLeetcodeHandle());
        }
        if(profileUpdateData.getGeeksforgeeksHandle() != null){
            profile.setGeeksforgeeksHandle(profileUpdateData.getGeeksforgeeksHandle());
        }
        user.setProfile(profile);
        userRepository.save(user);
        return profile;
    }
}
