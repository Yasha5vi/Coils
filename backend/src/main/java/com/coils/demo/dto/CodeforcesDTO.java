package com.coils.demo.dto;

public class CodeforcesDTO {

    private String status;
    private Result[] result;

    // Getters and Setters
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Result[] getResult() {
        return result;
    }

    public void setResult(Result[] result) {
        this.result = result;
    }

    public static class Result {

        private int contribution;
        private long lastOnlineTimeSeconds;
        private String organization;
        private int rating;
        private int friendOfCount;
        private String titlePhoto;
        private String rank;
        private String handle;
        private int maxRating;
        private String avatar;
        private long registrationTimeSeconds;
        private String maxRank;

        public int getContribution() { return contribution; }
        public void setContribution(int contribution) { this.contribution = contribution; }

        public long getLastOnlineTimeSeconds() { return lastOnlineTimeSeconds; }
        public void setLastOnlineTimeSeconds(long lastOnlineTimeSeconds) { this.lastOnlineTimeSeconds = lastOnlineTimeSeconds; }

        public String getOrganization() { return organization; }
        public void setOrganization(String organization) { this.organization = organization; }

        public int getRating() { return rating; }
        public void setRating(int rating) { this.rating = rating; }

        public int getFriendOfCount() { return friendOfCount; }
        public void setFriendOfCount(int friendOfCount) { this.friendOfCount = friendOfCount; }

        public String getTitlePhoto() { return titlePhoto; }
        public void setTitlePhoto(String titlePhoto) { this.titlePhoto = titlePhoto; }

        public String getRank() { return rank; }
        public void setRank(String rank) { this.rank = rank; }

        public String getHandle() { return handle; }
        public void setHandle(String handle) { this.handle = handle; }

        public int getMaxRating() { return maxRating; }
        public void setMaxRating(int maxRating) { this.maxRating = maxRating; }

        public String getAvatar() { return avatar; }
        public void setAvatar(String avatar) { this.avatar = avatar; }

        public long getRegistrationTimeSeconds() { return registrationTimeSeconds; }
        public void setRegistrationTi0meSeconds(long registrationTimeSeconds) { this.registrationTimeSeconds = registrationTimeSeconds; }

        public String getMaxRank() { return maxRank; }
        public void setMaxRank(String maxRank) { this.maxRank = maxRank; }
    }
}
