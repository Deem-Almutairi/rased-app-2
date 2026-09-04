"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { AlertCard } from "@/components/alerts/AlertCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AlertSeverity, AlertItem } from "@/lib/types";

export default function AlertsPage() {
  const { t } = useLanguage();
  const alerts = useAppStore((s) => s.alerts);
  const [severity, setSeverity] = useState<AlertSeverity | "all">("all");
  const [status, setStatus] = useState<AlertItem["status"] | "all">("all");

  const filtered = useMemo(() => {
    return [...alerts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .filter((a) => (severity === "all" || a.severity === severity) && (status === "all" || a.status === status));
  }, [alerts, severity, status]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.alerts.title}</h1>
        <p className="text-sm text-muted-foreground">{t.alerts.subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={severity} onValueChange={(v) => setSeverity(v as AlertSeverity | "all")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t.alerts.severity} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            <SelectItem value="critical">{t.priority.critical}</SelectItem>
            <SelectItem value="warning">{t.status.attention}</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as AlertItem["status"] | "all")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t.common.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            <SelectItem value="active">{t.status.active}</SelectItem>
            <SelectItem value="acknowledged">{t.status.acknowledged}</SelectItem>
            <SelectItem value="resolved">{t.status.resolved}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">{t.common.noData}</div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((a) => (
            <AlertCard key={a.id} alert={a} />
          ))}
        </div>
      )}
    </div>
  );
}
