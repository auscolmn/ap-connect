import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Shield, Users, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm font-medium text-primary mb-4">
              For Australian Health Professionals
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Find an Authorised Prescriber for Your Patient
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Connect with verified psychiatrists authorised to prescribe psilocybin and MDMA 
              for treatment-resistant depression and PTSD.
            </p>
            
            {/* Search Box */}
            <div className="max-w-xl mx-auto">
              <form action="/search" method="GET" className="flex gap-2">
                <Input 
                  type="text" 
                  name="q" 
                  placeholder="Search by location, name, or condition..."
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-2">
                Or <a href="/search" className="text-primary hover:underline">browse all practitioners</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Shield className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Verified Credentials</h3>
                <p className="text-muted-foreground">
                  All listed practitioners have verified TGA Authorised Prescriber status 
                  and recognised training credentials.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Clinician to Clinician</h3>
                <p className="text-muted-foreground">
                  Designed for GPs, psychologists, and psychiatrists to find the right 
                  specialist for their patients.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Current Availability</h3>
                <p className="text-muted-foreground">
                  See real-time availability, waitlist estimates, and funding options 
                  to match patients with the right practitioner.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Conditions Treated</h2>
            <p className="text-muted-foreground">
              Authorised Prescribers can assess and treat patients with these conditions 
              using psychedelic-assisted therapy.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Treatment-Resistant Depression</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For patients who have not responded adequately to at least two different 
                  antidepressant treatments.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/search?condition=trd">Find AP for TRD →</a>
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Post-Traumatic Stress Disorder</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For patients with PTSD who have not responded adequately to standard 
                  evidence-based treatments.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/search?condition=ptsd">Find AP for PTSD →</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Practitioners CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Are You an Authorised Prescriber?</h2>
            <p className="text-muted-foreground mb-6">
              Join AP Connect to receive referrals from GPs and psychologists across Australia. 
              Free listing for all verified Authorised Prescribers.
            </p>
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <a href="/for-practitioners">Learn More</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/signup">Get Listed</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
