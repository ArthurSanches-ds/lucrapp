import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    const hoje = new Date();
    const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    const registros = await prisma.day.findMany({
      where: {
        userId: user.id,
        date: {
          gte: inicioMes,
          lte: fimMes,
        },
      },
      orderBy: { date: "desc" },
    });

    const totalReceita = registros.reduce((acc, d) => acc + d.grossIncome, 0);
    const totalGastos = registros.reduce((acc, d) => acc + d.fuel + d.food + d.maintenance + d.other, 0);
    const totalLucro = registros.reduce((acc, d) => acc + d.netIncome, 0);
    const totalDias = registros.length;

    return NextResponse.json({
      totalReceita,
      totalGastos,
      totalLucro,
      totalDias,
      registros,
    });
  } catch (error) {
    console.error("ERRO AO BUSCAR MÊS:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}