"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError("Email ou senha incorretos");
      return;
    }
    router.push("/dashboard");
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
  className="absolute right-3 top-1/2 -translate-y-1/2"
  style={{color: '#a1a1aa'}}>
  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
</button>
          </div>
          <button onClick={handleLogin} disabled={loading}
            className="rounded-lg py-3 text-white font-semibold text-sm transition"
            style={{backgroundColor: '#3d5a3e', opacity: loading ? 0.7 : 1}}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </div>
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{backgroundColor: '#2a2a2a'}} />
          <span className="text-xs" style={{color: '#a1a1aa'}}>ou continue com</span>
          <div className="flex-1 h-px" style={{backgroundColor: '#2a2a2a'}} />
        </div>
        <button className="w-full rounded-lg py-3 text-white text-sm font-medium transition"
          style={{backgroundColor: '#1a3a4a'}}>
          Entrar com Google
        </button>
        <p className="text-center text-sm mt-6" style={{color: '#a1a1aa'}}>
          Não tem conta?{' '}
          <a href="/cadastro" className="font-semibold" style={{color: '#3d5a3e'}}>Criar conta</a>
        </p>
      </div>
    </div>
  );
}