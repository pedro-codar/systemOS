"use client";

import { createClient } from "@/lib/supabase/client";
import type { EmailOtpType } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function ConfirmAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Confirmando seu convite...");

  useEffect(() => {
    async function confirmAuth() {
      const supabase = createClient();
      const next = searchParams.get("next") ?? "/auth/set-password";
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type") as EmailOtpType | null;

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
          router.replace(next);
          return;
        }
      }

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type,
          token_hash: tokenHash,
        });

        if (!error) {
          router.replace(next);
          return;
        }
      }

      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (!error) {
          window.history.replaceState(
            null,
            "",
            `${window.location.pathname}${window.location.search}`,
          );
          router.replace(next);
          return;
        }
      }

      setMessage("Link inválido ou expirado.");
      router.replace("/auth/login?error=link-invalido");
    }

    confirmAuth();
  }, [router, searchParams]);

  return (
    <div className="bg-foreground text-background flex min-h-full flex-1 flex-col items-center justify-center gap-4">
      <Loader2 className="text-primary size-8 animate-spin" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  );
}

export default function ConfirmAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-foreground text-background flex min-h-full flex-1 items-center justify-center">
          <Loader2 className="text-primary size-8 animate-spin" />
        </div>
      }
    >
      <ConfirmAuthContent />
    </Suspense>
  );
}
