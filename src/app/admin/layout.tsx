import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import AdminSidebar from "@/components/modules/admin/admin-sidebar"
import AdminHeader from "@/components/modules/admin/admin-header"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check authentication and authorization
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/admin/login")
  }

  if (user.role !== "ADMIN" && user.role !== "EDITOR") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <AdminSidebar user={user} />
      
      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Admin Header */}
        <AdminHeader user={user} />
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 