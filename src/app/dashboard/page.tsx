"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function DashboardPage() {
  const [modalAberto, setModalAberto] = useState(false);
  const [receita, setReceita] = useState("");
  const [gasolina, setGasolina] = useState("");
  const [alimentacao, setAlimentacao] = useState("");
  const [manutencao, setManutencao] = useState("");
  const [outros, setOutros] = useState("");
  const [loading, setLoading] = useState(false);
  const [receitaHoje, setReceitaHoje] = useState(0);
  const [gastosHoje, setGastosHoje] = useState(0);
  const [lucroHoje, setLucroHoje] = useState(0);
  const { data: session } = useSession();
  const router = useRouter();
  const [plano, setPlano] = useState("gratuito");
  const [historico, setHistorico] = useState<any[]>([]);
  const [receitaSemana, setReceitaSemana] = useState(0);
  const [gastosSemana, setGastosSemana] = useState(0);
  const [lucroSemana, setLucroSemana] = useState(0);
  const [receitaMes, setReceitaMes] = useState(0);
  const [gastosMes, setGastosMes] = useState(0);
  const [lucroMes, setLucroMes] = useState(0);
  const [diasMes, setDiasMes] = useState(0);
  const [modalEditAberto, setModalEditAberto] = useState(false);
  const [diaEditando, setDiaEditando] = useState<any>(null);
  const [editReceita, setEditReceita] = useState("");
  const [editGasolina, setEditGasolina] = useState("");
  const [editAlimentacao, setEditAlimentacao] = useState("");
  const [editManutencao, setEditManutencao] = useState("");
  const [editOutros, setEditOutros] = useState("");
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [horas, setHoras] = useState("");
  const [appUsado, setAppUsado] = useState("");
  const [editHoras, setEditHoras] = useState("");
  const [editAppUsado, setEditAppUsado] = useState("");
  const [mensagemSucesso, setMensagemSucesso] = useState("");
  const hoje = new Date();
  const [mesSelecionado, setMesSelecionado] = useState(hoje.getMonth() + 1);
  const [anoSelecionado, setAnoSelecionado] = useState(hoje.getFullYear());

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  function mostrarSucesso(msg: string) {
    setMensagemSucesso(msg);
    setTimeout(() => setMensagemSucesso(""), 3000);
  }

  async function carregarHistorico(mes: number, ano: number) {
    const res = await fetch(`/api/day/history?mes=${mes}&ano=${ano}`);
    if (res.ok) {
      const data = await res.json();
      setHistorico(data);
    }
  }

  useEffect(() => {
    async function carregarDados() {
      const res = await fetch("/api/day/today");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setReceitaHoje(data.grossIncome);
          setGastosHoje(data.fuel + data.food + data.maintenance + data.other);
          setLucroHoje(data.netIncome);
        }
      }
    }
    async function carregarSemana() {
      const res = await fetch(`/api/day/history?mes=${mesSelecionado}&ano=${anoSelecionado}`);
      if (res.ok) {
        const data = await res.json();
        const totalReceita = data.reduce((acc: number, d: any) => acc + d.grossIncome, 0);
        const totalGastos = data.reduce((acc: number, d: any) => acc + d.fuel + d.food + d.maintenance + d.other, 0);
        const totalLucro = data.reduce((acc: number, d: any) => acc + d.netIncome, 0);
        setReceitaSemana(totalReceita);
        setGastosSemana(totalGastos);
        setLucroSemana(totalLucro);
      }
    }
    async function carregarMes() {
      const res = await fetch("/api/day/monthly");
      if (res.ok) {
        const data = await res.json();
        setReceitaMes(data.totalReceita);
        setGastosMes(data.totalGastos);
        setLucroMes(data.totalLucro);
        setDiasMes(data.totalDias);
      }
    }
    async function carregarPlano() {
      const res = await fetch("/api/user/plan");
      if (res.ok) {
        const data = await res.json();
        setPlano(data.plan);
      }
    }
    if (session) {
      carregarDados();
      carregarHistorico(mesSelecionado, anoSelecionado);
      carregarSemana();
      carregarMes();
      carregarPlano();
    }
  }, [session, mesSelecionado, anoSelecionado]);

  async function handleSalvar() {
    setLoading(true);
    const r = parseFloat(receita) || 0;
    const g = parseFloat(gasolina) || 0;
    const a = parseFloat(alimentacao) || 0;
    const m = parseFloat(manutencao) || 0;
    const o = parseFloat(outros) || 0;
    const totalGastos = g + a + m + o;
    const lucro = r - totalGastos;
    const res = await fetch("/api/day", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grossIncome: r, fuel: g, food: a, maintenance: m, other: o,
        hoursWorked: parseFloat(horas) || null,
        appUsed: appUsado || null,
      }),
    });
    setLoading(false);
    if (res.status === 409) {
      alert("Você já registrou o dia de hoje. Use o botão Editar para alterar.");
      return;
    }
    if (!res.ok) {
      alert("Erro ao salvar. Tente novamente.");
      return;
    }
    setReceitaHoje(r);
    setGastosHoje(totalGastos);
    setLucroHoje(lucro);
    setModalAberto(false);
    setReceita(""); setGasolina(""); setAlimentacao(""); setManutencao(""); setOutros(""); setHoras(""); setAppUsado("");
    mostrarSucesso("Dia registrado com sucesso!");
    carregarHistorico(mesSelecionado, anoSelecionado);
    const resMes = await fetch("/api/day/monthly");
    if (resMes.ok) {
      const dataMes = await resMes.json();
      setReceitaMes(dataMes.totalReceita);
      setGastosMes(dataMes.totalGastos);
      setLucroMes(dataMes.totalLucro);
      setDiasMes(dataMes.totalDias);
    }
  }

  async function handleEditar() {
    if (!diaEditando) return;
    const idEditando = diaEditando.id;
    setLoadingEdit(true);
    const r = parseFloat(editReceita) || 0;
    const g = parseFloat(editGasolina) || 0;
    const a = parseFloat(editAlimentacao) || 0;
    const m = parseFloat(editManutencao) || 0;
    const o = parseFloat(editOutros) || 0;
    const res = await fetch("/api/day", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: idEditando, grossIncome: r, fuel: g, food: a, maintenance: m, other: o,
        hoursWorked: parseFloat(editHoras) || null,
        appUsed: editAppUsado || null,
      }),
    });
    setLoadingEdit(false);
    if (!res.ok) { alert("Erro ao editar. Tente novamente."); return; }
    setModalEditAberto(false);
    setDiaEditando(null);
    mostrarSucesso("Registro atualizado com sucesso!");
    carregarHistorico(mesSelecionado, anoSelecionado);
    const resHoje = await fetch("/api/day/today");
    if (resHoje.ok) {
      const dataHoje = await resHoje.json();
      if (dataHoje) {
        setReceitaHoje(dataHoje.grossIncome);
        setGastosHoje(dataHoje.fuel + dataHoje.food + dataHoje.maintenance + dataHoje.other);
        setLucroHoje(dataHoje.netIncome);
      }
    }
  }

  function formatarMoeda(valor: number) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function abrirEdicao(dia: any) {
    setDiaEditando(dia);
    setEditReceita(String(dia.grossIncome));
    setEditGasolina(String(dia.fuel));
    setEditAlimentacao(String(dia.food));
    setEditManutencao(String(dia.maintenance));
    setEditOutros(String(dia.other));
    setEditHoras(dia.hoursWorked ? String(dia.hoursWorked) : "");
    setEditAppUsado(dia.appUsed || "");
    setModalEditAberto(true);
  }

  async function handleDeletar(id: string) {
    if (!confirm("Tem certeza que deseja deletar este registro?")) return;
    const res = await fetch("/api/day", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) { alert("Erro ao deletar. Tente novamente."); return; }
    carregarHistorico(mesSelecionado, anoSelecionado);
    const resHoje = await fetch("/api/day/today");
    if (resHoje.ok) {
      const dataHoje = await resHoje.json();
      if (dataHoje) {
        setReceitaHoje(dataHoje.grossIncome);
        setGastosHoje(dataHoje.fuel + dataHoje.food + dataHoje.maintenance + dataHoje.other);
        setLucroHoje(dataHoje.netIncome);
      } else {
        setReceitaHoje(0); setGastosHoje(0); setLucroHoje(0);
      }
    }
    mostrarSucesso("Registro deletado com sucesso!");
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0a0a0a'}}>

      {mensagemSucesso && (
        <div className="fixed top-4 left-1/2 z-50 px-6 py-3 rounded-xl text-white text-sm font-medium shadow-lg"
          style={{backgroundColor: '#3d5a3e', transform: 'translateX(-50%)'}}>
          {mensagemSucesso}
        </div>
      )}

      <div className="flex items-center justify-between px-6 py-4" style={{borderBottom: '1px solid #1a1a1a'}}>
        <h1 className="text-lg font-bold" style={{color: '#3d5a3e'}}>LucrApp</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm" style={{color: '#a1a1aa'}}>Olá, {session?.user?.name?.split(" ")[0] || "Motorista"}</span>
          <button onClick={() => router.push("/perfil")}
            className="text-xs px-3 py-1 rounded-lg transition"
            style={{backgroundColor: '#1a1a1a', color: '#a1a1aa'}}>
            Perfil
          </button>
          <button onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs px-3 py-1 rounded-lg transition"
            style={{backgroundColor: '#1a1a1a', color: '#a1a1aa'}}>
            Sair
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl p-4" style={{backgroundColor: '#111111'}}>
          <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Receita hoje</p>
          <p className="text-2xl font-bold text-white">{formatarMoeda(receitaHoje)}</p>
        </div>
        <div className="rounded-xl p-4" style={{backgroundColor: '#111111'}}>
          <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Gastos hoje</p>
          <p className="text-2xl font-bold text-white">{formatarMoeda(gastosHoje)}</p>
        </div>
        <div className="rounded-xl p-4" style={{backgroundColor: '#111111'}}>
          <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Lucro real</p>
          <p className="text-2xl font-bold" style={{color: '#3d5a3e'}}>{formatarMoeda(lucroHoje)}</p>
        </div>
      </div>

      <div className="px-6 mb-4">
        <p className="text-xs mb-2" style={{color: '#a1a1aa'}}>Esta semana</p>
        {plano === "pago" ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl p-3" style={{backgroundColor: '#111111'}}>
              <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Receita</p>
              <p className="text-lg font-bold text-white">{formatarMoeda(receitaSemana)}</p>
            </div>
            <div className="rounded-xl p-3" style={{backgroundColor: '#111111'}}>
              <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Gastos</p>
              <p className="text-lg font-bold text-white">{formatarMoeda(gastosSemana)}</p>
            </div>
            <div className="rounded-xl p-3" style={{backgroundColor: '#111111'}}>
              <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Lucro</p>
              <p className="text-lg font-bold" style={{color: '#3d5a3e'}}>{formatarMoeda(lucroSemana)}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-4 flex items-center justify-between" style={{backgroundColor: '#111111', border: '1px solid #2a2a2a'}}>
            <p className="text-sm" style={{color: '#a1a1aa'}}>Disponível no plano Plus</p>
            <span className="text-xs px-3 py-1 rounded-lg font-medium" style={{backgroundColor: '#3d5a3e', color: '#ffffff'}}>Upgrade</span>
          </div>
        )}
      </div>

      <div className="px-6 mb-4">
        <p className="text-xs mb-2" style={{color: '#a1a1aa'}}>
          Este mês — {diasMes} {diasMes === 1 ? "dia trabalhado" : "dias trabalhados"}
        </p>
        {plano === "pago" ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl p-3" style={{backgroundColor: '#111111'}}>
              <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Receita</p>
              <p className="text-lg font-bold text-white">{formatarMoeda(receitaMes)}</p>
            </div>
            <div className="rounded-xl p-3" style={{backgroundColor: '#111111'}}>
              <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Gastos</p>
              <p className="text-lg font-bold text-white">{formatarMoeda(gastosMes)}</p>
            </div>
            <div className="rounded-xl p-3" style={{backgroundColor: '#111111'}}>
              <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Lucro</p>
              <p className="text-lg font-bold" style={{color: '#3d5a3e'}}>{formatarMoeda(lucroMes)}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl p-4 flex items-center justify-between" style={{backgroundColor: '#111111', border: '1px solid #2a2a2a'}}>
            <p className="text-sm" style={{color: '#a1a1aa'}}>Disponível no plano Plus</p>
            <span className="text-xs px-3 py-1 rounded-lg font-medium" style={{backgroundColor: '#3d5a3e', color: '#ffffff'}}>Upgrade</span>
          </div>
        )}
      </div>

      {/* FILTRO DE MÊS */}
      <div className="px-6 mb-4 flex items-center gap-3">
        <select
          value={mesSelecionado}
          onChange={(e) => setMesSelecionado(parseInt(e.target.value))}
          className="rounded-lg px-3 py-2 text-sm outline-none text-white"
          style={{backgroundColor: '#111111', border: '1px solid #2a2a2a'}}>
          {meses.map((m, i) => (
            <option key={i + 1} value={i + 1}>{m}</option>
          ))}
        </select>
        <select
          value={anoSelecionado}
          onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}
          className="rounded-lg px-3 py-2 text-sm outline-none text-white"
          style={{backgroundColor: '#111111', border: '1px solid #2a2a2a'}}>
          {[2024, 2025, 2026, 2027].map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {historico.length > 0 && (
        <div className="px-6 mb-6">
          <p className="text-xs mb-3" style={{color: '#a1a1aa'}}>Evolução do período</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...historico].reverse().map((dia) => ({
              nome: new Date(dia.date).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit" }),
              Receita: dia.grossIncome,
              Gasolina: dia.fuel,
              Alimentação: dia.food,
              Outros: dia.maintenance + dia.other,
            }))}>
              <XAxis dataKey="nome" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
              <YAxis tick={{ fill: '#a1a1aa', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8 }}
                labelStyle={{ color: '#ffffff' }}
                itemStyle={{ color: '#a1a1aa' }}
              />
              <Legend wrapperStyle={{ color: '#a1a1aa', fontSize: 12 }} />
              <Bar dataKey="Receita" fill="#3d5a3e" radius={[4,4,0,0]} />
              <Bar dataKey="Gasolina" fill="#1a3a4a" radius={[4,4,0,0]} />
              <Bar dataKey="Alimentação" fill="#4a3a1a" radius={[4,4,0,0]} />
              <Bar dataKey="Outros" fill="#3a1a1a" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="px-6">
        <button onClick={() => setModalAberto(true)}
          className="w-full rounded-xl py-4 text-white font-semibold transition"
          style={{backgroundColor: '#3d5a3e'}}>
          + Registrar meu dia
        </button>
      </div>

      {historico.length > 0 && (
        <div className="px-6 mt-6">
          <h2 className="text-sm font-semibold mb-3" style={{color: '#a1a1aa'}}>
            Histórico — {meses[mesSelecionado - 1]} {anoSelecionado}
          </h2>
          <div className="flex flex-col gap-3">
            {historico.map((dia) => (
              <div key={dia.id} className="rounded-xl p-4 flex justify-between items-center"
                style={{backgroundColor: '#111111'}}>
                <div>
                  <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>
                    {new Date(dia.date).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" })}
                  </p>
                  <p className="text-sm text-white font-medium">
                    Receita: {dia.grossIncome.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}
                  </p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <div>
                    <p className="text-xs mb-1" style={{color: '#a1a1aa'}}>Lucro real</p>
                    <p className="text-sm font-bold" style={{color: dia.netIncome >= 0 ? '#3d5a3e' : '#ef4444'}}>
                      {dia.netIncome.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})}
                    </p>
                  </div>
                  <button onClick={() => abrirEdicao(dia)}
                    className="text-xs px-3 py-1 rounded-lg transition"
                    style={{backgroundColor: '#1a3a4a', color: '#a1a1aa'}}>
                    Editar
                  </button>
                  <button onClick={() => handleDeletar(dia.id)}
                    className="text-xs px-3 py-1 rounded-lg transition"
                    style={{backgroundColor: '#3a1a1a', color: '#ef4444'}}>
                    Deletar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 flex items-center justify-center px-4 z-50"
          style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{backgroundColor: '#111111'}}>
            <h2 className="text-white font-bold text-lg mb-6">Registrar dia</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: "Receita bruta", value: receita, set: setReceita },
                { label: "Gasolina", value: gasolina, set: setGasolina },
                { label: "Alimentação", value: alimentacao, set: setAlimentacao },
                { label: "Manutenção", value: manutencao, set: setManutencao },
                { label: "Outros", value: outros, set: setOutros },
                { label: "Horas trabalhadas", value: horas, set: setHoras },
              ].map((campo) => (
                <div key={campo.label}>
                  <label className="text-xs mb-1 block" style={{color: '#a1a1aa'}}>{campo.label}</label>
                  <input type="number" placeholder="0,00" value={campo.value}
                    onChange={(e) => campo.set(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 outline-none text-white text-sm"
                    style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs mb-1 block" style={{color: '#a1a1aa'}}>App usado</label>
                <select value={appUsado} onChange={(e) => setAppUsado(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 outline-none text-white text-sm"
                  style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}>
                  <option value="">Selecione</option>
                  <option value="Uber">Uber</option>
                  <option value="99">99</option>
                  <option value="InDriver">InDriver</option>
                  <option value="Todos">Todos</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalAberto(false)}
                className="flex-1 rounded-xl py-3 text-sm font-medium"
                style={{backgroundColor: '#1a1a1a', color: '#a1a1aa'}}>
                Cancelar
              </button>
              <button onClick={handleSalvar} disabled={loading}
                className="flex-1 rounded-xl py-3 text-white text-sm font-semibold"
                style={{backgroundColor: '#3d5a3e', opacity: loading ? 0.7 : 1}}>
                {loading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalEditAberto && diaEditando && (
        <div className="fixed inset-0 flex items-center justify-center px-4 z-50"
          style={{backgroundColor: 'rgba(0,0,0,0.8)'}}>
          <div className="w-full max-w-md rounded-2xl p-6" style={{backgroundColor: '#111111'}}>
            <h2 className="text-white font-bold text-lg mb-6">Editar dia</h2>
            <div className="flex flex-col gap-3">
              {[
                { label: "Receita bruta", value: editReceita, set: setEditReceita },
                { label: "Gasolina", value: editGasolina, set: setEditGasolina },
                { label: "Alimentação", value: editAlimentacao, set: setEditAlimentacao },
                { label: "Manutenção", value: editManutencao, set: setEditManutencao },
                { label: "Outros", value: editOutros, set: setEditOutros },
                { label: "Horas trabalhadas", value: editHoras, set: setEditHoras },
              ].map((campo) => (
                <div key={campo.label}>
                  <label className="text-xs mb-1 block" style={{color: '#a1a1aa'}}>{campo.label}</label>
                  <input type="number" placeholder="0,00" value={campo.value}
                    onChange={(e) => campo.set(e.target.value)}
                    className="w-full rounded-lg px-4 py-3 outline-none text-white text-sm"
                    style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}
                  />
                </div>
              ))}
              <div>
                <label className="text-xs mb-1 block" style={{color: '#a1a1aa'}}>App usado</label>
                <select value={editAppUsado} onChange={(e) => setEditAppUsado(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 outline-none text-white text-sm"
                  style={{backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a'}}>
                  <option value="">Selecione</option>
                  <option value="Uber">Uber</option>
                  <option value="99">99</option>
                  <option value="InDriver">InDriver</option>
                  <option value="Todos">Todos</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalEditAberto(false)}
                className="flex-1 rounded-xl py-3 text-sm font-medium"
                style={{backgroundColor: '#1a1a1a', color: '#a1a1aa'}}>
                Cancelar
              </button>
              <button onClick={handleEditar} disabled={loadingEdit}
                className="flex-1 rounded-xl py-3 text-white text-sm font-semibold"
                style={{backgroundColor: '#3d5a3e', opacity: loadingEdit ? 0.7 : 1}}>
                {loadingEdit ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}