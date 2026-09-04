"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { navItems } from "./nav-config";
import { canAccess } from "@/lib/rbac";

export function MobileNavSheet() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, dir } = useLanguage();
  const { user, signOut } = useAuth();

  if (!user) return null;
  const items = navItems.filter((item) => canAccess(user.role, item.key));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={dir === "rtl" ? "right" : "left"} className="w-72 bg-sidebar text-sidebar-foreground border-sidebar-border p-0">
        <SheetHeader className="px-5 py-5">
          <SheetTitle className="flex items-center gap-2.5 text-white">
            <div className="flex size-9 items-center justify-center rounded-lg bg-brand-gold text-brand-emerald-dark font-bold text-lg">
              ر
            </div>
            RASED | راصد
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-0.5">
          {items.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-sidebar-accent text-white" : "text-sidebar-foreground/75 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className="size-4.5 shrink-0" />
                <span className="truncate">{t.nav[item.key]}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="size-4" />
            {t.nav.logout}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
