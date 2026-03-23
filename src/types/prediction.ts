export type Education = "High School" | "Diploma" | "Bachelors" | "Masters" | "PhD";

export type PredictionFormPayload = {
    education: Education;
    stream: string;
    cgpa: number;
    internships: number;
    certifications: number;
    skills: string[];
};

export type PredictedRole = {
    name: string;
    confidence: number;
};

export type ImprovementTip = {
    title: string;
    detail: string;
};

export type PredictResponse = {
    mode: "rule_based" | "ml_placeholder";
    roles: PredictedRole[];
    skill_suggestions: string[];
    recommendations: ImprovementTip[];
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
