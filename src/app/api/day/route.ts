import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { grossIncome, fuel, food, maintenance, other, hoursWorked, appUsed, notes } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const inicioDia = new Date();
    inicioDia.setHours(0, 0, 0, 0);

    const fimDia = new Date();
    fimDia.setHours(23, 59, 59, 999);

    const registroExistente = await prisma.day.findFirst({
      where: {
        userId: user.id,
        date: { gte: inicioDia, lte: fimDia },
      },
    });

    if (registroExistente) {
      return NextResponse.json(
        { error: "Você já registrou o dia de hoje." },
        { status: 409 }
      );
    }

    const netIncome = grossIncome - (fuel + food + maintenance + other);

    const day = await prisma.day.create({
      data: {
        date: new Date(),
        grossIncome,
        fuel,
        food,
        maintenance,
        other,
        netIncome,
        hoursWorked: hoursWorked || null,
        appUsed: appUsed || null,
        notes: notes || null,
        userId: user.id,
      },
    });

    return NextResponse.json(day, { status: 201 });
  } catch (error) {
    console.error("ERRO AO SALVAR DIA:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const { id, grossIncome, fuel, food, maintenance, other, hoursWorked, appUsed } = await request.json();

    const registro = await prisma.day.findUnique({
      where: { id },
    });

    if (!registro || registro.userId !== user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const netIncome = grossIncome - (fuel + food + maintenance + other);

    const day = await prisma.day.update({
      where: { id },
      data: { grossIncome, fuel, food, maintenance, other, netIncome, hoursWorked: hoursWorked || null, appUsed: appUsed || null },
    });

    return NextResponse.json(day);
  } catch (error) {
    console.error("ERRO AO EDITAR DIA:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const { id } = await request.json();

    const registro = await prisma.day.findUnique({
      where: { id },
    });

    if (!registro || registro.userId !== user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    await prisma.day.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO AO DELETAR DIA:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}