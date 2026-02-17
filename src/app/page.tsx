import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Shield, 
  Users, 
  Clock, 
  MapPin,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen">
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
              <Link href="/search" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                Find a Practitioner
              </Link>
              <Link href="/signup" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                For Practitioners
              </Link>
              <Button asChild size="sm" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden hero-gradient">
        {/* Decorative shapes */}
        <div className="organic-shape w-96 h-96 -top-20 -right-20 opacity-30" />
        <div className="organic-shape w-64 h-64 bottom-10 -left-10 opacity-20" />
        
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[var(--border)] mb-8 animate-fade-in-up">
              <div className="w-2 h-2 rounded-full bg-[var(--verified)] animate-pulse" />
              <span className="text-sm font-medium text-[var(--muted-foreground)]">
                Australia's Verified Practitioner Network
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6 animate-fade-in-up animate-delay-100">
              Find an{" "}
              <span className="italic text-[var(--primary)]">Authorised Prescriber</span>{" "}
              for Your Patient
            </h1>
            
            {/* Subhead */}
            <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
              Connect with verified psychiatrists authorised to prescribe psilocybin and MDMA 
              for treatment-resistant conditions. Trusted by clinicians across Australia.
            </p>
            
            {/* Search Box */}
            <div className="max-w-xl mx-auto animate-fade-in-up animate-delay-300">
              <form action="/search" method="GET" className="relative">
                <div className="flex gap-3 p-2 bg-white rounded-2xl shadow-lg shadow-[var(--primary)]/5 border border-[var(--border)]">
                  <div className="flex-1 flex items-center gap-3 pl-4">
                    <Search className="h-5 w-5 text-[var(--muted-foreground)]" />
                    <Input 
                      type="text" 
                      name="q" 
                      placeholder="Search by location, name, or condition..."
                      className="border-0 shadow-none focus-visible:ring-0 text-base placeholder:text-[var(--muted-foreground)]/60"
                    />
                  </div>
                  <Button type="submit" size="lg" className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 rounded-xl px-6">
                    Search
                  </Button>
                </div>
              </form>
              <p className="text-sm text-[var(--muted-foreground)] mt-4">
                Or{" "}
                <Link href="/search" className="text-[var(--primary)] hover:text-[var(--gold)] font-medium">
                  browse all verified practitioners →
                </Link>
              </p>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center gap-8 mt-16 animate-fade-in-up animate-delay-400">
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <CheckCircle className="h-4 w-4 text-[var(--verified)]" />
              <span>TGA Verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <CheckCircle className="h-4 w-4 text-[var(--verified)]" />
              <span>AHPRA Registered</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
              <CheckCircle className="h-4 w-4 text-[var(--verified)]" />
              <span>Recognised Training</span>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* Value Props */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Why Clinicians Trust AP Connect
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
              We verify every practitioner's credentials so you can confidently refer your patients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-[var(--border)] card-hover group">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-[var(--primary)]" />
                </div>
                <h3 className="font-display text-xl mb-3">Verified Credentials</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  Every practitioner's TGA Authorised Prescriber status and AHPRA registration 
                  is verified before listing.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-[var(--border)] card-hover group">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-[var(--primary)]" />
                </div>
                <h3 className="font-display text-xl mb-3">Clinician to Clinician</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  Built for GPs, psychologists, and psychiatrists to find the right 
                  specialist for their patients' needs.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-[var(--border)] card-hover group">
              <CardContent className="pt-8 pb-8">
                <div className="w-14 h-14 rounded-2xl bg-[var(--accent)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Clock className="h-7 w-7 text-[var(--primary)]" />
                </div>
                <h3 className="font-display text-xl mb-3">Real-Time Availability</h3>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  See current availability, waitlist times, and funding options 
                  to match patients quickly.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="py-24 bg-[var(--muted)]/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="bg-[var(--primary)]/10 text-[var(--primary)] border-0 mb-6">
                Approved Conditions
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl mb-6">
                Psychedelic-Assisted Therapy for Serious Mental Health Conditions
              </h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed mb-8">
                Authorised Prescribers can assess and treat patients with treatment-resistant 
                conditions using psilocybin and MDMA-assisted therapy under the TGA's 
                Authorised Prescriber pathway.
              </p>
              <Button asChild className="bg-[var(--primary)] hover:bg-[var(--primary)]/90">
                <Link href="/search">
                  Find a Practitioner
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-6">
              <Card className="bg-white border-[var(--border)] card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🧠</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Treatment-Resistant Depression</h3>
                      <p className="text-sm text-[var(--muted-foreground)] mb-4">
                        For patients who have not responded adequately to at least two different 
                        antidepressant treatments.
                      </p>
                      <Link href="/search?condition=trd" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--gold)] inline-flex items-center gap-1">
                        Find AP for TRD <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-[var(--border)] card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">💜</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Post-Traumatic Stress Disorder</h3>
                      <p className="text-sm text-[var(--muted-foreground)] mb-4">
                        For patients with PTSD who have not responded adequately to standard 
                        evidence-based treatments.
                      </p>
                      <Link href="/search?condition=ptsd" className="text-sm font-medium text-[var(--primary)] hover:text-[var(--gold)] inline-flex items-center gap-1">
                        Find AP for PTSD <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* States Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Practitioners Across Australia
            </h2>
            <p className="text-[var(--muted-foreground)]">
              Find verified Authorised Prescribers in your state
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { code: "NSW", name: "New South Wales" },
              { code: "VIC", name: "Victoria" },
              { code: "QLD", name: "Queensland" },
              { code: "WA", name: "Western Australia" },
              { code: "SA", name: "South Australia" },
              { code: "TAS", name: "Tasmania" },
              { code: "ACT", name: "ACT" },
              { code: "NT", name: "Northern Territory" },
            ].map((state) => (
              <Link 
                key={state.code}
                href={`/search?state=${state.code}`}
                className="group p-6 rounded-xl border border-[var(--border)] bg-white hover:border-[var(--primary)] hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[var(--muted-foreground)] group-hover:text-[var(--primary)] transition-colors" />
                  <div>
                    <div className="font-semibold group-hover:text-[var(--primary)] transition-colors">{state.code}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{state.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* For Practitioners CTA */}
      <section className="py-24 bg-[var(--primary)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <Badge className="bg-white/20 text-white border-0 mb-6">
            For Authorised Prescribers
          </Badge>
          <h2 className="font-display text-3xl md:text-5xl text-white mb-6">
            Join Australia's Trusted<br />Practitioner Network
          </h2>
          <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Receive referrals from GPs and psychologists across Australia. 
            Free listing for all verified Authorised Prescribers. 
            Premium features for PIA graduates.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90 rounded-xl">
              <Link href="/signup">
                Get Listed Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-xl">
              <Link href="/for-practitioners">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-xl">AP Connect</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-[var(--muted-foreground)]">
              <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">About</Link>
              <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">Contact</Link>
              <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">Terms</Link>
            </div>
            
            <p className="text-sm text-[var(--muted-foreground)]">
              © {new Date().getFullYear()} AP Connect. Part of the PIA network.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
