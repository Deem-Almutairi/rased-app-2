"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { navItems } from "./nav-config";
import { canAccess } from "@/lib/rbac";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { t, bi } = useLanguage();
  const { user, signOut } = useAuth();

  if (!user) return null;
  const items = navItems.filter((item) => canAccess(user.role, item.key));

  return (
    <aside
      className={cn(
        "hidden lg:flex lg:flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground border-e border-sidebar-border h-screen sticky top-0",
        className
      )}
    >
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-brand-gold text-brand-emerald-dark font-bold text-lg">
          ر
        </div>
        <div className="leading-tight">
          <p className="font-bold text-white">RASED | راصد</p>
          <p className="text-[11px] text-sidebar-foreground/60">{t.common.region}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-2 space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/75 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-4.5 shrink-0" />
              <span className="truncate">{t.nav[item.key]}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <Avatar className="size-9">
            <AvatarFallback className="bg-brand-gold/20 text-brand-gold-light font-semibold">
              {user.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-white truncate">{bi(user.name)}</p>
            <p className="text-[11px] text-sidebar-foreground/60 truncate">{bi(user.title)}</p>
          </div>
          <button
            onClick={signOut}
            className="shrink-0 rounded-md p-1.5 text-sidebar-foreground/60 hover:bg-white/10 hover:text-white"
            title={t.nav.logout}
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
