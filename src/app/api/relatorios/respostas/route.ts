import { prisma } from "@/lib/prisma";

const DELIMITER = ";";

function escapeCsv(value: string | number | null | undefined) {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/["\r\n]/.test(str) || str.includes(DELIMITER)) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idPesquisa = searchParams.get("id_pesquisa");

  if (!idPesquisa) {
    return new Response(
      JSON.stringify({ error: "ID da pesquisa não fornecido" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const perguntas = await prisma.pergunta.findMany({
      where: { id_pesquisa: idPesquisa },
      orderBy: { ordem: "asc" },
      select: {
        id_pergunta: true,
        texto_pergunta: true,
      },
    });

    const questionarios = await prisma.questionario.findMany({
      where: { id_pesquisa: idPesquisa },
      orderBy: {
        contato: {
          telefone: "asc",
        },
      },
      select: {
        contato: {
          select: { telefone: true },
        },
        resposta: {
          select: {
            id_pergunta: true,
            conteudo_resposta: true,
          },
        },
      },
    });

    const header = ["contato", ...perguntas.map((p) => p.texto_pergunta)];
    const rows = questionarios.map((q) => {
      const resps = new Map(
        q.resposta.map((r) => [r.id_pergunta, r.conteudo_resposta]),
      );
      return [
        q.contato?.telefone ?? "",
        ...perguntas.map((p) => resps.get(p.id_pergunta) ?? ""),
      ];
    });

    const csv = [
      "\uFEFF" + header.map(escapeCsv).join(DELIMITER),
      ...rows.map((r) => r.map(escapeCsv).join(DELIMITER)),
    ].join("\r\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": "attachment; filename=relatorio_respostas.csv",
      },
    });
  } catch (error) {
    console.error("Erro ao gerar CSV de respostas:", error);
    return new Response(JSON.stringify({ error: "Erro ao gerar relatório" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
