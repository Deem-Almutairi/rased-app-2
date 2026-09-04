"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { facilities } from "@/lib/data/facilities";
import { assetTypeLabels } from "@/lib/data/assets";
import { AssetCard } from "@/components/assets/AssetCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AssetType } from "@/lib/types";

export default function AssetsPage() {
  const { t, bi } = useLanguage();
  const assets = useAppStore((s) => s.assets);
  const [query, setQuery] = useState("");
  const [facilityId, setFacilityId] = useState("all");
  const [type, setType] = useState<AssetType | "all">("all");

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchesQuery =
        query.trim() === "" || a.id.toLowerCase().includes(query.toLowerCase()) || a.name.en.toLowerCase().includes(query.toLowerCase());
      const matchesFacility = facilityId === "all" || a.facilityId === facilityId;
      const matchesType = type === "all" || a.type === type;
      return matchesQuery && matchesFacility && matchesType;
    });
  }, [assets, query, facilityId, type]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.assets.title}</h1>
        <p className="text-sm text-muted-foreground">{assets.length} {t.assets.title.toLowerCase()} · {t.common.prototypeLabel}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder={t.common.search} value={query} onChange={(e) => setQuery(e.target.value)} className="ps-9" />
        </div>
        <Select value={facilityId} onValueChange={setFacilityId}>
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue placeholder={t.common.facility} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            {facilities.map((f) => (
              <SelectItem key={f.id} value={f.id}>
                {f.id} · {bi(f.name)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={(v) => setType(v as AssetType | "all")}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder={t.common.category} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.common.all}</SelectItem>
            {Object.entries(assetTypeLabels).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {bi(label)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center text-sm text-muted-foreground">{t.common.noData}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((a) => (
            <AssetCard key={a.id} asset={a} />
          ))}
        </div>
      )}
    </div>
  );
}
