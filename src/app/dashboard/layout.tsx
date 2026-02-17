import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { signOut } from '@/lib/actions/auth'
import { 
  User, 
  MapPin, 
  Clock, 
  GraduationCap, 
  LayoutDashboard,
  LogOut,
  Eye
} from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get practitioner data
  const { data: practitioner } = await supabase
    .from('practitioners')
    .select('slug, first_name, last_name, profile_status, ap_status')
    .eq('user_id', user.id)
    .single() as { data: { slug: string; first_name: string; last_name: string; profile_status: string; ap_status: string } | null }

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/profile', label: 'Profile', icon: User },
    { href: '/dashboard/locations', label: 'Locations', icon: MapPin },
    { href: '/dashboard/availability', label: 'Availability', icon: Clock },
    { href: '/dashboard/training', label: 'Training', icon: GraduationCap },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-background rounded-lg p-4 shadow-sm space-y-6">
              {/* User info */}
              <div className="pb-4 border-b">
                <p className="font-semibold">
                  {practitioner?.first_name} {practitioner?.last_name}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              {/* Status badges */}
              {practitioner && (
                <div className="pb-4 border-b space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Profile</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      practitioner.profile_status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : practitioner.profile_status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {practitioner.profile_status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">AP Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      practitioner.ap_status === 'verified'
                        ? 'bg-green-100 text-green-800'
                        : practitioner.ap_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {practitioner.ap_status}
                    </span>
                  </div>
                </div>
              )}

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

              {/* View profile link */}
              {practitioner?.profile_status === 'active' && practitioner?.ap_status === 'verified' && (
                <div className="pt-4 border-t">
                  <Link
                    href={`/practitioner/${practitioner.slug}`}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-primary hover:underline"
                  >
                    <Eye className="h-4 w-4" />
                    View public profile
                  </Link>
                </div>
              )}

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
