"use client";

import { toast } from "sonner";
import { AlertTriangle, PackageX, Clock, Sparkles, RotateCcw } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAppStore } from "@/lib/store/useAppStore";
import { facilities } from "@/lib/data/facilities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Asset, AssetCondition } from "@/lib/types";

export function SimulationControlPanel({
  facilityId,
  onFacilityChange,
  assetId,
  onAssetChange,
  asset,
}: {
  facilityId: string;
  onFacilityChange: (id: string) => void;
  assetId: string;
  onAssetChange: (id: string) => void;
  asset: Asset | undefined;
}) {
  const { t, bi } = useLanguage();
  const assets = useAppStore((s) => s.assets);
  const inventory = useAppStore((s) => s.inventory);
  const approvals = useAppStore((s) => s.approvals);

  const updateAssetSensors = useAppStore((s) => s.updateAssetSensors);
  const setAssetCondition = useAppStore((s) => s.setAssetCondition);
  const setPartStock = useAppStore((s) => s.setPartStock);
  const escalateApproval = useAppStore((s) => s.escalateApproval);
  const simulateFailureRisk = useAppStore((s) => s.simulateFailureRisk);
  const simulateSparePartShortage = useAppStore((s) => s.simulateSparePartShortage);
  const simulateApprovalDelay = useAppStore((s) => s.simulateApprovalDelay);
  const simulateRecovery = useAppStore((s) => s.simulateRecovery);
  const resetScenario = useAppStore((s) => s.resetScenario);

  const assetsForFacility = assets.filter((a) => a.facilityId === facilityId);
  const relatedPart = asset ? inventory.find((p) => asset.requiredSpareParts.includes(p.id)) : undefined;
  const relatedApproval = approvals.find((a) => a.assetId === assetId);

  return (
    <div className="rounded-xl border bg-card p-4 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>{t.simulator.selectFacility}</Label>
          <Select value={facilityId} onValueChange={onFacilityChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {facilities.map((f) => (
                <SelectItem key={f.id} value={f.id}>
                  {f.id} · {bi(f.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>{t.simulator.selectAsset}</Label>
          <Select value={assetId} onValueChange={onAssetChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assetsForFacility.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.id} · {bi(a.name)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {asset && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <SliderField
            label={t.simulator.vibration}
            unit="mm/s"
            value={asset.sensors?.vibration ?? 2}
            max={10}
            onChange={(v) => updateAssetSensors(asset.id, { vibration: v })}
          />
          <SliderField
            label={t.simulator.temperature}
            unit="°C"
            value={asset.sensors?.temperature ?? 40}
            max={100}
            onChange={(v) => updateAssetSensors(asset.id, { temperature: v })}
          />
          {asset.sensors?.flowRate !== undefined && (
            <SliderField
              label={t.simulator.waterFlow}
              unit="L/min"
              value={asset.sensors.flowRate}
              max={600}
              onChange={(v) => updateAssetSensors(asset.id, { flowRate: v })}
            />
          )}
          <SliderField
            label={t.simulator.energyConsumption}
            unit="kWh"
            value={asset.sensors?.energyConsumption ?? 30}
            max={100}
            onChange={(v) => updateAssetSensors(asset.id, { energyConsumption: v })}
          />

          <div className="space-y-1.5">
            <Label>{t.simulator.assetCondition}</Label>
            <Select value={asset.condition} onValueChange={(v) => setAssetCondition(asset.id, v as AssetCondition)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["excellent", "good", "fair", "poor", "critical"] as AssetCondition[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {relatedPart && (
            <div className="space-y-1.5">
              <Label>
                {t.simulator.sparePartAvailability} — {bi(relatedPart.name)}
              </Label>
              <Slider
                value={[relatedPart.currentStock]}
                max={10}
                step={1}
                onValueChange={([v]) => setPartStock(relatedPart.id, v)}
              />
              <p className="text-[11px] text-muted-foreground">{relatedPart.currentStock} units in stock</p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 pt-2 border-t">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (!asset) return;
            simulateFailureRisk(asset.id);
            toast.error(t.simulator.simulateFailure);
          }}
        >
          <AlertTriangle className="size-3.5 text-status-risk" /> {t.simulator.simulateFailure}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (!relatedPart) return;
            simulateSparePartShortage(relatedPart.id);
            toast.error(t.simulator.simulateShortage);
          }}
        >
          <PackageX className="size-3.5 text-status-risk" /> {t.simulator.simulateShortage}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (relatedApproval) {
              simulateApprovalDelay(relatedApproval.id);
            } else {
              escalateApproval("AP-2026-001");
            }
            toast.warning(t.simulator.simulateDelay);
          }}
        >
          <Clock className="size-3.5 text-status-attention" /> {t.simulator.simulateDelay}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (!asset) return;
            simulateRecovery(asset.id);
            toast.success(t.simulator.simulateRecovery);
          }}
        >
          <Sparkles className="size-3.5 text-status-ready" /> {t.simulator.simulateRecovery}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            resetScenario();
            toast(t.simulator.resetScenario);
          }}
        >
          <RotateCcw className="size-3.5" /> {t.simulator.resetScenario}
        </Button>
      </div>
    </div>
  );
}

function SliderField({
  label,
  unit,
  value,
  max,
  onChange,
}: {
  label: string;
  unit: string;
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <Label>{label}</Label>
        <span className="font-semibold tabular-nums">
          {value} {unit}
        </span>
      </div>
      <Slider value={[value]} max={max} step={max > 50 ? 1 : 0.1} onValueChange={([v]) => onChange(v)} />
    </div>
  );
}
