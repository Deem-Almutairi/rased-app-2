"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore, useAllFacilityReadiness } from "@/lib/store/useAppStore";
import { cityLabels } from "@/lib/data/facilities";
import { Button } from "@/components/ui/button";
import type { ReadinessStatus } from "@/lib/types";

const STATUS_FILL: Record<ReadinessStatus, string> = {
  ready: "var(--color-status-ready)",
  attention: "var(--color-status-attention)",
  at_risk: "var(--color-status-risk)",
};

export function RegionalMap({ compact = false, className }: { compact?: boolean; className?: string }) {
  const { t, bi } = useLanguage();
  const facilities = useAppStore((s) => s.facilities);
  const readiness = useAllFacilityReadiness();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedFacility = selected ? facilities.find((f) => f.id === selected) : null;
  const selectedReadiness = selected ? readiness.get(selected) : null;
  const alertsForSelected = useAppStore(
    useShallow((s) => (selected ? s.alerts.filter((a) => a.facilityId === selected && a.status === "active") : []))
  );
  const woForSelected = useAppStore(
    useShallow((s) =>
      selected ? s.workOrders.filter((w) => w.facilityId === selected && w.status !== "completed" && w.status !== "cancelled") : []
    )
  );

  return (
    <div className={cn("relative rounded-xl border bg-card overflow-hidden", className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full min-h-[280px]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="mapBg" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="var(--brand-sand)" />
            <stop offset="100%" stopColor="var(--brand-sand-dark)" />
          </radialGradient>
        </defs>
        <rect x="0" y="0" width="100" height="100" fill="url(#mapBg)" />
        {/* Stylized region outline */}
        <path
          d="M8,20 Q30,6 55,10 T92,22 Q97,45 88,68 Q80,92 52,94 Q22,96 10,74 Q2,50 8,20 Z"
          fill="none"
          stroke="var(--brand-teal)"
          strokeOpacity="0.25"
          strokeWidth="0.6"
          strokeDasharray="2 1.5"
        />
        {Object.entries(cityLabels).map(([cityId]) => {
          const cityFacilities = facilities.filter((f) => f.city === cityId);
          if (cityFacilities.length === 0) return null;
          const cx = cityFacilities.reduce((s, f) => s + f.lat, 0) / cityFacilities.length;
          const cy = cityFacilities.reduce((s, f) => s + f.lng, 0) / cityFacilities.length;
          return (
            <text key={cityId} x={cx} y={cy - 8} textAnchor="middle" fontSize="3.4" fontWeight="700" fill="var(--brand-emerald)" opacity="0.55">
              {bi(cityLabels[cityId as keyof typeof cityLabels])}
            </text>
          );
        })}
        {facilities.map((f) => {
          const r = readiness.get(f.id);
          const status = r?.status ?? "ready";
          const isSelected = selected === f.id;
          return (
            <g key={f.id} transform={`translate(${f.lat}, ${f.lng})`} className="cursor-pointer" onClick={() => setSelected(f.id)}>
              {isSelected && <circle r="4.2" fill={STATUS_FILL[status]} opacity="0.2" />}
              <circle r={isSelected ? 2.6 : 2.1} fill={STATUS_FILL[status]} stroke="white" strokeWidth="0.5" />
              {!compact && (
                <text y="-3.2" textAnchor="middle" fontSize="2.6" fontWeight="600" fill="var(--foreground)" className="pointer-events-none">
                  {f.id}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {!compact && (
        <div className="absolute bottom-2 start-2 flex items-center gap-3 rounded-lg bg-card/90 backdrop-blur px-3 py-1.5 text-xs shadow-sm border">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-status-ready" /> {t.status.ready}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-status-attention" /> {t.status.attention}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-status-risk" /> {t.status.at_risk}
          </span>
        </div>
      )}

      {selectedFacility && selectedReadiness && (
        <div className="absolute top-2 end-2 w-64 rounded-xl border bg-card shadow-lg p-4 space-y-2.5 animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{selectedFacility.id}</p>
              <p className="font-semibold text-sm leading-snug">{bi(selectedFacility.name)}</p>
              <p className="text-xs text-muted-foreground">{bi(cityLabels[selectedFacility.city])}</p>
            </div>
            <button onClick={() => setSelected(null)} className="shrink-0 text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.facilities.readiness}</span>
            <span className="font-bold" style={{ color: STATUS_FILL[selectedReadiness.status] }}>
              {selectedReadiness.score}%
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.dashboard.activeAlerts}</span>
            <span className="font-medium">{alertsForSelected.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t.facilities.openWO}</span>
            <span className="font-medium">{woForSelected.length}</span>
          </div>
          <Button asChild size="sm" className="w-full mt-1">
            <Link href={`/facilities/${selectedFacility.id}`}>{t.common.viewFacility}</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
