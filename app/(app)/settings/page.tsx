"use client";

import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { DEFAULT_WEIGHTS } from "@/lib/readiness/calculateReadiness";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { KPIWeights } from "@/lib/types";

const WEIGHT_KEYS: (keyof KPIWeights)[] = [
  "assetCondition",
  "maintenancePreparedness",
  "sparePartsAvailability",
  "personnelAvailability",
  "equipmentAvailability",
  "approvalReadiness",
  "serviceRiskCondition",
];

export default function SettingsPage() {
  const { t, bi } = useLanguage();
  const { user } = useAuth();
  const weights = useAppStore((s) => s.weights);
  const setWeights = useAppStore((s) => s.setWeights);

  const total = WEIGHT_KEYS.reduce((s, k) => s + weights[k], 0);

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold">{t.settings.title}</h1>
        <p className="text-sm text-muted-foreground">{t.settings.subtitle}</p>
      </div>

      {user && (
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <Avatar className="size-11">
            <AvatarFallback className="bg-brand-emerald/10 text-brand-emerald font-semibold">{user.avatarInitials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-sm">{bi(user.name)}</p>
            <p className="text-xs text-muted-foreground">{bi(user.title)} · {user.email}</p>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">{t.settings.language}</p>
          <p className="text-xs text-muted-foreground">English / العربية</p>
        </div>
        <LanguageToggle variant="outline" />
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{t.settings.weights}</p>
            <p className="text-xs text-muted-foreground">{t.readiness.formula}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setWeights(DEFAULT_WEIGHTS)}>
            {t.common.reset}
          </Button>
        </div>
        <div className="space-y-3">
          {WEIGHT_KEYS.map((key) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <Label>{t.readiness[key]}</Label>
                <span className="font-semibold tabular-nums">{Math.round((weights[key] / total) * 100)}%</span>
              </div>
              <Slider
                value={[weights[key] * 100]}
                min={0}
                max={40}
                step={1}
                onValueChange={([v]) => setWeights({ ...weights, [key]: v / 100 })}
              />
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {t.common.prototypeLabel} — {t.common.poweredByRules}
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-2">
        <p className="text-sm font-medium">{t.settings.escalation}</p>
        <p className="text-xs text-muted-foreground">
          24 {t.common.hours} — {t.status.pending} {t.approvals.title.toLowerCase()} beyond this threshold are automatically flagged as {t.status.escalated}.
        </p>
      </div>

      <div className="rounded-xl border bg-card p-4 space-y-1.5">
        <p className="text-sm font-medium">{t.settings.about}</p>
        <p className="text-xs text-muted-foreground">RASED | راصد — {t.common.tagline}</p>
        <p className="text-xs text-muted-foreground">{t.common.region} · ENBTHON 2026</p>
        <p className="text-xs text-muted-foreground">ForgeX Team · Northern Border University</p>
      </div>
    </div>
  );
}
