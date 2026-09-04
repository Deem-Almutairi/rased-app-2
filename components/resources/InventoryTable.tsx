"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { cityLabels } from "@/lib/data/facilities";
import { ResponsiveDataTable, type DataColumn } from "@/components/shared/ResponsiveDataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { SparePart } from "@/lib/types";

export function InventoryTable({ parts }: { parts: SparePart[] }) {
  const { t, bi, locale } = useLanguage();

  const columns: DataColumn<SparePart>[] = [
    { key: "id", header: t.resources.partId, render: (p) => <span className="font-medium">{p.id}</span> },
    { key: "name", header: t.resources.partName, render: (p) => bi(p.name) },
    { key: "warehouse", header: t.resources.warehouse, render: (p) => bi(cityLabels[p.warehouse]) },
    {
      key: "stock",
      header: t.resources.currentStock,
      render: (p) => (
        <span className="tabular-nums">
          {p.currentStock - p.reserved} / {p.currentStock}
        </span>
      ),
    },
    { key: "status", header: t.common.status, render: (p) => <StatusBadge status={p.status} label={t.status[p.status]} /> },
    { key: "criticality", header: t.assets.criticality, hideOnMobile: true, render: (p) => <RiskBadge level={p.criticality} /> },
    { key: "leadTime", header: t.resources.leadTime, hideOnMobile: true, render: (p) => `${p.leadTimeDays} ${t.common.days}` },
    { key: "cost", header: t.resources.unitCost, hideOnMobile: true, render: (p) => formatCurrency(p.unitCost, locale) },
    {
      key: "delivery",
      header: t.resources.expectedDelivery,
      hideOnMobile: true,
      render: (p) => (p.expectedDelivery ? formatDate(p.expectedDelivery, locale) : "—"),
    },
  ];

  return <ResponsiveDataTable columns={columns} rows={parts} rowKey={(p) => p.id} emptyLabel={t.common.noData} />;
}
