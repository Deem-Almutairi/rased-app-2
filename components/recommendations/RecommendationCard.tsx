"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ChevronDown, ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getFacility } from "@/lib/data/facilities";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Recommendation } from "@/lib/types";

export function RecommendationCard({ recommendation, defaultOpen = false }: { recommendation: Recommendation; defaultOpen?: boolean }) {
  const { t, bi } = useLanguage();
  const [open, setOpen] = useState(defaultOpen);
  const facility = getFacility(recommendation.facilityId);

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-gold/15 text-brand-gold">
              <Sparkles className="size-4.5" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-snug">{bi(recommendation.problem)}</p>
              <p className="text-xs text-muted-foreground truncate">
                {facility ? bi(facility.name) : recommendation.facilityId} · {recommendation.assetId}
              </p>
            </div>
          </div>
          <RiskBadge level={recommendation.risk} />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">{t.recommendations.confidence}</span>
              <span className="font-semibold">{recommendation.confidence}%</span>
            </div>
            <Progress value={recommendation.confidence} className="h-1.5" />
          </div>
        </div>

        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-1 text-xs font-medium text-brand-emerald">
          {open ? t.common.close : t.recommendations.evidence}
          <ChevronDown className={cn("size-3.5 transition-transform", open && "rotate-180")} />
        </button>

        {open && (
          <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-top-1">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">{t.recommendations.evidence}</p>
              <ul className="space-y-1">
                {recommendation.evidence.map((e, i) => (
                  <li key={i} className="text-xs flex gap-1.5">
                    <span className="text-brand-emerald">•</span>
                    <span>{bi(e)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">{t.recommendations.recommendedActions}</p>
              <ul className="space-y-1">
                {recommendation.actions.map((a, i) => (
                  <li key={i} className="text-xs flex gap-1.5">
                    <span className="text-brand-gold">→</span>
                    <span>{bi(a)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-status-ready-bg text-status-ready text-xs p-2.5">{bi(recommendation.expectedImpact)}</div>
            <p className="text-[11px] text-muted-foreground italic">{bi(recommendation.ruleBasis)}</p>
            <p className="text-[10px] text-muted-foreground">{t.common.poweredByRules}</p>
          </div>
        )}

        {recommendation.alternativesAvailable && (
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link href={`/what-if?facility=${recommendation.facilityId}&asset=${recommendation.assetId}`}>
              {t.recommendations.viewAlternatives}
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
