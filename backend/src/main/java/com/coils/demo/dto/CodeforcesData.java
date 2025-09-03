package com.coils.demo.dto;

public class CodeforcesData {
    private Integer rating;
    private Integer maxRating;

    public CodeforcesData() {
    }

    public CodeforcesData(Integer rating, Integer maxRating) {
        this.rating = rating;
        this.maxRating = maxRating;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public Integer getMaxRating() {
        return maxRating;
    }

    public void setMaxRating(Integer maxRating) {
        this.maxRating = maxRating;
    }

    @Override
    public String toString() {
        return "CodeforcesData{" +
                "rating=" + rating +
                ", maxRating=" + maxRating +
                '}';
    }
}

