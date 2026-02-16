package com.coils.demo.service;

import com.coils.demo.dto.HrCandidateScoreView;
import com.coils.demo.dto.HrCreateJobRequest;
import com.coils.demo.dto.HrScoreRequest;
import com.coils.demo.entity.CandidateMatchScore;
import com.coils.demo.entity.JobDescription;

import java.util.List;

public interface HrJobService {
    JobDescription createJob(String recruiterUsername, HrCreateJobRequest request);
    List<JobDescription> getMyJobs(String recruiterUsername);
    CandidateMatchScore upsertCandidateScore(String recruiterUsername, Long jobId, HrScoreRequest request);
    List<HrCandidateScoreView> getRankedCandidates(String recruiterUsername, Long jobId);
}
