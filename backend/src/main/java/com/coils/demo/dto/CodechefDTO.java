package com.coils.demo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class CodechefDTO {

    private String username;
    private String rating;

    @JsonProperty("rating_number")
    private int ratingNumber;

    private String country;

    @JsonProperty("user_type")
    private String userType;

    private String institution;
    private String organisation;

    @JsonProperty("global_rank")
    private String globalRank;

    @JsonProperty("country_rank")
    private String countryRank;

    @JsonProperty("max_rank")
    private int maxRank;

    // Getters and Setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public int getRatingNumber() { return ratingNumber; }
    public void setRatingNumber(int ratingNumber) { this.ratingNumber = ratingNumber; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getUserType() { return userType; }
    public void setUserType(String userType) { this.userType = userType; }

    public String getInstitution() { return institution; }
    public void setInstitution(String institution) { this.institution = institution; }

    public String getOrganisation() { return organisation; }
    public void setOrganisation(String organisation) { this.organisation = organisation; }

    public String getGlobalRank() { return globalRank; }
    public void setGlobalRank(String globalRank) { this.globalRank = globalRank; }

    public String getCountryRank() { return countryRank; }
    public void setCountryRank(String countryRank) { this.countryRank = countryRank; }

    public int getMaxRank() { return maxRank; }
    public void setMaxRank(int maxRank) { this.maxRank = maxRank; }
}

