"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plano, setPlano] = useState("gratuito");

  useEffect(() => {
    async function carregarPlano() {
      const res = await fetch("/api/user/plan");
      if (res.ok) {
        const data = await res.json();
        setPlano(data.plan);
      }
    }
    if (status === "authenticated") carregarPlano();
  }, [status]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#0a0a0a'}}>
        <p style={{color: '#a1a1aa'}}>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0a0a0a'}}>
      <div className="flex items-center justify-between px-6 py-4" style={{borderBottom: '1px solid #1a1a1a'}}>
        <button onClick={() => router.push("/dashboard")}
          className="text-sm"
          style={{color: '#a1a1aa'}}>
          ← Voltar
        </button>
        <h1 className="text-lg font-bold" style={{color: '#3d5a3e'}}>Meu Perfil</h1>
        <div style={{width: 60}} />
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="rounded-xl p-5" style={{backgroundColor: '#111111'}}>
          <p className="text-xs mb-4 font-semibold uppercase tracking-wider" style={{color: '#a1a1aa'}}>
            Informações da conta
          </p>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Nome</p>
              <p className="text-white font-medium">{session?.user?.name || "—"}</p>
            </div>

            <div style={{borderTop: '1px solid #1a1a1a', paddingTop: 16}}>
              <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Email</p>
              <p className="text-white font-medium">{session?.user?.email || "—"}</p>
            </div>

            <div style={{borderTop: '1px solid #1a1a1a', paddingTop: 16}}>
              <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Plano</p>
              <p className="font-medium" style={{color: '#3d5a3e'}}>
                {plano === "pago" ? "Plus ✓" : "Gratuito"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full rounded-xl py-4 text-sm font-semibold"
          style={{backgroundColor: '#1a1a1a', color: '#ef4444'}}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}