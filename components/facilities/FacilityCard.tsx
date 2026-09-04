"use client";

import Link from "next/link";
import { Building2, ChevronRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cityLabels } from "@/lib/data/facilities";
import { useAppStore, useFacilityReadiness } from "@/lib/store/useAppStore";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { Facility } from "@/lib/types";

export function FacilityCard({ facility }: { facility: Facility }) {
  const { t, bi, locale } = useLanguage();
  const readiness = useFacilityReadiness(facility.id);
  const assetsCount = useAppStore((s) => s.assets.filter((a) => a.facilityId === facility.id).length);
  const openWO = useAppStore(
    (s) => s.workOrders.filter((w) => w.facilityId === facility.id && w.status !== "completed" && w.status !== "cancelled").length
  );
  const activeAlerts = useAppStore((s) => s.alerts.filter((a) => a.facilityId === facility.id && a.status === "active").length);

  if (!readiness) return null;

  return (
    <Link
      href={`/facilities/${facility.id}`}
      className="group flex flex-col rounded-xl border bg-card p-4 shadow-sm hover:shadow-md hover:border-brand-emerald/40 transition-all"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-emerald/10 text-brand-emerald">
            <Building2 className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{facility.id}</p>
            <p className="font-semibold text-sm truncate">{bi(facility.name)}</p>
          </div>
        </div>
        <ChevronRight className="size-4 text-muted-foreground shrink-0 group-hover:text-brand-emerald rtl:rotate-180" />
      </div>

      <p className="text-xs text-muted-foreground mt-2">{bi(cityLabels[facility.city])} · {bi(facility.manager)}</p>

      <div className="flex items-center justify-between mt-3">
        <StatusBadge status={readiness.status} label={t.status[readiness.status]} />
        <span className="text-lg font-bold tabular-nums">{readiness.score}%</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center">
        <div>
          <p className="text-sm font-semibold tabular-nums">{assetsCount}</p>
          <p className="text-[10px] text-muted-foreground">{t.facilities.assets}</p>
        </div>
        <div>
          <p className="text-sm font-semibold tabular-nums">{openWO}</p>
          <p className="text-[10px] text-muted-foreground">{t.facilities.openWO}</p>
        </div>
        <div>
          <p className={`text-sm font-semibold tabular-nums ${activeAlerts > 0 ? "text-status-risk" : ""}`}>{activeAlerts}</p>
          <p className="text-[10px] text-muted-foreground">{t.dashboard.activeAlerts}</p>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2.5">
        {t.facilities.nextMaintenance}: {formatDate(facility.nextMaintenance, locale)}
      </p>
    </Link>
  );
}
