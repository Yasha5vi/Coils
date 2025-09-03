package com.coils.demo.dto;

import java.util.List;

public class LeetcodeDTO {

    private String username;
    private Profile profile;
    private SubmitStats submitStats;
    private ContestBadge contestBadge;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public SubmitStats getSubmitStats() {
        return submitStats;
    }

    public void setSubmitStats(SubmitStats submitStats) {
        this.submitStats = submitStats;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    public ContestBadge getContestBadge() {
        return contestBadge;
    }

    public void setContestBadge(ContestBadge contestBadge) {
        this.contestBadge = contestBadge;
    }

    // -------------------- Profile --------------------
    public static class Profile {
        private String realName;
        private List<Object> websites;
        private String countryName;
        private Object company;
        private Object school;
        private String aboutMe;
        private int reputation;
        private int ranking;

        public String getRealName() {
            return realName;
        }

        public void setRealName(String realName) {
            this.realName = realName;
        }

        public List<Object> getWebsites() {
            return websites;
        }

        public void setWebsites(List<Object> websites) {
            this.websites = websites;
        }

        public String getCountryName() {
            return countryName;
        }

        public void setCountryName(String countryName) {
            this.countryName = countryName;
        }

        public Object getCompany() {
            return company;
        }

        public void setCompany(Object company) {
            this.company = company;
        }

        public Object getSchool() {
            return school;
        }

        public void setSchool(Object school) {
            this.school = school;
        }

        public String getAboutMe() {
            return aboutMe;
        }

        public void setAboutMe(String aboutMe) {
            this.aboutMe = aboutMe;
        }

        public int getReputation() {
            return reputation;
        }

        public void setReputation(int reputation) {
            this.reputation = reputation;
        }

        public int getRanking() {
            return ranking;
        }

        public void setRanking(int ranking) {
            this.ranking = ranking;
        }

        @Override
        public String toString() {
            return "Profile{" +
                    "realName='" + realName + '\'' +
                    ", websites=" + websites +
                    ", countryName='" + countryName + '\'' +
                    ", company=" + company +
                    ", school=" + school +
                    ", aboutMe='" + aboutMe + '\'' +
                    ", reputation=" + reputation +
                    ", ranking=" + ranking +
                    '}';
        }
    }

    // -------------------- Submit Stats --------------------
    public static class SubmitStats {
        private List<Submission> acSubmissionNum;
        private List<Submission> totalSubmissionNum;

        public List<Submission> getAcSubmissionNum() {
            return acSubmissionNum;
        }

        public void setAcSubmissionNum(List<Submission> acSubmissionNum) {
            this.acSubmissionNum = acSubmissionNum;
        }

        public List<Submission> getTotalSubmissionNum() {
            return totalSubmissionNum;
        }

        public void setTotalSubmissionNum(List<Submission> totalSubmissionNum) {
            this.totalSubmissionNum = totalSubmissionNum;
        }

        @Override
        public String toString() {
            return "SubmitStats{" +
                    "acSubmissionNum=" + acSubmissionNum +
                    ", totalSubmissionNum=" + totalSubmissionNum +
                    '}';
        }
    }

    // -------------------- Submission --------------------
    public static class Submission {
        private String difficulty;
        private int count;
        private int submissions;

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public int getCount() {
            return count;
        }

        public void setCount(int count) {
            this.count = count;
        }

        public int getSubmissions() {
            return submissions;
        }

        public void setSubmissions(int submissions) {
            this.submissions = submissions;
        }

        @Override
        public String toString() {
            return "Submission{" +
                    "difficulty='" + difficulty + '\'' +
                    ", count=" + count +
                    ", submissions=" + submissions +
                    '}';
        }
    }

    // -------------------- Contest Badge --------------------
    public static class ContestBadge {
        private String name;
        private boolean expired;
        private String hoverText;
        private String icon;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public boolean isExpired() {
            return expired;
        }

        public void setExpired(boolean expired) {
            this.expired = expired;
        }

        public String getHoverText() {
            return hoverText;
        }

        public void setHoverText(String hoverText) {
            this.hoverText = hoverText;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

        @Override
        public String toString() {
            return "ContestBadge{" +
                    "name='" + name + '\'' +
                    ", expired=" + expired +
                    ", hoverText='" + hoverText + '\'' +
                    ", icon='" + icon + '\'' +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "LeetcodeDTO{" +
                "username='" + username + '\'' +
                ", profile=" + profile +
                ", submitStats=" + submitStats +
                ", contestBadge=" + contestBadge +
                '}';
    }
}
