import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import stopwords from 'stopwords-pt';
import { remove as removeAccents } from 'diacritics';
import { palavrasIrrelevantes } from './lista_de_palavras';

// Lista de palavras que não devem ser consideradas
const palavrasExcluidas = palavrasIrrelevantes  
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idPesquisa = searchParams.get('id_pesquisa');

  if (!idPesquisa) {
    return NextResponse.json({ error: 'ID da pesquisa não fornecido' }, { status: 400 });
  }

  try {
    // 1. Buscar os questionários associados à pesquisa
    const questionarios = await prisma.questionario.findMany({
      where: { id_pesquisa: idPesquisa },  // Filtrando questionários pela pesquisa
      select: { id_questionario: true },   // Seleciona apenas os id_questionario
    });

    // 2. Buscar as respostas associadas a cada questionário
    const respostas = await prisma.resposta.findMany({
      where: {
        id_questionario: { in: questionarios.map(q => q.id_questionario) },  // Filtrando respostas para os questionários encontrados
        conteudo_resposta: { not: undefined },  // Garantindo que o conteúdo não seja nulo
      },
      select: { conteudo_resposta: true },  // Seleciona o conteúdo da resposta
    });

    // 3. Processar as respostas para gerar a nuvem de palavras
    const tokens = removeAccents(
      respostas.map(r => r.conteudo_resposta!).join(' ')  // Juntando todas as respostas
    )
      .toLowerCase()
      .replace(/[^\p{L}\s]+/gu, ' ')  // Removendo pontuação e números
      .split(/\s+/)  // Separando as palavras
      .filter(w => w.length > 2 && !stopwords.includes(w) && !palavrasExcluidas.includes(w));  // Filtrando stopwords e palavras da lista de exclusão

    // 4. Contagem da frequência das palavras
    const freq = new Map<string, number>();
    for (const w of tokens) freq.set(w, (freq.get(w) ?? 0) + 1);

    // 5. Criar o array final com as palavras e suas frequências
    const data = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])  // Ordenando por frequência
      .slice(0, 150)  // Limitando a 150 palavras mais frequentes
      .map(([text, value]) => ({ text, value }));

    console.log('Palavras mais frequentes:', data);
    return NextResponse.json(data);  // Retorna as palavras com suas frequências
  } catch (err) {
    console.error('Erro ao gerar nuvem de palavras:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
