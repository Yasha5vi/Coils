package com.coils.demo.dto;

import java.util.Map;

public class GfgData {
    private Map<String, Integer> solvedStats;

    public GfgData() {
    }

    public GfgData(Map<String, Integer> solvedStats) {
        this.solvedStats = solvedStats;
    }

    public Map<String, Integer> getSolvedStats() {
        return solvedStats;
    }

    public void setSolvedStats(Map<String, Integer> solvedStats) {
        this.solvedStats = solvedStats;
    }

    @Override
    public String toString() {
        return "GfgData{" +
                "solvedStats=" + solvedStats +
                '}';
    }
}
