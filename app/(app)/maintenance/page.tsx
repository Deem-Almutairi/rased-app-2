"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { WorkOrderTable } from "@/components/maintenance/WorkOrderTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WorkOrderStatus, Priority } from "@/lib/types";

const STATUSES: WorkOrderStatus[] = [
  "new",
  "under_review",
  "approved",
  "scheduled",
  "in_progress",
  "waiting_for_part",
  "waiting_for_approval",
  "completed",
  "cancelled",
];

export default function MaintenancePage() {
  const { t } = useLanguage();
  const workOrders = useAppStore((s) => s.workOrders);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<WorkOrderStatus | "all">("all");
  const [priority, setPriority] = useState<Priority | "all">("all");

  const filtered = useMemo(() => {
    return [...workOrders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((w) => {
        const matchesQuery =
          query.trim() === "" ||
          w.id.toLowerCase().includes(query.toLowerCase()) ||
          w.problem.en.toLowerCase().includes(query.toLowerCase()) ||
          w.assetId.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = status === "all" || w.status === status;
        const matchesPriority = priority === "all" || w.priority === priority;
        return matchesQuery && matchesStatus && matchesPriority;
      });
  }, [workOrders, query, status, priority]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.maintenance.title}</h1>
        <p className="text-sm text-muted-foreground">{t.maintenance.subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder={t.common.search} value={query} onChange={(e) => setQuery(e.target.value)} className="ps-9" />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as WorkOrderStatus | "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t.common.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {t.status[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={(v) => setPriority(v as Priority | "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t.common.priority} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            <SelectItem value="low">{t.priority.low}</SelectItem>
            <SelectItem value="medium">{t.priority.medium}</SelectItem>
            <SelectItem value="high">{t.priority.high}</SelectItem>
            <SelectItem value="urgent">{t.priority.urgent}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <WorkOrderTable workOrders={filtered} />
    </div>
  );
}
