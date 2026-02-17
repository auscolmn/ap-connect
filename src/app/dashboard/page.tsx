import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPractitionerByUserId } from '@/lib/data/practitioners'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { submitForVerification } from '@/lib/actions/practitioner'
import { 
  CheckCircle, 
  Circle, 
  AlertCircle,
  User,
  MapPin,
  GraduationCap,
  Clock
} from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const practitioner = await getPractitionerByUserId(user.id)

  // If no practitioner profile, show onboarding
  if (!practitioner) {
    return <OnboardingPrompt />
  }

  // Calculate profile completion
  const completionSteps = [
    { 
      label: 'Basic information', 
      complete: !!(practitioner.first_name && practitioner.last_name && practitioner.ahpra_number),
      href: '/dashboard/profile'
    },
    { 
      label: 'Professional bio', 
      complete: !!(practitioner.bio && practitioner.bio.length > 50),
      href: '/dashboard/profile'
    },
    { 
      label: 'Conditions treated', 
      complete: !!(practitioner.ap_conditions && practitioner.ap_conditions.length > 0),
      href: '/dashboard/profile'
    },
    { 
      label: 'Practice location', 
      complete: practitioner.locations.length > 0,
      href: '/dashboard/locations'
    },
    { 
      label: 'Training credentials', 
      complete: practitioner.training_records.length > 0,
      href: '/dashboard/training'
    },
    { 
      label: 'Referral information', 
      complete: !!(practitioner.referral_process || practitioner.referral_email),
      href: '/dashboard/profile'
    },
  ]

  const completedCount = completionSteps.filter(s => s.complete).length
  const completionPercentage = Math.round((completedCount / completionSteps.length) * 100)
  const isReadyForSubmission = completionPercentage >= 80

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your AP Connect profile
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Status</p>
                <p className="text-2xl font-bold capitalize">{practitioner.profile_status}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                practitioner.profile_status === 'active' 
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {practitioner.profile_status === 'active' 
                  ? <CheckCircle className="h-5 w-5" />
                  : <AlertCircle className="h-5 w-5" />
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AP Verification</p>
                <p className="text-2xl font-bold capitalize">{practitioner.ap_status}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                practitioner.ap_status === 'verified'
                  ? 'bg-green-100 text-green-600'
                  : 'bg-yellow-100 text-yellow-600'
              }`}>
                {practitioner.ap_status === 'verified'
                  ? <CheckCircle className="h-5 w-5" />
                  : <Clock className="h-5 w-5" />
                }
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Profile Completeness</p>
                <p className="text-2xl font-bold">{completionPercentage}%</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <span className="text-sm font-semibold">{completedCount}/{completionSteps.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Completion Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
          <CardDescription>
            Complete these steps to submit your profile for verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {completionSteps.map((step, index) => (
              <Link 
                key={index} 
                href={step.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
              >
                {step.complete ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className={step.complete ? 'text-muted-foreground' : ''}>{step.label}</span>
              </Link>
            ))}
          </div>

          {practitioner.ap_status === 'pending' && practitioner.profile_status === 'draft' && (
            <div className="mt-6 pt-6 border-t">
              {isReadyForSubmission ? (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Your profile is ready to submit for verification. Once verified, 
                    you'll appear in the AP Connect directory.
                  </p>
                  <form action={submitForVerification}>
                    <Button type="submit">
                      Submit for Verification
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Complete at least 80% of your profile to submit for verification.
                  </p>
                  <p className="text-sm font-medium">
                    {completionSteps.filter(s => !s.complete).map(s => s.label).join(', ')} still needed.
                  </p>
                </div>
              )}
            </div>
          )}

          {practitioner.ap_status === 'verified' && practitioner.profile_status === 'active' && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span>Your profile is live in the AP Connect directory!</span>
              </div>
              <Button variant="outline" asChild className="mt-4">
                <Link href={`/practitioner/${practitioner.slug}`}>
                  View your public profile
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      {practitioner.ap_status === 'verified' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Accepting patients</p>
                <Badge variant={practitioner.accepting_patients ? 'default' : 'secondary'}>
                  {practitioner.accepting_patients ? 'Yes' : 'No'}
                </Badge>
              </div>
              {practitioner.waitlist_weeks && (
                <div>
                  <p className="text-sm text-muted-foreground">Waitlist</p>
                  <Badge variant="outline">{practitioner.waitlist_weeks} weeks</Badge>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Telehealth</p>
                <Badge variant={practitioner.telehealth ? 'default' : 'secondary'}>
                  {practitioner.telehealth ? 'Available' : 'No'}
                </Badge>
              </div>
            </div>
            <Button variant="outline" asChild className="mt-4">
              <Link href="/dashboard/availability">Update availability</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function OnboardingPrompt() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to AP Connect</CardTitle>
        <CardDescription>
          Let's set up your practitioner profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          To get listed in the AP Connect directory, you'll need to:
        </p>
        
        <ol className="space-y-4">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
              1
            </span>
            <div>
              <p className="font-medium">Complete your profile</p>
              <p className="text-sm text-muted-foreground">Add your credentials, bio, and practice details</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
              2
            </span>
            <div>
              <p className="font-medium">Add your training credentials</p>
              <p className="text-sm text-muted-foreground">PI graduates are automatically verified</p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
              3
            </span>
            <div>
              <p className="font-medium">Submit for verification</p>
              <p className="text-sm text-muted-foreground">We'll verify your AP status and training</p>
            </div>
          </li>
        </ol>

        <Button asChild>
          <Link href="/dashboard/profile">Start your profile</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
