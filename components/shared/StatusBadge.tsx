import { cn } from "@/lib/utils";
import { statusTone, toneClasses, type Tone } from "@/lib/status-tone";

export function StatusBadge({
  status,
  label,
  tone,
  className,
  dot = true,
}: {
  status: string;
  label: string;
  tone?: Tone;
  className?: string;
  dot?: boolean;
}) {
  const resolvedTone = tone ?? statusTone(status);
  const c = toneClasses[resolvedTone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        c.bg,
        c.text,
        c.border,
        className
      )}
    >
      {dot && <span className={cn("size-1.5 rounded-full", c.dot)} />}
      {label}
    </span>
  );
}

export function RiskDot({ level }: { level: "low" | "medium" | "high" | "critical" }) {
  const tone: Tone = level === "critical" || level === "high" ? "risk" : level === "medium" ? "attention" : "ready";
  const c = toneClasses[tone];
  return <span className={cn("inline-block size-2 rounded-full", c.dot)} title={level} />;
}
