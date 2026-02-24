package com.coils.demo.dto;

import java.math.BigDecimal;

public class HrCandidateScoreView {
    private Long candidateUserId;
    private String username;
    private String email;
    private BigDecimal score;
    private String matchedSkills;
    private String remarks;

    public HrCandidateScoreView() {}

    public HrCandidateScoreView(Long candidateUserId, String username, String email,
                                BigDecimal score, String matchedSkills, String remarks) {
        this.candidateUserId = candidateUserId;
        this.username = username;
        this.email = email;
        this.score = score;
        this.matchedSkills = matchedSkills;
        this.remarks = remarks;
    }

    public Long getCandidateUserId() { return candidateUserId; }
    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public BigDecimal getScore() { return score; }
    public String getMatchedSkills() { return matchedSkills; }
    public String getRemarks() { return remarks; }
}
