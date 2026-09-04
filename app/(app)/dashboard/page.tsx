"use client";

import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Gauge,
  Wrench,
  PackageX,
  ClipboardCheck,
  BellRing,
  Droplets,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAppStore, useAllFacilityReadiness } from "@/lib/store/useAppStore";
import { KPICard } from "@/components/dashboard/KPICard";
import { RegionalMap } from "@/components/map/RegionalMap";
import { FacilityCard } from "@/components/facilities/FacilityCard";
import { AlertCard } from "@/components/alerts/AlertCard";
import { RecommendationCard } from "@/components/recommendations/RecommendationCard";
import { MaintenanceReadinessChart } from "@/components/dashboard/MaintenanceReadinessChart";
import { ResourceAvailabilityChart } from "@/components/dashboard/ResourceAvailabilityChart";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { t, bi } = useLanguage();
  const { user } = useAuth();
  const facilities = useAppStore((s) => s.facilities);
  const workOrders = useAppStore((s) => s.workOrders);
  const inventory = useAppStore((s) => s.inventory);
  const approvals = useAppStore((s) => s.approvals);
  const alerts = useAppStore((s) => s.alerts);
  const recommendations = useAppStore((s) => s.recommendations);
  const readiness = useAllFacilityReadiness();

  const scores = facilities.map((f) => readiness.get(f.id)?.score ?? 0);
  const overallReadiness = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  const readyCount = facilities.filter((f) => readiness.get(f.id)?.status === "ready").length;
  const attentionCount = facilities.filter((f) => readiness.get(f.id)?.status === "attention").length;
  const atRiskCount = facilities.filter((f) => readiness.get(f.id)?.status === "at_risk").length;

  const openWorkOrders = workOrders.filter((w) => w.status !== "completed" && w.status !== "cancelled").length;
  const criticalParts = inventory.filter((p) => p.status === "out_of_stock" && p.criticality === "critical").length;
  const pendingApprovals = approvals.filter((a) => a.status === "pending" || a.status === "escalated").length;
  const activeAlerts = alerts.filter((a) => a.status === "active").length;

  const topPriority = [...facilities]
    .sort((a, b) => (readiness.get(a.id)?.score ?? 0) - (readiness.get(b.id)?.score ?? 0))
    .slice(0, 4);

  const recentAlerts = [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 4);
  const topRecommendation = recommendations[0];

  const waterEfficiency = 78;
  const energyEfficiency = 71;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">
            {t.dashboard.welcome}, {user ? bi(user.name) : ""}
          </h1>
          <p className="text-sm text-muted-foreground">{t.common.region} · {t.common.prototypeLabel}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        <KPICard label={t.dashboard.totalFacilities} value={facilities.length} icon={Building2} tone="neutral" />
        <KPICard label={t.dashboard.readyFacilities} value={readyCount} icon={CheckCircle2} tone="ready" />
        <KPICard label={t.dashboard.needingAttention} value={attentionCount} icon={AlertTriangle} tone="attention" />
        <KPICard label={t.dashboard.atRisk} value={atRiskCount} icon={ShieldAlert} tone="risk" />
        <KPICard label={t.dashboard.regionalReadiness} value={`${overallReadiness}%`} icon={Gauge} tone={overallReadiness >= 80 ? "ready" : overallReadiness >= 60 ? "attention" : "risk"} />
        <KPICard label={t.dashboard.openWorkOrders} value={openWorkOrders} icon={Wrench} tone="info" />
        <KPICard label={t.dashboard.criticalSpareParts} value={criticalParts} icon={PackageX} tone={criticalParts > 0 ? "risk" : "ready"} />
        <KPICard label={t.dashboard.pendingApprovals} value={pendingApprovals} icon={ClipboardCheck} tone={pendingApprovals > 0 ? "attention" : "ready"} />
        <KPICard label={t.dashboard.activeAlerts} value={activeAlerts} icon={BellRing} tone={activeAlerts > 0 ? "risk" : "ready"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-1.5">
          <h2 className="text-sm font-semibold px-1">{t.dashboard.regionalMap}</h2>
          <RegionalMap className="h-[340px]" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold">{t.dashboard.topPriority}</h2>
            <Link href="/facilities" className="text-xs text-brand-emerald font-medium">
              {t.common.viewAll}
            </Link>
          </div>
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto scrollbar-thin pe-1">
            {topPriority.map((f) => (
              <FacilityCard key={f.id} facility={f} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <h2 className="text-sm font-semibold">{t.dashboard.maintenanceReadiness}</h2>
          <MaintenanceReadinessChart />
        </div>
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <h2 className="text-sm font-semibold">{t.dashboard.resourceAvailability}</h2>
          <ResourceAvailabilityChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-4 space-y-4">
          <h2 className="text-sm font-semibold">{t.dashboard.efficiency}</h2>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Droplets className="size-3.5 text-status-info" /> {t.dashboard.water}</span>
              <span className="font-semibold">{waterEfficiency}%</span>
            </div>
            <Progress value={waterEfficiency} className="h-2" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-muted-foreground"><Zap className="size-3.5 text-brand-gold" /> {t.dashboard.energy}</span>
              <span className="font-semibold">{energyEfficiency}%</span>
            </div>
            <Progress value={energyEfficiency} className="h-2" />
          </div>
          <p className="text-[10px] text-muted-foreground">{t.common.prototypeEstimate}</p>
        </div>

        <div className="lg:col-span-2 space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold">{t.dashboard.recentAlerts}</h2>
            <Link href="/alerts" className="text-xs text-brand-emerald font-medium">
              {t.common.viewAll}
            </Link>
          </div>
          <div className="space-y-2.5">
            {recentAlerts.map((a) => (
              <AlertCard key={a.id} alert={a} compact />
            ))}
          </div>
        </div>
      </div>

      {topRecommendation && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-semibold">{t.dashboard.aiSummary}</h2>
            <Link href="/recommendations" className="text-xs text-brand-emerald font-medium">
              {t.common.viewAll}
            </Link>
          </div>
          <RecommendationCard recommendation={topRecommendation} />
        </div>
      )}
    </div>
  );
}
