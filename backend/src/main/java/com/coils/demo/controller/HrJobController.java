package com.coils.demo.controller;

import com.coils.demo.dto.HrCandidateScoreView;
import com.coils.demo.dto.HrCreateJobRequest;
import com.coils.demo.dto.HrScoreRequest;
import com.coils.demo.entity.CandidateMatchScore;
import com.coils.demo.entity.JobDescription;
import com.coils.demo.service.HrJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hr/jobs")
public class HrJobController {

    private final HrJobService hrJobService;

    public HrJobController(HrJobService hrJobService) {
        this.hrJobService = hrJobService;
    }

    @PostMapping
    public ResponseEntity<JobDescription> createJob(Authentication authentication,
                                                    @RequestBody HrCreateJobRequest request) {
        return ResponseEntity.ok(hrJobService.createJob(authentication.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<JobDescription>> getMyJobs(Authentication authentication) {
        return ResponseEntity.ok(hrJobService.getMyJobs(authentication.getName()));
    }

    @PostMapping("/{jobId}/score")
    public ResponseEntity<CandidateMatchScore> upsertCandidateScore(Authentication authentication,
                                                                    @PathVariable Long jobId,
                                                                    @RequestBody HrScoreRequest request) {
        return ResponseEntity.ok(hrJobService.upsertCandidateScore(authentication.getName(), jobId, request));
    }

    @GetMapping("/{jobId}/matches")
    public ResponseEntity<List<HrCandidateScoreView>> getRankedCandidates(Authentication authentication,
                                                                          @PathVariable Long jobId) {
        return ResponseEntity.ok(hrJobService.getRankedCandidates(authentication.getName(), jobId));
    }
}
