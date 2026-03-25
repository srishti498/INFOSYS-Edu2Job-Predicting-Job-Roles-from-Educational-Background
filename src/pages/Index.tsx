import { useEffect, useRef, useState } from "react";

import { HistoryPanel } from "@/components/history-panel";
import { PredictionForm } from "@/components/prediction-form";
import { ResultsPanel } from "@/components/results-panel";
import { ThemeToggle } from "@/components/theme-toggle";
import { toast } from "@/components/ui/sonner";
import { predictionApi } from "@/services/api";
import { HistoryItem, PredictResponse, PredictionFormPayload } from "@/types/prediction";
import { exportPredictionPDF } from "@/utils/pdf";

const HISTORY_KEY = "edu2job.history";

const normalizeHistory = (raw: unknown): HistoryItem[] => {
  if (!Array.isArray(raw)) return [];

  return raw.filter((item) => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Record<string, unknown>;
    const profile = candidate.profile as Record<string, unknown> | undefined;
    const result = candidate.result as Record<string, unknown> | undefined;

    const hasNewProfile = !!profile && typeof profile.degree === "string" && typeof profile.branch === "string";
    const hasNewResult = !!result && Array.isArray(result.predicted_roles);

    return hasNewProfile && hasNewResult;
  }) as HistoryItem[];
};

const Index = () => {
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [lastProfile, setLastProfile] = useState<PredictionFormPayload | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem(HISTORY_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as unknown;
        const normalized = normalizeHistory(parsed);
        setHistory(normalized);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(normalized));
      } catch {
        localStorage.removeItem(HISTORY_KEY);
      }
    }

    predictionApi
      .getHistory(10)
      .then((response) => {
        setHistory(response.items);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(response.items));
      })
      .catch(() => {
        toast.warning("Backend history not available yet, showing local cache.");
      });
  }, []);

  const handlePredict = async (payload: PredictionFormPayload) => {
    if (payload.cgpa < 0 || payload.cgpa > 10) {
      toast.error("CGPA must be between 0 and 10");
      return;
    }

    if (payload.tenth_percentage < 0 || payload.tenth_percentage > 100 || payload.twelfth_percentage < 0 || payload.twelfth_percentage > 100) {
      toast.error("10th/12th percentage must be between 0 and 100");
      return;
    }

    if (payload.graduation_year < 2000 || payload.graduation_year > 2100) {
      toast.error("Graduation year must be between 2000 and 2100");
      return;
    }

    setLoading(true);
    try {
      const prediction = await predictionApi.predict(payload);
      setResult(prediction);
      setLastProfile(payload);
      toast.success("Prediction generated successfully");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);

      predictionApi
        .getHistory(10)
        .then((latestHistory) => {
          setHistory(latestHistory.items);
          localStorage.setItem(HISTORY_KEY, JSON.stringify(latestHistory.items));
        })
        .catch(() => {
          toast.info("Live history is unavailable, keeping local results.");
        });
    } catch (error) {
      toast.error("Unable to fetch prediction. Please check backend API.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!result || !lastProfile) {
      toast.error("Generate a prediction before exporting");
      return;
    }
    exportPredictionPDF(lastProfile, result);
    toast.success("PDF exported");
  };

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_20%,rgba(245,158,11,.22),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(20,184,166,.24),transparent_45%),linear-gradient(145deg,#f8fafc,#e5e7eb,#f8fafc)] dark:bg-[radial-gradient(circle_at_10%_20%,rgba(245,158,11,.18),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(20,184,166,.20),transparent_45%),linear-gradient(145deg,#09090b,#18181b,#09090b)]" />

      <section className="mx-auto max-w-7xl space-y-6">
        <header className="flex items-center justify-between rounded-3xl border border-white/30 bg-white/65 px-5 py-4 shadow-xl shadow-zinc-900/10 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-900/60">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">SaaS Intelligence Suite</p>
            <h1 className="text-2xl font-bold sm:text-3xl">Edu2Job Predictor</h1>
            <p className="text-sm text-muted-foreground">Predict high-fit job roles from educational and skill profile data.</p>
          </div>
          <ThemeToggle />
        </header>

        <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6">
            <PredictionForm onSubmit={handlePredict} loading={loading} initial={lastProfile ?? undefined} result={result} />
            <HistoryPanel history={history} />
          </div>
          <div ref={resultsRef} className="animate-in fade-in duration-500">
            <ResultsPanel result={result} loading={loading} onExport={handleExport} lastProfile={lastProfile} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;
