import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const acessos: { pesquisa_id: string }[] =
    await prisma.$queryRaw`SELECT pesquisa_id FROM usuario_pesquisa WHERE usuario_id   = ${data.user.id}`;

  const pesquisas = await prisma.pesquisa.findMany({
    where: {
      id_pesquisa: { in: acessos.map((a) => a.pesquisa_id) },
    },
  });

  return NextResponse.json(pesquisas);
}
