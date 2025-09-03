package com.coils.demo.controller;

import com.coils.demo.dto.ProfileUpdateData;
import com.coils.demo.entity.*;
import com.coils.demo.service.ProfileService;
import com.coils.demo.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;

    public ProfileController(ProfileService profileService, UserService userService){
        this.profileService = profileService;
        this.userService = userService;
    }

    @PostMapping("/certifications/update")
    public ResponseEntity<List<Achievements>> updateCertifications(@RequestBody ProfileUpdateData profileUpdateData){
        try{
            List<Achievements> updatedCertifications = profileService.updateAchievements(profileUpdateData);
            return ResponseEntity.ok(updatedCertifications);
        }catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/projects/update")
    public ResponseEntity<List<Projects>> updateProjectsData(@RequestBody ProfileUpdateData profileUpdateData){
        try{
            List<Projects> updatedProjects = profileService.updateProjects(profileUpdateData);
            return ResponseEntity.ok(updatedProjects);
        }catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/journey/update")
    public ResponseEntity<List<Journey>> updateJourneyData(@RequestBody ProfileUpdateData profileUpdateData) {
        try {
            List<Journey> updatedJourney = profileService.updateJourney(profileUpdateData);
            return ResponseEntity.ok(updatedJourney);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/profile/update")
    public ResponseEntity<Profile> updateProfileData(@RequestBody ProfileUpdateData profileUpdateData){
        try{
            Profile updatedProfile = profileService.updateProfileByUsername(profileUpdateData);
            return ResponseEntity.ok(updatedProfile);
        }catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/about/update")
    public ResponseEntity<Profile> updateAboutSection(@RequestBody ProfileUpdateData profileUpdateData) {
        try {
            Profile updatedProfile = profileService.updateAbout(profileUpdateData);
            return ResponseEntity.ok(updatedProfile);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @PostMapping("/handle/update")
    public ResponseEntity<Profile> updateCodingProfileHandles(@RequestBody ProfileUpdateData profileUpdateData){
        try {
            Profile updatedProfile = profileService.updateHandles(profileUpdateData);
            return ResponseEntity.ok(updatedProfile);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<Profile> getProfileData(@PathVariable String username){
        try{
            Optional<User> opt = userService.getUserByUsername(username);
            if(opt.isPresent()){
                User user = opt.get();
                System.out.println(user.getProfile());
                return ResponseEntity.ok(user.getProfile());
            }
            throw new NoSuchElementException();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

}
