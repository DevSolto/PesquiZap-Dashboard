import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const acessos: { id_pesquisa: string }[] =
    await prisma.$queryRaw`SELECT id_pesquisa FROM usuario_pesquisa WHERE id_usuario = ${data.user.id}`;

  const pesquisas = await prisma.pesquisa.findMany({
    where: {
      id_pesquisa: { in: acessos.map((a) => a.id_pesquisa) },
    },
  });

  return NextResponse.json(pesquisas);
}
