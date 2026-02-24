package com.coils.demo.dto.hrai;

import java.util.List;

public class AiScoreBatchRequest {
    private AiJobInput job;
    private List<AiCandidateInput> candidates;

    public AiJobInput getJob() { return job; }
    public void setJob(AiJobInput job) { this.job = job; }

    public List<AiCandidateInput> getCandidates() { return candidates; }
    public void setCandidates(List<AiCandidateInput> candidates) { this.candidates = candidates; }
}
