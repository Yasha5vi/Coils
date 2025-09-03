package com.coils.demo.dto;

import java.util.Map;

public class LeetcodeData {
    private String contestBadge;
    private Map<String, Integer> submissions; // Easy, Medium, Hard, All

    public LeetcodeData() {
    }

    public LeetcodeData(String contestBadge, Map<String, Integer> submissions) {
        this.contestBadge = contestBadge;
        this.submissions = submissions;
    }

    public String getContestBadge() {
        return contestBadge;
    }

    public void setContestBadge(String contestBadge) {
        this.contestBadge = contestBadge;
    }

    public Map<String, Integer> getSubmissions() {
        return submissions;
    }

    public void setSubmissions(Map<String, Integer> submissions) {
        this.submissions = submissions;
    }

    @Override
    public String toString() {
        return "LeetcodeData{" +
                "contestBadge='" + contestBadge + '\'' +
                ", submissions=" + submissions +
                '}';
    }
}
