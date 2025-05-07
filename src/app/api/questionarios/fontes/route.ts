import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idPesquisa = url.searchParams.get("id_pesquisa");

  if (!idPesquisa) {
    return NextResponse.json({ error: "ID da pesquisa não fornecido" }, { status: 400 });
  }
  const countQuestionariosTrafegoPago = await prisma.questionario.count({
    where: {
      id_pesquisa: idPesquisa,
      fonte: "trafego_pago",
    },
  });
  const countQuestionariosListaEnvios = await prisma.questionario.count({
    where: {
      id_pesquisa: idPesquisa,
      fonte: "lista_de_envios",
    },
  });
  
  return NextResponse.json({countQuestionariosListaEnvios, countQuestionariosTrafegoPago});
}
