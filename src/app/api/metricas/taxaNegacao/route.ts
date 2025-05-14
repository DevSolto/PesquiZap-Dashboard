import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idPesquisa = url.searchParams.get("id_pesquisa"); // Obtém o id_pesquisa da query string

  if (!idPesquisa) {
    return NextResponse.json({ error: "ID da pesquisa não fornecido" }, { status: 400 });
  }

  try {
    // Conta o total de questionários para a pesquisa selecionada
    const totalQuestionarios = await prisma.questionario.count({
      where: {
        id_pesquisa: idPesquisa, // Filtra pela pesquisa selecionada
      },
    });
    // Conta o total de questionários com status 'negado' para a pesquisa selecionada
    const questionariosNegados = await prisma.questionario.count({
      where: {
        status: "negado",
        id_pesquisa: idPesquisa, // Filtra pela pesquisa selecionada
      },
    });
    // Calcula a taxa de negação
    const taxaDeNegacao = totalQuestionarios > 0 ? (questionariosNegados / totalQuestionarios) * 100 : 0;

    // Retorna a taxa de negação
    return NextResponse.json({ taxaDeNegacao });
  } catch (error) {
    console.error("Erro ao calcular a taxa de negação:", error);
    return NextResponse.json({ error: "Erro ao calcular a taxa de negação" }, { status: 500 });
  }
}
