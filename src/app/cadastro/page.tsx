"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function CadastroPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCadastro() {
    setError("");
    if (password !== confirm) {
      setError("As senhas não coincidem");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{backgroundColor: '#0a0a0a'}}>
      <div className="w-full max-w-md rounded-2xl p-8" style={{backgroundColor: '#111111'}}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight" style={{color: '#3d5a3e'}}>LucrApp</h1>
          <p className="text-sm mt-1" style={{color: '#a1a1aa'}}>GS Soluções Digitais</p>
        </div>
        {error && (
          <div className="rounded-lg px-4 py-3 mb-4 text-sm text-red-400" style={{backgroundColor: '#2a1a1a'}}>
            {error}
          </div>
        )}
        <div className="flex flex-col gap-3">
          <input type="text" placeholder="Nome completo" value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg px-4 py-3 outline-none text-white text-sm"
            style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}
          />
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg px-4 py-3 outline-none text-white text-sm"
            style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg px-4 py-3 outline-none text-white text-sm pr-12"
              style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style={{color: '#a1a1aa'}}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirmar senha"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-lg px-4 py-3 outline-none text-white text-sm pr-12"
              style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm"
              style={{color: '#a1a1aa'}}>
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <button onClick={handleCadastro} disabled={loading}
            className="rounded-lg py-3 text-white font-semibold text-sm transition"
            style={{backgroundColor: '#3d5a3e', opacity: loading ? 0.7 : 1}}>
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </div>
        <p className="text-center text-sm mt-6" style={{color: '#a1a1aa'}}>
          Já tem conta?{' '}
          <a href="/login" className="font-semibold" style={{color: '#3d5a3e'}}>Entrar</a>
        </p>
      </div>
    </div>
  );
}