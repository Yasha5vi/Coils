package com.coils.demo.dto;

public class GeeksforgeeksDTO {

    private Info info;
    private SolvedStats solvedStats;

    // Inner classes
    public static class Info {
        private String userName;
        private String fullName;
        private String profilePicture;
        private String institute;
        private int instituteRank;
        private int currentStreak;
        private int maxStreak;
        private int codingScore;
        private int monthlyScore;
        private int totalProblemsSolved;

        public String getUserName() {
            return userName;
        }

        public void setUserName(String userName) {
            this.userName = userName;
        }

        public int getTotalProblemsSolved() {
            return totalProblemsSolved;
        }

        public void setTotalProblemsSolved(int totalProblemsSolved) {
            this.totalProblemsSolved = totalProblemsSolved;
        }

        public int getMonthlyScore() {
            return monthlyScore;
        }

        public void setMonthlyScore(int monthlyScore) {
            this.monthlyScore = monthlyScore;
        }

        public int getCodingScore() {
            return codingScore;
        }

        public void setCodingScore(int codingScore) {
            this.codingScore = codingScore;
        }

        public int getMaxStreak() {
            return maxStreak;
        }

        public void setMaxStreak(int maxStreak) {
            this.maxStreak = maxStreak;
        }

        public int getCurrentStreak() {
            return currentStreak;
        }

        public void setCurrentStreak(int currentStreak) {
            this.currentStreak = currentStreak;
        }

        public int getInstituteRank() {
            return instituteRank;
        }

        public void setInstituteRank(int instituteRank) {
            this.instituteRank = instituteRank;
        }

        public String getInstitute() {
            return institute;
        }

        public void setInstitute(String institute) {
            this.institute = institute;
        }

        public String getProfilePicture() {
            return profilePicture;
        }

        public void setProfilePicture(String profilePicture) {
            this.profilePicture = profilePicture;
        }

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        @Override
        public String toString() {
            return "Info{" +
                    "userName='" + userName + '\'' +
                    ", fullName='" + fullName + '\'' +
                    ", profilePicture='" + profilePicture + '\'' +
                    ", institute='" + institute + '\'' +
                    ", instituteRank=" + instituteRank +
                    ", currentStreak=" + currentStreak +
                    ", maxStreak=" + maxStreak +
                    ", codingScore=" + codingScore +
                    ", monthlyScore=" + monthlyScore +
                    ", totalProblemsSolved=" + totalProblemsSolved +
                    '}';
        }
    }

    public static class SolvedStats {
        private Difficulty basic;
        private Difficulty easy;
        private Difficulty medium;
        private Difficulty hard;

        public static class Difficulty {
            private int count;

            public Difficulty(int count) {
                this.count = count;
            }

            // Getter and Setter
            public int getCount() {
                return count;
            }

            public void setCount(int count) {
                this.count = count;
            }

            @Override
            public String toString() {
                return "Difficulty{" +
                        "count=" + count +
                        '}';
            }
        }

        public Difficulty getBasic() {
            return basic;
        }

        public void setBasic(Difficulty basic) {
            this.basic = basic;
        }

        // Getters and Setters
        public Difficulty getEasy() {
            return easy;
        }

        public void setEasy(Difficulty easy) {
            this.easy = easy;
        }

        public Difficulty getMedium() {
            return medium;
        }

        public void setMedium(Difficulty medium) {
            this.medium = medium;
        }

        public Difficulty getHard() {
            return hard;
        }

        public void setHard(Difficulty hard) {
            this.hard = hard;
        }

        @Override
        public String toString() {
            return "SolvedStats{" +
                    "basic=" + basic +
                    ", easy=" + easy +
                    ", medium=" + medium +
                    ", hard=" + hard +
                    '}';
        }
    }

    // Getters and Setters for info and solvedStats
    public Info getInfo() {
        return info;
    }

    public void setInfo(Info info) {
        this.info = info;
    }

    public SolvedStats getSolvedStats() {
        return solvedStats;
    }

    public void setSolvedStats(SolvedStats solvedStats) {
        this.solvedStats = solvedStats;
    }

    @Override
    public String toString() {
        return "GeeksforgeeksDTO{" +
                "info=" + info +
                ", solvedStats=" + solvedStats +
                '}';
    }
}
