"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, ClipboardList, Bell, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const items = [
  { key: "home", href: "/dashboard", icon: Home },
  { key: "map", href: "/map", icon: Map },
  { key: "tasks", href: "/maintenance", icon: ClipboardList },
  { key: "alerts", href: "/alerts", icon: Bell },
  { key: "more", href: "/settings", icon: MoreHorizontal },
] as const;

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium",
                active ? "text-brand-emerald" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("size-5", active && "fill-brand-emerald/10")} />
              {t.mobile[item.key]}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
