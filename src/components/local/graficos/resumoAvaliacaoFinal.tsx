"use client";

import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { usePesquisa } from "@/app/context/PesquisaContext";
import { useEffect, useState } from "react";

const chartConfig = {
  questionarios: {
    label: "Questionários",
  },
  negativo: {
    label: "Negativo",
    color: "#ef4444", // vermelho
  },
  positivo: {
    label: "Positivo",
    color: "#22c55e", // verde
  },
  neutro: {
    label: "Neutro",
    color: "#3b82f6", // azul (para representar neutro)
  },
} satisfies ChartConfig;

export function ResumoAvaliacaoFinal() {
  const { selectedPesquisa } = usePesquisa();
  const [positivo, setPositivo] = useState(0);
  const [negativo, setNegativo] = useState(0);
  const [neutro, setNeutro] = useState(0);

  const chartData = [
    { browser: "negativo", visitors: negativo, fill: "#ef4444" },
    { browser: "positivo", visitors: positivo, fill: "#22c55e" },
    { browser: "neutro", visitors: neutro, fill: "#3b82f6" },
  ];

  const fetchDados = async () => {
    try {
      const response = await fetch(
        `/api/questionarios/avaliacaoFinal?id_pesquisa=${selectedPesquisa}`
      );
      const data = await response.json();
      setNegativo(data.countQuestionariosNegativos);
      setPositivo(data.countQuestionariosPositivos);
      setNeutro(data.countQuestionariosNeutros);
    } catch (error) {
      console.error(`Erro ao buscar os questionários por avaliação:`, error);
    }
  };

  useEffect(() => {
    if (selectedPesquisa) {
      fetchDados();
    }
  }, [selectedPesquisa]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle className="text-lg font-bold">
          Avaliação Final dos Questionários
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Distribuição entre avaliações positivas e negativas
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {negativo + positivo + neutro}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Questionários
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="browser" />}
              className="w-full -translate-y-2 flex text-nowrap gap-2 [&>*]:basis-1/2 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="leading-tight text-muted-foreground">
          Atualização conforme os envios mais recentes.
        </div>
      </CardFooter>
    </Card>
  );
}
