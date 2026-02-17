import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is admin
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single() as { data: { role: string } | null }
    isAdmin = profile?.role === 'admin' || false
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold text-primary">
          AP Connect
        </Link>
        <nav className="flex items-center gap-6">
          <Link 
            href="/search" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Find an AP
          </Link>
          <Link 
            href="/how-to-refer" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            How to Refer
          </Link>
          <Link 
            href="/for-practitioners" 
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            For Practitioners
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link 
                  href="/admin" 
                  className="text-sm text-primary font-medium hover:underline"
                >
                  Admin
                </Link>
              )}
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login" 
                className="text-sm font-medium text-primary hover:underline"
              >
                Log In
              </Link>
              <Button size="sm" asChild>
                <Link href="/signup">Get Listed</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
