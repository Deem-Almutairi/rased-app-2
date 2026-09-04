export { cn } from "cn";

export function formatDate(iso: string, locale: "en" | "ar" = "en") {
  const d = new Date(iso);
  return d.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function daysBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function daysFromNow(iso: string) {
  return daysBetween(new Date().toISOString(), iso);
}

export function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

export function formatNumber(n: number, locale: "en" | "ar" = "en") {
  return n.toLocaleString(locale === "ar" ? "ar-SA" : "en-US");
}

export function formatCurrency(n: number, locale: "en" | "ar" = "en") {
  return new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(n);
}
