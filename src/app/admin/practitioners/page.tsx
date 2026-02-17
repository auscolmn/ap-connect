import Link from 'next/link'
import { getAllPractitioners } from '@/lib/data/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, ExternalLink } from 'lucide-react'

export default async function PractitionersListPage() {
  const practitioners = await getAllPractitioners()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">All Practitioners</h1>
          <p className="text-muted-foreground">
            {practitioners.length} practitioners registered
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Email</th>
                  <th className="text-left p-4 font-medium">Location</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">AP Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {practitioners.map(practitioner => {
                  const primaryLocation = practitioner.locations?.find((l: any) => l.is_primary) || practitioner.locations?.[0]
                  
                  return (
                    <tr key={practitioner.id} className="hover:bg-muted/30">
                      <td className="p-4">
                        <p className="font-medium">
                          {practitioner.title} {practitioner.first_name} {practitioner.last_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {practitioner.clinic_name}
                        </p>
                      </td>
                      <td className="p-4 text-sm">
                        {practitioner.user?.email}
                      </td>
                      <td className="p-4 text-sm">
                        {primaryLocation 
                          ? `${primaryLocation.suburb}, ${primaryLocation.state}`
                          : '-'
                        }
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={
                            practitioner.profile_status === 'active' ? 'default' : 
                            practitioner.profile_status === 'draft' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {practitioner.profile_status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant={
                            practitioner.ap_status === 'verified' ? 'default' : 
                            practitioner.ap_status === 'pending' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {practitioner.ap_status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {practitioner.profile_status === 'active' && (
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={`/practitioner/${practitioner.slug}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" asChild>
                            <a 
                              href={`https://www.ahpra.gov.au/registration/registers-of-practitioners.aspx?q=${practitioner.ahpra_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {practitioners.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No practitioners registered yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
