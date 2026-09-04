"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { getFacility } from "@/lib/data/facilities";
import { getAsset } from "@/lib/data/assets";
import { heroWhatIfOptions } from "@/lib/data/whatifOptions";
import { computeDecisionScores, DEFAULT_DECISION_WEIGHTS } from "@/lib/whatif/decisionEngine";
import { WhatIfComparison } from "@/components/whatif/WhatIfComparison";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import type { ScoredWhatIfOption } from "@/lib/whatif/decisionEngine";
import type { DecisionWeights } from "@/lib/types";

const SLIDER_KEYS: (keyof DecisionWeights)[] = ["serviceImpact", "delay", "cost", "risk", "resourceEfficiency"];

export default function WhatIfPage() {
  const { t, bi } = useLanguage();
  const searchParams = useSearchParams();
  const facilityId = searchParams.get("facility") ?? "AR-01";
  const assetId = searchParams.get("asset") ?? "AR-IR-001";
  const facility = getFacility(facilityId);
  const asset = getAsset(assetId);

  const transferPart = useAppStore((s) => s.transferPart);
  const log = useAppStore((s) => s.log);
  const approval = useAppStore((s) => s.approvals.find((a) => a.workOrderId === "WO-2026-0001"));

  const [rawWeights, setRawWeights] = useState<DecisionWeights>({ ...DEFAULT_DECISION_WEIGHTS });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [transferDone, setTransferDone] = useState(false);

  const weightSum = SLIDER_KEYS.reduce((s, k) => s + rawWeights[k], 0) || 1;
  const normalizedWeights = SLIDER_KEYS.reduce((acc, k) => ({ ...acc, [k]: rawWeights[k] / weightSum }), {} as DecisionWeights);

  const scored: ScoredWhatIfOption[] = useMemo(
    () => computeDecisionScores(heroWhatIfOptions, normalizedWeights),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawWeights]
  );

  const handleSelect = (option: ScoredWhatIfOption) => {
    setSelectedId(option.id);
    if (option.id === "C" && !transferDone) {
      transferPart("PT-002", "PT-001", 2);
      log({
        en: "Transfer request generated: 2x Pump Impeller (IR-450) from Turaif to Arar warehouse",
        ar: "تم إنشاء طلب نقل: دفاعتان (IR-450) من مستودع طريف إلى عرعر",
      });
      setTransferDone(true);
      toast.success(t.whatif.generateApproval, { description: bi(option.label) });
    } else {
      log({ en: `Selected what-if option: ${option.label.en}`, ar: `تم اختيار البديل: ${option.label.ar}` });
      toast.success(t.common.confirm, { description: bi(option.label) });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.whatif.title}</h1>
        <p className="text-sm text-muted-foreground">{t.whatif.subtitle}</p>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <p className="text-xs text-muted-foreground">{t.whatif.scenario}</p>
        <p className="font-semibold text-sm mt-0.5">
          {asset ? bi(asset.name) : assetId} — {facility ? bi(facility.name) : facilityId}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Compatible impeller unavailable locally · standard procurement lead time 8 days · maintenance window within 2 days
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <p className="text-sm font-semibold">{t.whatif.priorities}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SLIDER_KEYS.map((key) => (
            <div key={key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.whatif[key === "resourceEfficiency" ? "resourceReq" : key === "delay" ? "delay" : key === "cost" ? "cost" : key === "risk" ? "risk" : "serviceImpact"]}</span>
                <span className="font-semibold">{Math.round((rawWeights[key] / weightSum) * 100)}%</span>
              </div>
              <Slider
                value={[rawWeights[key]]}
                min={0}
                max={100}
                step={5}
                onValueChange={([v]) => setRawWeights((w) => ({ ...w, [key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>

      <WhatIfComparison options={scored} onSelect={handleSelect} selectedId={selectedId} />

      {transferDone && approval && (
        <div className="rounded-xl border border-brand-gold/40 bg-brand-gold/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-sm">
            <span className="font-semibold">{t.whatif.generateApproval}</span> — {bi(approval.title)}
          </p>
          <Button asChild size="sm">
            <Link href="/approvals">
              {t.nav.approvals} <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
