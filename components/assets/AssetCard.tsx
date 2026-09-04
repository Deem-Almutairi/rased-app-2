"use client";

import { Activity, Gauge, Thermometer, Droplets, Zap } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { assetTypeLabels } from "@/lib/data/assets";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { RiskBadge } from "@/components/shared/RiskBadge";
import { formatDate } from "@/lib/utils";
import type { Asset } from "@/lib/types";

export function AssetCard({ asset }: { asset: Asset }) {
  const { t, bi, locale } = useLanguage();
  const sensors = asset.sensors;

  return (
    <div className="rounded-xl border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{asset.id} · {bi(assetTypeLabels[asset.type])}</p>
          <p className="font-semibold text-sm">{bi(asset.name)}</p>
        </div>
        <RiskBadge level={asset.currentRisk} />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t.assets.condition}</span>
          <StatusBadge status={asset.condition} label={asset.condition} dot={false} className="py-0" />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t.assets.criticality}</span>
          <span className="font-medium capitalize">{asset.criticality}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t.assets.sensorStatus}</span>
          <StatusBadge status={asset.sensorStatus} label={asset.sensorStatus} dot={false} className="py-0" />
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t.assets.failureHistory}</span>
          <span className="font-medium">{asset.failureHistory}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t.assets.runtimeHours}</span>
          <span className="font-medium tabular-nums">{asset.runtimeHours.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t.facilities.nextMaintenance}</span>
          <span className="font-medium">{formatDate(asset.nextMaintenance, locale)}</span>
        </div>
      </div>

      {sensors && Object.keys(sensors).length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {sensors.vibration !== undefined && (
            <SensorChip icon={Activity} label="Vib" value={`${sensors.vibration.toFixed(1)} mm/s`} warn={sensors.vibration >= 4.5} />
          )}
          {sensors.temperature !== undefined && (
            <SensorChip icon={Thermometer} label="Temp" value={`${sensors.temperature}°C`} warn={sensors.temperature >= 65} />
          )}
          {sensors.flowRate !== undefined && <SensorChip icon={Gauge} label="Flow" value={`${sensors.flowRate} L/min`} />}
          {sensors.tankLevel !== undefined && (
            <SensorChip icon={Droplets} label="Level" value={`${sensors.tankLevel}%`} warn={sensors.tankLevel < 30} />
          )}
          {sensors.energyConsumption !== undefined && <SensorChip icon={Zap} label="Energy" value={`${sensors.energyConsumption} kWh`} />}
        </div>
      )}

      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-muted-foreground">{t.assets.assignedTechnician}</span>
        <span className="font-medium">{asset.assignedTechnician ?? t.assets.unassigned}</span>
      </div>
    </div>
  );
}

function SensorChip({ icon: Icon, label, value, warn }: { icon: typeof Activity; label: string; value: string; warn?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${
        warn ? "bg-status-risk-bg text-status-risk" : "bg-muted text-muted-foreground"
      }`}
    >
      <Icon className="size-3" /> {label} {value}
    </span>
  );
}
