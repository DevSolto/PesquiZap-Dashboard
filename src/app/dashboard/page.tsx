'use client';   
import { ResumoFontes } from "@/components/local/graficos/resumoFontes";
import { ResumoQuestionarios } from "@/components/local/graficos/resumoQuestionarios";
import { SectionCards } from "@/components/local/section-cards";
import { usePesquisa } from "../context/PesquisaContext";

export default function Dashboard() {
  const { selectedPesquisa } = usePesquisa();
  if (!selectedPesquisa) {
    return <div className="flex flex-1 items-center justify-center">Selecione uma pesquisa para visualizar o dashboard.</div>;
  }
  return (
    <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="w-full grid grid-cols-1 gap-4 px-4 sm:grid-cols-2">
              <ResumoQuestionarios />
              <ResumoFontes/>
              </div>
            </div>
          </div>
        </div>
  );
}
