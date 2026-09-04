"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore, useFacilityReadiness } from "@/lib/store/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { SimulationControlPanel } from "@/components/simulator/SimulationControlPanel";
import { ReadinessGauge } from "@/components/shared/ReadinessGauge";
import { AlertCard } from "@/components/alerts/AlertCard";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";

export default function SimulatorPage() {
  const { t } = useLanguage();
  const [facilityId, setFacilityId] = useState("AR-01");
  const [assetId, setAssetId] = useState("AR-IR-001");

  const asset = useAppStore((s) => s.assets.find((a) => a.id === assetId));
  const readiness = useFacilityReadiness(facilityId);
  const alertsForAsset = useAppStore(useShallow((s) => s.alerts.filter((a) => a.assetId === assetId && a.status === "active")));
  const recommendation = useAppStore((s) => s.recommendations.find((r) => r.assetId === assetId));
  const simLog = useAppStore((s) => s.simLog);
  const { bi, locale } = useLanguage();

  const handleFacilityChange = (id: string) => {
    setFacilityId(id);
    const firstAsset = useAppStore.getState().assets.find((a) => a.facilityId === id);
    if (firstAsset) setAssetId(firstAsset.id);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.simulator.title}</h1>
        <p className="text-sm text-muted-foreground">{t.simulator.subtitle}</p>
      </div>

      <SimulationControlPanel facilityId={facilityId} onFacilityChange={handleFacilityChange} assetId={assetId} onAssetChange={setAssetId} asset={asset} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 flex flex-col items-center justify-center gap-2">
          <p className="text-xs text-muted-foreground self-start">{t.readiness.title} — {facilityId}</p>
          {readiness && <ReadinessGauge score={readiness.score} status={readiness.status} size={140} />}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground px-1">{t.dashboard.activeAlerts}</p>
          {alertsForAsset.length === 0 ? (
            <div className="rounded-xl border bg-card p-6 text-center text-xs text-muted-foreground">{t.common.noData}</div>
          ) : (
            alertsForAsset.map((a) => <AlertCard key={a.id} alert={a} compact />)
          )}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground px-1">{t.nav.recommendations}</p>
          {recommendation ? (
            <RecommendationCard recommendation={recommendation} />
          ) : (
            <div className="rounded-xl border bg-card p-6 text-center text-xs text-muted-foreground">{t.common.noData}</div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-2">
        <p className="text-sm font-semibold">{t.simulator.liveLog}</p>
        {simLog.length === 0 ? (
          <p className="text-xs text-muted-foreground">{t.common.noData}</p>
        ) : (
          <ul className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
            {simLog.map((entry) => (
              <li key={entry.id} className="text-xs flex justify-between gap-3 border-b last:border-0 pb-1.5">
                <span>{bi(entry.message)}</span>
                <span className="text-muted-foreground shrink-0 tabular-nums">
                  {new Date(entry.timestamp).toLocaleTimeString(locale === "ar" ? "ar-SA" : "en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
