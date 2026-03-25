import { jsPDF } from "jspdf";

import { PredictResponse, PredictionFormPayload } from "@/types/prediction";

export const exportPredictionPDF = (profile: PredictionFormPayload, result: PredictResponse): void => {
    const doc = new jsPDF();
    const now = new Date();

    doc.setFontSize(18);
    doc.text("Edu2Job Predictor Report", 14, 20);

    doc.setFontSize(11);
    doc.text(`Generated: ${now.toLocaleString()}`, 14, 28);
    doc.text(`Degree: ${profile.degree}`, 14, 36);
    doc.text(`Branch: ${profile.branch}`, 14, 42);
    doc.text(`CGPA: ${profile.cgpa}`, 14, 48);
    doc.text(`10th Percentage: ${profile.tenth_percentage}`, 14, 54);
    doc.text(`12th Percentage: ${profile.twelfth_percentage}`, 14, 60);
    doc.text(`Graduation Year: ${profile.graduation_year}`, 14, 66);
    doc.text(`Backlogs: ${profile.backlogs}`, 14, 72);
    doc.text(`College Type: ${profile.college_type}`, 14, 78);
    doc.text(`Major Subject Focus: ${profile.major_subject_focus}`, 14, 84, { maxWidth: 180 });

    doc.setFontSize(13);
    doc.text("Top Role Predictions", 14, 98);

    let y = 106;
    result.predicted_roles.forEach((role, index) => {
        doc.setFontSize(11);
        doc.text(`${index + 1}. ${role.role} - ${role.confidence}%`, 14, y);
        y += 8;
    });

    y += 4;
    doc.setFontSize(13);
    doc.text("Improvement Suggestions", 14, y);
    y += 8;

    result.improvement_suggestions.forEach((suggestion) => {
        doc.setFontSize(11);
        doc.text(`- ${suggestion}`, 14, y);
        y += 7;
    });

    y += 3;
    doc.setFontSize(13);
    doc.text("Weakness Indicators", 14, y);
    y += 8;

    result.weaknesses.forEach((tip) => {
        doc.setFontSize(11);
        doc.text(`- ${tip.category}: ${tip.detail}`, 14, y, { maxWidth: 180 });
        y += 10;
    });

    doc.save("edu2job-prediction-report.pdf");
};
