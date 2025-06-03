"use client"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { usePesquisa } from "@/app/context/PesquisaContext";

/**
 * Utilitário seguro para formatar números.
 * Retorna "—" caso o valor seja nulo/indefinido/NaN.
 */
function formatNumber(val: number | null, decimals = 2, suffix = "") {
  return val != null && !Number.isNaN(val)
    ? `${val.toFixed(decimals)}${suffix}`
    : "—";
}

export function SectionCards() {
  const { selectedPesquisa } = usePesquisa();

  const [taxaDeConclusao, setTaxaDeConclusao] = useState<number | null>(null);
  const [taxaDeNegacao, setTaxaDeNegacao] = useState<number | null>(null);
  const [totalQuestionariosAtivos, setTotalQuestionariosAtivos] =
    useState<number | null>(null);
  const [tempoMedioResposta, setTempoMedioResposta] =
    useState<number | null>(null);

  // ------- Fetch helpers (todos já tratam erros e parsers) ---------
  async function fetchAndSet<T extends keyof typeof setters>(
    endpoint: string,
    setterKey: T,
    parser: (data: any) => number | null = (d) => d
  ) {
    try {
      const res = await fetch(
        `${endpoint}?id_pesquisa=${encodeURIComponent(selectedPesquisa ?? "")}`
      );
      const data = await res.json();
      // parser garante número ou null
      setters[setterKey](parser(data));
    } catch (err) {
      console.error(`Erro ao buscar ${setterKey}:`, err);
      setters[setterKey](null);
    }
  }

  const setters = {
    taxaDeConclusao: setTaxaDeConclusao,
    taxaDeNegacao: setTaxaDeNegacao,
    totalQuestionariosAtivos: setTotalQuestionariosAtivos,
    tempoMedioResposta: setTempoMedioResposta,
  } as const;

  // ------------------- Effects -------------------
  useEffect(() => {
    if (!selectedPesquisa) return;

    fetchAndSet("/api/metricas/taxaDeConclusao", "taxaDeConclusao", (d) =>
      typeof d.taxaDeConclusao === "number" ? d.taxaDeConclusao : null
    );

    fetchAndSet(
      "/api/metricas/entrevistadosAtivos",
      "totalQuestionariosAtivos",
      (d) => (typeof d.totalQuestionariosAtivos === "number" ? d.totalQuestionariosAtivos : null)
    );

    fetchAndSet("/api/metricas/tempoMedioDeResposta", "tempoMedioResposta", (d) =>
      typeof d.tempoMedio === "number" ? d.tempoMedio : null
    );

    fetchAndSet("/api/metricas/taxaNegacao", "taxaDeNegacao", (d) =>
      typeof d.taxaDeNegacao === "number" ? d.taxaDeNegacao : null
    );
  }, [selectedPesquisa]);

  // ------------------- JSX -------------------
  return (
    <div className="w-full grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4">
      {/* Card 1: Taxa de conclusão */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Taxa de Conclusão</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatNumber(taxaDeConclusao, 2, "%") || "Carregando..."}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">
            Taxa de conclusão dos questionários nesta pesquisa
          </div>
        </CardFooter>
      </Card>

      {/* Card 2: Entrevistados ativos */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Entrevistados Ativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {totalQuestionariosAtivos != null
              ? totalQuestionariosAtivos.toLocaleString()
              : "Carregando..."}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">
            Número de entrevistados ativos
          </div>
        </CardFooter>
      </Card>

      {/* Card 3: Tempo Médio de Resposta */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tempo Médio de Resposta</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {tempoMedioResposta != null
              ? `${tempoMedioResposta.toFixed(2)} min`
              : "Carregando..."}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">
            Tempo médio para completar o questionário
          </div>
        </CardFooter>
      </Card>

      {/* Card 4: Taxa de Negação */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Taxa de Negação</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {formatNumber(taxaDeNegacao, 2, "%") || "Carregando..."}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">
            Taxa de negação dos questionários nesta pesquisa
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
