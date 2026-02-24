package com.coils.demo.dto.hrai;

import java.util.List;

public class AiScoreBatchResponse {
    private Long jobId;
    private List<AiScoreResult> results;

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }
    public List<AiScoreResult> getResults() { return results; }
    public void setResults(List<AiScoreResult> results) { this.results = results; }
}
