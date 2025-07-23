import { AppSidebar } from "@/components/local/appSidebar"
import { SiteHeader } from "@/components/local/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/server"
import { redirect } from "next/navigation"

export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/auth/login')
  }

  const user = {
    name: data.user.user_metadata?.name ?? '',
    email: data.user.email ?? '',
    avatar: data.user.user_metadata?.avatar_url ?? '',
  }

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <div className="mx-auto flex w-full max-w-7xl flex-col px-4 md:px-6">
          <SiteHeader />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
