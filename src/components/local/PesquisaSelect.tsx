// app/components/PesquisaSelect.tsx
'use client'

import React, { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePesquisa } from "@/app/context/PesquisaContext";

type PesquisaSelectProps = {
  placeholder?: string;
};

const PesquisaSelect: React.FC<PesquisaSelectProps> = ({ placeholder = "Selecione a Pesquisa" }) => {
  const [pesquisas, setPesquisas] = useState<{ id_pesquisa: string; titulo: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedPesquisa } = usePesquisa(); // Usando o hook para acessar e atualizar o contexto

  // Função para buscar as pesquisas da API
  const fetchPesquisas = async () => {
    try {
      const response = await fetch("/api/pesquisas"); // Substitua pela URL correta da sua API
      if (!response.ok) {
        throw new Error("Erro ao carregar pesquisas");
      }
      const data = await response.json();
      setPesquisas(data);
    } catch (err) {
      setError("Não foi possível carregar as pesquisas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPesquisas(); // Executa a busca quando o componente é montado
  }, []);

  // Exibindo carregamento ou erro
  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Select onValueChange={setSelectedPesquisa}>
      <SelectTrigger className="w-full" aria-label="Pesquisa">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {pesquisas.map((item) => (
          <SelectItem key={item.id_pesquisa} value={item.id_pesquisa}>
            {item.titulo}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default PesquisaSelect;
