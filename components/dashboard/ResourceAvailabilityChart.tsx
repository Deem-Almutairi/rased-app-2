"use client";

import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import type { PartStatus } from "@/lib/types";

const STATUS_COLORS: Record<PartStatus, string> = {
  available: "var(--color-status-ready)",
  low_stock: "var(--color-status-attention)",
  out_of_stock: "var(--color-status-risk)",
  ordered: "var(--color-status-info)",
  in_transit: "var(--brand-teal)",
  delayed: "var(--brand-gold)",
};

export function ResourceAvailabilityChart() {
  const { t } = useLanguage();
  const inventory = useAppStore((s) => s.inventory);

  const statuses: PartStatus[] = ["available", "low_stock", "out_of_stock", "ordered", "in_transit", "delayed"];
  const data = statuses
    .map((status) => ({ status, name: t.status[status], value: inventory.filter((p) => p.status === status).length }))
    .filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((d) => (
            <Cell key={d.status} fill={STATUS_COLORS[d.status]} stroke="var(--color-card)" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
