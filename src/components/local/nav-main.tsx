'use client'

// app/components/NavMain.tsx
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import PesquisaSelect from "./PesquisaSelect"  // Importando o componente de select
import { GET } from "@/app/api/pesquisas/route"

type NavMainProps = {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}

export default function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <PesquisaSelect />  {/* Usando o componente PesquisaSelect */}
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroupLabel>Relatórios</SidebarGroupLabel>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

// Server-side data fetching
export async function getServerSideProps() {
  // Fazendo a requisição à API para pegar as pesquisas
  const pesquisas = await GET()

  return {
    props: {
      pesquisas, // Passando os dados das pesquisas para o componente
    },
  }
}
