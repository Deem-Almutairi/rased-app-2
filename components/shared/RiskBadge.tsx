"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { StatusBadge } from "./StatusBadge";

export function RiskBadge({ level }: { level: "low" | "medium" | "high" | "critical" | "urgent" }) {
  const { t } = useLanguage();
  const label = level === "urgent" ? t.priority.urgent : t.priority[level as keyof typeof t.priority];
  return <StatusBadge status={level} label={label} />;
}

export function ReadinessStatusBadge({ status }: { status: "ready" | "attention" | "at_risk" }) {
  const { t } = useLanguage();
  return <StatusBadge status={status} label={t.status[status]} />;
}
