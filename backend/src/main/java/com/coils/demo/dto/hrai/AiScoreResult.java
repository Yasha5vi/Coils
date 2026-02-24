package com.coils.demo.dto.hrai;

import java.math.BigDecimal;
import java.util.List;

public class AiScoreResult {
    private Long candidateUserId;
    private BigDecimal score;
    private List<String> matchedSkills;
    private String remarks;

    public Long getCandidateUserId() { return candidateUserId; }
    public void setCandidateUserId(Long candidateUserId) { this.candidateUserId = candidateUserId; }
    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }
    public List<String> getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(List<String> matchedSkills) { this.matchedSkills = matchedSkills; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
