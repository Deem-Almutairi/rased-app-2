"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import type { ReadinessStatus } from "@/lib/types";

const STATUS_COLOR: Record<ReadinessStatus, string> = {
  ready: "var(--color-status-ready)",
  attention: "var(--color-status-attention)",
  at_risk: "var(--color-status-risk)",
};

export function ReadinessGauge({
  score,
  status,
  size = 140,
  strokeWidth = 12,
  showStatus = true,
  className,
}: {
  score: number;
  status: ReadinessStatus;
  size?: number;
  strokeWidth?: number;
  showStatus?: boolean;
  className?: string;
}) {
  const { t } = useLanguage();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = STATUS_COLOR[status];

  return (
    <div className={cn("relative inline-flex flex-col items-center justify-center", className)} style={{ width: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums" style={{ color }}>
          {score}%
        </span>
        {showStatus && <span className="text-xs font-medium text-muted-foreground mt-0.5">{t.status[status]}</span>}
      </div>
    </div>
  );
}
