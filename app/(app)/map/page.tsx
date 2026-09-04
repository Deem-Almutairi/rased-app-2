"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { RegionalMap } from "@/components/map/RegionalMap";

export default function MapPage() {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.nav.map}</h1>
        <p className="text-sm text-muted-foreground">{t.common.region} · {t.common.prototypeLabel}</p>
      </div>
      <RegionalMap className="h-[calc(100vh-220px)] min-h-[420px]" />
    </div>
  );
}
