"use client";

import { TrendingUp } from "lucide-react";
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
  concluido: {
    label: "Concluídos",
    color: "#22c55e",
  },
  emAndamento: {
    label: "Em andamento",
    color: "#eab308",
  },
  negado: {
    label: "Negados",
    color: "#ef4444",
  },
  abandonado: {
    label: "Abandonados",
    color: "#991b1b",
  },
} satisfies ChartConfig;

export function ResumoQuestionarios() {
  const { selectedPesquisa } = usePesquisa();
  const [emAndamento, setEmAndamento] = useState(0);
  const [concluido, setConcluido] = useState(0);
  const [negado, setNegado] = useState(0);
  const [abandonado, setAbandonado] = useState(0);

  const chartData = [
    { browser: "concluido", visitors: concluido, fill: "#22c55e" },
    { browser: "emAndamento", visitors: emAndamento, fill: "#eab308" },
    { browser: "negado", visitors: negado, fill: "#ef4444" },
    { browser: "abandonado", visitors: abandonado, fill: "#991b1b" },
  ];

  const fetchDados = async (status: string, setter: (val: number) => void) => {
    try {
      const response = await fetch(
        `/api/questionarios?id_pesquisa=${selectedPesquisa}&status=${status}`
      );
      const data = await response.json();
      setter(data.length);
    } catch (error) {
      console.error(`Erro ao buscar os questionários (${status}):`, error);
    }
  };

  useEffect(() => {
    if (selectedPesquisa) {
      fetchDados("em_andamento", setEmAndamento);
      fetchDados("concluido", setConcluido);
      fetchDados("negado", setNegado);
      fetchDados("abandonado", setAbandonado);
    }
  }, [selectedPesquisa]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle className="text-lg font-bold">
          Distribuição de Questionários
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Visão geral por status
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
                          {concluido + emAndamento + negado + abandonado}
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
              className="-translate-y-2 flex-wrap  text-nowrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm text-center">
        <div className="leading-tight text-muted-foreground">
          Atualização com base nas respostas mais recentes.
        </div>
      </CardFooter>
    </Card>
  );
}
