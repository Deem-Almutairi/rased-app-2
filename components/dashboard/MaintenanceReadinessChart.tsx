"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import type { WorkOrderStatus } from "@/lib/types";

const STATUS_COLORS: Record<WorkOrderStatus, string> = {
  new: "var(--color-status-info)",
  under_review: "var(--color-status-attention)",
  approved: "var(--color-status-info)",
  scheduled: "var(--color-status-attention)",
  in_progress: "var(--brand-teal)",
  waiting_for_part: "var(--color-status-risk)",
  waiting_for_approval: "var(--color-status-risk)",
  completed: "var(--color-status-ready)",
  cancelled: "var(--muted-foreground)",
};

export function MaintenanceReadinessChart() {
  const { t } = useLanguage();
  const workOrders = useAppStore((s) => s.workOrders);

  const statuses: WorkOrderStatus[] = [
    "new",
    "under_review",
    "scheduled",
    "in_progress",
    "waiting_for_part",
    "waiting_for_approval",
    "completed",
  ];
  const data = statuses.map((status) => ({
    status,
    label: t.status[status],
    count: workOrders.filter((w) => w.status === status).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
        <XAxis dataKey="label" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} interval={0} angle={-20} textAnchor="end" height={50} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
        <Tooltip
          contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
          cursor={{ fill: "var(--color-muted)" }}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((d) => (
            <Cell key={d.status} fill={STATUS_COLORS[d.status]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
