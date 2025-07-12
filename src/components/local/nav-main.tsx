"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LucideIcon } from "lucide-react"
import PesquisaSelect from "./PesquisaSelect"
import { usePesquisa } from "@/app/context/PesquisaContext"

type NavMainProps = {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}

export default function NavMain({ items }: NavMainProps) {
  const { selectedPesquisa } = usePesquisa();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <PesquisaSelect/>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarGroupLabel>Relatórios</SidebarGroupLabel>

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <a
                  href={
                    selectedPesquisa
                      ? `${item.url}?id_pesquisa=${encodeURIComponent(selectedPesquisa)}`
                      : "#"
                  }
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

