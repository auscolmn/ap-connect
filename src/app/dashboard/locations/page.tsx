import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPractitionerByUserId, getStates } from '@/lib/data/practitioners'
import { addLocation, deleteLocation } from '@/lib/actions/practitioner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { MapPin, Trash2 } from 'lucide-react'

export default async function LocationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const practitioner = await getPractitionerByUserId(user.id)
  const states = await getStates()

  if (!practitioner) {
    redirect('/dashboard/profile')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Practice Locations</h1>
        <p className="text-muted-foreground">
          Add and manage your practice locations
        </p>
      </div>

      {/* Existing Locations */}
      {practitioner.locations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {practitioner.locations.map(location => (
                <div 
                  key={location.id} 
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{location.name || 'Practice Location'}</p>
                        {location.is_primary && (
                          <Badge variant="secondary" className="text-xs">Primary</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {location.address && `${location.address}, `}
                        {location.suburb} {location.state} {location.postcode}
                      </p>
                    </div>
                  </div>
                  <form action={deleteLocation.bind(null, location.id)}>
                    <Button 
                      type="submit" 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Location */}
      <Card>
        <CardHeader>
          <CardTitle>Add Location</CardTitle>
          <CardDescription>
            Add a new practice location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addLocation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Location Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g., Main Practice, Tuesday Clinic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input 
                id="address" 
                name="address" 
                placeholder="123 Example Street"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="suburb">Suburb</Label>
                <Input id="suburb" name="suburb" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select name="state" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map(state => (
                      <SelectItem key={state.code} value={state.code}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode</Label>
                <Input id="postcode" name="postcode" />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="isPrimary"
                name="isPrimary"
                defaultChecked={practitioner.locations.length === 0}
              />
              <Label htmlFor="isPrimary">Set as primary location</Label>
            </div>

            <Button type="submit">Add Location</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
