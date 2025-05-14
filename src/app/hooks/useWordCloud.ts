import useSWR from 'swr';

export interface Word { text: string; value: number }

export function useWordCloud(idPesquisa: string) {
  const { data, error, isLoading } = useSWR<Word[]>(
    idPesquisa ? `/api/questionarios/nuvem?id_pesquisa=${idPesquisa}` : null,
    (url: string) => fetch(url).then(r => r.json()),
    { revalidateOnFocus: false },
  );

  return { words: data ?? [], isLoading, error };
}
