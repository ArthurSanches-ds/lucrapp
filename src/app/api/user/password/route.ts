import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { senhaAtual, novaSenha } = await request.json();

    if (!senhaAtual || !novaSenha) {
      return NextResponse.json({ error: "Preencha todos os campos" }, { status: 400 });
    }

    if (novaSenha.length < 6) {
      return NextResponse.json({ error: "A nova senha deve ter pelo menos 6 caracteres" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const senhaCorreta = await bcrypt.compare(senhaAtual, user.password);

    if (!senhaCorreta) {
      return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: novaSenhaHash },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("ERRO AO ALTERAR SENHA:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}