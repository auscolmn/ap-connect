import Link from 'next/link'
import { getPendingPractitioners } from '@/lib/data/admin'
import { verifyPractitioner, suspendPractitioner } from '@/lib/data/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, ExternalLink, User } from 'lucide-react'

async function handleVerify(practitionerId: string) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  await verifyPractitioner(practitionerId, user.id)
  revalidatePath('/admin/pending')
}

async function handleReject(practitionerId: string) {
  'use server'
  await suspendPractitioner(practitionerId)
  revalidatePath('/admin/pending')
}

export default async function PendingVerificationPage() {
  const pending = await getPendingPractitioners()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pending Verification</h1>
        <p className="text-muted-foreground">
          Review and verify practitioner profiles
        </p>
      </div>

      {pending.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-muted-foreground">No practitioners pending verification.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pending.map(practitioner => (
            <Card key={practitioner.id}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">
                        {practitioner.title} {practitioner.first_name} {practitioner.last_name}
                      </h3>
                      {practitioner.training_records.some(t => t.is_pi_graduate) && (
                        <Badge>PI Graduate</Badge>
                      )}
                    </div>

                    {/* Details */}
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Email</p>
                        <p>{practitioner.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">AHPRA Number</p>
                        <p>{practitioner.ahpra_number}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clinic</p>
                        <p>{practitioner.clinic_name || 'Not specified'}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p>
                          {practitioner.locations.length > 0 
                            ? practitioner.locations.map(l => `${l.suburb}, ${l.state}`).join('; ')
                            : 'Not specified'
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conditions</p>
                        <div className="flex gap-1 flex-wrap">
                          {practitioner.ap_conditions?.map(c => (
                            <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Training</p>
                        <div className="flex gap-1 flex-wrap">
                          {practitioner.training_records.map(t => (
                            <Badge 
                              key={t.id} 
                              variant={t.verified ? 'default' : 'secondary'}
                              className="text-xs"
                            >
                              {t.provider}
                              {t.verified && ' ✓'}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Verification Links */}
                    <div className="mt-4 flex gap-4 text-sm">
                      <a 
                        href={`https://www.ahpra.gov.au/registration/registers-of-practitioners.aspx?q=${practitioner.ahpra_number}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Verify AHPRA
                      </a>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-2">
                    <form action={handleVerify.bind(null, practitioner.id)}>
                      <Button type="submit" className="w-full">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    </form>
                    <form action={handleReject.bind(null, practitioner.id)}>
                      <Button type="submit" variant="outline" className="w-full">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
