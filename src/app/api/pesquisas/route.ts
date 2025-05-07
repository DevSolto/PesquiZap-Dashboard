import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const pesquisas = await prisma.pesquisa.findMany();
  
  return NextResponse.json(pesquisas); // Retorna as pesquisas como resposta JSON
}
