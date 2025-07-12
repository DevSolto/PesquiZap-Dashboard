import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const acessos = await prisma.usuario_pesquisa.findMany({
    where: { usuario_id: data.user.id },
    select: { pesquisa_id: true },
  });

  const pesquisas = await prisma.pesquisa.findMany({
    where: {
      id_pesquisa: { in: acessos.map((a) => a.pesquisa_id).filter((id): id is string => id !== null) },
    },
  });

  return NextResponse.json(pesquisas);
}
