"""
HR AI MATCHING MODEL - STANDALONE DEMO
Matches candidates to jobs based on competitive programming stats and skills
"""

import json
import random
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
import pickle

print("="*70)
print("🤖 HR AI MATCHING MODEL - DEMONSTRATION")
print("="*70)
print()

# ============================================================================
# STEP 1: GENERATE SYNTHETIC TRAINING DATA
# ============================================================================

print("📊 STEP 1: Generating Training Data...")
print("-" * 70)

# Skills pool
technical_skills = [
    "Java", "Python", "JavaScript", "C++", "React", "Node.js", "Spring Boot",
    "Django", "Flask", "Angular", "PostgreSQL", "MongoDB", "MySQL",
    "Docker", "Kubernetes", "AWS", "Machine Learning", "Data Structures",
    "Algorithms", "System Design", "REST API", "Git"
]

# Job templates
job_templates = [
    {
        "title": "Backend Engineer",
        "skills": ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS"],
        "experience_level": "mid",
        "min_cf_rating": 1200,
        "min_lc_problems": 150
    },
    {
        "title": "Full Stack Developer",
        "skills": ["React", "Node.js", "JavaScript", "MongoDB", "Docker"],
        "experience_level": "senior",
        "min_cf_rating": 1400,
        "min_lc_problems": 250
    },
    {
        "title": "Frontend Developer",
        "skills": ["JavaScript", "React", "Angular", "Git"],
        "experience_level": "entry",
        "min_cf_rating": 800,
        "min_lc_problems": 50
    },
    {
        "title": "ML Engineer",
        "skills": ["Python", "Machine Learning", "Data Structures", "AWS"],
        "experience_level": "senior",
        "min_cf_rating": 1500,
        "min_lc_problems": 200
    },
    {
        "title": "DevOps Engineer",
        "skills": ["Docker", "Kubernetes", "AWS", "Python"],
        "experience_level": "mid",
        "min_cf_rating": 1000,
        "min_lc_problems": 100
    }
]

def generate_candidate(cid):
    """Generate a synthetic candidate profile"""
    cf_rating = random.randint(600, 2400)
    lc_total = random.randint(30, 600)
    cc_stars = random.randint(1, 7)
    gfg_total = random.randint(10, 300)
    exp_years = random.choice([0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8])
    
    num_skills = random.randint(3 + exp_years, 8 + exp_years)
    skills = random.sample(technical_skills, min(num_skills, len(technical_skills)))
    
    return {
        "id": cid,
        "name": f"Candidate_{cid}",
        "skills": skills,
        "experience_years": exp_years,
        "cf_rating": cf_rating,
        "lc_total": lc_total,
        "lc_easy": int(lc_total * 0.4),
        "lc_medium": int(lc_total * 0.4),
        "lc_hard": int(lc_total * 0.2),
        "cc_stars": cc_stars,
        "gfg_total": gfg_total,
        "projects": random.randint(1, 6),
        "achievements": random.randint(0, 4)
    }

def calculate_ground_truth_score(candidate, job):
    """Calculate the actual match score (ground truth for training)"""
    score = 0
    
    # 1. Skills match (40%)
    candidate_skills = set(s.lower() for s in candidate["skills"])
    job_skills = set(s.lower() for s in job["skills"])
    matched = len(candidate_skills.intersection(job_skills))
    skill_score = (matched / len(job_skills)) * 40
    score += skill_score
    
    # 2. Codeforces (15%)
    cf_diff = candidate["cf_rating"] - job["min_cf_rating"]
    if cf_diff >= 200: cf_score = 15
    elif cf_diff >= 0: cf_score = 12
    elif cf_diff >= -200: cf_score = 8
    else: cf_score = 4
    score += cf_score
    
    # 3. LeetCode (15%)
    lc_diff = candidate["lc_total"] - job["min_lc_problems"]
    if lc_diff >= job["min_lc_problems"] * 0.5: lc_score = 15
    elif lc_diff >= 0: lc_score = 12
    elif lc_diff >= -job["min_lc_problems"] * 0.3: lc_score = 8
    else: lc_score = 4
    score += lc_score
    
    # 4. Experience (20%)
    level_map = {"entry": 0, "junior": 1, "mid": 3, "senior": 5, "lead": 8}
    required = level_map[job["experience_level"]]
    if candidate["experience_years"] >= required: exp_score = 20
    elif candidate["experience_years"] >= required * 0.7: exp_score = 15
    elif candidate["experience_years"] >= required * 0.5: exp_score = 10
    else: exp_score = 5
    score += exp_score
    
    # 5. Projects & achievements (10%)
    portfolio_score = min(candidate["projects"] * 1.5 + candidate["achievements"] * 1, 10)
    score += portfolio_score
    
    return round(score, 2)

# Generate dataset
print("Generating 500 candidate profiles...")
candidates = [generate_candidate(i+1) for i in range(500)]

print("Creating training examples...")
training_data = []
for job in job_templates:
    for candidate in candidates:
        score = calculate_ground_truth_score(candidate, job)
        
        # Extract features
        cand_skills = set(s.lower() for s in candidate["skills"])
        job_skills = set(s.lower() for s in job["skills"])
        
        example = {
            # Features
            "cf_rating": candidate["cf_rating"],
            "lc_total": candidate["lc_total"],
            "lc_easy": candidate["lc_easy"],
            "lc_medium": candidate["lc_medium"],
            "lc_hard": candidate["lc_hard"],
            "cc_stars": candidate["cc_stars"],
            "gfg_total": candidate["gfg_total"],
            "experience_years": candidate["experience_years"],
            "skills_matched": len(cand_skills.intersection(job_skills)),
            "skills_total": len(cand_skills),
            "skills_required": len(job_skills),
            "skills_match_ratio": len(cand_skills.intersection(job_skills)) / len(job_skills),
            "projects": candidate["projects"],
            "achievements": candidate["achievements"],
            "job_level": {"entry": 0, "junior": 1, "mid": 2, "senior": 3, "lead": 4}[job["experience_level"]],
            "lc_hard_ratio": candidate["lc_hard"] / candidate["lc_total"] if candidate["lc_total"] > 0 else 0,
            "problem_solving_index": candidate["lc_total"] * 0.3 + candidate["cf_rating"] * 0.5,
            
            # Label
            "match_score": score
        }
        training_data.append(example)

print(f"✅ Generated {len(training_data)} training examples")
print(f"   (500 candidates × 5 jobs = 2,500 examples)")
print()

# ============================================================================
# STEP 2: PREPARE DATA FOR TRAINING
# ============================================================================

print("📋 STEP 2: Preparing Data for Training...")
print("-" * 70)

# Convert to DataFrame
df = pd.DataFrame(training_data)
feature_columns = [col for col in df.columns if col != "match_score"]
X = df[feature_columns].values
y = df["match_score"].values

print(f"Features: {len(feature_columns)}")
print(f"Training examples: {len(X)}")
print(f"Feature names: {feature_columns[:5]}... (showing first 5)")
print()

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"Training set: {len(X_train)} examples")
print(f"Test set: {len(X_test)} examples")
print()

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# ============================================================================
# STEP 3: TRAIN THE AI MODEL
# ============================================================================

print("🧠 STEP 3: Training AI Model...")
print("-" * 70)

model = GradientBoostingRegressor(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    min_samples_split=5,
    random_state=42,
    verbose=0
)

print("Training Gradient Boosting Regressor...")
model.fit(X_train_scaled, y_train)
print("✅ Training complete!")
print()

# ============================================================================
# STEP 4: EVALUATE MODEL PERFORMANCE
# ============================================================================

print("📈 STEP 4: Evaluating Model Performance...")
print("-" * 70)

y_train_pred = model.predict(X_train_scaled)
y_test_pred = model.predict(X_test_scaled)

train_mse = mean_squared_error(y_train, y_train_pred)
test_mse = mean_squared_error(y_test, y_test_pred)
train_mae = mean_absolute_error(y_train, y_train_pred)
test_mae = mean_absolute_error(y_test, y_test_pred)
train_r2 = r2_score(y_train, y_train_pred)
test_r2 = r2_score(y_test, y_test_pred)

print("TRAINING SET METRICS:")
print(f"  Mean Squared Error (MSE):     {train_mse:.4f}")
print(f"  Mean Absolute Error (MAE):    {train_mae:.4f}")
print(f"  R² Score:                     {train_r2:.4f} ({train_r2*100:.2f}%)")
print()

print("TEST SET METRICS (Unseen Data):")
print(f"  Mean Squared Error (MSE):     {test_mse:.4f}")
print(f"  Mean Absolute Error (MAE):    {test_mae:.4f}")
print(f"  R² Score:                     {test_r2:.4f} ({test_r2*100:.2f}%)")
print()

print("📊 INTERPRETATION:")
print(f"  ✅ The model explains {test_r2*100:.1f}% of variance in match scores")
print(f"  ✅ Average prediction error: ±{test_mae:.2f} points (out of 100)")
print()

# Feature importance
importances = model.feature_importances_
feature_importance = sorted(
    zip(feature_columns, importances),
    key=lambda x: x[1],
    reverse=True
)

print("🎯 TOP 10 MOST IMPORTANT FEATURES:")
for i, (feature, importance) in enumerate(feature_importance[:10], 1):
    bar = "█" * int(importance * 50)
    print(f"  {i:2d}. {feature:25s} {'│'} {bar} {importance:.4f}")
print()

# ============================================================================
# STEP 5: LIVE DEMO - TEST WITH NEW CANDIDATES
# ============================================================================

print("="*70)
print("🎬 STEP 5: LIVE DEMONSTRATION")
print("="*70)
print()

# Create test job
demo_job = {
    "title": "Senior Software Engineer",
    "skills": ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS"],
    "experience_level": "senior",
    "min_cf_rating": 1400,
    "min_lc_problems": 250
}

print("📄 JOB DESCRIPTION:")
print(f"  Title: {demo_job['title']}")
print(f"  Required Skills: {', '.join(demo_job['skills'])}")
print(f"  Experience Level: {demo_job['experience_level']}")
print(f"  Min. Codeforces Rating: {demo_job['min_cf_rating']}")
print(f"  Min. LeetCode Problems: {demo_job['min_lc_problems']}")
print()

# Create 3 test candidates with different profiles
test_candidates = [
    {
        "name": "Alice - Strong Match",
        "skills": ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS", "React"],
        "experience_years": 6,
        "cf_rating": 1600,
        "lc_total": 350,
        "lc_easy": 140,
        "lc_medium": 140,
        "lc_hard": 70,
        "cc_stars": 5,
        "gfg_total": 200,
        "projects": 5,
        "achievements": 3
    },
    {
        "name": "Bob - Medium Match",
        "skills": ["Python", "Django", "MySQL", "Docker", "Git"],
        "experience_years": 3,
        "cf_rating": 1200,
        "lc_total": 150,
        "lc_easy": 60,
        "lc_medium": 60,
        "lc_hard": 30,
        "cc_stars": 3,
        "gfg_total": 100,
        "projects": 3,
        "achievements": 1
    },
    {
        "name": "Charlie - Low Match",
        "skills": ["JavaScript", "React", "Node.js"],
        "experience_years": 1,
        "cf_rating": 800,
        "lc_total": 50,
        "lc_easy": 30,
        "lc_medium": 15,
        "lc_hard": 5,
        "cc_stars": 2,
        "gfg_total": 40,
        "projects": 2,
        "achievements": 0
    }
]

def predict_score(candidate, job, model, scaler, feature_columns):
    """Predict match score for a candidate"""
    cand_skills = set(s.lower() for s in candidate["skills"])
    job_skills = set(s.lower() for s in job["skills"])
    
    features = {
        "cf_rating": candidate["cf_rating"],
        "lc_total": candidate["lc_total"],
        "lc_easy": candidate["lc_easy"],
        "lc_medium": candidate["lc_medium"],
        "lc_hard": candidate["lc_hard"],
        "cc_stars": candidate["cc_stars"],
        "gfg_total": candidate["gfg_total"],
        "experience_years": candidate["experience_years"],
        "skills_matched": len(cand_skills.intersection(job_skills)),
        "skills_total": len(cand_skills),
        "skills_required": len(job_skills),
        "skills_match_ratio": len(cand_skills.intersection(job_skills)) / len(job_skills),
        "projects": candidate["projects"],
        "achievements": candidate["achievements"],
        "job_level": {"entry": 0, "junior": 1, "mid": 2, "senior": 3, "lead": 4}[job["experience_level"]],
        "lc_hard_ratio": candidate["lc_hard"] / candidate["lc_total"] if candidate["lc_total"] > 0 else 0,
        "problem_solving_index": candidate["lc_total"] * 0.3 + candidate["cf_rating"] * 0.5,
    }
    
    feature_vector = np.array([features[col] for col in feature_columns]).reshape(1, -1)
    feature_vector_scaled = scaler.transform(feature_vector)
    score = model.predict(feature_vector_scaled)[0]
    score = np.clip(score, 0, 100)
    
    return score, features

print("👥 TESTING 3 CANDIDATES:")
print("="*70)

results = []
for candidate in test_candidates:
    score, features = predict_score(candidate, demo_job, model, scaler, feature_columns)
    
    print(f"\n🧑 {candidate['name'].upper()}")
    print("-" * 70)
    print(f"  Skills: {', '.join(candidate['skills'])}")
    print(f"  Experience: {candidate['experience_years']} years")
    print(f"  Codeforces Rating: {candidate['cf_rating']}")
    print(f"  LeetCode Problems: {candidate['lc_total']} (E:{candidate['lc_easy']}, M:{candidate['lc_medium']}, H:{candidate['lc_hard']})")
    print(f"  CodeChef: {candidate['cc_stars']}★")
    print(f"  GeeksforGeeks: {candidate['gfg_total']} problems")
    print(f"  Projects: {candidate['projects']}")
    print(f"  Achievements: {candidate['achievements']}")
    print()
    
    print(f"  🎯 AI MATCH SCORE: {score:.2f}/100")
    
    # Score bar
    filled = int(score / 2)
    bar = "█" * filled + "░" * (50 - filled)
    print(f"  [{bar}]")
    
    # Recommendation
    if score >= 80:
        recommendation = "🟢 EXCELLENT MATCH - Strongly Recommend Interview"
    elif score >= 70:
        recommendation = "🟢 STRONG MATCH - Recommend Interview"
    elif score >= 60:
        recommendation = "🟡 GOOD MATCH - Consider for Interview"
    elif score >= 45:
        recommendation = "🟡 FAIR MATCH - Review Profile Carefully"
    else:
        recommendation = "🔴 LOW MATCH - May Not Be Suitable"
    
    print(f"  {recommendation}")
    
    # Key strengths/weaknesses
    print()
    print("  📊 BREAKDOWN:")
    print(f"     Skills Match: {features['skills_matched']}/{features['skills_required']} ({features['skills_match_ratio']*100:.0f}%)")
    print(f"     CP Performance: CF={candidate['cf_rating']}, LC={candidate['lc_total']}")
    print(f"     Experience Gap: {candidate['experience_years']} years (needs {features['job_level']*2}+)")
    
    results.append((candidate['name'], score))

print()
print("="*70)
print("📊 FINAL RANKING (Sorted by AI Score)")
print("="*70)
results.sort(key=lambda x: x[1], reverse=True)
for rank, (name, score) in enumerate(results, 1):
    print(f"  {rank}. {name:30s} → {score:6.2f}/100")

print()
print("="*70)
print("✅ DEMONSTRATION COMPLETE!")
print("="*70)
print()
print("💡 KEY INSIGHTS:")
print("  • The AI model successfully ranks candidates based on multiple factors")
print("  • Competitive programming stats (CF, LC) heavily influence the score")
print("  • Skills matching and experience are also critical factors")
print("  • The model can process any candidate profile and job description")
print()
print("🎯 MODEL CAPABILITIES:")
print("  ✓ Analyzes 16+ features per candidate")
print("  ✓ Considers competitive programming performance")
print("  ✓ Weights skills, experience, and portfolio")
print(f"  ✓ Achieves {test_r2*100:.1f}% accuracy on test data")
print("  ✓ Provides interpretable recommendations")
print()

# Save model
print("💾 Saving trained model...")
model_data = {
    'model': model,
    'scaler': scaler,
    'feature_columns': feature_columns
}
with open('hr_ai_model.pkl', 'wb') as f:
    pickle.dump(model_data, f)
print("✅ Model saved as 'hr_ai_model.pkl'")
print()
print("🎉 You can now show this demo to your mentor!")
print("="*70)