"use client";

import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { Progress } from "@/components/ui/progress";
import type { ReadinessResult } from "@/lib/types";

const FACTOR_KEYS = [
  "assetCondition",
  "maintenancePreparedness",
  "sparePartsAvailability",
  "personnelAvailability",
  "equipmentAvailability",
  "approvalReadiness",
  "serviceRiskCondition",
] as const;

export function ReadinessBreakdown({ readiness }: { readiness: ReadinessResult }) {
  const { t, bi } = useLanguage();
  const trendData = readiness.trend.map((v, i) => ({ i, v }));

  return (
    <div className="rounded-xl border bg-card p-4 lg:p-5 space-y-5">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <ReadinessGauge score={readiness.score} status={readiness.status} size={128} />
        <div className="flex-1 w-full space-y-3 min-w-0">
          <p className="text-xs text-muted-foreground">{t.readiness.formula}</p>
          <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-2.5">
            {FACTOR_KEYS.map((key) => (
              <div key={key}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{t.readiness[key]}</span>
                  <span className="font-semibold tabular-nums">{Math.round(readiness.breakdown[key])}%</span>
                </div>
                <Progress value={readiness.breakdown[key]} className="h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1.5">{t.readiness.trend}</p>
        <ResponsiveContainer width="100%" height={48}>
          <LineChart data={trendData} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
            <YAxis hide domain={[0, 100]} />
            <Line
              type="monotone"
              dataKey="v"
              stroke={readiness.status === "at_risk" ? "var(--color-status-risk)" : readiness.status === "attention" ? "var(--color-status-attention)" : "var(--color-status-ready)"}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {readiness.reasons.length > 0 && (
        <div className="rounded-lg bg-status-risk-bg/60 p-3.5 space-y-2">
          <p className="text-xs font-semibold text-status-risk flex items-center gap-1.5">
            <AlertTriangle className="size-3.5" /> {t.readiness.whyLow}
          </p>
          <ul className="space-y-1.5">
            {readiness.reasons.map((r, i) => (
              <li key={i} className="text-xs text-foreground/80 flex gap-1.5">
                <span className="text-status-risk">•</span>
                <span>{bi(r)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
