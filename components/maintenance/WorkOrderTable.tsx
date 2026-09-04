"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getFacility } from "@/lib/data/facilities";
import { ResponsiveDataTable, type DataColumn } from "@/components/shared/ResponsiveDataTable";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { WorkOrderDrawer } from "./WorkOrderDrawer";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { WorkOrder } from "@/lib/types";

export function WorkOrderTable({ workOrders, showFacility = true }: { workOrders: WorkOrder[]; showFacility?: boolean }) {
  const { t, bi, locale } = useLanguage();
  const [selected, setSelected] = useState<WorkOrder | null>(null);

  const columns: DataColumn<WorkOrder>[] = [
    { key: "id", header: "ID", render: (w) => <span className="font-medium">{w.id}</span> },
    ...(showFacility
      ? [
          {
            key: "facility",
            header: t.common.facility,
            render: (w: WorkOrder) => <span>{bi(getFacility(w.facilityId)?.name ?? { en: w.facilityId, ar: w.facilityId })}</span>,
          },
        ]
      : []),
    { key: "problem", header: t.maintenance.problem, render: (w) => <span className="line-clamp-2">{bi(w.problem)}</span> },
    { key: "priority", header: t.common.priority, render: (w) => <RiskBadge level={w.priority} /> },
    { key: "status", header: t.common.status, render: (w) => <StatusBadge status={w.status} label={t.status[w.status]} /> },
    { key: "planned", header: t.maintenance.plannedDate, hideOnMobile: true, render: (w) => formatDate(w.plannedDate, locale) },
    { key: "progress", header: t.maintenance.progress, hideOnMobile: true, render: (w) => `${w.progress}%` },
    { key: "cost", header: t.maintenance.estimatedCost, hideOnMobile: true, render: (w) => formatCurrency(w.estimatedCost, locale) },
  ];

  return (
    <>
      <ResponsiveDataTable
        columns={columns}
        rows={workOrders}
        rowKey={(w) => w.id}
        onRowClick={setSelected}
        emptyLabel={t.common.noData}
      />
      <WorkOrderDrawer workOrder={selected} onClose={() => setSelected(null)} />
    </>
  );
}
