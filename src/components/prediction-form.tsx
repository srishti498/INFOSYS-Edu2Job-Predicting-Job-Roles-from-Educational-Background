import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Education, PredictionFormPayload } from "@/types/prediction";

const DEFAULT_FORM: PredictionFormPayload = {
    education: "Bachelors",
    stream: "Computer Science",
    cgpa: 8.1,
    internships: 1,
    certifications: 1,
    skills: ["python", "sql", "react"],
};

const STREAM_OPTIONS = [
    "Computer Science",
    "Information Technology",
    "Data Science",
    "Business",
    "Commerce",
    "Design",
    "Mechanical",
    "Civil",
    "Electronics",
    "Other",
];

type PredictionFormProps = {
    onSubmit: (payload: PredictionFormPayload) => Promise<void>;
    loading: boolean;
    initial?: PredictionFormPayload;
};

export const PredictionForm = ({ onSubmit, loading, initial }: PredictionFormProps) => {
    const [form, setForm] = useState<PredictionFormPayload>(initial ?? DEFAULT_FORM);
    const [skillsInput, setSkillsInput] = useState((initial?.skills ?? DEFAULT_FORM.skills).join(", "));

    const parsedSkills = useMemo(
        () =>
            skillsInput
                .split(",")
                .map((skill) => skill.trim().toLowerCase())
                .filter(Boolean),
        [skillsInput],
    );

    const canSubmit = parsedSkills.length > 0 && form.stream.trim().length >= 2;

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        await onSubmit({ ...form, skills: parsedSkills });
    };

    return (
        <Card className="rounded-3xl border-white/20 bg-white/60 shadow-xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/60">
            <CardHeader>
                <CardTitle className="text-2xl">Student Profile Input</CardTitle>
                <CardDescription>Provide profile details to generate top 3 role predictions.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4" onSubmit={submit}>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Education</Label>
                            <Select
                                value={form.education}
                                onValueChange={(value) => setForm((prev) => ({ ...prev, education: value as Education }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select education" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="High School">High School</SelectItem>
                                    <SelectItem value="Diploma">Diploma</SelectItem>
                                    <SelectItem value="Bachelors">Bachelors</SelectItem>
                                    <SelectItem value="Masters">Masters</SelectItem>
                                    <SelectItem value="PhD">PhD</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Stream</Label>
                            <Select value={form.stream} onValueChange={(value) => setForm((prev) => ({ ...prev, stream: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select stream" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STREAM_OPTIONS.map((stream) => (
                                        <SelectItem key={stream} value={stream}>
                                            {stream}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label>CGPA (0-10)</Label>
                            <Input
                                type="number"
                                min={0}
                                max={10}
                                step={0.1}
                                value={form.cgpa}
                                onChange={(event) => setForm((prev) => ({ ...prev, cgpa: Number(event.target.value) || 0 }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Internships</Label>
                            <Input
                                type="number"
                                min={0}
                                value={form.internships}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, internships: Math.max(0, Number(event.target.value) || 0) }))
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Certifications</Label>
                            <Input
                                type="number"
                                min={0}
                                value={form.certifications}
                                onChange={(event) =>
                                    setForm((prev) => ({ ...prev, certifications: Math.max(0, Number(event.target.value) || 0) }))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Skills (comma separated)</Label>
                        <Textarea
                            rows={4}
                            value={skillsInput}
                            onChange={(event) => setSkillsInput(event.target.value)}
                            placeholder="python, sql, machine learning, power bi"
                        />
                        <p className="text-xs text-muted-foreground">Recognized skills: {parsedSkills.join(", ") || "none"}</p>
                    </div>

                    <Button
                        type="submit"
                        disabled={!canSubmit || loading}
                        className="w-full rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/30 hover:opacity-95"
                    >
                        {loading ? "Predicting Roles..." : "Predict Best-Fit Roles"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};
