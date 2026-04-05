from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import numpy as np
import pickle

app = FastAPI(title="HR AI Scoring Service")

# -----------------------------
# Load trained model artifacts
# -----------------------------
with open("hr_ai_model.pkl", "rb") as f:
    model_data = pickle.load(f)

model = model_data["model"]
scaler = model_data["scaler"]
feature_columns = model_data["feature_columns"]


# -----------------------------
# Request/Response schemas
# -----------------------------
class JobInput(BaseModel):
    jobId: int
    title: str
    description: str
    requiredSkills: List[str]
    minExperienceYears: int = 0
    location: str = ""
    experienceLevel: str = "mid"
    minCfRating: int = 1000
    minLcProblems: int = 100


class CandidateInput(BaseModel):
    candidateUserId: int
    username: str
    email: str
    skills: List[str]
    experienceYears: int = 0
    cfRating: int = 0
    lcTotal: int = 0
    lcEasy: int = 0
    lcMedium: int = 0
    lcHard: int = 0
    ccStars: int = 0
    gfgTotal: int = 0
    projects: int = 0
    achievements: int = 0


class ScoreBatchRequest(BaseModel):
    job: JobInput
    candidates: List[CandidateInput]


class ScoreResult(BaseModel):
    candidateUserId: int
    score: float
    matchedSkills: List[str]
    remarks: str


class ScoreBatchResponse(BaseModel):
    jobId: int
    results: List[ScoreResult]


# -----------------------------
# Feature builder
# -----------------------------
def build_features(job: JobInput, candidate: CandidateInput):
    cand_skills = set(s.lower() for s in candidate.skills)
    job_skills = set(s.lower() for s in job.requiredSkills)
    matched = cand_skills.intersection(job_skills)

    skills_required = max(len(job_skills), 1)
    skills_match_ratio = len(matched) / skills_required

    level_map = {"entry": 0, "junior": 1, "mid": 2, "senior": 3, "lead": 4}
    job_level = level_map.get(job.experienceLevel.lower(), 2)

    lc_hard_ratio = candidate.lcHard / candidate.lcTotal if candidate.lcTotal > 0 else 0
    problem_solving_index = candidate.lcTotal * 0.3 + candidate.cfRating * 0.5

    features = {
        "cf_rating": candidate.cfRating,
        "lc_total": candidate.lcTotal,
        "lc_easy": candidate.lcEasy,
        "lc_medium": candidate.lcMedium,
        "lc_hard": candidate.lcHard,
        "cc_stars": candidate.ccStars,
        "gfg_total": candidate.gfgTotal,
        "experience_years": candidate.experienceYears,
        "skills_matched": len(matched),
        "skills_total": len(cand_skills),
        "skills_required": len(job_skills),
        "skills_match_ratio": skills_match_ratio,
        "projects": candidate.projects,
        "achievements": candidate.achievements,
        "job_level": job_level,
        "lc_hard_ratio": lc_hard_ratio,
        "problem_solving_index": problem_solving_index
    }

    return features, list(matched)


def build_remarks(score: float, matched_count: int, required_count: int):
    ratio = (matched_count / required_count * 100) if required_count > 0 else 0
    if score >= 80:
        grade = "Strong match"
    elif score >= 65:
        grade = "Good match"
    elif score >= 50:
        grade = "Moderate match"
    else:
        grade = "Low match"
    return f"{grade}; skills match {ratio:.0f}%"


# -----------------------------
# API endpoints
# -----------------------------
@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/score-batch", response_model=ScoreBatchResponse)
def score_batch(payload: ScoreBatchRequest):
    results = []

    for c in payload.candidates:
        features, matched_skills = build_features(payload.job, c)

        feature_vector = np.array([features.get(col, 0) for col in feature_columns]).reshape(1, -1)
        feature_vector_scaled = scaler.transform(feature_vector)
        score = float(model.predict(feature_vector_scaled)[0])
        score = max(0.0, min(100.0, score))

        remarks = build_remarks(score, len(matched_skills), len(payload.job.requiredSkills))

        results.append(
            ScoreResult(
                candidateUserId=c.candidateUserId,
                score=round(score, 2),
                matchedSkills=matched_skills,
                remarks=remarks
            )
        )

    # sort descending by score
    results.sort(key=lambda x: x.score, reverse=True)

    return ScoreBatchResponse(jobId=payload.job.jobId, results=results)
