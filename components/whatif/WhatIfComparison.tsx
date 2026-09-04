"use client";

import { Check, Crown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import type { ScoredWhatIfOption } from "@/lib/whatif/decisionEngine";

const METRICS: { key: "serviceImpact" | "risk" | "resourceRequirement" | "sustainabilityImpact"; labelKey: "serviceImpact" | "risk" | "resourceReq" | "sustainability" }[] = [
  { key: "serviceImpact", labelKey: "serviceImpact" },
  { key: "risk", labelKey: "risk" },
  { key: "resourceRequirement", labelKey: "resourceReq" },
  { key: "sustainabilityImpact", labelKey: "sustainability" },
];

export function WhatIfComparison({
  options,
  onSelect,
  selectedId,
}: {
  options: ScoredWhatIfOption[];
  onSelect: (option: ScoredWhatIfOption) => void;
  selectedId?: string | null;
}) {
  const { t, bi, locale } = useLanguage();
  const topId = options[0]?.id;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {options.map((option) => {
        const isTop = option.id === topId;
        const isSelected = option.id === selectedId;
        return (
          <div
            key={option.id}
            className={cn(
              "rounded-xl border bg-card p-4 space-y-3 relative",
              isTop && "border-brand-gold shadow-md ring-1 ring-brand-gold/40"
            )}
          >
            {isTop && (
              <span className="absolute -top-2.5 start-4 inline-flex items-center gap-1 rounded-full bg-brand-gold text-white text-[10px] font-semibold px-2 py-0.5">
                <Crown className="size-3" /> {t.common.recommended}
              </span>
            )}
            <div>
              <p className="text-xs text-muted-foreground">{t.whatif.scenario} {option.id}</p>
              <p className="font-semibold text-sm">{bi(option.label)}</p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{bi(option.description)}</p>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t">
              <Metric label={t.whatif.cost} value={formatCurrency(option.costUSD, locale)} />
              <Metric label={t.whatif.delay} value={`${option.delayDays} ${t.common.days}`} />
              {METRICS.map((m) => (
                <Metric key={m.key} label={t.whatif[m.labelKey]} value={`${option[m.key]}/100`} />
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">{t.whatif.decisionScore}</span>
              <span className={cn("text-lg font-bold tabular-nums", isTop ? "text-brand-gold" : "text-foreground")}>
                {Math.round(option.decisionScore)}
              </span>
            </div>

            <Button
              size="sm"
              variant={isSelected ? "default" : "outline"}
              className="w-full"
              onClick={() => onSelect(option)}
            >
              {isSelected && <Check className="size-3.5" />}
              {t.whatif.selectOption}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
