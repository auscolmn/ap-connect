import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions/auth'
import { 
  LayoutDashboard,
  Users,
  CheckSquare,
  GraduationCap,
  LogOut,
  Shield
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single() as { data: { role: string } | null }

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  const navItems = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/practitioners', label: 'Practitioners', icon: Users },
    { href: '/admin/pending', label: 'Pending Verification', icon: CheckSquare },
    { href: '/admin/training', label: 'Training Records', icon: GraduationCap },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-background rounded-lg p-4 shadow-sm space-y-6">
              {/* Admin badge */}
              <div className="pb-4 border-b">
                <div className="flex items-center gap-2 text-primary">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">Admin Panel</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                ))}
              </nav>

              {/* Sign out */}
              <div className="pt-4 border-t">
                <form action={signOut}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-muted-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </Button>
                </form>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
