export type Education = "High School" | "Diploma" | "Bachelors" | "Masters" | "PhD";
export type CollegeType = "Tier 1" | "Tier 2" | "Tier 3";

export type PredictionFormPayload = {
    degree: Education;
    branch: string;
    specialization: string;
    cgpa: number;
    tenth_percentage: number;
    twelfth_percentage: number;
    graduation_year: number;
    backlogs: number;
    college_type: CollegeType;
    major_subject_focus: string;
};

export type PredictedRole = {
    role: string;
    confidence: number;
    reason: string;
    influences?: string[];
};

export type ProfileWeakness = {
    category: string;
    detail: string;
    improvement_suggestion: string;
};

export type PredictResponse = {
    mode: "rule_based" | "ml_placeholder";
    predicted_roles: PredictedRole[];
    profile_strength_score: number;
    top_role_confidence: number;
    weights_breakdown: Record<string, number>;
    academic_consistency_bonus?: number;
    weaknesses: ProfileWeakness[];
    improvement_suggestions: string[];
    required_skills: Record<string, string[]>;
    recommended_additional_roles: string[];
    salary_ranges: Record<string, string>;
    top_hiring_companies: Record<string, string[]>;
};

export type HistoryItem = {
    id: number;
    profile: PredictionFormPayload;
    result: PredictResponse;
    created_at: string;
};

export type HistoryResponse = {
    items: HistoryItem[];
};
