import { History } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HistoryItem } from "@/types/prediction";

type HistoryPanelProps = {
    history: HistoryItem[];
};

export const HistoryPanel = ({ history }: HistoryPanelProps) => {
    const getTopRole = (item: HistoryItem): string => {
        const legacyRoles = (item.result as unknown as { roles?: Array<{ name?: string }> }).roles;
        return item.result.predicted_roles?.[0]?.role ?? legacyRoles?.[0]?.name ?? "N/A";
    };

    const getProfileSummary = (item: HistoryItem): string => {
        const legacyProfile = item.profile as unknown as { education?: string; stream?: string; cgpa?: number };
        const degree = item.profile.degree ?? legacyProfile.education ?? "N/A";
        const branch = item.profile.branch ?? legacyProfile.stream ?? "N/A";
        const cgpa = item.profile.cgpa ?? legacyProfile.cgpa ?? "N/A";
        return `${degree} • ${branch} • CGPA ${cgpa}`;
    };

    if (!history.length) {
        return (
            <Card className="rounded-3xl border-white/20 bg-white/60 shadow-xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/60">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <History className="h-5 w-5" /> Recent Predictions
                    </CardTitle>
                    <CardDescription>No history yet. Submit your first prediction.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="rounded-3xl border-white/20 bg-white/60 shadow-xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/60">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <History className="h-5 w-5" /> Recent Predictions
                </CardTitle>
                <CardDescription>Stored in backend database and synced locally for fast recall.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {history.slice(0, 5).map((item) => (
                        <article key={item.id} className="rounded-2xl border border-zinc-200/70 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-950/70">
                            <p className="text-sm font-semibold">{getTopRole(item)}</p>
                            <p className="text-xs text-muted-foreground">{getProfileSummary(item)}</p>
                            <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString()}</p>
                        </article>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
