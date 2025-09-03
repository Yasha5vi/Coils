package com.coils.demo.dto;

public class CodechefData {
    private String rating;
    private Integer maxRank;

    public CodechefData() {
    }

    public CodechefData(String rating, Integer maxRank) {
        this.rating = rating;
        this.maxRank = maxRank;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    public Integer getMaxRank() {
        return maxRank;
    }

    public void setMaxRank(Integer maxRank) {
        this.maxRank = maxRank;
    }

    @Override
    public String toString() {
        return "CodechefData{" +
                "rating=" + rating +
                ", maxRank=" + maxRank +
                '}';
    }
}
