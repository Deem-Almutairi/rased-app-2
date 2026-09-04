"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export function LanguageToggle({ variant = "ghost" }: { variant?: "ghost" | "outline" }) {
  const { locale, toggleLocale } = useLanguage();
  return (
    <Button variant={variant} size="sm" onClick={toggleLocale} className="gap-1.5">
      <Languages className="size-4" />
      {locale === "en" ? "العربية" : "English"}
    </Button>
  );
}
