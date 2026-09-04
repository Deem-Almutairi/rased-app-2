"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";

export default function RecommendationsPage() {
  const { t } = useLanguage();
  const recommendations = useAppStore((s) => s.recommendations);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.recommendations.title}</h1>
        <p className="text-sm text-muted-foreground">{t.recommendations.subtitle}</p>
      </div>

      {recommendations.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">{t.common.noData}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {recommendations.map((r, i) => (
            <RecommendationCard key={r.id} recommendation={r} defaultOpen={i === 0} />
          ))}
        </div>
      )}
    </div>
  );
}
