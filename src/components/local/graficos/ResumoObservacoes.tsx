'use client';
import { useWordCloud } from '@/app/hooks/useWordCloud';
import { useParams } from 'next/navigation';
import WordCloud from './WordCloud';

export default function ObservacoesCloud() {
  const { id } = useParams<{ id: string }>(); // /dashboard/[id]
  const { words, isLoading, error } = useWordCloud(id);

  if (isLoading) return <p>Carregando nuvem…</p>;
  if (error)     return <p>Erro ao carregar dados.</p>;
  if (!words.length) return <p>Nenhuma palavra relevante encontrada.</p>;

  return (
    <div className="h-96">
      <WordCloud words={words} /> {/* escala automática: value ⇢ fontSize */}
    </div>
  );
}
