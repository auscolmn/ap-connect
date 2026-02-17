import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPractitionerByUserId } from '@/lib/data/practitioners'
import { addTrainingRecord } from '@/lib/actions/practitioner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GraduationCap, CheckCircle, Clock } from 'lucide-react'

const TRAINING_PROVIDERS = [
  { value: 'Psychedelic Institute Australia', label: 'Psychedelic Institute Australia' },
  { value: 'Mind Medicine Australia', label: 'Mind Medicine Australia' },
  { value: 'MAPS', label: 'MAPS (Multidisciplinary Association for Psychedelic Studies)' },
  { value: 'Other', label: 'Other' },
]

export default async function TrainingPage() {
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
        <h1 className="text-2xl font-bold">Training Credentials</h1>
        <p className="text-muted-foreground">
          Add and manage your training credentials
        </p>
      </div>

      {/* Existing Training Records */}
      {practitioner.training_records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {practitioner.training_records.map(record => (
                <div 
                  key={record.id} 
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{record.program}</p>
                        {record.verified ? (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                        {record.is_pi_graduate && (
                          <Badge className="text-xs">PI Graduate</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {record.provider}
                        {record.completed_at && ` • ${new Date(record.completed_at).getFullYear()}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Training */}
      <Card>
        <CardHeader>
          <CardTitle>Add Training</CardTitle>
          <CardDescription>
            Add a new training credential. PI graduates are automatically verified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={addTrainingRecord} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="provider">Training Provider *</Label>
              <Select name="provider" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {TRAINING_PROVIDERS.map(provider => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="program">Program Name *</Label>
              <Input 
                id="program" 
                name="program" 
                required
                placeholder="e.g., Psychiatrist Training Program, CPAT, PAT Program"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="completedAt">Completion Date</Label>
                <Input 
                  id="completedAt" 
                  name="completedAt" 
                  type="date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certificateId">Certificate ID (optional)</Label>
                <Input 
                  id="certificateId" 
                  name="certificateId" 
                  placeholder="For verification"
                />
              </div>
            </div>

            <Button type="submit">Add Training</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Verification Process</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none text-muted-foreground">
          <ul>
            <li>
              <strong>Psychedelic Institute Australia:</strong> If you're a PI graduate, 
              your training will be automatically verified when you use the same email 
              as your training registration.
            </li>
            <li>
              <strong>Other providers:</strong> Training from other providers will be 
              manually verified by our team. This typically takes 2-3 business days.
            </li>
            <li>
              <strong>Certificate IDs:</strong> Including your certificate ID can speed 
              up the verification process.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
