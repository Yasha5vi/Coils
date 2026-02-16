package com.coils.demo.service;

import com.coils.demo.dto.HrCandidateScoreView;
import com.coils.demo.dto.HrCreateJobRequest;
import com.coils.demo.dto.HrScoreRequest;
import com.coils.demo.entity.CandidateMatchScore;
import com.coils.demo.entity.JobDescription;
import com.coils.demo.entity.User;
import com.coils.demo.repository.CandidateMatchScoreRepository;
import com.coils.demo.repository.JobDescriptionRepository;
import com.coils.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HrJobServiceImpl implements HrJobService {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final CandidateMatchScoreRepository candidateMatchScoreRepository;
    private final UserRepository userRepository;

    public HrJobServiceImpl(JobDescriptionRepository jobDescriptionRepository,
                            CandidateMatchScoreRepository candidateMatchScoreRepository,
                            UserRepository userRepository) {
        this.jobDescriptionRepository = jobDescriptionRepository;
        this.candidateMatchScoreRepository = candidateMatchScoreRepository;
        this.userRepository = userRepository;
    }

    @Override
    public JobDescription createJob(String recruiterUsername, HrCreateJobRequest request) {
        User recruiter = userRepository.findByUsername(recruiterUsername)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        JobDescription job = new JobDescription();
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setMinExperienceYears(request.getMinExperienceYears());
        job.setLocation(request.getLocation());
        job.setRecruiter(recruiter);

        return jobDescriptionRepository.save(job);
    }

    @Override
    public List<JobDescription> getMyJobs(String recruiterUsername) {
        User recruiter = userRepository.findByUsername(recruiterUsername)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobDescriptionRepository.findByRecruiterIdOrderByCreatedAtDesc(recruiter.getId());
    }

    @Override
    public CandidateMatchScore upsertCandidateScore(String recruiterUsername, Long jobId, HrScoreRequest request) {
        User recruiter = userRepository.findByUsername(recruiterUsername)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        JobDescription job = jobDescriptionRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Not allowed for this job");
        }

        User candidate = userRepository.findById(request.getCandidateUserId())
                .orElseThrow(() -> new RuntimeException("Candidate user not found"));

        CandidateMatchScore cms = candidateMatchScoreRepository
                .findByJobDescriptionIdAndCandidateUserId(jobId, request.getCandidateUserId())
                .orElseGet(CandidateMatchScore::new);

        cms.setJobDescription(job);
        cms.setCandidateUser(candidate);
        cms.setScore(request.getScore());
        cms.setMatchedSkills(request.getMatchedSkills());
        cms.setRemarks(request.getRemarks());

        return candidateMatchScoreRepository.save(cms);
    }

    @Override
    public List<HrCandidateScoreView> getRankedCandidates(String recruiterUsername, Long jobId) {
        User recruiter = userRepository.findByUsername(recruiterUsername)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        JobDescription job = jobDescriptionRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getRecruiter().getId().equals(recruiter.getId())) {
            throw new RuntimeException("Not allowed for this job");
        }

        return candidateMatchScoreRepository.findByJobDescriptionIdOrderByScoreDesc(jobId)
                .stream()
                .map(s -> new HrCandidateScoreView(
                        s.getCandidateUser().getId(),
                        s.getCandidateUser().getUsername(),
                        s.getCandidateUser().getEmail(),
                        s.getScore(),
                        s.getMatchedSkills(),
                        s.getRemarks()
                ))
                .toList();
    }
}
