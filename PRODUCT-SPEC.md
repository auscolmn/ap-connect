# AP Connect — Product Specification

## Authorised Prescriber Referral Network

---

## 1. Product Overview

### Vision
The trusted referral network connecting Australian clinicians with verified Authorised Prescribers for psychedelic-assisted therapy.

### Mission
Enable GPs, psychologists, and psychiatrists to find and refer patients to qualified, verified Authorised Prescribers for treatment-resistant depression and PTSD.

### Core Principles
1. **Clinician-to-clinician** — Built for health professionals, not consumers
2. **TGA compliant** — No advertising of prescription medicines to public
3. **Verification-first** — Only verified APs listed
4. **PI integration** — Seamless value-add for PI training graduates

---

## 2. User Personas

### 2.1 Dr. Sarah — Referring GP
- **Context:** Has a patient with treatment-resistant depression who's exhausted standard options
- **Need:** Find a qualified Authorised Prescriber to refer to
- **Wants:** Verified credentials, location, availability, how to refer
- **Behavior:** Quick search, scan profiles, send referral

### 2.2 Dr. Michael — Authorised Prescriber (Listed)
- **Context:** Psychiatrist who completed PI training, has AP status
- **Need:** Receive qualified referrals from GPs and psychologists
- **Wants:** Profile that showcases credentials, easy referral intake
- **Behavior:** Set up profile once, update availability as needed

### 2.3 Dr. Emily — Psychologist
- **Context:** Treating a PTSD patient who needs medical assessment for PAT
- **Need:** Find a psychiatrist who can assess and prescribe
- **Wants:** Someone who takes referrals, ideally bulk-bills or DVA
- **Behavior:** Filter by location, funding, availability

---

## 3. Features (MVP)

### 3.1 Directory Search
**Users:** Referring clinicians (GPs, psychologists, psychiatrists)

| Feature | Description | Priority |
|---------|-------------|----------|
| State filter | Filter by Australian state | P0 |
| Condition filter | TRD, PTSD | P0 |
| Availability filter | Accepting patients Y/N | P0 |
| Funding filter | Medicare, DVA, NDIS, Private | P1 |
| Telehealth filter | Offers telehealth Y/N | P1 |
| Training filter | PI-trained Y/N | P2 |
| Results list | Sortable, paginated | P0 |

**Search results show:**
- Name, credentials, clinic
- Location (suburb, state)
- Conditions treated
- Accepting patients / waitlist estimate
- Funding accepted (icons)
- "View Profile" button

### 3.2 Practitioner Profiles
**Public profile page for each AP**

| Section | Content |
|---------|---------|
| Header | Photo, name, credentials, clinic |
| About | Bio, qualifications, experience |
| Conditions | TRD, PTSD with approach description |
| Locations | Practice addresses, telehealth |
| Availability | Status, waitlist estimate |
| Funding | Medicare, DVA, NDIS, Private, WorkCover |
| Training | Verified credentials (PI, MMA, etc.) |
| Referral | How to refer, form download, contact |

### 3.3 Practitioner Dashboard
**For listed Authorised Prescribers**

| Feature | Description |
|---------|-------------|
| Profile editor | Edit all profile fields |
| Availability toggle | Accepting / Waitlist / Not accepting |
| Waitlist estimate | Update estimated wait weeks |
| Location management | Add/edit practice locations |
| Training records | View verified credentials |
| Profile preview | See how profile appears to searchers |

### 3.4 PI Training Integration
**Automatic listing for PI graduates**

| Trigger | Action |
|---------|--------|
| Graduate completes PI psychiatrist training | Account created, profile pre-populated |
| Graduate email sent | "Complete your AP Connect profile" |
| Graduate logs in | Guided profile completion flow |
| Profile complete + AP verified | Listed in directory |

### 3.5 Verification System
**Internal verification (not public validation)**

| What's Verified | How |
|-----------------|-----|
| AHPRA registration | Manual check against AHPRA register |
| TGA AP status | Manual check or self-declared + spot-check |
| PI training | Automatic via PI integration |
| Other training | Certificate upload + manual review |

---

## 4. Information Architecture

```
/                           → Landing page ("For referring clinicians")
/search                     → Directory search
/search?state=VIC&...       → Search with filters
/practitioner/[slug]        → Public practitioner profile

/login                      → Authentication
/signup                     → Practitioner registration
/dashboard                  → Practitioner dashboard
/dashboard/profile          → Edit profile
/dashboard/locations        → Manage locations
/dashboard/availability     → Update availability
/dashboard/training         → View training records

/about                      → About AP Connect
/how-to-refer               → Guide for referring clinicians
/for-practitioners          → Info for APs wanting to be listed
/contact                    → Contact form
/privacy                    → Privacy policy
/terms                      → Terms of service
```

---

## 5. User Flows

### 5.1 Referring Clinician: Find an AP
```
Landing → Search → Apply Filters → View Results → View Profile → Get Referral Info
```

### 5.2 PI Graduate: Get Listed
```
Complete PI Training → Receive Email → Create Account → Complete Profile 
                    → Submit for Verification → Approved → Live in Directory
```

### 5.3 Non-PI Practitioner: Get Listed
```
Landing → "Get Listed" → Sign Up → Complete Profile → Upload Credentials 
       → Submit for Verification → Admin Review → Approved → Live in Directory
```

---

## 6. Content Requirements

### Landing Page
- Clear "for health professionals" positioning
- Search box prominent
- Value props for referring clinicians
- "Get listed" CTA for APs

### How to Refer Guide
- General referral process
- What information to include
- What to tell patients
- Links to downloadable referral templates

### For Practitioners Page
- Benefits of being listed
- How verification works
- PI graduate automatic listing
- Profile best practices

---

## 7. Technical Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 14+ (App Router) |
| Styling | Tailwind CSS |
| Components | shadcn/ui (from findpat) |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Hosting | Vercel |
| Domain | apconnect.com.au |

---

## 8. MVP Scope

### In Scope
- [ ] Directory search with filters
- [ ] Practitioner profiles
- [ ] Practitioner dashboard (profile edit)
- [ ] Basic auth (email/password)
- [ ] Admin verification workflow
- [ ] PI training auto-population (manual for MVP)

### Out of Scope (v1)
- Consumer-facing features
- Referral submission through platform
- Certificate validation for public
- Paid tiers
- Reviews/ratings
- Booking integration
- API access

---

## 9. Success Metrics

### Launch (Month 1)
- 20+ APs listed
- 100+ directory searches
- All PI psychiatrist graduates onboarded

### Growth (Month 3)
- 50+ APs listed
- 500+ monthly searches
- Referrals happening (qualitative feedback)

### Scale (Month 6)
- 100+ APs listed
- GP awareness growing
- Integrated into PI training value prop

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Not enough APs to list | Seed with PI graduates, reach out to known APs |
| GPs don't know about it | Partner with PI for promotion, GP education |
| TGA compliance concerns | Legal review of all public-facing copy |
| Verification bottleneck | Clear process, admin tooling, prioritize PI graduates |

---

## 11. Launch Plan

### Phase 1: Build (Weeks 1-4)
- [ ] Set up project (Next.js + Supabase)
- [ ] Adapt UI components from findpat
- [ ] Build search + profiles
- [ ] Build practitioner dashboard
- [ ] Admin verification tools

### Phase 2: Seed (Weeks 5-6)
- [ ] Onboard first PI graduates
- [ ] Manual outreach to known APs
- [ ] Test referral flows

### Phase 3: Launch (Weeks 7-8)
- [ ] Announce to PI network
- [ ] Promote to GP channels
- [ ] Collect feedback, iterate

---

*Product spec version: 1.0*
*Focus: MVP for Australian clinician-to-clinician AP referrals*
