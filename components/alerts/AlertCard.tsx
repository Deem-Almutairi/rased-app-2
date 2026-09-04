"use client";

import Link from "next/link";
import { AlertTriangle, AlertOctagon, Info, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { getFacility } from "@/lib/data/facilities";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AlertItem } from "@/lib/types";

const SEVERITY_ICON = { critical: AlertOctagon, warning: AlertTriangle, info: Info };
const SEVERITY_CLASSES = {
  critical: { bg: "bg-status-risk-bg", text: "text-status-risk" },
  warning: { bg: "bg-status-attention-bg", text: "text-status-attention" },
  info: { bg: "bg-status-info-bg", text: "text-status-info" },
} as const;

export function AlertCard({ alert, compact = false }: { alert: AlertItem; compact?: boolean }) {
  const { t, bi, locale } = useLanguage();
  const facility = getFacility(alert.facilityId);
  const acknowledgeAlert = useAppStore((s) => s.acknowledgeAlert);
  const resolveAlert = useAppStore((s) => s.resolveAlert);
  const Icon = SEVERITY_ICON[alert.severity];

  return (
    <div className={cn("rounded-xl border bg-card p-3.5 flex gap-3", alert.status === "resolved" && "opacity-60")}>
      <div className={cn("shrink-0 flex size-9 items-center justify-center rounded-lg", SEVERITY_CLASSES[alert.severity].bg)}>
        <Icon className={cn("size-4.5", SEVERITY_CLASSES[alert.severity].text)} />
      </div>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-snug">{bi(alert.description)}</p>
          <StatusBadge status={alert.status} label={t.status[alert.status]} className="shrink-0" />
        </div>
        <p className="text-xs text-muted-foreground">
          {t.alerts.types[alert.type]} · {facility ? bi(facility.name) : alert.facilityId} ·{" "}
          {new Date(alert.timestamp).toLocaleString(locale === "ar" ? "ar-SA" : "en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        </p>
        {!compact && (
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{t.alerts.recommendedAction}:</span> {bi(alert.recommendedAction)}
          </p>
        )}
        {!compact && alert.status === "active" && (
          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
              {t.status.acknowledged}
            </Button>
            <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
              <Check className="size-3.5" /> {t.status.resolved}
            </Button>
            {alert.assetId && (
              <Button size="sm" variant="ghost" asChild>
                <Link href={`/facilities/${alert.facilityId}?tab=recommendations`}>{t.nav.recommendations}</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
