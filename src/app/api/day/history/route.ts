import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const mes = searchParams.get("mes");
    const ano = searchParams.get("ano");

    let where: any = { userId: user.id };

    if (mes && ano) {
      const inicio = new Date(parseInt(ano), parseInt(mes) - 1, 1);
      const fim = new Date(parseInt(ano), parseInt(mes), 0, 23, 59, 59, 999);
      where.date = { gte: inicio, lte: fim };
    }

    const registros = await prisma.day.findMany({
      where,
      orderBy: { date: "desc" },
      take: mes && ano ? undefined : 30,
    });

    return NextResponse.json(registros);
  } catch (error) {
    console.error("ERRO AO BUSCAR HISTÓRICO:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}