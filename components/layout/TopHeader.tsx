"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LanguageToggle } from "./LanguageToggle";
import { MobileNavSheet } from "./MobileNavSheet";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useAppStore } from "@/lib/store/useAppStore";

export function TopHeader({ title }: { title?: string }) {
  const { locale } = useLanguage();
  const { user, signOut } = useAuth();
  const activeAlerts = useAppStore((s) => s.alerts.filter((a) => a.status === "active").length);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- clock must start after mount to avoid SSR/client time skew
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-background/95 backdrop-blur px-4 py-3 lg:px-6">
      <div className="flex items-center gap-2 min-w-0">
        <MobileNavSheet />
        {title && <h1 className="text-lg font-semibold truncate">{title}</h1>}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {now && (
          <span className="hidden md:inline text-xs text-muted-foreground tabular-nums">
            {now.toLocaleDateString(locale === "ar" ? "ar-SA" : "en-GB", { weekday: "short", day: "numeric", month: "short" })}
            {" · "}
            {now.toLocaleTimeString(locale === "ar" ? "ar-SA" : "en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
        )}
        <LanguageToggle />
        <Link href="/alerts">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-5" />
            {activeAlerts > 0 && (
              <span className="absolute -top-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-status-risk text-[10px] font-semibold text-white">
                {activeAlerts}
              </span>
            )}
          </Button>
        </Link>
        {user && (
          <button onClick={signOut} className="lg:hidden">
            <Avatar className="size-8">
              <AvatarFallback className="bg-brand-emerald/10 text-brand-emerald font-semibold text-xs">
                {user.avatarInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        )}
      </div>
    </header>
  );
}
