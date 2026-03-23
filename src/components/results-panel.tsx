import { Download, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PredictResponse, PredictionFormPayload } from "@/types/prediction";

type ResultsPanelProps = {
    result: PredictResponse | null;
    loading: boolean;
    onExport: () => void;
    lastProfile: PredictionFormPayload | null;
};

export const ResultsPanel = ({ result, loading, onExport, lastProfile }: ResultsPanelProps) => {
    return (
        <Card className="rounded-3xl border-white/20 bg-zinc-950/90 text-zinc-100 shadow-2xl shadow-black/30 backdrop-blur-xl dark:border-zinc-700">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Sparkles className="h-5 w-5 text-amber-300" />
                    Prediction Results
                </CardTitle>
                <CardDescription className="text-zinc-400">Ranked confidence from the current rule engine.</CardDescription>
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

                {!loading && !result && <p className="text-sm text-zinc-400">Submit a profile to see your top 3 role predictions.</p>}

                {!loading && result && (
                    <>
                        <div className="space-y-4">
                            {result.roles.map((role, index) => (
                                <div
                                    key={role.name}
                                    className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900 to-zinc-800/80 p-4 transition hover:border-orange-400/40"
                                >
                                    <div className="mb-2 flex items-center justify-between text-sm">
                                        <span className="font-semibold text-zinc-100">
                                            {index + 1}. {role.name}
                                        </span>
                                        <span className="text-amber-300">{role.confidence}%</span>
                                    </div>
                                    <Progress
                                        value={role.confidence}
                                        className="h-2 bg-zinc-800 [&>div]:bg-gradient-to-r [&>div]:from-amber-500 [&>div]:to-orange-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                            <h3 className="text-sm font-semibold text-zinc-100">Skill Suggestions</h3>
                            <ul className="space-y-2 text-sm text-zinc-300">
                                {result.skill_suggestions.map((item) => (
                                    <li key={item}>• {item}</li>
                                ))}
                            </ul>
                        </section>

                        <section className="space-y-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                            <h3 className="text-sm font-semibold text-zinc-100">Improve Your Profile</h3>
                            <ul className="space-y-2 text-sm text-zinc-300">
                                {result.recommendations.map((tip) => (
                                    <li key={tip.title}>
                                        <p className="font-medium text-zinc-100">{tip.title}</p>
                                        <p>{tip.detail}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <Button
                            onClick={onExport}
                            disabled={!lastProfile}
                            className="w-full rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:opacity-95"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF Report
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
};
