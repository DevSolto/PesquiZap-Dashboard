'use client';
import { useState, useEffect } from 'react';
import { ResumoFontes } from "@/components/local/graficos/resumoFontes";
import { ResumoQuestionarios } from "@/components/local/graficos/resumoQuestionarios";
import { SectionCards } from "@/components/local/section-cards";
import { usePesquisa } from "../context/PesquisaContext";
import { ResumoAvaliacaoFinal } from "@/components/local/graficos/resumoAvaliacaoFinal";
import WordCloud, { Word } from "@/components/local/graficos/WordCloud";  // Importando o componente de nuvem de palavras

export default function Dashboard() {
  const { selectedPesquisa } = usePesquisa();

  // Estado para armazenar palavras e gerenciamento de carregamento
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!selectedPesquisa) return;

    setLoading(true);
    fetch(`/api/questionarios/nuvem?id_pesquisa=${selectedPesquisa}`, { cache: 'no-store' })
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const data = (await r.json()) as Word[];
        setWords(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [selectedPesquisa]);

  if (!selectedPesquisa) {
    return (
      <div className="flex flex-1 items-center justify-center">
        Selecione uma pesquisa para visualizar o dashboard.
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards />
          <div className="w-full grid grid-cols-1 gap-4 px-4 sm:grid-cols-3">
            <ResumoQuestionarios />
            <ResumoFontes />
            <ResumoAvaliacaoFinal />
          </div>

          {/* Nuvem de palavras com feedback de carregamento ou erro */}
          <div className="w-full  px-4">
            {loading && <p>Carregando nuvem de palavras...</p>}
            {error && <p>Erro ao carregar dados da nuvem de palavras.</p>}
            {!loading && !error && words.length === 0 && (
              <p>Nenhuma palavra relevante encontrada.</p>
            )}
            {!loading && !error && words.length > 0 && (
              <div className="h-screen">
                <WordCloud words={words} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
