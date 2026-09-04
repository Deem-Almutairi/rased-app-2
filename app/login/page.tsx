"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthProvider";
import { demoUsers } from "@/lib/data/users";

export default function LoginPage() {
  const { t, bi, dir } = useLanguage();
  const { user, isLoading, signIn, signInAsDemo } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) router.replace("/dashboard");
  }, [isLoading, user, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setTimeout(() => {
      const result = signIn(email, password);
      if (!result.ok) {
        setError(t.login.invalidCredentials);
        setSubmitting(false);
      } else {
        router.replace("/dashboard");
      }
    }, 350);
  };

  const handleDemoClick = (demoEmail: string) => {
    setSubmitting(true);
    setTimeout(() => {
      signInAsDemo(demoEmail);
      router.replace("/dashboard");
    }, 250);
  };

  const featuredDemoEmails = ["admin@rased.sa", "maintenance@rased.sa", "procurement@rased.sa", "technician@rased.sa"];
  const featured = demoUsers.filter((u) => featuredDemoEmails.includes(u.email));

  return (
    <div className="min-h-screen flex bg-background" dir={dir}>
      {/* Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-brand-emerald-dark overflow-hidden flex-col justify-between p-10 text-white">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(198,149,47,0.5), transparent 40%), radial-gradient(circle at 80% 70%, rgba(14,109,109,0.6), transparent 45%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-brand-gold text-brand-emerald-dark font-bold text-2xl">
            ر
          </div>
          <div>
            <p className="text-xl font-bold">RASED | راصد</p>
            <p className="text-xs text-white/60">ENBTHON 2026</p>
          </div>
        </div>

        <div className="relative space-y-4 max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-brand-gold-light">
            <ShieldCheck className="size-3.5" />
            {t.common.prototypeLabel}
          </span>
          <h1 className="text-3xl font-bold leading-tight">{t.common.tagline}</h1>
          <p className="text-white/70">{t.common.taglineSecondary}</p>
          <p className="text-white/50 text-sm pt-4">{t.common.region}</p>
        </div>

        <p className="relative text-xs text-white/40">{t.login.poweredBy}</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center p-4 lg:justify-end">
          <div className="lg:hidden flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-brand-emerald text-white font-bold">ر</div>
            <span className="font-bold">RASED</span>
          </div>
          <LanguageToggle variant="outline" />
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-sm space-y-6">
            <div className="space-y-1.5 text-center lg:text-start">
              <h2 className="text-2xl font-bold">{t.login.title}</h2>
              <p className="text-sm text-muted-foreground">{t.login.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">{t.login.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@rased.sa"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">{t.login.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-status-risk">{error}</p>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                {t.login.signIn}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">{t.login.demoAccounts}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">{t.login.demoHint}</p>

            <div className="grid grid-cols-2 gap-2">
              {featured.map((u) => (
                <Card
                  key={u.uid}
                  className="cursor-pointer hover:border-brand-emerald hover:shadow-md transition-all py-0"
                  onClick={() => !submitting && handleDemoClick(u.email)}
                >
                  <CardContent className="p-3 space-y-0.5">
                    <p className="text-sm font-semibold truncate">{bi(u.name)}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{bi(u.title)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground text-center pt-2">{t.login.event} · {t.login.poweredBy}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
