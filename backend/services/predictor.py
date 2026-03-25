from typing import Protocol

from models.schemas import PredictRequest, PredictedRole, ProfileWeakness

# ============================================================================
# BRANCH-TO-ROLES MAPPING (30% weight in scoring)
# ============================================================================
BRANCH_ROLES = {
    "computer science": {
        "roles": [
            "Software Developer",
            "Data Scientist",
            "Cloud Engineer",
            "Cybersecurity Analyst",
            "Data Analyst",
            "QA Engineer",
        ],
        "weight": 1.0,
    },
    "information technology": {
        "roles": [
            "Software Developer",
            "Cloud Engineer",
            "Cybersecurity Analyst",
            "QA Engineer",
            "Data Analyst",
            "Business Analyst",
        ],
        "weight": 1.0,
    },
    "data science": {
        "roles": [
            "Data Scientist",
            "Data Analyst",
            "Software Developer",
            "Cloud Engineer",
            "Business Analyst",
        ],
        "weight": 1.0,
    },
    "mechanical": {
        "roles": [
            "Mechanical Engineer",
            "Quality Engineer",
            "Manufacturing Engineer",
            "Mechanical Designer",
        ],
        "weight": 1.0,
    },
    "civil": {
        "roles": [
            "Site Engineer",
            "Structural Engineer",
            "Civil Designer",
            "Project Manager",
        ],
        "weight": 1.0,
    },
    "electronics": {
        "roles": [
            "Electronics Engineer",
            "Embedded Systems Engineer",
            "Cybersecurity Analyst",
            "QA Engineer",
        ],
        "weight": 1.0,
    },
    "business": {
        "roles": [
            "Business Analyst",
            "Data Analyst",
            "Project Manager",
            "Product Manager",
        ],
        "weight": 1.0,
    },
    "commerce": {
        "roles": [
            "Business Analyst",
            "Data Analyst",
            "Financial Analyst",
            "Product Manager",
        ],
        "weight": 1.0,
    },
    "design": {
        "roles": [
            "UI/UX Designer",
            "Product Designer",
            "Graphic Designer",
        ],
        "weight": 1.0,
    },
}

# ============================================================================
# SPECIALIZATION-TO-ROLES MAPPING (10% weight in scoring)
# ============================================================================
SPECIALIZATION_ROLES = {
    "ai": ["Data Scientist", "Software Developer", "Cloud Engineer"],
    "ml": ["Data Scientist", "Data Analyst", "Software Developer"],
    "artificial intelligence": ["Data Scientist", "Software Developer"],
    "machine learning": ["Data Scientist", "Data Analyst"],
    "web development": ["Software Developer", "Cloud Engineer", "QA Engineer"],
    "web dev": ["Software Developer", "Cloud Engineer"],
    "cybersecurity": ["Cybersecurity Analyst", "QA Engineer"],
    "security": ["Cybersecurity Analyst", "Software Developer"],
    "data science": ["Data Scientist", "Data Analyst"],
    "data engineering": ["Data Scientist", "Cloud Engineer"],
    "cloud computing": ["Cloud Engineer", "Software Developer"],
}

# ============================================================================
# MAJOR SUBJECT FOCUS MAPPING (10% weight in scoring)
# ============================================================================
SUBJECT_FOCUS_BOOST = {
    "dsa": ["Software Developer", "Cloud Engineer"],
    "data structures": ["Software Developer", "Cloud Engineer"],
    "dbms": ["Software Developer", "Data Analyst"],
    "database": ["Data Scientist", "Data Analyst"],
    "ml": ["Data Scientist", "Data Analyst"],
    "machine learning": ["Data Scientist", "Data Analyst"],
    "stats": ["Data Scientist", "Data Analyst"],
    "statistics": ["Data Scientist", "Data Analyst"],
    "operating systems": ["Software Developer", "Cloud Engineer"],
    "os": ["Software Developer", "Cloud Engineer"],
    "networking": ["Cloud Engineer", "Cybersecurity Analyst"],
    "networks": ["Cloud Engineer", "Cybersecurity Analyst"],
    "algorithms": ["Software Developer", "Cloud Engineer"],
    "web": ["Software Developer", "UI/UX Designer"],
}

# ============================================================================
# COLLEGE TIER IMPACT (10% weight in scoring)
# ============================================================================
COLLEGE_TYPE_BOOST = {
    "Tier 1": 1.3,  # 30% boost
    "Tier 2": 1.15,  # 15% boost
    "Tier 3": 1.05,  # 5% boost
}


# ============================================================================
# ALL AVAILABLE ROLES
# ============================================================================
ALL_ROLES = {
    "Software Developer",
    "Data Scientist",
    "Data Analyst",
    "Cloud Engineer",
    "Cybersecurity Analyst",
    "QA Engineer",
    "Business Analyst",
    "UI/UX Designer",
    "Mechanical Engineer",
    "Quality Engineer",
    "Manufacturing Engineer",
    "Electronics Engineer",
    "Embedded Systems Engineer",
    "Site Engineer",
    "Structural Engineer",
    "Project Manager",
    "Product Manager",
    "Product Designer",
    "Graphic Designer",
    "Financial Analyst",
    "Mechanical Designer",
    "Civil Designer",
}


class EducationDatasetPredictor:
    """
    COMPREHENSIVE EDUCATION DATASET PREDICTOR
    
    Implements a sophisticated weighted scoring engine using:
    - Degree + Branch: 30%
    - Specialization: 10%
    - CGPA: 15%
    - 12th Percentage: 5%
    - 10th Percentage: 5%
    - Graduation Year: 5%
    - Backlogs: -10% penalty if >0
    - College Type: 10%
    - Major Subject Focus: 10%
    - Skills/Other: 10% (if present)
    """

    mode = "rule_based"

    def predict(self, payload: PredictRequest) -> tuple[list[PredictedRole], dict]:
        """
        Predict job roles based on structured educational data.
        
        Returns:
            - list[PredictedRole]: Top predicted roles with confidence
            - dict: Scoring breakdown and influences
        """
        # Initialize role scores
        base_scores = {role: 0.0 for role in ALL_ROLES}
        influences = {role: [] for role in ALL_ROLES}
        
        # ===== SCORE CALCULATION (WITH WEIGHTS) =====
        
        # 1. Degree + Branch (30% weight)
        branch_scores, branch_inf = self._calculate_branch_score(payload.branch)
        for role in base_scores:
            base_scores[role] += branch_scores.get(role, 0) * 0.30
            if branch_inf.get(role):
                influences[role].extend(branch_inf[role])
        
        # 2. Specialization (10% weight)
        spec_scores, spec_inf = self._calculate_specialization_score(payload.specialization)
        for role in base_scores:
            base_scores[role] += spec_scores.get(role, 0) * 0.10
            if spec_inf.get(role):
                influences[role].append(spec_inf[role])
        
        # 3. CGPA (15% weight)
        cgpa_scores, cgpa_inf = self._calculate_cgpa_score(payload.cgpa)
        for role in base_scores:
            base_scores[role] += cgpa_scores.get(role, 0) * 0.15
            if cgpa_inf.get(role):
                influences[role].append(cgpa_inf[role])
        
        # 4. 12th Percentage (5% weight)
        twelfth_scores, twelfth_inf = self._calculate_percentage_score(payload.twelfth_percentage)
        for role in base_scores:
            base_scores[role] += twelfth_scores.get(role, 0) * 0.05
            if twelfth_inf.get(role):
                influences[role].append(twelfth_inf[role])
        
        # 5. 10th Percentage (5% weight)
        tenth_scores, tenth_inf = self._calculate_percentage_score(payload.tenth_percentage)
        for role in base_scores:
            base_scores[role] += tenth_scores.get(role, 0) * 0.05
            if tenth_inf.get(role):
                influences[role].append(tenth_inf[role])
        
        # 6. Graduation Year (5% weight)
        year_scores, year_inf = self._calculate_graduation_year_score(payload.graduation_year)
        for role in base_scores:
            base_scores[role] += year_scores.get(role, 0) * 0.05
            if year_inf.get(role):
                influences[role].append(year_inf[role])
        
        # 7. College Type (10% weight)
        college_boost = self._calculate_college_type_boost(payload.college_type)
        for role in base_scores:
            base_scores[role] *= college_boost
        influences_college = f"College Tier {payload.college_type} profile"
        for role in influences:
            influences[role].append(influences_college)
        
        # 8. Major Subject Focus (10% weight)
        subject_scores, subject_inf = self._calculate_subject_focus_score(payload.major_subject_focus)
        for role in base_scores:
            base_scores[role] += subject_scores.get(role, 0) * 0.10
            if subject_inf.get(role):
                influences[role].append(subject_inf[role])
        
        # 9. Backlogs Penalty (-10% if >0)
        if payload.backlogs > 0:
            backlog_penalty = 0.90  # 10% reduction
            for role in base_scores:
                base_scores[role] *= backlog_penalty
            for role in influences:
                influences[role].append(f"Backlogs ({payload.backlogs}) reduce confidence")
        
        # 10. Academic Consistency Bonus (if good progression)
        consistency_bonus = self._calculate_academic_consistency(
            payload.tenth_percentage, payload.twelfth_percentage, payload.cgpa
        )
        if consistency_bonus > 0:
            for role in base_scores:
                base_scores[role] += consistency_bonus
            for role in influences:
                influences[role].append("Strong academic progression")
        
        # ===== RANK AND NORMALIZE =====
        ranked = sorted(base_scores.items(), key=lambda x: x[1], reverse=True)[:3]
        total_score = sum(max(score, 0.1) for _, score in ranked)
        
        predicted_roles = []
        for role, score in ranked:
            confidence = round((max(score, 0.1) / total_score) * 100, 1)
            reason = self._generate_explanation(
                role, payload.branch, payload.specialization, payload.cgpa, payload.college_type
            )
            predicted_roles.append(
                PredictedRole(
                    role=role,
                    confidence=confidence,
                    reason=reason,
                    influences=influences.get(role, [])[:5],  # Top 5 influences
                )
            )
        
        weights_breakdown = {
            "degree_branch": 30,
            "specialization": 10,
            "cgpa": 15,
            "twelfth_percentage": 5,
            "tenth_percentage": 5,
            "graduation_year": 5,
            "college_type": 10,
            "major_subject_focus": 10,
            "backlogs_penalty": -10,
            "academic_consistency": 10,
        }
        
        return predicted_roles, weights_breakdown
    
    def _calculate_branch_score(self, branch: str) -> tuple[dict[str, float], dict[str, list]]:
        """Calculate score based on branch (30% weight)"""
        scores = {role: 0.0 for role in ALL_ROLES}
        influences = {role: [] for role in ALL_ROLES}
        
        branch_lower = branch.lower()
        matched_branch = None
        
        for branch_key, data in BRANCH_ROLES.items():
            if any(token in branch_lower for token in branch_key.split()):
                matched_branch = branch_key
                break
        
        if matched_branch:
            for role in BRANCH_ROLES[matched_branch]["roles"]:
                if role in scores:
                    scores[role] = 10.0
                    influences[role] = [f"Strong match with {branch} branch"]
        
        return scores, influences
    
    def _calculate_specialization_score(self, specialization: str) -> tuple[dict[str, float], dict[str, str]]:
        """Calculate score based on specialization (10% weight)"""
        scores = {role: 0.0 for role in ALL_ROLES}
        influences = {role: "" for role in ALL_ROLES}
        
        spec_lower = specialization.lower()
        
        for spec_key, roles in SPECIALIZATION_ROLES.items():
            if spec_key in spec_lower:
                for role in roles:
                    if role in scores:
                        scores[role] = 8.0
                        influences[role] = f"Specialization in {specialization}"
        
        return scores, influences
    
    def _calculate_cgpa_score(self, cgpa: float) -> tuple[dict[str, float], dict[str, str]]:
        """Calculate score based on CGPA (15% weight)"""
        scores = {role: 0.0 for role in ALL_ROLES}
        influences = {role: "" for role in ALL_ROLES}
        
        if cgpa >= 9.0:
            cgpa_score = 10.0
            cgpa_text = f"Excellent CGPA ({cgpa})"
        elif cgpa >= 8.5:
            cgpa_score = 9.0
            cgpa_text = f"Very Good CGPA ({cgpa})"
        elif cgpa >= 8.0:
            cgpa_score = 8.0
            cgpa_text = f"Good CGPA ({cgpa})"
        elif cgpa >= 7.0:
            cgpa_score = 6.0
            cgpa_text = f"Satisfactory CGPA ({cgpa})"
        elif cgpa >= 6.0:
            cgpa_score = 4.0
            cgpa_text = f"Moderate CGPA ({cgpa})"
        else:
            cgpa_score = 2.0
            cgpa_text = f"Low CGPA ({cgpa})"
        
        for role in scores:
            scores[role] = cgpa_score
            influences[role] = cgpa_text
        
        return scores, influences
    
    def _calculate_percentage_score(self, percentage: float) -> tuple[dict[str, float], dict[str, str]]:
        """Calculate score based on board percentages (5% each)"""
        scores = {role: 0.0 for role in ALL_ROLES}
        influences = {role: "" for role in ALL_ROLES}
        
        if percentage >= 90:
            score = 10.0
        elif percentage >= 80:
            score = 8.0
        elif percentage >= 70:
            score = 6.0
        elif percentage >= 60:
            score = 4.0
        else:
            score = 2.0
        
        for role in scores:
            scores[role] = score
        
        return scores, influences
    
    def _calculate_graduation_year_score(self, graduation_year: int) -> tuple[dict[str, float], dict[str, str]]:
        """Calculate score based on graduation year (5% weight)"""
        from datetime import datetime
        
        scores = {role: 0.0 for role in ALL_ROLES}
        influences = {role: "" for role in ALL_ROLES}
        
        current_year = datetime.now().year
        years_since_graduation = current_year - graduation_year
        
        # Recent graduates get higher score
        if years_since_graduation <= 1:
            score = 9.0
        elif years_since_graduation <= 3:
            score = 8.0
        elif years_since_graduation <= 5:
            score = 7.0
        else:
            score = 6.0
        
        for role in scores:
            scores[role] = score
        
        return scores, influences
    
    def _calculate_college_type_boost(self, college_type: str) -> float:
        """Get college type multiplier (10% weight)"""
        return COLLEGE_TYPE_BOOST.get(college_type, 1.0)
    
    def _calculate_subject_focus_score(self, major_subject_focus: str) -> tuple[dict[str, float], dict[str, str]]:
        """Calculate score based on major subject focus (10% weight)"""
        scores = {role: 0.0 for role in ALL_ROLES}
        influences = {role: "" for role in ALL_ROLES}
        
        focus_lower = major_subject_focus.lower()
        
        for subject_key, roles in SUBJECT_FOCUS_BOOST.items():
            if subject_key in focus_lower:
                for role in roles:
                    if role in scores:
                        scores[role] = 8.0
                        influences[role] = f"Strong focus on {subject_key.upper()}"
        
        return scores, influences
    
    def _calculate_academic_consistency(self, tenth: float, twelfth: float, cgpa: float) -> float:
        """Bonus for good academic progression"""
        # Check if student improved from 10th to 12th
        improvement_10_to_12 = twelfth - tenth
        
        # Check if CGPA is consistent with 12th percentage
        expected_cgpa_from_12th = (twelfth / 100) * 10
        cgpa_consistency = abs(expected_cgpa_from_12th - cgpa) < 1.0
        
        bonus = 0.0
        if improvement_10_to_12 > 5:  # Improvement of >5%
            bonus += 1.0
        if cgpa_consistency:
            bonus += 1.0
        
        return min(bonus, 2.0)
    
    def _generate_explanation(self, role: str, branch: str, specialization: str, cgpa: float, college_type: str) -> str:
        """Generate human-readable explanation"""
        reasons = []
        
        # Branch alignment
        reasons.append(f"Your {branch} background aligns with {role} requirements.")
        
        # Specialization match
        if specialization:
            reasons.append(f"Specialization in {specialization} strengthens your profile.")
        
        # CGPA assessment
        if cgpa >= 8.5:
            reasons.append(f"Strong CGPA ({cgpa}) enhances your competitiveness.")
        elif cgpa >= 7.0:
            reasons.append(f"CGPA ({cgpa}) meets industry standards for this role.")
        
        # College tier impact
        if college_type == "Tier 1":
            reasons.append("Your institution's reputation provides additional advantage.")
        
        return " ".join(reasons)


class MLReadyPredictorFacade:
    """Facade pattern for stable API with future ML model support."""

    def __init__(self) -> None:
        self.predictor = EducationDatasetPredictor()

    def predict(self, payload: PredictRequest) -> tuple[str, list[PredictedRole]]:
        """
        Predict job roles using the current predictor.
        
        Future: Can swap EducationDatasetPredictor with MLPredictor seamlessly.
        """
        roles, _breakdown = self.predictor.predict(payload)
        return self.predictor.mode, roles
