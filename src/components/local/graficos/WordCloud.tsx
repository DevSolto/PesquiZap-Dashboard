'use client';
import React, { useEffect, useRef } from 'react';
import { Chart, Tooltip, Legend, ChartOptions, LinearScale } from 'chart.js';
import { WordCloudController, WordElement } from 'chartjs-chart-wordcloud';
import { Card } from '@/components/ui/card';

Chart.register(WordCloudController, WordElement, Tooltip, Legend, LinearScale);

export interface Word {
  text: string;
  value: number;
}

interface WordCloudProps {
  words: Word[];
  height?: number | string;
}

const WordCloud: React.FC<WordCloudProps> = ({ words, height = 320 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Lista de cores predefinidas para randomização
  const colorList = [
    '#FF5733', '#33FF57', '#3357FF', '#F333FF', '#FF8C33', '#33FFF9',
    '#FF33A1', '#8C33FF', '#F1C40F', '#E74C3C', '#2ECC71', '#1F77B4',
    '#9B59B6', '#FF69B4', '#16A085', '#F39C12', '#27AE60', '#D35400',
  ];

  // Função para escolher uma cor aleatória da lista
  const getRandomColor = () => colorList[Math.floor(Math.random() * colorList.length)];

  useEffect(() => {
    if (!canvasRef.current || !words.length) return;

    const chart = new Chart(canvasRef.current, {
      type: 'wordCloud' as const,
      data: {
        labels: words.map(w => w.text),
        datasets: [{ data: words.map(w => w.value) }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1.5,
        plugins: {
          legend: {
            display: false,  // Desabilitando a legenda
          },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const label = ctx.label as string;
                return `${label}: ${ctx.raw} ocorrência${ctx.raw === 1 ? '' : 's'}`;
              },
            },
          },
        },
        wordCloud: {
          minFontSize: 12,
          maxFontSize: 50,
          padding: 4,
          rotationSteps: 2,
          rotation: 0,
          color: (_: unknown, i: number) => getRandomColor(),  // Usando a função de cor aleatória
          fit: true,  // Ajusta automaticamente as palavras dentro do gráfico
        },
      } as ChartOptions,
    });

    return () => chart.destroy();  // Limpeza do gráfico quando o componente desmonta
  }, [words]);

  return (
    <Card style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </Card>
  );
};

export default WordCloud;
