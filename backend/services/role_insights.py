from dataclasses import dataclass


@dataclass(frozen=True)
class RoleInsight:
    required_skills: list[str]
    salary_range: str
    top_hiring_companies: list[str]


ROLE_INSIGHTS: dict[str, RoleInsight] = {
    "Cloud Engineer": RoleInsight(
        required_skills=["AWS", "Linux", "Networking", "Python"],
        salary_range="5-12 LPA",
        top_hiring_companies=["Infosys", "Accenture", "TCS"],
    ),
    "Software Developer": RoleInsight(
        required_skills=["Java", "DSA", "DBMS"],
        salary_range="4-10 LPA",
        top_hiring_companies=["Wipro", "HCL", "Cognizant"],
    ),
    "Data Scientist": RoleInsight(
        required_skills=["Python", "SQL", "Machine Learning"],
        salary_range="6-15 LPA",
        top_hiring_companies=["IBM", "Capgemini", "Deloitte"],
    ),
}

RECOMMENDED_ADDITIONAL_ROLES = [
    "DevOps Engineer",
    "Backend Developer",
    "AI Engineer",
]


def build_role_insights(predicted_role_names: list[str]) -> dict[str, dict]:
    required_skills: dict[str, list[str]] = {}
    salary_ranges: dict[str, str] = {}
    top_hiring_companies: dict[str, list[str]] = {}

    for role_name in predicted_role_names:
        role_data = ROLE_INSIGHTS.get(role_name)
        if not role_data:
            continue
        required_skills[role_name] = role_data.required_skills
        salary_ranges[role_name] = role_data.salary_range
        top_hiring_companies[role_name] = role_data.top_hiring_companies

    return {
        "required_skills": required_skills,
        "salary_ranges": salary_ranges,
        "top_hiring_companies": top_hiring_companies,
        "recommended_additional_roles": RECOMMENDED_ADDITIONAL_ROLES,
    }