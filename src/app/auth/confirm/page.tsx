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
    document.title = "Confirmar acesso | Oratos";
  }, []);

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
    <div className="flex min-h-full flex-1 flex-col">
      <header className="flex items-center justify-center px-6 py-8">
        <img
          src="https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/oratus_light.png"
          alt="Oratus"
          width={1011}
          height={247}
          className="h-auto w-full max-w-[180px]"
        />
      </header>

      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 pb-12">
        <Loader2 className="text-primary size-8 animate-spin" />
        <p className="text-muted-foreground text-sm">{message}</p>
      </main>
    </div>
  );
}

export default function ConfirmAuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-full flex-1 flex-col">
          <header className="flex items-center justify-center px-6 py-8">
            <img
              src="https://mclturmjholrfjqfivwi.supabase.co/storage/v1/object/public/system_images/oratus_light.png"
              alt="Oratus"
              width={1011}
              height={247}
              className="h-auto w-full max-w-[180px]"
            />
          </header>

          <main className="flex flex-1 items-center justify-center px-6 pb-12">
            <Loader2 className="text-primary size-8 animate-spin" />
          </main>
        </div>
      }
    >
      <ConfirmAuthContent />
    </Suspense>
  );
}
