import { PredictResponse, PredictedRole } from "@/types/prediction";

export const jobData = {
    cloud: {
        role: "Cloud Engineer",
        required_skills: ["AWS", "Linux", "Networking", "Python"],
        salary_range: "5-12 LPA",
        top_hiring_companies: ["Infosys", "Accenture", "TCS"],
    },
    developer: {
        role: "Software Developer",
        required_skills: ["Java", "DSA", "DBMS"],
        salary_range: "4-10 LPA",
        top_hiring_companies: ["Wipro", "HCL", "Cognizant"],
    },
    data_scientist: {
        role: "Data Scientist",
        required_skills: ["Python", "SQL", "Machine Learning"],
        salary_range: "6-15 LPA",
        top_hiring_companies: ["IBM", "Capgemini", "Deloitte"],
    },
} as const;

type RoleInsightCatalog = {
    required_skills: Record<string, string[]>;
    salary_ranges: Record<string, string>;
    top_hiring_companies: Record<string, string[]>;
    recommended_additional_roles: string[];
};

const ROLE_CATALOG: RoleInsightCatalog = {
    required_skills: {
        [jobData.cloud.role]: [...jobData.cloud.required_skills],
        [jobData.developer.role]: [...jobData.developer.required_skills],
        [jobData.data_scientist.role]: [...jobData.data_scientist.required_skills],
    },
    salary_ranges: {
        [jobData.cloud.role]: jobData.cloud.salary_range,
        [jobData.developer.role]: jobData.developer.salary_range,
        [jobData.data_scientist.role]: jobData.data_scientist.salary_range,
    },
    top_hiring_companies: {
        [jobData.cloud.role]: [...jobData.cloud.top_hiring_companies],
        [jobData.developer.role]: [...jobData.developer.top_hiring_companies],
        [jobData.data_scientist.role]: [...jobData.data_scientist.top_hiring_companies],
    },
    recommended_additional_roles: ["DevOps Engineer", "Backend Developer", "AI Engineer"],
};

export const buildInsightsFromRoleNames = (roleNames: string[]): RoleInsightCatalog => {
    const required_skills: Record<string, string[]> = {};
    const salary_ranges: Record<string, string> = {};
    const top_hiring_companies: Record<string, string[]> = {};

    roleNames.forEach((name) => {
        const skills = ROLE_CATALOG.required_skills[name];
        const salary = ROLE_CATALOG.salary_ranges[name];
        const companies = ROLE_CATALOG.top_hiring_companies[name];

        if (skills) required_skills[name] = skills;
        if (salary) salary_ranges[name] = salary;
        if (companies) top_hiring_companies[name] = companies;
    });

    return {
        required_skills,
        salary_ranges,
        top_hiring_companies,
        recommended_additional_roles: ROLE_CATALOG.recommended_additional_roles,
    };
};

export const withRoleInsightsFallback = (response: PredictResponse): PredictResponse => {
    const roleNames = response.predicted_roles.map((role) => role.role);
    const fallback = buildInsightsFromRoleNames(roleNames);

    return {
        ...response,
        required_skills:
            Object.keys(response.required_skills ?? {}).length > 0 ? response.required_skills : fallback.required_skills,
        recommended_additional_roles:
            (response.recommended_additional_roles ?? []).length > 0
                ? response.recommended_additional_roles
                : fallback.recommended_additional_roles,
        salary_ranges: Object.keys(response.salary_ranges ?? {}).length > 0 ? response.salary_ranges : fallback.salary_ranges,
        top_hiring_companies:
            Object.keys(response.top_hiring_companies ?? {}).length > 0
                ? response.top_hiring_companies
                : fallback.top_hiring_companies,
    };
};

const defaultPredictedRoles = (payloadBranch: string): PredictedRole[] => {
    const branchLower = payloadBranch.toLowerCase();

    if (branchLower.includes("data")) {
        return [
            { role: "Data Scientist", confidence: 44.2, reason: "Strong fit for data-oriented branch" },
            { role: "Software Developer", confidence: 31.5, reason: "Programming and system design potential" },
            { role: "Cloud Engineer", confidence: 24.3, reason: "Good alignment with deployment and scale" },
        ];
    }

    return [
        { role: "Software Developer", confidence: 40.8, reason: "Branch fundamentals align with software engineering" },
        { role: "Cloud Engineer", confidence: 33.6, reason: "Profile indicates infrastructure and systems interest" },
        { role: "Data Scientist", confidence: 25.6, reason: "Analytical track shows data science potential" },
    ];
};

export const createMockPredictResponse = (branch: string): PredictResponse => {
    const predicted_roles = defaultPredictedRoles(branch);
    const roleNames = predicted_roles.map((item) => item.role);
    const insights = buildInsightsFromRoleNames(roleNames);

    return {
        mode: "rule_based",
        predicted_roles,
        profile_strength_score: 72.5,
        top_role_confidence: predicted_roles[0].confidence,
        weights_breakdown: {
            degree_branch: 30,
            specialization: 10,
            cgpa: 15,
            twelfth_percentage: 5,
            tenth_percentage: 5,
            graduation_year: 5,
            college_type: 10,
            major_subject_focus: 10,
            academic_consistency: 10,
        },
        academic_consistency_bonus: 2,
        weaknesses: [],
        improvement_suggestions: [
            "Build one role-specific project for your top predicted job role",
            "Earn one certification aligned to your strongest role",
        ],
        required_skills: insights.required_skills,
        recommended_additional_roles: insights.recommended_additional_roles,
        salary_ranges: insights.salary_ranges,
        top_hiring_companies: insights.top_hiring_companies,
    };
};
