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
import com.coils.demo.dto.hrai.AiCandidateInput;
import com.coils.demo.dto.hrai.AiJobInput;
import com.coils.demo.dto.hrai.AiScoreBatchRequest;
import com.coils.demo.dto.hrai.AiScoreBatchResponse;
import com.coils.demo.dto.hrai.AiScoreResult;
import com.coils.demo.entity.Profile;
import com.coils.demo.dto.HrJobDetailView;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.stream.Collectors;


import java.util.List;

@Service
public class HrJobServiceImpl implements HrJobService {

    private final JobDescriptionRepository jobDescriptionRepository;
    private final CandidateMatchScoreRepository candidateMatchScoreRepository;
    private final UserRepository userRepository;
    private final AiScoringClient aiScoringClient;


    public HrJobServiceImpl(JobDescriptionRepository jobDescriptionRepository,
                        CandidateMatchScoreRepository candidateMatchScoreRepository,
                        UserRepository userRepository,
                        AiScoringClient aiScoringClient) {
    this.jobDescriptionRepository = jobDescriptionRepository;
    this.candidateMatchScoreRepository = candidateMatchScoreRepository;
    this.userRepository = userRepository;
    this.aiScoringClient = aiScoringClient;
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

    @Override
public List<HrCandidateScoreView> autoScoreCandidates(String recruiterUsername, Long jobId) {
    User recruiter = userRepository.findByUsername(recruiterUsername)
            .orElseThrow(() -> new RuntimeException("Recruiter not found"));

    JobDescription job = jobDescriptionRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

    if (!job.getRecruiter().getId().equals(recruiter.getId())) {
        throw new RuntimeException("Not allowed for this job");
    }

    List<User> allUsers = userRepository.findAll();
    List<User> memberUsers = allUsers.stream()
            .filter(u -> u.getRoles() != null && u.getRoles().stream()
                    .anyMatch(r -> "MEMBER".equalsIgnoreCase(r.getRole())))
            .collect(Collectors.toList());

    AiJobInput aiJob = new AiJobInput();
    aiJob.setJobId(job.getId());
    aiJob.setTitle(job.getTitle());
    aiJob.setDescription(job.getDescription());
    aiJob.setRequiredSkills(parseSkills(job.getRequiredSkills()));
    aiJob.setMinExperienceYears(job.getMinExperienceYears() != null ? job.getMinExperienceYears() : 0);
    aiJob.setLocation(job.getLocation() != null ? job.getLocation() : "");
    aiJob.setExperienceLevel("mid");
    aiJob.setMinCfRating(1000);
    aiJob.setMinLcProblems(100);

    List<AiCandidateInput> aiCandidates = memberUsers.stream().map(u -> {
        Profile p = u.getProfile();

        AiCandidateInput c = new AiCandidateInput();
        c.setCandidateUserId(u.getId());
c.setUsername(u.getUsername());
c.setEmail(u.getEmail());
c.setSkills(parseSkills(p != null ? p.getSkills() : null));

        int expYears = extractExperienceYears(p != null ? p.getExperience() : null);
int cfRating = extractJsonInt(p, "codeforces", "rating", 0);
int lcTotal = extractJsonInt(p, "leetcode", "totalSolved", 0);
int lcEasy = extractJsonInt(p, "leetcode", "easySolved", 0);
int lcMedium = extractJsonInt(p, "leetcode", "mediumSolved", 0);
int lcHard = extractJsonInt(p, "leetcode", "hardSolved", 0);
int ccStars = extractCodechefStars(p);
int gfgTotal = extractJsonInt(p, "gfg", "totalProblemsSolved", 0);
int projectsCount = (p != null && p.getProjects() != null) ? p.getProjects().size() : 0;
int achievementsCount = (p != null && p.getAchievements() != null) ? p.getAchievements().size() : 0;

c.setExperienceYears(expYears);
c.setCfRating(cfRating);
c.setLcTotal(lcTotal);
c.setLcEasy(lcEasy);
c.setLcMedium(lcMedium);
c.setLcHard(lcHard);
c.setCcStars(ccStars);
c.setGfgTotal(gfgTotal);
c.setProjects(projectsCount);
c.setAchievements(achievementsCount);
return c;
    }).toList();

    AiScoreBatchRequest req = new AiScoreBatchRequest();
    req.setJob(aiJob);
    req.setCandidates(aiCandidates);

    AiScoreBatchResponse aiResponse = aiScoringClient.scoreBatch(req);
    if (aiResponse == null || aiResponse.getResults() == null) {
        throw new RuntimeException("AI scoring failed");
    }

    for (AiScoreResult r : aiResponse.getResults()) {
        User candidate = userRepository.findById(r.getCandidateUserId())
                .orElseThrow(() -> new RuntimeException("Candidate user not found"));

        CandidateMatchScore cms = candidateMatchScoreRepository
                .findByJobDescriptionIdAndCandidateUserId(jobId, r.getCandidateUserId())
                .orElseGet(CandidateMatchScore::new);

        cms.setJobDescription(job);
        cms.setCandidateUser(candidate);
        cms.setScore(r.getScore());
        cms.setMatchedSkills(r.getMatchedSkills() == null ? "" : String.join(", ", r.getMatchedSkills()));
        cms.setRemarks(r.getRemarks());

        candidateMatchScoreRepository.save(cms);
    }

    return getRankedCandidates(recruiterUsername, jobId);
}

private List<String> parseSkills(String raw) {
    if (raw == null || raw.isBlank()) return Collections.emptyList();

    String cleaned = raw
            .toLowerCase()
            .replace("[", " ")
            .replace("]", " ")
            .replace("\"", " ")
            .replace("'", " ")
            .replace("\t", " ");

    return Arrays.stream(cleaned.split("[,\\n\\r;|]+"))
            .map(String::trim)
            .map(s -> s.replaceAll("\\s+", " "))
            .filter(s -> !s.isBlank())
            .distinct()
            .collect(Collectors.toCollection(ArrayList::new));
}

private int extractExperienceYears(String experienceRaw) {
    if (experienceRaw == null || experienceRaw.isBlank()) return 0;
    // simple heuristic: count entries if stored as JSON array text
    String trimmed = experienceRaw.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        return Math.max(0, trimmed.split("\\{").length - 1);
    }
    return 0;
}

private int extractJsonInt(Profile p, String platform, String field, int fallback) {
    try {
        if (p == null || p.getPlatformDataJson() == null) return fallback;
        if (p.getPlatformDataJson().get(platform) == null) return fallback;
        if (p.getPlatformDataJson().get(platform).get(field) == null) return fallback;
        return p.getPlatformDataJson().get(platform).get(field).asInt(fallback);
    } catch (Exception e) {
        return fallback;
    }
}

private int extractCodechefStars(Profile p) {
    try {
        if (p == null || p.getPlatformDataJson() == null) return 0;
        var cc = p.getPlatformDataJson().get("codechef");
        if (cc == null) return 0;

        if (cc.get("stars") != null) return cc.get("stars").asInt(0);
        if (cc.get("rating") != null) {
            int rating = cc.get("rating").asInt(0);
            if (rating >= 2200) return 6;
            if (rating >= 2000) return 5;
            if (rating >= 1800) return 4;
            if (rating >= 1600) return 3;
            if (rating >= 1400) return 2;
            if (rating > 0) return 1;
        }
        return 0;
    } catch (Exception e) {
        return 0;
    }
}
@Override
public JobDescription getMyJobById(String recruiterUsername, Long jobId) {
    User recruiter = userRepository.findByUsername(recruiterUsername)
            .orElseThrow(() -> new RuntimeException("Recruiter not found"));

    JobDescription job = jobDescriptionRepository.findById(jobId)
            .orElseThrow(() -> new RuntimeException("Job not found"));

    if (!job.getRecruiter().getId().equals(recruiter.getId())) {
        throw new RuntimeException("Not allowed for this job");
    }

    return job;
}

@Override
public JobDescription closeJob(String recruiterUsername, Long jobId) {
    JobDescription job = getMyJobById(recruiterUsername, jobId);
    job.setStatus(com.coils.demo.entity.JobStatus.CLOSED);
    return jobDescriptionRepository.save(job);
}

@Override
public HrJobDetailView getMyJobDetailById(String recruiterUsername, Long jobId) {
    JobDescription job = getMyJobById(recruiterUsername, jobId);
    return new HrJobDetailView(
            job.getId(),
            job.getTitle(),
            job.getDescription(),
            job.getRequiredSkills(),
            job.getMinExperienceYears(),
            job.getLocation(),
            job.getStatus(),
            job.getCreatedAt(),
            job.getUpdatedAt()
    );
}



}
