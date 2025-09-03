package com.coils.demo.service;

import com.coils.demo.dto.ProfileUpdateData;
import com.coils.demo.entity.Achievements;
import com.coils.demo.entity.Journey;
import com.coils.demo.entity.Profile;
import com.coils.demo.entity.Projects;

import java.util.List;

public interface ProfileService {
    Profile saveProfile(Profile profile);

    Profile updateProfileByUsername(ProfileUpdateData profileUpdateData);

    List<Achievements> updateAchievements(ProfileUpdateData profileUpdateData);

    List<Projects> updateProjects(ProfileUpdateData profileUpdateData);

    Profile updateAbout(ProfileUpdateData profileUpdateData);

    List<Journey> updateJourney(ProfileUpdateData profileUpdateData);

    Profile updateHandles(ProfileUpdateData profileUpdateData);
}
