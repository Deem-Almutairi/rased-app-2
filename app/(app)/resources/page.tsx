"use client";

import { useMemo, useState } from "react";
import { Search, AlertOctagon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { cityLabels } from "@/lib/data/facilities";
import { InventoryTable } from "@/components/resources/InventoryTable";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PartStatus, CityId } from "@/lib/types";

export default function ResourcesPage() {
  const { t, bi } = useLanguage();
  const inventory = useAppStore((s) => s.inventory);
  const [query, setQuery] = useState("");
  const [warehouse, setWarehouse] = useState<CityId | "all">("all");
  const [status, setStatus] = useState<PartStatus | "all">("all");

  const criticalParts = inventory.filter(
    (p) => p.criticality === "critical" && (p.status === "out_of_stock" || p.status === "low_stock")
  );

  const filtered = useMemo(() => {
    return inventory.filter((p) => {
      const matchesQuery =
        query.trim() === "" || p.id.toLowerCase().includes(query.toLowerCase()) || p.name.en.toLowerCase().includes(query.toLowerCase());
      const matchesWarehouse = warehouse === "all" || p.warehouse === warehouse;
      const matchesStatus = status === "all" || p.status === status;
      return matchesQuery && matchesWarehouse && matchesStatus;
    });
  }, [inventory, query, warehouse, status]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.resources.title}</h1>
        <p className="text-sm text-muted-foreground">{t.resources.subtitle}</p>
      </div>

      {criticalParts.length > 0 && (
        <div className="rounded-xl border border-status-risk/30 bg-status-risk-bg p-4 space-y-2">
          <p className="text-sm font-semibold text-status-risk flex items-center gap-1.5">
            <AlertOctagon className="size-4" /> {t.resources.criticalParts}
          </p>
          <div className="flex flex-wrap gap-2">
            {criticalParts.map((p) => (
              <span key={p.id} className="text-xs rounded-lg bg-card border border-status-risk/20 px-2.5 py-1.5">
                <span className="font-medium">{bi(p.name)}</span>
                <span className="text-muted-foreground"> · {bi(cityLabels[p.warehouse])} · {t.status[p.status]}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder={t.common.search} value={query} onChange={(e) => setQuery(e.target.value)} className="ps-9" />
        </div>
        <Select value={warehouse} onValueChange={(v) => setWarehouse(v as CityId | "all")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t.resources.warehouse} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            {Object.entries(cityLabels).map(([id, label]) => (
              <SelectItem key={id} value={id}>
                {bi(label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as PartStatus | "all")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t.common.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            <SelectItem value="available">{t.status.available}</SelectItem>
            <SelectItem value="low_stock">{t.status.low_stock}</SelectItem>
            <SelectItem value="out_of_stock">{t.status.out_of_stock}</SelectItem>
            <SelectItem value="ordered">{t.status.ordered}</SelectItem>
            <SelectItem value="in_transit">{t.status.in_transit}</SelectItem>
            <SelectItem value="delayed">{t.status.delayed}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <InventoryTable parts={filtered} />
    </div>
  );
}
