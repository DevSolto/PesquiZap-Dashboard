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
  listaEnvios: {
    label: "Lista de Envios",
    color: "#22c55e",
  },
  trafegoPago: {
    label: "Tráfego Pago",
    color: "#eab308",
  },
} satisfies ChartConfig;

export function ResumoFontes() {
  const { selectedPesquisa } = usePesquisa();
  const [trafegoPago, setTrafegoPago] = useState(0);
  const [listaEnvios, setListaEnvios] = useState(0);

  const chartData = [
    { browser: "listaEnvios", visitors: listaEnvios, fill: "#22c55e" },
    { browser: "trafegoPago", visitors: trafegoPago, fill: "#eab308" },
  ];

  const fetchDados = async () => {
    try {
      const response = await fetch(
        `/api/questionarios/fontes?id_pesquisa=${selectedPesquisa}`
      );
      const data = await response.json();
      setListaEnvios(data.countQuestionariosListaEnvios);
      setTrafegoPago(data.countQuestionariosTrafegoPago);
    } catch (error) {
      console.error(`Erro ao buscar os questionários por fonte:`, error);
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
          Fontes de Coleta de Questionários
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Distribuição atualizada por fonte de entrada
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
                          {listaEnvios + trafegoPago}
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
              className="-translate-y-2 flex-wrap text-nowrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
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
