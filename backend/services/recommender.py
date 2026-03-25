from models.schemas import ImprovementTip, PredictRequest


class RecommendationService:
    """
    Provides education-centric recommendations.
    Focus on improving academic profile and fundamental skills.
    """

    def build_skill_suggestions(self, payload: PredictRequest) -> list[str]:
        """
        Suggest skills that complement the student's educational background.
        """
        skills = set(payload.skills)
        suggestions: list[str] = []

        stream_lower = payload.stream.lower()

        # Computer Science / IT focused suggestions
        if any(token in stream_lower for token in ["computer", "it", "software", "data"]):
            if "python" not in skills:
                suggestions.append("Learn Python - strongly aligns with CS education")
            if not ({"sql", "postgresql", "mysql"} & skills):
                suggestions.append("Master SQL - essential for data-centric roles")
            if "git" not in skills:
                suggestions.append("Learn Git/GitHub - industry-standard version control")

        # Engineering focused suggestions
        if any(token in stream_lower for token in ["mechanical", "civil", "electronics"]):
            if "cad" not in skills and "autocad" not in skills:
                suggestions.append("Master CAD tools alignment with your engineering degree")
            if not ({"matlab", "simulink"} & skills):
                suggestions.append("Learn MATLAB for advanced engineering problem-solving")

        # Business/Commerce focused suggestions
        if any(token in stream_lower for token in ["business", "commerce"]):
            if not ({"excel", "power bi", "tableau"} & skills):
                suggestions.append("Learn Excel and one BI tool (Power BI/Tableau)")
            if not ({"sql"} & skills):
                suggestions.append("Add SQL for data analysis capabilities")

        # General recommendations based on CGPA
        if payload.cgpa < 8.0:
            suggestions.append(
                "Focus on strengthening fundamental concepts from your core curriculum"
            )

        return suggestions[:4]

    def build_profile_recommendations(
        self, payload: PredictRequest
    ) -> list[ImprovementTip]:
        """
        Provide education-first recommendations.
        Emphasize academic improvement, practical application, and aligned upskilling.
        """
        tips: list[ImprovementTip] = []

        # CGPA-based recommendations (PRIMARY - Education focused)
        if payload.cgpa < 6.0:
            tips.append(
                ImprovementTip(
                    title="🎓 Strengthen Academic Foundation",
                    detail="Focus on core subjects and fundamental concepts. A CGPA of 7.0+ is critical for competitive roles.",
                )
            )
        elif payload.cgpa < 7.5:
            tips.append(
                ImprovementTip(
                    title="📚 Elevate Your Academic Performance",
                    detail="Work toward 7.5 - 8.0+ CGPA to unlock premium roles with better placement opportunities.",
                )
            )

        # Stream-aligned upskilling
        stream_lower = payload.stream.lower()
        if any(token in stream_lower for token in ["computer", "it", "data", "software"]):
            tips.append(
                ImprovementTip(
                    title="💻 Align Skills with Your CS Education",
                    detail="Build projects using Python, SQL, and modern web frameworks that complement your academic learning.",
                )
            )
        elif any(token in stream_lower for token in ["mechanical", "civil", "electronics"]):
            tips.append(
                ImprovementTip(
                    title="🔧 Practical Engineering Application",
                    detail="Apply theoretical concepts in real-world projects. Learn industry tools like CAD, MATLAB, or simulation software.",
                )
            )

        # Internship recommendations based on current count (SECONDARY)
        if len(payload.internships) < 1:
            tips.append(
                ImprovementTip(
                    title="🌟 Gain Hands-On Experience",
                    detail="Pursue at least 1 internship in your predicted field to apply classroom learning practically.",
                )
            )

        # Certification recommendations based on current count (TERTIARY)
        if len(payload.certifications) < 1:
            tips.append(
                ImprovementTip(
                    title="📜 Industry Recognition",
                    detail="Earn 1-2 relevant certifications aligned with your stream to strengthen your profile.",
                )
            )

        if len(tips) < 4:
            tips.append(
                ImprovementTip(
                    title="🚀 Build a Strong Portfolio",
                    detail="Create 2-3 projects that showcase your educational learning and industry readiness.",
                )
            )

        return tips[:4]
