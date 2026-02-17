import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPractitionerBySlug } from '@/lib/data/practitioners'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  MapPin, 
  Clock, 
  Phone, 
  Mail, 
  Globe, 
  Video, 
  Check,
  Download,
  ArrowLeft
} from 'lucide-react'

export default async function PractitionerPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const practitioner = await getPractitionerBySlug(slug)

  if (!practitioner) {
    notFound()
  }

  // Check if PI trained
  const isPiTrained = practitioner.training_records.some(t => t.is_pi_graduate && t.verified)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back link */}
      <Link 
        href="/search" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to search
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold">
                      {practitioner.title} {practitioner.first_name} {practitioner.last_name}
                    </h1>
                    {isPiTrained && (
                      <Badge variant="secondary">PI Trained</Badge>
                    )}
                  </div>
                  {practitioner.qualifications && practitioner.qualifications.length > 0 && (
                    <p className="text-muted-foreground mb-2">
                      {practitioner.qualifications.join(', ')}
                    </p>
                  )}
                  {practitioner.clinic_name && (
                    <p className="font-medium">{practitioner.clinic_name}</p>
                  )}
                </div>
                
                {practitioner.accepting_patients ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    <Check className="h-3 w-3 mr-1" />
                    Accepting Patients
                  </Badge>
                ) : (
                  <Badge variant="secondary">Not Currently Accepting</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* About */}
          {practitioner.bio && (
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  {practitioner.bio.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Conditions Treated */}
          {practitioner.ap_conditions && practitioner.ap_conditions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Conditions Treated</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {practitioner.ap_conditions.map(c => (
                    <Badge key={c} variant="outline" className="text-base py-1 px-3">
                      {c === 'TRD' ? 'Treatment-Resistant Depression' : 
                       c === 'PTSD' ? 'Post-Traumatic Stress Disorder' : c}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Training & Credentials */}
          {practitioner.training_records.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Training & Credentials</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {practitioner.training_records.map((t) => (
                    <li key={t.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{t.program}</p>
                        <p className="text-sm text-muted-foreground">
                          {t.provider}
                          {t.completed_at && `, ${new Date(t.completed_at).getFullYear()}`}
                        </p>
                      </div>
                      {t.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* How to Refer */}
          {(practitioner.referral_process || practitioner.referral_email) && (
            <Card>
              <CardHeader>
                <CardTitle>How to Refer a Patient</CardTitle>
              </CardHeader>
              <CardContent>
                {practitioner.referral_process && (
                  <div className="prose prose-sm max-w-none mb-6">
                    {practitioner.referral_process.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="text-muted-foreground mb-4 last:mb-0 whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                
                {practitioner.referral_form_url && (
                  <Button variant="outline" asChild>
                    <a href={practitioner.referral_form_url} download>
                      <Download className="h-4 w-4 mr-2" />
                      Download Referral Form
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact for Referrals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {practitioner.referral_email && (
                <a 
                  href={`mailto:${practitioner.referral_email}`}
                  className="flex items-center gap-3 text-sm hover:text-primary"
                >
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {practitioner.referral_email}
                </a>
              )}
              {practitioner.referral_phone && (
                <a 
                  href={`tel:${practitioner.referral_phone}`}
                  className="flex items-center gap-3 text-sm hover:text-primary"
                >
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {practitioner.referral_phone}
                </a>
              )}
              {practitioner.website && (
                <a 
                  href={practitioner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm hover:text-primary"
                >
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Website
                </a>
              )}
            </CardContent>
          </Card>

          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {practitioner.accepting_patients ? (
                <div className="flex items-center gap-2 text-green-700">
                  <Check className="h-4 w-4" />
                  <span>Accepting new patients</span>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Not currently accepting new patients
                </div>
              )}
              
              {practitioner.waitlist_weeks && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Approximately {practitioner.waitlist_weeks} week wait</span>
                </div>
              )}
              
              {practitioner.telehealth && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Video className="h-4 w-4" />
                  <span>Telehealth appointments available</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Locations */}
          {practitioner.locations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {practitioner.locations.map((loc) => (
                  <div key={loc.id} className="text-sm">
                    {loc.name && <p className="font-medium">{loc.name}</p>}
                    <p className="text-muted-foreground">
                      {loc.address && <>{loc.address}<br /></>}
                      {loc.suburb} {loc.state} {loc.postcode}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Funding */}
          <Card>
            <CardHeader>
              <CardTitle>Funding Accepted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {practitioner.funding_medicare && <Badge>Medicare</Badge>}
                {practitioner.funding_dva && <Badge>DVA</Badge>}
                {practitioner.funding_ndis && <Badge>NDIS</Badge>}
                {practitioner.funding_private && <Badge>Private</Badge>}
                {practitioner.funding_workcover && <Badge>WorkCover</Badge>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
