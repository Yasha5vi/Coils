
package com.coils.demo.dto;

import com.coils.demo.entity.Profile;

public class AuthenticationResponse {
    private final String token;
    
    private Profile profile;

    public AuthenticationResponse(String token,Profile profile) {

        this.token = token;
        this.profile = profile;
    }

    public String getToken() {
        return token;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }
}
