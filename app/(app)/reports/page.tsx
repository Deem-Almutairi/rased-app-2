"use client";

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore, useAllFacilityReadiness } from "@/lib/store/useAppStore";
import {
  preventiveVsCorrective,
  meanMaintenanceDelay,
  sparePartAvailabilityRate,
  averageLeadTime,
  averageApprovalLeadHours,
  SYNTHETIC_MONTHLY_EFFICIENCY,
} from "@/lib/reports/computeKpis";
import { formatCurrency } from "@/lib/utils";

function ReportCard({
  title,
  value,
  tag,
  hint,
}: {
  title: string;
  value: string;
  tag: "simulated" | "target" | "estimate";
  hint?: string;
}) {
  const { t } = useLanguage();
  const tagLabel = tag === "simulated" ? t.common.simulatedResult : tag === "target" ? t.common.targetKpi : t.common.prototypeEstimate;
  return (
    <div className="rounded-xl border bg-card p-4 space-y-1.5">
      <p className="text-xs text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] rounded-full bg-muted px-2 py-0.5 text-muted-foreground">{tagLabel}</span>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { t, locale } = useLanguage();
  const facilities = useAppStore((s) => s.facilities);
  const workOrders = useAppStore((s) => s.workOrders);
  const inventory = useAppStore((s) => s.inventory);
  const approvals = useAppStore((s) => s.approvals);
  const readiness = useAllFacilityReadiness();

  const avgReadiness = Math.round(
    facilities.reduce((s, f) => s + (readiness.get(f.id)?.score ?? 0), 0) / (facilities.length || 1)
  );
  const { preventive, corrective } = preventiveVsCorrective(workOrders);
  const delay = meanMaintenanceDelay(workOrders);
  const partAvailability = sparePartAvailabilityRate(inventory);
  const leadTime = averageLeadTime(inventory);
  const approvalLeadHours = averageApprovalLeadHours(approvals);
  const openWO = workOrders.filter((w) => w.status !== "completed" && w.status !== "cancelled").length;
  const completedWO = workOrders.filter((w) => w.status === "completed").length;

  const pmData = [
    { name: locale === "ar" ? "وقائية" : "Preventive", value: preventive },
    { name: locale === "ar" ? "تصحيحية" : "Corrective", value: corrective },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.reports.title}</h1>
        <p className="text-sm text-muted-foreground">{t.reports.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <ReportCard title={t.dashboard.regionalReadiness} value={`${avgReadiness}%`} tag="simulated" />
        <ReportCard title={t.dashboard.openWorkOrders} value={String(openWO)} tag="simulated" hint={`${completedWO} completed`} />
        <ReportCard title="Mean Maintenance Delay" value={`${delay} ${t.common.days}`} tag="simulated" />
        <ReportCard title="Spare Part Availability" value={`${partAvailability}%`} tag="simulated" />
        <ReportCard title="Procurement Lead Time" value={`${leadTime} ${t.common.days}`} tag="simulated" />
        <ReportCard title="Approval Lead Time" value={`${approvalLeadHours}h`} tag="simulated" />
        <ReportCard title="Response Time Target" value="< 24h" tag="target" />
        <ReportCard title="Service Continuity Target" value="99%" tag="target" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-4 space-y-2">
          <h2 className="text-sm font-semibold">Preventive vs Corrective Maintenance</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={pmData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--brand-teal)" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground">{t.common.simulatedResult}</p>
        </div>

        <div className="rounded-xl border bg-card p-4 space-y-2">
          <h2 className="text-sm font-semibold">Water & Energy Consumption Efficiency</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={SYNTHETIC_MONTHLY_EFFICIENCY}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="water" name={t.dashboard.water} stroke="var(--color-status-info)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="energy" name={t.dashboard.energy} stroke="var(--brand-gold)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-[10px] text-muted-foreground">{t.common.prototypeEstimate}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-2">
        <h2 className="text-sm font-semibold">Expected Improvement — Hero Scenario (Arar Irrigation Pump)</h2>
        <p className="text-sm text-muted-foreground">
          Readiness Score projected to rise from <span className="font-semibold text-status-risk">42%</span> to{" "}
          <span className="font-semibold text-status-ready">86%</span> once the cross-warehouse transfer and maintenance work order are completed.
        </p>
        <p className="text-[10px] text-muted-foreground">{t.common.simulatedResult} — {formatCurrency(3600, locale)} transfer cost vs {formatCurrency(3200, locale)} standard procurement, 1 day vs 8 days delay.</p>
      </div>
    </div>
  );
}
