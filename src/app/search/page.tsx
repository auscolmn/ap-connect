import { Suspense } from 'react'
import { searchPractitioners, getStates, getConditions, type SearchFilters } from '@/lib/data/practitioners'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { MapPin, Clock, Video, Check, Search, Sparkles, ArrowLeft, Filter } from 'lucide-react'
import Link from 'next/link'
import type { ActivePractitioner } from '@/types/database'

// Search filters component
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
    <Card className="bg-white border-[var(--border)] sticky top-24">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-lg flex items-center gap-2">
          <Filter className="h-4 w-4 text-[var(--primary)]" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action="/search" method="GET" className="space-y-6">
          {/* Search Query */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <Input 
                name="q" 
                defaultValue={currentFilters.query || ''}
                placeholder="Name, clinic, suburb..."
                className="pl-9 border-[var(--border)] focus:border-[var(--primary)]"
              />
            </div>
          </div>

          {/* State Filter */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">State</Label>
            <Select name="state" defaultValue={currentFilters.state || 'all'}>
              <SelectTrigger className="border-[var(--border)]">
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
            <Label className="text-sm font-medium">Condition</Label>
            <Select name="condition" defaultValue={currentFilters.condition || 'all'}>
              <SelectTrigger className="border-[var(--border)]">
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
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3">
              <input 
                type="checkbox"
                id="accepting"
                name="accepting"
                defaultChecked={currentFilters.acceptingOnly}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <Label htmlFor="accepting" className="text-sm cursor-pointer">
                Accepting patients only
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <input 
                type="checkbox"
                id="telehealth"
                name="telehealth"
                defaultChecked={currentFilters.telehealthOnly}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <Label htmlFor="telehealth" className="text-sm cursor-pointer">
                Telehealth available
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <input 
                type="checkbox"
                id="piTrained"
                name="piTrained"
                defaultChecked={currentFilters.piTrainedOnly}
                className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <Label htmlFor="piTrained" className="text-sm cursor-pointer">
                PIA trained only
              </Label>
            </div>
          </div>

          <div className="pt-2 space-y-2">
            <Button type="submit" className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90">
              Apply Filters
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full border-[var(--border)]"
              asChild
            >
              <Link href="/search">Clear All</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function PractitionerCard({ practitioner }: { practitioner: ActivePractitioner }) {
  return (
    <Card className="bg-white border-[var(--border)] card-hover group">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            {/* Name and credentials */}
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-display text-xl">
                {practitioner.title} {practitioner.first_name} {practitioner.last_name}
              </h3>
              {practitioner.pi_trained && (
                <Badge className="badge-gold text-xs font-medium">
                  PIA Trained
                </Badge>
              )}
            </div>
            
            {/* Clinic and location */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)] mb-4">
              {practitioner.clinic_name && (
                <span className="font-medium text-[var(--foreground)]">{practitioner.clinic_name}</span>
              )}
              {practitioner.suburb && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {practitioner.suburb}, {practitioner.state}
                </span>
              )}
            </div>

            {/* Conditions */}
            <div className="flex flex-wrap gap-2 mb-4">
              {practitioner.ap_conditions?.map(c => (
                <Badge key={c} variant="outline" className="border-[var(--border)] bg-[var(--accent)]/50 text-[var(--foreground)]">
                  {c === 'trd' ? 'Treatment-Resistant Depression' : 'PTSD'}
                </Badge>
              ))}
            </div>

            {/* Funding icons */}
            <div className="flex flex-wrap gap-2">
              {practitioner.funding_medicare && (
                <Badge variant="secondary" className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs">Medicare</Badge>
              )}
              {practitioner.funding_dva && (
                <Badge variant="secondary" className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs">DVA</Badge>
              )}
              {practitioner.funding_ndis && (
                <Badge variant="secondary" className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs">NDIS</Badge>
              )}
              {practitioner.funding_private && (
                <Badge variant="secondary" className="bg-[var(--muted)] text-[var(--muted-foreground)] text-xs">Private</Badge>
              )}
            </div>
          </div>

          {/* Status and actions */}
          <div className="flex flex-col items-start md:items-end gap-3">
            {practitioner.accepting_patients ? (
              <Badge className="badge-verified">
                <Check className="h-3 w-3 mr-1" />
                Accepting Patients
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-[var(--muted)]">Not Currently Accepting</Badge>
            )}
            
            {practitioner.waitlist_weeks && (
              <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                ~{practitioner.waitlist_weeks} week wait
              </span>
            )}

            {practitioner.telehealth && (
              <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1.5">
                <Video className="h-3.5 w-3.5" />
                Telehealth available
              </span>
            )}

            <Button size="sm" asChild className="mt-2 bg-[var(--primary)] hover:bg-[var(--primary)]/90 group-hover:shadow-md transition-all">
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
    state: typeof params.state === 'string' && params.state !== 'all' ? params.state : undefined,
    condition: typeof params.condition === 'string' && params.condition !== 'all' ? params.condition : undefined,
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
    <div className="min-h-screen bg-[var(--background)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-xl">AP Connect</span>
            </Link>
            
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <Button asChild size="sm" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-display text-3xl md:text-4xl mb-3">Find an Authorised Prescriber</h1>
            <p className="text-[var(--muted-foreground)] text-lg">
              Search verified practitioners to refer your patients for psychedelic-assisted therapy.
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
              <div className="mb-6 flex items-center justify-between">
                <p className="text-[var(--muted-foreground)]">
                  <span className="font-semibold text-[var(--foreground)]">{practitioners.length}</span> practitioner{practitioners.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <div className="space-y-4">
                {practitioners.map(practitioner => (
                  <PractitionerCard key={practitioner.id} practitioner={practitioner} />
                ))}

                {practitioners.length === 0 && (
                  <Card className="bg-white border-[var(--border)]">
                    <CardContent className="py-16 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
                        <Search className="h-8 w-8 text-[var(--muted-foreground)]" />
                      </div>
                      <h3 className="font-display text-xl mb-2">No practitioners found</h3>
                      <p className="text-[var(--muted-foreground)] mb-6">
                        Try adjusting your filters or search criteria.
                      </p>
                      <Button variant="outline" asChild className="border-[var(--border)]">
                        <Link href="/search">Clear all filters</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
