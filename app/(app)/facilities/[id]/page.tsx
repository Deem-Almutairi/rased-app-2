"use client";

import { useState } from "react";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { MapPin, User } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore, useFacilityReadiness } from "@/lib/store/useAppStore";
import { useShallow } from "zustand/react/shallow";
import { cityLabels } from "@/lib/data/facilities";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReadinessBreakdown } from "@/components/facilities/ReadinessBreakdown";
import { AssetCard } from "@/components/assets/AssetCard";
import { WorkOrderTable } from "@/components/maintenance/WorkOrderTable";
import { InventoryTable } from "@/components/resources/InventoryTable";
import { AlertCard } from "@/components/alerts/AlertCard";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { formatDate } from "@/lib/utils";

export default function FacilityDetailPage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const { t, bi, locale } = useLanguage();

  const facility = useAppStore((s) => s.facilities.find((f) => f.id === id));
  const readiness = useFacilityReadiness(id);
  const assets = useAppStore(useShallow((s) => s.assets.filter((a) => a.facilityId === id)));
  const workOrders = useAppStore(useShallow((s) => s.workOrders.filter((w) => w.facilityId === id)));
  const alerts = useAppStore(useShallow((s) => s.alerts.filter((a) => a.facilityId === id)));
  const recommendations = useAppStore(useShallow((s) => s.recommendations.filter((r) => r.facilityId === id)));
  const inventory = useAppStore((s) => s.inventory);
  const [tab, setTab] = useState(searchParams.get("tab") ?? "overview");

  if (!facility) {
    notFound();
  }
  if (!readiness) return null;

  const assetPartIds = new Set(assets.flatMap((a) => a.requiredSpareParts));
  const relevantParts = inventory.filter((p) => assetPartIds.has(p.id) || assets.some((a) => a.type && p.compatibleAssetTypes.includes(a.type)));

  const completedWorkOrders = workOrders.filter((w) => w.status === "completed");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-4 lg:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">{facility.id}</p>
            <h1 className="text-xl lg:text-2xl font-bold">{bi(facility.name)}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {bi(cityLabels[facility.city])}</span>
              <span className="flex items-center gap-1"><User className="size-3.5" /> {bi(facility.manager)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <StatusBadge status={readiness.status} label={t.status[readiness.status]} className="text-sm px-3 py-1.5" />
            <div className="text-end">
              <p className="text-2xl font-bold tabular-nums">{readiness.score}%</p>
              <p className="text-[11px] text-muted-foreground">{t.readiness.title}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">{t.facilities.tabs.overview}</TabsTrigger>
          <TabsTrigger value="assets">{t.facilities.tabs.assets} ({assets.length})</TabsTrigger>
          <TabsTrigger value="maintenance">{t.facilities.tabs.maintenance} ({workOrders.length})</TabsTrigger>
          <TabsTrigger value="resources">{t.facilities.tabs.resources}</TabsTrigger>
          <TabsTrigger value="alerts">{t.facilities.tabs.alerts} ({alerts.filter((a) => a.status === "active").length})</TabsTrigger>
          <TabsTrigger value="recommendations">{t.facilities.tabs.recommendations}</TabsTrigger>
          <TabsTrigger value="history">{t.facilities.tabs.history}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          <ReadinessBreakdown readiness={readiness} />
        </TabsContent>

        <TabsContent value="assets" className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {assets.map((a) => (
              <AssetCard key={a.id} asset={a} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="pt-4">
          <WorkOrderTable workOrders={workOrders} showFacility={false} />
        </TabsContent>

        <TabsContent value="resources" className="pt-4">
          <InventoryTable parts={relevantParts} />
        </TabsContent>

        <TabsContent value="alerts" className="pt-4 space-y-2.5">
          {alerts.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">{t.common.noData}</div>
          ) : (
            alerts.map((a) => <AlertCard key={a.id} alert={a} />)
          )}
        </TabsContent>

        <TabsContent value="recommendations" className="pt-4 space-y-3">
          {recommendations.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">{t.common.noData}</div>
          ) : (
            recommendations.map((r) => <RecommendationCard key={r.id} recommendation={r} defaultOpen />)
          )}
        </TabsContent>

        <TabsContent value="history" className="pt-4">
          {completedWorkOrders.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-center text-sm text-muted-foreground">{t.common.noData}</div>
          ) : (
            <div className="space-y-2.5">
              {completedWorkOrders.map((w) => (
                <div key={w.id} className="rounded-xl border bg-card p-3.5 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{bi(w.problem)}</p>
                    <p className="text-xs text-muted-foreground">{w.id} · {formatDate(w.plannedDate, locale)}</p>
                  </div>
                  <StatusBadge status={w.status} label={t.status[w.status]} />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
