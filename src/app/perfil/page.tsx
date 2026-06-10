"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plano, setPlano] = useState("gratuito");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [sucessoSenha, setSucessoSenha] = useState("");

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

  async function handleAlterarSenha() {
    setErroSenha("");
    setSucessoSenha("");

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      setErroSenha("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroSenha("A nova senha e a confirmação não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      setErroSenha("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoadingSenha(true);
    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senhaAtual, novaSenha }),
    });
    setLoadingSenha(false);

    const data = await res.json();

    if (!res.ok) {
      setErroSenha(data.error || "Erro ao alterar senha.");
      return;
    }

    setSucessoSenha("Senha alterada com sucesso!");
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }

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

        <div className="rounded-xl p-5" style={{backgroundColor: '#111111'}}>
          <p className="text-xs mb-4 font-semibold uppercase tracking-wider" style={{color: '#a1a1aa'}}>
            Alterar senha
          </p>

          {erroSenha && (
            <div className="rounded-lg px-4 py-3 mb-4 text-sm text-red-400" style={{backgroundColor: '#2a1a1a'}}>
              {erroSenha}
            </div>
          )}

          {sucessoSenha && (
            <div className="rounded-lg px-4 py-3 mb-4 text-sm" style={{backgroundColor: '#1a2a1a', color: '#3d5a3e'}}>
              {sucessoSenha}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs mb-1 block" style={{color: '#a1a1aa'}}>Senha atual</label>
              <div className="relative">
                <input
                  type={showSenhaAtual ? "text" : "password"}
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 outline-none text-white text-sm pr-12"
                  style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}
                />
                <button type="button" onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{color: '#a1a1aa'}}>
                  {showSenhaAtual ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{color: '#a1a1aa'}}>Nova senha</label>
              <div className="relative">
                <input
                  type={showNovaSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 outline-none text-white text-sm pr-12"
                  style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}
                />
                <button type="button" onClick={() => setShowNovaSenha(!showNovaSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{color: '#a1a1aa'}}>
                  {showNovaSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs mb-1 block" style={{color: '#a1a1aa'}}>Confirmar nova senha</label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full rounded-lg px-4 py-3 outline-none text-white text-sm"
                style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}
              />
            </div>

            <button onClick={handleAlterarSenha} disabled={loadingSenha}
              className="w-full rounded-xl py-3 text-white text-sm font-semibold mt-2"
              style={{backgroundColor: '#3d5a3e', opacity: loadingSenha ? 0.7 : 1}}>
              {loadingSenha ? "Salvando..." : "Alterar senha"}
            </button>
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