import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signUp } from '@/lib/actions/auth'
import { Shield, Users, CheckCircle } from 'lucide-react'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams
  const error = params.error
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Benefits */}
        <div>
          <h1 className="text-3xl font-bold mb-4">Join AP Connect</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Get listed in Australia's premier Authorised Prescriber referral network and 
            receive qualified referrals from GPs and psychologists.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Verified Credentials</h3>
                <p className="text-sm text-muted-foreground">
                  Your TGA Authorised Prescriber status and training credentials are 
                  verified and displayed on your profile.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Qualified Referrals</h3>
                <p className="text-sm text-muted-foreground">
                  Receive referrals from health professionals who understand your work 
                  and have pre-screened patients.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-1">Free for All APs</h3>
                <p className="text-sm text-muted-foreground">
                  Listing is free for all verified Authorised Prescribers, regardless 
                  of training pathway.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>PI Graduates:</strong> If you completed training through Psychedelic 
              Institute Australia, your training credentials will be automatically verified.
            </p>
          </div>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Start by creating an account. You'll then complete your profile and 
              submit for verification.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}
            <form action={signUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Use your professional email address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 8 characters
                </p>
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full">
                  Create account
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
