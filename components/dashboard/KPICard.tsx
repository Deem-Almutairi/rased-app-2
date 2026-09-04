import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Tone } from "@/lib/status-tone";
import { toneClasses } from "@/lib/status-tone";

export function KPICard({
  label,
  value,
  icon: Icon,
  tone = "neutral",
  hint,
  className,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  tone?: Tone;
  hint?: string;
  className?: string;
}) {
  const c = toneClasses[tone];
  return (
    <div className={cn("rounded-xl border bg-card p-4 shadow-sm flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground truncate">{label}</p>
        <p className="text-2xl font-bold tabular-nums mt-1 text-card-foreground">{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
      {Icon && (
        <div className={cn("shrink-0 rounded-lg p-2", c.bg)}>
          <Icon className={cn("size-5", c.text)} />
        </div>
      )}
    </div>
  );
}
