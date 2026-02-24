package com.coils.demo.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "candidate_match_scores",
    uniqueConstraints = @UniqueConstraint(columnNames = {"job_description_id", "candidate_user_id"})
)
public class CandidateMatchScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_description_id", nullable = false)
    private JobDescription jobDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_user_id", nullable = false)
    private User candidateUser; // user with MEMBER role

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "matched_skills", columnDefinition = "TEXT")
    private String matchedSkills; // JSON/string

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public CandidateMatchScore() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public JobDescription getJobDescription() { return jobDescription; }
    public void setJobDescription(JobDescription jobDescription) { this.jobDescription = jobDescription; }
    public User getCandidateUser() { return candidateUser; }
    public void setCandidateUser(User candidateUser) { this.candidateUser = candidateUser; }
    public BigDecimal getScore() { return score; }
    public void setScore(BigDecimal score) { this.score = score; }
    public String getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}
