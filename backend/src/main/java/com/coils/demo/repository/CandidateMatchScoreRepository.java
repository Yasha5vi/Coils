package com.coils.demo.repository;

import com.coils.demo.entity.CandidateMatchScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CandidateMatchScoreRepository extends JpaRepository<CandidateMatchScore, Long> {
    List<CandidateMatchScore> findByJobDescriptionIdOrderByScoreDesc(Long jobDescriptionId);
    Optional<CandidateMatchScore> findByJobDescriptionIdAndCandidateUserId(Long jobDescriptionId, Long candidateUserId);
}
