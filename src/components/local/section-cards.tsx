'use client'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { usePesquisa } from "@/app/context/PesquisaContext";

export function SectionCards() {
  const { selectedPesquisa } = usePesquisa(); // Obtendo o id_pesquisa do contexto
  const [taxaDeConclusao, setTaxaDeConclusao] = useState<number | null>(null);
  const [taxaDeNegacao, setTaxaDeNegacao] = useState<number | null>(null);
  const [totalQuestionariosAtivos, setTotalQuestionariosAtivos] = useState<number | null>(null);
  const [tempoMedioResposta, setTempoMedioResposta] = useState<number | null>(null);

  // Função para buscar o tempo médio de resposta
  const fetchTempoMedioResposta = async () => {
    try {
      const response = await fetch(`/api/metricas/tempoMedioDeResposta?id_pesquisa=${selectedPesquisa}`); // Incluindo id_pesquisa na URL
      const data = await response.json();
      setTempoMedioResposta(data.tempoMedio);
    } catch (error) {
      console.error("Erro ao buscar o tempo médio de resposta:", error);
    }
  };

  // Função para buscar a taxa de conclusão
  const fetchTaxaDeConclusao = async () => {
    try {
      const response = await fetch(`/api/metricas/taxaDeConclusao?id_pesquisa=${selectedPesquisa}`); // Incluindo id_pesquisa na URL
      const data = await response.json();
      setTaxaDeConclusao(data.taxaDeConclusao);
    } catch (error) {
      console.error("Erro ao buscar a taxa de conclusão:", error);
    }
  };

  // Função para buscar a taxa de negação
  const fetchTaxaDeNegacao = async () => {
    try {
      const response = await fetch(`/api/metricas/taxaNegacao?id_pesquisa=${selectedPesquisa}`); // Incluindo id_pesquisa na URL
      const data = await response.json();
      setTaxaDeNegacao(data.taxaDeNegacao);
    } catch (error) {
      console.error("Erro ao buscar a taxa de negação:", error);
    }
  };

  // Função para buscar total de questionários ativos
  const fetchTotalQuestionariosAtivos = async () => {
    try {
      const response = await fetch(`/api/metricas/entrevistadosAtivos?id_pesquisa=${selectedPesquisa}`); // Incluindo id_pesquisa na URL
      const data = await response.json();
      setTotalQuestionariosAtivos(data.totalQuestionariosAtivos);
    } catch (error) {
      console.error("Erro ao buscar o total de questionários ativos:", error);
    }
  };

  // UseEffect para executar as funções de API ao carregar a página
  useEffect(() => {
    if (selectedPesquisa) {
      fetchTaxaDeConclusao();
      fetchTotalQuestionariosAtivos();
      fetchTempoMedioResposta();
      fetchTaxaDeNegacao();
    }
  }, [selectedPesquisa]); // Reexecuta quando o selectedPesquisa mudar

  return (
    <div className="w-full grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4">
      {/* Card 1: Taxa de conclusão */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Taxa de Conclusão</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {taxaDeConclusao !== null ? `${taxaDeConclusao.toFixed(2)}%` : "Carregando..."}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">Taxa de conclusão dos questionários nesta pesquisa</div>
        </CardFooter>
      </Card>

      {/* Card 2: Entrevistados ativos */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Entrevistados Ativos</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {totalQuestionariosAtivos !== null ? `${totalQuestionariosAtivos}` : "Carregando..."}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">Número de entrevistados ativos</div>
        </CardFooter>
      </Card>

      {/* Card 3: Tempo Médio de Resposta */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Tempo Médio de Resposta</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {tempoMedioResposta !== null ? `${tempoMedioResposta.toFixed(2)} minutos` : "Carregando..."}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">Tempo médio para completar o questionário</div>
        </CardFooter>
      </Card>

      {/* Card 4: Taxa de Negação */}
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Taxa de Negação</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {taxaDeNegacao !== null ? `${taxaDeNegacao}%` : "Carregando..."}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="text-muted-foreground">Taxa de negação dos questionários nesta pesquisa</div>
        </CardFooter>
      </Card>
    </div>
  );
}
