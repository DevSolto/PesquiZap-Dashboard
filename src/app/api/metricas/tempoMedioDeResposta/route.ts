import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const idPesquisa = url.searchParams.get("id_pesquisa"); // Obtém o id_pesquisa da query string

  if (!idPesquisa) {
    return NextResponse.json({ error: "ID da pesquisa não fornecido" }, { status: 400 });
  }

  try {
    // Obter todos os questionários da pesquisa selecionada e que foram finalizados
    const questionarios = await prisma.questionario.findMany({
      where: {
        data_hora_fim: {
          not: null, // Certificando-se de que data_hora_fim não é nulo
        },
        id_pesquisa: idPesquisa, // Filtra pela pesquisa selecionada
      },
      select: {
        data_hora_inicio: true,
        data_hora_fim: true,
      },
    });

    // Somar os tempos de resposta
    const totalTempo = questionarios.reduce((total: number, questionario: { data_hora_inicio: Date | null; data_hora_fim: Date | null }) => {  // Tipo explícito para 'questionario'
      // Garantir que as datas sejam válidas antes de fazer os cálculos
      if (questionario.data_hora_inicio && questionario.data_hora_fim) {
        const inicio = new Date(questionario.data_hora_inicio).getTime();  // Convertendo para milissegundos
        const fim = new Date(questionario.data_hora_fim).getTime();        // Convertendo para milissegundos

        // Verificar se as datas são válidas
        if (!isNaN(inicio) && !isNaN(fim) && fim > inicio) {
          const tempoResposta = (fim - inicio) / (1000 * 60); // tempo em minutos (1000 milissegundos = 1 segundo, 60 segundos = 1 minuto)
          return total + tempoResposta;  // Soma o tempo ao total
        }
      }
      return total; // Caso a data não seja válida, retorna o total atual sem alterações
    }, 0);

    // Calcular a média em minutos
    const tempoMedio = questionarios.length > 0 ? totalTempo / questionarios.length : 0;

    // Retornar a resposta com a média de tempo
    return NextResponse.json({ tempoMedio: tempoMedio });
  } catch (error) {
    console.error("Erro ao calcular o tempo médio de resposta:", error);
    return NextResponse.json({ error: "Erro ao calcular o tempo médio de resposta" }, { status: 500 });
  }
}
