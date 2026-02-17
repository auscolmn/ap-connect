import { createClient } from '@/lib/supabase/server'
import { verifyTrainingRecord } from '@/lib/data/admin'
import { revalidatePath } from 'next/cache'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, GraduationCap } from 'lucide-react'

async function handleVerifyTraining(trainingId: string) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  
  await verifyTrainingRecord(trainingId, user.id)
  revalidatePath('/admin/training')
}

export default async function TrainingReviewPage() {
  const supabase = await createClient()

  // Get all unverified training records with practitioner info
  const { data: pendingTraining } = await supabase
    .from('training_records')
    .select(`
      *,
      practitioner:practitioners(
        first_name,
        last_name,
        title,
        user_id,
        user:users!practitioners_user_id_fkey(email)
      )
    `)
    .eq('verified', false)
    .order('created_at', { ascending: true }) as { data: any[] | null }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Training Review</h1>
        <p className="text-muted-foreground">
          Verify practitioner training credentials
        </p>
      </div>

      {!pendingTraining || pendingTraining.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-muted-foreground">No training records pending verification.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingTraining.map(record => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex gap-3">
                    <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{record.program}</p>
                        {record.is_pi_graduate && (
                          <Badge>PI Graduate</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {record.provider}
                        {record.completed_at && ` • Completed ${new Date(record.completed_at).toLocaleDateString()}`}
                      </p>
                      <p className="text-sm mt-2">
                        <span className="text-muted-foreground">Practitioner: </span>
                        {record.practitioner?.title} {record.practitioner?.first_name} {record.practitioner?.last_name}
                        <span className="text-muted-foreground ml-2">
                          ({record.practitioner?.user?.email})
                        </span>
                      </p>
                      {record.certificate_id && (
                        <p className="text-sm">
                          <span className="text-muted-foreground">Certificate ID: </span>
                          {record.certificate_id}
                        </p>
                      )}
                    </div>
                  </div>

                  <form action={handleVerifyTraining.bind(null, record.id)}>
                    <Button type="submit">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Verify Training
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
