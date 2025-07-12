'use client'

import type * as React from "react"
import {
  CameraIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileDownIcon,
  FileTextIcon,
  HelpCircleIcon,
  PhoneIcon,
  SearchIcon,
  SettingsIcon,
  Workflow,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavDocuments } from "./nav-documents"
import { NavUser } from "./nav-user"
import NavMain from "./nav-main"

const navMain = [
  {
    title: "Respostas",
    url: "/api/relatorios/respostas",
    icon: FileDownIcon,
  },
  {
    title: "Total de caracteres",
    url: "#",
    icon: FileDownIcon,
  },
  {
    title: "Questionários",
    url: "#",
    icon: FileDownIcon,
  },
];

const navClouds = [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ];

const navSecondary = [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Get Help",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Search",
      url: "#",
      icon: SearchIcon,
    },
  ];

const documents = [
    {
      name: "N8N Workflow",
      url: "#",
      icon: Workflow,
    },
    {
      name: "ZAPI",
      url: "#",
      icon: PhoneIcon,
    },
    {
      name: "Supabase",
      url: "#",
      icon: DatabaseIcon,
    },
];

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <span className="text-base font-semibold">PesquiZap</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavDocuments items={documents} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
