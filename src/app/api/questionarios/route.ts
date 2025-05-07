import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idPesquisa = url.searchParams.get("id_pesquisa");
  const status = url.searchParams.get("status");

  if (!idPesquisa) {
    return NextResponse.json({ error: "ID da pesquisa não fornecido" }, { status: 400 });
  }
  if (!status) {
    return NextResponse.json({ error: "Status não fornecido" }, { status: 400 });
  }
  const questionarios = await prisma.questionario.findMany({
    where: {
      id_pesquisa: idPesquisa,
      status: status,
    },
  });
  
  return NextResponse.json(questionarios); // Retorna as pesquisas como resposta JSON
}
