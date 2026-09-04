"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore, useAllFacilityReadiness } from "@/lib/store/useAppStore";
import { cityLabels } from "@/lib/data/facilities";
import { FacilityCard } from "@/components/facilities/FacilityCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { ReadinessStatus, CityId } from "@/lib/types";

export default function FacilitiesPage() {
  const { t, bi } = useLanguage();
  const facilities = useAppStore((s) => s.facilities);
  const readiness = useAllFacilityReadiness();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState<CityId | "all">("all");
  const [status, setStatus] = useState<ReadinessStatus | "all">("all");

  const filtered = useMemo(() => {
    return facilities.filter((f) => {
      const matchesQuery =
        query.trim() === "" ||
        f.id.toLowerCase().includes(query.toLowerCase()) ||
        f.name.en.toLowerCase().includes(query.toLowerCase()) ||
        f.name.ar.includes(query);
      const matchesCity = city === "all" || f.city === city;
      const matchesStatus = status === "all" || readiness.get(f.id)?.status === status;
      return matchesQuery && matchesCity && matchesStatus;
    });
  }, [facilities, query, city, status, readiness]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.facilities.title}</h1>
        <p className="text-sm text-muted-foreground">{t.facilities.subtitle}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder={t.common.search} value={query} onChange={(e) => setQuery(e.target.value)} className="ps-9" />
        </div>
        <Select value={city} onValueChange={(v) => setCity(v as CityId | "all")}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={t.common.location} />
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
        <Select value={status} onValueChange={(v) => setStatus(v as ReadinessStatus | "all")}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder={t.common.status} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            <SelectItem value="ready">{t.status.ready}</SelectItem>
            <SelectItem value="attention">{t.status.attention}</SelectItem>
            <SelectItem value="at_risk">{t.status.at_risk}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">{t.common.noData}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((f) => (
            <FacilityCard key={f.id} facility={f} />
          ))}
        </div>
      )}
    </div>
  );
}
