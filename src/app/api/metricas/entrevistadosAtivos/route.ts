import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// A função GET agora recebe um parâmetro de pesquisa (id_pesquisa)
export async function GET(request: Request) {
  const url = new URL(request.url);
  const idPesquisa = url.searchParams.get("id_pesquisa"); // Obtém o id_pesquisa da query string

  if (!idPesquisa) {
    return NextResponse.json({ error: "ID da pesquisa não fornecido" }, { status: 400 });
  }

  try {
    const totalQuestionariosAtivos = await prisma.questionario.count({
      where: {
        status: "em_andamento",
        id_pesquisa: idPesquisa, // Filtra pela pesquisa selecionada
      },
    });

    return NextResponse.json({ totalQuestionariosAtivos });
  } catch (error) {
    console.error("Erro ao obter questionários ativos:", error);
    return NextResponse.json({ error: "Erro ao obter questionários ativos" }, { status: 500 });
  }
}
