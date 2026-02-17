import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPractitionerByUserId, getConditions } from '@/lib/data/practitioners'
import { updatePractitionerProfile, createPractitionerProfile } from '@/lib/actions/practitioner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const practitioner = await getPractitionerByUserId(user.id)
  const conditions = await getConditions()

  // Show create form if no practitioner
  if (!practitioner) {
    return <CreateProfileForm />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">
          Update your practitioner profile information
        </p>
      </div>

      <form action={updatePractitionerProfile} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Select name="title" defaultValue={practitioner.title || ''}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr">Dr</SelectItem>
                    <SelectItem value="Prof">Prof</SelectItem>
                    <SelectItem value="A/Prof">A/Prof</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="firstName">First Name *</Label>
                <Input 
                  id="firstName" 
                  name="firstName" 
                  defaultValue={practitioner.first_name}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  defaultValue={practitioner.last_name}
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ahpraNumber">AHPRA Number *</Label>
                <Input 
                  id="ahpraNumber" 
                  name="ahpraNumber" 
                  defaultValue={practitioner.ahpra_number}
                  placeholder="MED0000000000"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <Input 
                  id="qualifications" 
                  name="qualifications" 
                  defaultValue={practitioner.qualifications?.join(', ')}
                  placeholder="MBBS, FRANZCP, PhD"
                />
                <p className="text-xs text-muted-foreground">Comma-separated</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                defaultValue={practitioner.bio || ''}
                rows={6}
                placeholder="Tell referring clinicians about your background, experience, and approach..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Conditions Treated */}
        <Card>
          <CardHeader>
            <CardTitle>Conditions Treated</CardTitle>
            <CardDescription>
              Select the conditions you are authorised to treat
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conditions.map(condition => (
                <div key={condition.id} className="flex items-start space-x-3">
                  <Checkbox 
                    id={`condition-${condition.id}`}
                    name="conditions"
                    value={condition.id.toUpperCase()}
                    defaultChecked={practitioner.ap_conditions?.includes(condition.id.toUpperCase())}
                  />
                  <div>
                    <Label htmlFor={`condition-${condition.id}`} className="font-medium">
                      {condition.name}
                    </Label>
                    {condition.description && (
                      <p className="text-sm text-muted-foreground">{condition.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Practice Details */}
        <Card>
          <CardHeader>
            <CardTitle>Practice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clinicName">Clinic Name</Label>
                <Input 
                  id="clinicName" 
                  name="clinicName" 
                  defaultValue={practitioner.clinic_name || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  name="website" 
                  type="url"
                  defaultValue={practitioner.website || ''}
                  placeholder="https://"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input 
                  id="contactEmail" 
                  name="contactEmail" 
                  type="email"
                  defaultValue={practitioner.contact_email || ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input 
                  id="contactPhone" 
                  name="contactPhone" 
                  type="tel"
                  defaultValue={practitioner.contact_phone || ''}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="telehealth"
                name="telehealth"
                defaultChecked={practitioner.telehealth}
              />
              <Label htmlFor="telehealth">Telehealth appointments available</Label>
            </div>
          </CardContent>
        </Card>

        {/* Funding Accepted */}
        <Card>
          <CardHeader>
            <CardTitle>Funding Accepted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fundingMedicare"
                  name="fundingMedicare"
                  defaultChecked={practitioner.funding_medicare}
                />
                <Label htmlFor="fundingMedicare">Medicare</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fundingDva"
                  name="fundingDva"
                  defaultChecked={practitioner.funding_dva}
                />
                <Label htmlFor="fundingDva">DVA</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fundingNdis"
                  name="fundingNdis"
                  defaultChecked={practitioner.funding_ndis}
                />
                <Label htmlFor="fundingNdis">NDIS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fundingPrivate"
                  name="fundingPrivate"
                  defaultChecked={practitioner.funding_private}
                />
                <Label htmlFor="fundingPrivate">Private</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fundingWorkcover"
                  name="fundingWorkcover"
                  defaultChecked={practitioner.funding_workcover}
                />
                <Label htmlFor="fundingWorkcover">WorkCover</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral Information */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Information</CardTitle>
            <CardDescription>
              How should other clinicians refer patients to you?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="referralProcess">Referral Process</Label>
              <Textarea 
                id="referralProcess" 
                name="referralProcess" 
                defaultValue={practitioner.referral_process || ''}
                rows={4}
                placeholder="Describe how to refer a patient to you. Include what information to include, where to send referrals, and expected response time."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="referralEmail">Referral Email</Label>
                <Input 
                  id="referralEmail" 
                  name="referralEmail" 
                  type="email"
                  defaultValue={practitioner.referral_email || ''}
                  placeholder="referrals@clinic.com.au"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referralPhone">Referral Phone</Label>
                <Input 
                  id="referralPhone" 
                  name="referralPhone" 
                  type="tel"
                  defaultValue={practitioner.referral_phone || ''}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  )
}

function CreateProfileForm() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Your Profile</h1>
        <p className="text-muted-foreground">
          Start by adding your basic information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            This information is required to create your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPractitionerProfile} className="space-y-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Select name="title">
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr">Dr</SelectItem>
                    <SelectItem value="Prof">Prof</SelectItem>
                    <SelectItem value="A/Prof">A/Prof</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" name="firstName" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" name="lastName" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ahpraNumber">AHPRA Number *</Label>
              <Input 
                id="ahpraNumber" 
                name="ahpraNumber" 
                placeholder="MED0000000000"
                required
              />
            </div>

            <Button type="submit">Create Profile</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
