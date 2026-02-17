import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPractitionerByUserId } from '@/lib/data/practitioners'
import { updateAvailability } from '@/lib/actions/practitioner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

export default async function AvailabilityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const practitioner = await getPractitionerByUserId(user.id)

  if (!practitioner) {
    redirect('/dashboard/profile')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Availability</h1>
        <p className="text-muted-foreground">
          Update your availability status
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient Availability</CardTitle>
          <CardDescription>
            Let referring clinicians know if you're accepting new patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateAvailability} className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="acceptingPatients"
                name="acceptingPatients"
                defaultChecked={practitioner.accepting_patients}
              />
              <Label htmlFor="acceptingPatients" className="text-base">
                I am currently accepting new patients
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="waitlistWeeks">Estimated Waitlist (weeks)</Label>
              <Input 
                id="waitlistWeeks" 
                name="waitlistWeeks" 
                type="number"
                min="0"
                defaultValue={practitioner.waitlist_weeks || ''}
                placeholder="e.g., 4"
                className="max-w-[200px]"
              />
              <p className="text-sm text-muted-foreground">
                Leave blank if you don't have a waitlist
              </p>
            </div>

            <Button type="submit">Update Availability</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <ul>
            <li>
              <strong>Keep it current:</strong> Update your availability regularly so 
              referring clinicians have accurate information.
            </li>
            <li>
              <strong>Waitlist estimates:</strong> Even a rough estimate is helpful. 
              If your waitlist varies, give an average.
            </li>
            <li>
              <strong>Not accepting?</strong> If you're temporarily not accepting new 
              patients, uncheck the box but keep your profile active.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
