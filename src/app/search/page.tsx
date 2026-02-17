import { Suspense } from 'react'
import { searchPractitioners, getStates, getConditions, type SearchFilters } from '@/lib/data/practitioners'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { MapPin, Clock, Video, Check } from 'lucide-react'
import Link from 'next/link'
import type { ActivePractitioner } from '@/types/database'

// Search filters component (client-side for UX, but form submits to server)
function SearchFiltersForm({ 
  states, 
  conditions,
  currentFilters 
}: { 
  states: { code: string; name: string }[]
  conditions: { id: string; name: string }[]
  currentFilters: SearchFilters
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <form action="/search" method="GET" className="space-y-6">
          {/* State Filter */}
          <div className="space-y-2">
            <Label>State</Label>
            <Select name="state" defaultValue={currentFilters.state || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map(s => (
                  <SelectItem key={s.code} value={s.code}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition Filter */}
          <div className="space-y-2">
            <Label>Condition</Label>
            <Select name="condition" defaultValue={currentFilters.condition || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                {conditions.map(c => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Checkbox Filters */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="accepting"
                name="accepting"
                defaultChecked={currentFilters.acceptingOnly}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="accepting" className="text-sm">
                Accepting patients only
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="telehealth"
                name="telehealth"
                defaultChecked={currentFilters.telehealthOnly}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="telehealth" className="text-sm">
                Telehealth available
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="checkbox"
                id="piTrained"
                name="piTrained"
                defaultChecked={currentFilters.piTrainedOnly}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="piTrained" className="text-sm">
                PI trained only
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full">Apply Filters</Button>
          
          <Button 
            variant="outline" 
            className="w-full"
            asChild
          >
            <Link href="/search">Clear Filters</Link>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function PractitionerCard({ practitioner }: { practitioner: ActivePractitioner }) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            {/* Name and credentials */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold">
                {practitioner.title} {practitioner.first_name} {practitioner.last_name}
              </h3>
              {practitioner.pi_trained && (
                <Badge variant="secondary" className="text-xs">PI Trained</Badge>
              )}
            </div>
            
            {/* Clinic and location */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-3">
              {practitioner.clinic_name && (
                <span className="font-medium text-foreground">{practitioner.clinic_name}</span>
              )}
              {practitioner.suburb && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {practitioner.suburb}, {practitioner.state}
                </span>
              )}
            </div>

            {/* Conditions */}
            <div className="flex gap-2 mb-3">
              {practitioner.ap_conditions?.map(c => (
                <Badge key={c} variant="outline">
                  {c === 'TRD' ? 'Treatment-Resistant Depression' : 'PTSD'}
                </Badge>
              ))}
            </div>

            {/* Funding icons */}
            <div className="flex gap-2 text-xs text-muted-foreground">
              {practitioner.funding_medicare && <Badge variant="secondary">Medicare</Badge>}
              {practitioner.funding_dva && <Badge variant="secondary">DVA</Badge>}
              {practitioner.funding_ndis && <Badge variant="secondary">NDIS</Badge>}
              {practitioner.funding_private && <Badge variant="secondary">Private</Badge>}
            </div>
          </div>

          {/* Status and actions */}
          <div className="flex flex-col items-end gap-2">
            {practitioner.accepting_patients ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                <Check className="h-3 w-3 mr-1" />
                Accepting Patients
              </Badge>
            ) : (
              <Badge variant="secondary">Not Currently Accepting</Badge>
            )}
            
            {practitioner.waitlist_weeks && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                ~{practitioner.waitlist_weeks} week wait
              </span>
            )}

            {practitioner.telehealth && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Video className="h-3 w-3" />
                Telehealth available
              </span>
            )}

            <Button size="sm" asChild className="mt-2">
              <Link href={`/practitioner/${practitioner.slug}`}>View Profile</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  
  // Parse search params into filters
  const filters: SearchFilters = {
    state: typeof params.state === 'string' ? params.state : undefined,
    condition: typeof params.condition === 'string' ? params.condition : undefined,
    acceptingOnly: params.accepting === 'on',
    telehealthOnly: params.telehealth === 'on',
    piTrainedOnly: params.piTrained === 'on',
    query: typeof params.q === 'string' ? params.q : undefined,
  }

  // Fetch data
  const [practitioners, states, conditions] = await Promise.all([
    searchPractitioners(filters),
    getStates(),
    getConditions(),
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Find an Authorised Prescriber</h1>
        <p className="text-muted-foreground">
          Search for verified practitioners to refer your patients.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <SearchFiltersForm 
            states={states} 
            conditions={conditions}
            currentFilters={filters}
          />
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {practitioners.length} practitioner{practitioners.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="space-y-4">
            {practitioners.map(practitioner => (
              <PractitionerCard key={practitioner.id} practitioner={practitioner} />
            ))}

            {practitioners.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    No practitioners found matching your criteria.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/search">Clear filters</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
