import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idPesquisa = url.searchParams.get("id_pesquisa");

  if (!idPesquisa) {
    return NextResponse.json({ error: "ID da pesquisa não fornecido" }, { status: 400 });
  }
  const countQuestionariosPositivos = await prisma.questionario.count({
    where: {
      id_pesquisa: idPesquisa,
      status: "concluido",
      avaliacao_final: 'positivo',
    },
  });
  const countQuestionariosNegativos = await prisma.questionario.count({
    where: {
      id_pesquisa: idPesquisa,
      status: "concluido",
      avaliacao_final: 'negativo',
    },
  });
  const countQuestionariosNeutros = await prisma.questionario.count({
    where: {
      id_pesquisa: idPesquisa,
      status: "concluido",
      avaliacao_final: 'neutro',
    },
  });
  return NextResponse.json({countQuestionariosNegativos, countQuestionariosNeutros, countQuestionariosPositivos}); // Retorna as pesquisas como resposta JSON
}
