from models.schemas import ImprovementTip, PredictRequest


class RecommendationService:
    def build_skill_suggestions(self, payload: PredictRequest) -> list[str]:
        skills = set(payload.skills)
        suggestions: list[str] = []

        if "python" not in skills:
            suggestions.append("Learn Python fundamentals for analytics and automation roles")
        if not ({"sql", "postgresql", "mysql"} & skills):
            suggestions.append("Add SQL to strengthen data and backend opportunities")
        if not ({"excel", "power bi", "tableau"} & skills):
            suggestions.append("Pick one BI tool (Power BI/Tableau) for analyst profiles")
        if not ({"docker", "kubernetes", "aws", "azure"} & skills):
            suggestions.append("Gain cloud exposure using AWS or Azure plus Docker")
        if payload.internships < 2:
            suggestions.append("Target at least 2 internships to improve practical readiness")

        return suggestions[:4]

    def build_profile_recommendations(self, payload: PredictRequest) -> list[ImprovementTip]:
        tips: list[ImprovementTip] = []

        if payload.cgpa < 7.5:
            tips.append(
                ImprovementTip(
                    title="Raise academic score",
                    detail="Focus on core subjects and mini-project quality to move your CGPA toward 8.0+.",
                )
            )

        if payload.certifications < 2:
            tips.append(
                ImprovementTip(
                    title="Add role-aligned certifications",
                    detail="Complete 1-2 certifications in your top predicted domain to improve shortlist probability.",
                )
            )

        if payload.internships == 0:
            tips.append(
                ImprovementTip(
                    title="Get practical experience",
                    detail="Apply for internships, open-source tasks, or freelance projects to demonstrate execution.",
                )
            )

        tips.append(
            ImprovementTip(
                title="Build a portfolio",
                detail="Maintain a GitHub profile with 3 polished projects and measurable outcomes.",
            )
        )

        return tips[:4]
