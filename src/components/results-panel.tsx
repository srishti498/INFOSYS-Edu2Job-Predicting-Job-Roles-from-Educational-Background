import { Download, Sparkles, Lightbulb, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RoleInsightsPanel } from "@/components/role-insights-panel";
import { PredictResponse, PredictionFormPayload } from "@/types/prediction";

type ResultsPanelProps = {
    result: PredictResponse | null;
    loading: boolean;
    onExport: () => void;
    lastProfile: PredictionFormPayload | null;
};

export const ResultsPanel = ({ result, loading, onExport, lastProfile }: ResultsPanelProps) => {
    return (
        <Card className="rounded-3xl border-white/20 bg-gradient-to-b from-blue-950/40 to-zinc-950/90 text-zinc-100 shadow-2xl shadow-black/30 backdrop-blur-xl dark:border-zinc-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="h-6 w-6 text-blue-400" />
                    Prediction Results
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Based primarily on your educational background (50%+ weight)
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="animate-pulse space-y-2 rounded-2xl border border-zinc-700 bg-zinc-900/80 p-4">
                                <div className="h-3 w-1/2 rounded bg-zinc-700" />
                                <div className="h-2 w-full rounded bg-zinc-800" />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !result && (
                    <p className="text-sm text-zinc-400">Submit a profile to see your top 3 role predictions.</p>
                )}

                {!loading && result && (
                    <>
                        {/* Weight Distribution Breakdown */}
                        <Alert className="border-blue-400/30 bg-blue-950/40">
                            <TrendingUp className="h-4 w-4 text-blue-400" />
                            <AlertDescription className="text-blue-100">
                                <strong>Profile Strength Score:</strong> {result.profile_strength_score.toFixed(1)} / 100
                            </AlertDescription>
                        </Alert>

                        {/* Top Predicted Roles */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-blue-200 flex items-center gap-2">
                                <span>🎯</span> Top 3 Best-Fit Roles
                            </h3>

                            {result.predicted_roles.map((role, index) => (
                                <div
                                    key={role.role}
                                    className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-900/30 to-zinc-900/50 p-5 transition hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/10"
                                >
                                    {/* Role Header */}
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-lg font-semibold text-blue-100">{role.role}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-400">{role.confidence}%</p>
                                            <p className="text-xs text-zinc-400">Confidence</p>
                                        </div>
                                    </div>

                                    {/* Confidence Progress Bar */}
                                    <Progress
                                        value={role.confidence}
                                        className="mb-3 h-2.5 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:via-blue-400 [&>div]:to-cyan-400"
                                    />

                                    {/* Explanation */}
                                    {role.reason && (
                                        <div className="rounded-lg border border-blue-400/20 bg-blue-950/30 p-3 text-sm text-zinc-200">
                                            <p className="flex items-start gap-2">
                                                <span className="mt-0.5 flex-shrink-0 text-blue-300">💡</span>
                                                <span>{role.reason}</span>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Improvement Suggestions Section */}
                        <section className="rounded-2xl border border-amber-500/20 bg-amber-950/30 p-5">
                            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-amber-100">
                                <Lightbulb className="h-5 w-5 text-amber-400" />
                                Improve Your Profile
                            </h3>
                            <div className="grid gap-2 text-sm">
                                {result.improvement_suggestions.length > 0 ? (
                                    result.improvement_suggestions.map((suggestion) => (
                                        <div
                                            key={suggestion}
                                            className="flex items-center gap-2 rounded-lg border border-amber-400/30 bg-amber-950/50 px-3 py-2 text-amber-100"
                                        >
                                            <span>✨</span> {suggestion}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-zinc-400">No additional suggestions at this time.</p>
                                )}
                            </div>
                        </section>

                        {/* Weakness Indicators */}
                        <section className="rounded-2xl border border-green-500/20 bg-green-950/30 p-5">
                            <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-green-100">
                                <TrendingUp className="h-5 w-5 text-green-400" />
                                Weakness Indicator
                            </h3>
                            <div className="space-y-3 text-sm">
                                {result.weaknesses.length > 0 ? (
                                    result.weaknesses.map((tip) => (
                                        <div
                                            key={`${tip.category}-${tip.detail}`}
                                            className="rounded-lg border border-green-400/30 bg-green-950/50 p-3"
                                        >
                                            <p className="font-semibold text-green-100">📌 {tip.category}</p>
                                            <p className="mt-1 text-green-50/80">{tip.detail}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-zinc-400">No major weaknesses detected.</p>
                                )}
                            </div>
                        </section>

                        <RoleInsightsPanel result={result} />

                        {/* Export Button */}
                        <Button
                            onClick={onExport}
                            disabled={!lastProfile}
                            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:opacity-95 disabled:opacity-50"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            📄 Export PDF Report
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

