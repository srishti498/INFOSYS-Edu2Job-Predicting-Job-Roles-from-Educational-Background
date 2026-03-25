import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PredictResponse } from "@/types/prediction";
import {
    BrainCircuit,
    BriefcaseBusiness,
    Building2,
    Cloud,
    Code2,
    Coins,
    ListChecks,
    Server,
    Settings,
    Sparkles,
    WandSparkles,
} from "lucide-react";

type RoleInsightsPanelProps = {
    result: PredictResponse;
    surface?: "dark" | "light";
    className?: string;
};

const roleIcon = (role: string) => {
    if (role === "Cloud Engineer") return <Cloud className="h-4 w-4 text-cyan-300" />;
    if (role === "Software Developer") return <Code2 className="h-4 w-4 text-blue-300" />;
    if (role === "Data Scientist") return <BrainCircuit className="h-4 w-4 text-emerald-300" />;
    return <BriefcaseBusiness className="h-4 w-4 text-zinc-300" />;
};

export const RoleInsightsPanel = ({ result, surface = "dark", className }: RoleInsightsPanelProps) => {
    const roleNames = result.predicted_roles.map((role) => role.role);
    const isLight = surface === "light";

    const additionalRoleIcon = (role: string) => {
        if (role === "DevOps Engineer") return <Settings className="mr-1 h-3.5 w-3.5" />;
        if (role === "Backend Developer") return <Server className="mr-1 h-3.5 w-3.5" />;
        if (role === "AI Engineer") return <WandSparkles className="mr-1 h-3.5 w-3.5" />;
        return <BriefcaseBusiness className="mr-1 h-3.5 w-3.5" />;
    };

    return (
        <div className={cn("grid gap-4 md:grid-cols-2", className)}>
            <Card className={cn(
                "rounded-2xl transition duration-300 hover:shadow-lg",
                isLight
                    ? "border-2 border-indigo-200 bg-indigo-50/70 hover:border-indigo-300 hover:shadow-indigo-500/10 dark:border-indigo-900/30 dark:bg-indigo-950/20"
                    : "border border-indigo-400/30 bg-indigo-950/25 hover:border-indigo-300/60 hover:shadow-indigo-500/10",
            )}>
                <CardHeader className="pb-3">
                    <CardTitle className={cn("flex items-center gap-2 text-lg", isLight ? "text-indigo-900 dark:text-indigo-100" : "text-indigo-100")}>
                        <ListChecks className="h-5 w-5 text-indigo-300" />
                        Required Skills (Most Important)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    {roleNames.map((roleName) => {
                        const skills = result.required_skills[roleName] ?? [];
                        if (skills.length === 0) return null;

                        return (
                            <div className={cn(
                                "rounded-xl p-3",
                                isLight
                                    ? "border border-indigo-200/80 bg-indigo-100/50 dark:border-indigo-300/20 dark:bg-indigo-950/30"
                                    : "border border-indigo-300/20 bg-indigo-950/30",
                            )} key={roleName}>
                                <p className={cn("mb-2 flex items-center gap-2 font-semibold", isLight ? "text-indigo-900 dark:text-indigo-100" : "text-indigo-100")}>
                                    {roleIcon(roleName)} {roleName}
                                </p>
                                <ul className={cn("list-disc space-y-1 pl-5", isLight ? "text-zinc-700 dark:text-zinc-200" : "text-zinc-200")}>
                                    {skills.map((skill) => (
                                        <li key={`${roleName}-${skill}`}>{skill}</li>
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <Card className={cn(
                "rounded-2xl transition duration-300 hover:shadow-lg",
                isLight
                    ? "border-2 border-fuchsia-200 bg-fuchsia-50/70 hover:border-fuchsia-300 hover:shadow-fuchsia-500/10 dark:border-fuchsia-900/30 dark:bg-fuchsia-950/20"
                    : "border border-fuchsia-400/25 bg-fuchsia-950/20 hover:border-fuchsia-300/55 hover:shadow-fuchsia-500/10",
            )}>
                <CardHeader className="pb-3">
                    <CardTitle className={cn("flex items-center gap-2 text-lg", isLight ? "text-fuchsia-900 dark:text-fuchsia-100" : "text-fuchsia-100")}>
                        <Sparkles className="h-5 w-5 text-fuchsia-300" />
                        Recommended Additional Roles
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                    {result.recommended_additional_roles.map((role) => (
                        <Badge
                            key={role}
                            className={cn(
                                "rounded-full px-3 py-1 transition-transform duration-200 hover:-translate-y-0.5",
                                isLight
                                    ? "border-fuchsia-300 bg-fuchsia-100/80 text-fuchsia-800 dark:border-fuchsia-300/40 dark:bg-fuchsia-500/15 dark:text-fuchsia-100"
                                    : "border-fuchsia-300/40 bg-fuchsia-500/15 text-fuchsia-100",
                            )}
                            variant="outline"
                        >
                            {additionalRoleIcon(role)}
                            {role}
                        </Badge>
                    ))}
                </CardContent>
            </Card>

            <Card className={cn(
                "rounded-2xl md:col-span-2 transition duration-300 hover:shadow-lg",
                isLight
                    ? "border-2 border-amber-200 bg-amber-50/70 hover:border-amber-300 hover:shadow-amber-500/10 dark:border-amber-900/30 dark:bg-amber-950/20"
                    : "border border-amber-400/25 bg-amber-950/20 hover:border-amber-300/55 hover:shadow-amber-500/10",
            )}>
                <CardHeader className="pb-3">
                    <CardTitle className={cn("flex items-center gap-2 text-lg", isLight ? "text-amber-900 dark:text-amber-100" : "text-amber-100")}>
                        <Coins className="h-5 w-5 text-amber-300" />
                        Salary Range
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {roleNames.map((roleName) => {
                        const salary = result.salary_ranges[roleName];
                        if (!salary) return null;

                        return (
                            <div
                                key={roleName}
                                className={cn(
                                    "rounded-xl p-4 transition duration-300 hover:-translate-y-0.5",
                                    isLight
                                        ? "border border-amber-200/90 bg-amber-100/60 dark:border-amber-300/25 dark:bg-amber-950/40"
                                        : "border border-amber-300/25 bg-amber-950/40",
                                )}
                            >
                                <p className={cn("mb-1 flex items-center gap-2 text-sm font-medium", isLight ? "text-amber-900 dark:text-amber-100" : "text-amber-100")}>
                                    {roleIcon(roleName)} {roleName}
                                </p>
                                <p className="text-xl font-bold text-amber-300">{salary}</p>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            <Card className={cn(
                "rounded-2xl md:col-span-2 transition duration-300 hover:shadow-lg",
                isLight
                    ? "border-2 border-teal-200 bg-teal-50/70 hover:border-teal-300 hover:shadow-teal-500/10 dark:border-teal-900/30 dark:bg-teal-950/20"
                    : "border border-teal-400/30 bg-teal-950/20 hover:border-teal-300/60 hover:shadow-teal-500/10",
            )}>
                <CardHeader className="pb-3">
                    <CardTitle className={cn("flex items-center gap-2 text-lg", isLight ? "text-teal-900 dark:text-teal-100" : "text-teal-100")}>
                        <Building2 className="h-5 w-5 text-teal-300" />
                        Top Hiring Companies
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {roleNames.map((roleName) => {
                        const companies = result.top_hiring_companies[roleName] ?? [];
                        if (companies.length === 0) return null;

                        return (
                            <div className={cn(
                                "rounded-xl p-4",
                                isLight
                                    ? "border border-teal-200/90 bg-teal-100/60 dark:border-teal-300/25 dark:bg-teal-950/35"
                                    : "border border-teal-300/25 bg-teal-950/35",
                            )} key={roleName}>
                                <p className={cn("mb-2 flex items-center gap-2 text-sm font-semibold", isLight ? "text-teal-900 dark:text-teal-100" : "text-teal-100")}>
                                    {roleIcon(roleName)} {roleName}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {companies.map((company) => (
                                        <Badge
                                            key={`${roleName}-${company}`}
                                            className={cn(
                                                "rounded-full",
                                                isLight
                                                    ? "border-teal-300 bg-teal-100 text-teal-800 dark:border-teal-300/40 dark:bg-teal-500/15 dark:text-teal-50"
                                                    : "border-teal-300/40 bg-teal-500/15 text-teal-50",
                                            )}
                                            variant="outline"
                                        >
                                            {company}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </div>
    );
};
