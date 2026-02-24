package com.coils.demo.dto;

import java.math.BigDecimal;

public class HrScoreRequest {
    private Long candidateUserId;
    private BigDecimal score;
    private String matchedSkills;
    private String remarks;

    public HrScoreRequest() {}

    public Long getCandidateUserId() { return candidateUserId; }
    public void setCandidateUserId(Long candidateUserId) { this.candidateUserId = candidateUserId; }
    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }
    public String getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
