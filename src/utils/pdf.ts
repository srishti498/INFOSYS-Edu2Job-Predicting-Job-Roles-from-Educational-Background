import { jsPDF } from "jspdf";

import { PredictResponse, PredictionFormPayload } from "@/types/prediction";

export const exportPredictionPDF = (profile: PredictionFormPayload, result: PredictResponse): void => {
    const doc = new jsPDF();
    const now = new Date();

    doc.setFontSize(18);
    doc.text("Edu2Job Predictor Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Generated: ${now.toLocaleString()}`, 14, 28);
    doc.text(`Education: ${profile.education}`, 14, 36);
    doc.text(`Stream: ${profile.stream}`, 14, 42);
    doc.text(`CGPA: ${profile.cgpa}`, 14, 48);
    doc.text(`Internships: ${profile.internships}`, 14, 54);
    doc.text(`Certifications: ${profile.certifications}`, 14, 60);
    doc.text(`Skills: ${profile.skills.join(", ")}`, 14, 66);

    doc.setFontSize(13);
    doc.text("Top Role Predictions", 14, 78);

    let y = 86;
    result.roles.forEach((role, index) => {
        doc.setFontSize(11);
        doc.text(`${index + 1}. ${role.name} - ${role.confidence}%`, 14, y);
        y += 8;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Skill Suggestions", 14, y);
    y += 8;

    result.skill_suggestions.forEach((suggestion) => {
        doc.setFontSize(11);
        doc.text(`- ${suggestion}`, 14, y);
        y += 7;
    });

    y += 3;
    doc.setFontSize(13);
    doc.text("Profile Recommendations", 14, y);
    y += 8;

    result.recommendations.forEach((tip) => {
        doc.setFontSize(11);
        doc.text(`- ${tip.title}: ${tip.detail}`, 14, y, { maxWidth: 180 });
        y += 10;
    });

    doc.save("edu2job-prediction-report.pdf");
};
