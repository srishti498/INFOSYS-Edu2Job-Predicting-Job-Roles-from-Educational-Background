import { FormEvent, useState, type ReactNode } from "react";
import { AlertCircle, BookOpen, TrendingUp, GraduationCap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RoleInsightsPanel } from "@/components/role-insights-panel";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { createMockPredictResponse } from "@/lib/role-insights";
import { CollegeType, Education, PredictResponse, PredictionFormPayload } from "@/types/prediction";

const DEFAULT_FORM: PredictionFormPayload = {
    degree: "Bachelors",
    branch: "Computer Science",
    specialization: "AI",
    cgpa: 8.1,
    tenth_percentage: 85,
    twelfth_percentage: 88,
    graduation_year: new Date().getFullYear(),
    backlogs: 0,
    college_type: "Tier 2",
    major_subject_focus: "DSA, DBMS",
};

const DEGREE_OPTIONS: Education[] = [
    "High School",
    "Diploma",
    "Bachelors",
    "Masters",
    "PhD",
];

const BRANCH_OPTIONS = [
    "Computer Science",
    "Information Technology",
    "Data Science",
    "Electronics",
    "Mechanical",
    "Civil",
    "Business",
    "Commerce",
    "Design",
    "Other",
];

const COLLEGE_TYPE_OPTIONS: CollegeType[] = ["Tier 1", "Tier 2", "Tier 3"];

type PredictionFormProps = {
    onSubmit: (payload: PredictionFormPayload) => Promise<void>;
    loading: boolean;
    initial?: PredictionFormPayload;
    result?: PredictResponse | null;
};

const FormField = ({
    label,
    tooltip,
    required,
    children,
}: {
    label: string;
    tooltip?: string;
    required?: boolean;
    children: ReactNode;
}) => (
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <Label className="font-semibold">
                {label}
                {required && <span className="text-red-500">*</span>}
            </Label>
            {tooltip && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button
                                type="button"
                                className="rounded-full bg-blue-100 w-5 h-5 flex items-center justify-center text-blue-600 text-xs font-bold hover:bg-blue-200"
                            >
                                ?
                            </button>
                        </TooltipTrigger>
                        <TooltipContent>{tooltip}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
        {children}
    </div>
);

export const PredictionForm = ({ onSubmit, loading, initial, result }: PredictionFormProps) => {
    const [form, setForm] = useState<PredictionFormPayload>(initial ?? DEFAULT_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const insightsSource = result ?? createMockPredictResponse(form.branch);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!form.degree) newErrors.degree = "Degree is required";
        if (!form.branch) newErrors.branch = "Branch is required";
        if (!form.specialization.trim()) newErrors.specialization = "Specialization is required";
        if (form.cgpa < 0 || form.cgpa > 10) newErrors.cgpa = "CGPA must be between 0 and 10";
        if (form.tenth_percentage < 0 || form.tenth_percentage > 100)
            newErrors.tenth_percentage = "10th percentage must be between 0 and 100";
        if (form.twelfth_percentage < 0 || form.twelfth_percentage > 100)
            newErrors.twelfth_percentage = "12th percentage must be between 0 and 100";
        if (form.graduation_year < 2000 || form.graduation_year > 2100)
            newErrors.graduation_year = "Graduation year must be between 2000 and 2100";
        if (form.backlogs < 0) newErrors.backlogs = "Backlogs cannot be negative";
        if (!form.college_type) newErrors.college_type = "College type is required";
        if (!form.major_subject_focus.trim())
            newErrors.major_subject_focus = "Major subject focus is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (!validateForm()) return;
        await onSubmit(form);
    };

    return (
        <Card className="rounded-3xl border-white/20 bg-white/60 shadow-xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/60">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                <CardTitle className="flex items-center gap-3 text-2xl">
                    <GraduationCap className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    Educational Profile Analysis
                </CardTitle>
                <CardDescription className="text-base">
                    👉 <strong>Primary Prediction Factor</strong> - Provide your complete educational background
                    for accurate job role predictions
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <form className="space-y-8" onSubmit={submit}>
                    {/* === SECTION 1: DEGREE & BRANCH === */}
                    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/30 dark:bg-blue-950/20">
                        <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-blue-900 dark:text-blue-100">
                            <BookOpen className="h-5 w-5" />
                            Academic Foundation (30% Weight)
                        </h3>

                        <div className="grid gap-5 md:grid-cols-2">
                            <FormField label="Degree" tooltip="Highest academic qualification" required>
                                <Select
                                    value={form.degree}
                                    onValueChange={(value) =>
                                        setForm((prev) => ({ ...prev, degree: value as Education }))
                                    }
                                >
                                    <SelectTrigger
                                        className={`bg-white dark:bg-zinc-900 ${errors.degree
                                            ? "border-red-500"
                                            : "border-blue-300 dark:border-blue-800"
                                            }`}
                                    >
                                        <SelectValue placeholder="Select degree" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DEGREE_OPTIONS.map((d) => (
                                            <SelectItem key={d} value={d}>
                                                {d}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.degree && (
                                    <p className="text-sm text-red-500">{errors.degree}</p>
                                )}
                            </FormField>

                            <FormField label="Branch" tooltip="Your field of study" required>
                                <Select
                                    value={form.branch}
                                    onValueChange={(value) =>
                                        setForm((prev) => ({ ...prev, branch: value }))
                                    }
                                >
                                    <SelectTrigger
                                        className={`bg-white dark:bg-zinc-900 ${errors.branch
                                            ? "border-red-500"
                                            : "border-blue-300 dark:border-blue-800"
                                            }`}
                                    >
                                        <SelectValue placeholder="Select branch" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BRANCH_OPTIONS.map((b) => (
                                            <SelectItem key={b} value={b}>
                                                {b}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.branch && (
                                    <p className="text-sm text-red-500">{errors.branch}</p>
                                )}
                            </FormField>

                            <FormField
                                label="Specialization"
                                tooltip="e.g., AI, ML, Web Dev, Cybersecurity"
                                required
                            >
                                <Input
                                    value={form.specialization}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            specialization: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g., Artificial Intelligence"
                                    className={`bg-white dark:bg-zinc-900 ${errors.specialization
                                        ? "border-red-500"
                                        : "border-blue-300 dark:border-blue-800"
                                        }`}
                                />
                                {errors.specialization && (
                                    <p className="text-sm text-red-500">{errors.specialization}</p>
                                )}
                            </FormField>

                            <FormField label="College Type" tooltip="Tier 1: IITs, etc. | Tier 2: NIT, BITS | Tier 3: Others" required>
                                <Select
                                    value={form.college_type}
                                    onValueChange={(value) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            college_type: value as CollegeType,
                                        }))
                                    }
                                >
                                    <SelectTrigger
                                        className={`bg-white dark:bg-zinc-900 ${errors.college_type
                                            ? "border-red-500"
                                            : "border-blue-300 dark:border-blue-800"
                                            }`}
                                    >
                                        <SelectValue placeholder="Select college tier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COLLEGE_TYPE_OPTIONS.map((t) => (
                                            <SelectItem key={t} value={t}>
                                                {t}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.college_type && (
                                    <p className="text-sm text-red-500">{errors.college_type}</p>
                                )}
                            </FormField>
                        </div>
                    </div>

                    {/* === SECTION 2: ACADEMIC PERFORMANCE === */}
                    <div className="rounded-2xl border-2 border-purple-200 bg-purple-50/50 p-6 dark:border-purple-900/30 dark:bg-purple-950/20">
                        <h3 className="mb-5 flex items-center gap-2 text-lg font-bold text-purple-900 dark:text-purple-100">
                            <TrendingUp className="h-5 w-5" />
                            Academic Performance (35% Weight)
                        </h3>

                        <div className="grid gap-5 md:grid-cols-3">
                            <FormField
                                label="CGPA"
                                tooltip="Current CGPA on 10-point scale"
                                required
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    max={10}
                                    step={0.1}
                                    value={form.cgpa}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            cgpa: parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    placeholder="e.g., 8.5"
                                    className={`bg-white dark:bg-zinc-900 ${errors.cgpa
                                        ? "border-red-500"
                                        : "border-purple-300 dark:border-purple-800"
                                        }`}
                                />
                                {errors.cgpa && (
                                    <p className="text-sm text-red-500">{errors.cgpa}</p>
                                )}
                            </FormField>

                            <FormField
                                label="10th Percentage"
                                tooltip="Board exam score from 10th grade"
                                required
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={0.1}
                                    value={form.tenth_percentage}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            tenth_percentage: parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    placeholder="e.g., 85"
                                    className={`bg-white dark:bg-zinc-900 ${errors.tenth_percentage
                                        ? "border-red-500"
                                        : "border-purple-300 dark:border-purple-800"
                                        }`}
                                />
                                {errors.tenth_percentage && (
                                    <p className="text-sm text-red-500">{errors.tenth_percentage}</p>
                                )}
                            </FormField>

                            <FormField
                                label="12th Percentage"
                                tooltip="Board exam score from 12th grade"
                                required
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    max={100}
                                    step={0.1}
                                    value={form.twelfth_percentage}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            twelfth_percentage: parseFloat(e.target.value) || 0,
                                        }))
                                    }
                                    placeholder="e.g., 88"
                                    className={`bg-white dark:bg-zinc-900 ${errors.twelfth_percentage
                                        ? "border-red-500"
                                        : "border-purple-300 dark:border-purple-800"
                                        }`}
                                />
                                {errors.twelfth_percentage && (
                                    <p className="text-sm text-red-500">
                                        {errors.twelfth_percentage}
                                    </p>
                                )}
                            </FormField>
                        </div>
                    </div>

                    {/* === SECTION 3: GRADUATION & ACADEMIC STATUS === */}
                    <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 p-6 dark:border-emerald-900/30 dark:bg-emerald-950/20">
                        <h3 className="mb-5 text-lg font-bold text-emerald-900 dark:text-emerald-100">
                            Graduation & Academic Status (15% Weight)
                        </h3>

                        <div className="grid gap-5 md:grid-cols-3">
                            <FormField
                                label="Graduation Year"
                                tooltip="Expected or actual graduation year"
                                required
                            >
                                <Input
                                    type="number"
                                    min={2000}
                                    max={2100}
                                    value={form.graduation_year}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            graduation_year: parseInt(e.target.value) || 2024,
                                        }))
                                    }
                                    placeholder="e.g., 2024"
                                    className={`bg-white dark:bg-zinc-900 ${errors.graduation_year
                                        ? "border-red-500"
                                        : "border-emerald-300 dark:border-emerald-800"
                                        }`}
                                />
                                {errors.graduation_year && (
                                    <p className="text-sm text-red-500">{errors.graduation_year}</p>
                                )}
                            </FormField>

                            <FormField
                                label="Backlogs"
                                tooltip="Number of pending backlogs (courses to retake)"
                                required
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    value={form.backlogs}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            backlogs: Math.max(0, parseInt(e.target.value) || 0),
                                        }))
                                    }
                                    placeholder="0"
                                    className={`bg-white dark:bg-zinc-900 ${errors.backlogs
                                        ? "border-red-500"
                                        : "border-emerald-300 dark:border-emerald-800"
                                        }`}
                                />
                                {errors.backlogs && (
                                    <p className="text-sm text-red-500">{errors.backlogs}</p>
                                )}
                            </FormField>

                            <FormField
                                label="Major Subject Focus"
                                tooltip="e.g., DSA, DBMS, ML, Statistics"
                                required
                            >
                                <Input
                                    value={form.major_subject_focus}
                                    onChange={(e) =>
                                        setForm((prev) => ({
                                            ...prev,
                                            major_subject_focus: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g., DSA, DBMS"
                                    className={`bg-white dark:bg-zinc-900 ${errors.major_subject_focus
                                        ? "border-red-500"
                                        : "border-emerald-300 dark:border-emerald-800"
                                        }`}
                                />
                                {errors.major_subject_focus && (
                                    <p className="text-sm text-red-500">
                                        {errors.major_subject_focus}
                                    </p>
                                )}
                            </FormField>
                        </div>
                    </div>

                    <section className="space-y-3 animate-in fade-in duration-500">
                        <div className="flex flex-col gap-1">
                            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Role-Aligned Career Insights</h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                {result
                                    ? "Dynamic insights based on your latest predicted roles."
                                    : "Preview insights from mock job data. Submit to load live prediction-based insights."}
                            </p>
                        </div>

                        <RoleInsightsPanel result={insightsSource} surface="light" />
                    </section>

                    {/* === INFO BOX: WEIGHT DISTRIBUTION === */}
                    <Alert className="border-2 border-blue-300 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-950/30">
                        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <AlertDescription className="text-blue-900 dark:text-blue-100">
                            <strong>Prediction Engine Weights:</strong>
                            <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                                <li>Degree + Branch: 30%</li>
                                <li>CGPA: 15%</li>
                                <li>12th Percentage: 5%</li>
                                <li>10th Percentage: 5%</li>
                                <li>Graduation Year: 5%</li>
                                <li>College Type: 10%</li>
                                <li>Major Subject Focus: 10%</li>
                                <li>Specialization: 10%</li>
                                <li>Backlogs: -10% penalty if present</li>
                            </ul>
                        </AlertDescription>
                    </Alert>

                    {/* === SUBMIT BUTTON === */}
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 py-6 text-lg font-bold text-white shadow-lg shadow-blue-500/40 hover:shadow-xl hover:shadow-blue-500/60 disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Analyzing Profile...
                            </span>
                        ) : (
                            <span>🚀 Predict Best-Fit Roles</span>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

