# AP Connect - Project Overview

> Authorised Prescriber Referral Network for Psychedelic Institute Australia

## Summary

AP Connect is a clinician-to-clinician directory connecting **referring clinicians** (GPs, psychologists, psychiatrists) with **trained Authorised Prescribers** who can assess and treat patients with treatment-resistant depression (TRD) and PTSD.

**Replaces:** Pathfinder (restructured for TGA compliance)

---

## Strategic Value

### For Psychedelic Institute Australia
- Creates direct value proposition for training programs (complete training → get listed)
- Establishes PI as the central hub in the Australian PAT ecosystem
- Builds network effects (more practitioners → more referrals → more training demand)
- 100% TGA compliant (B2B, health professional to health professional)

### For Practitioners (Listed)
- Receive qualified referrals from GPs and psychologists
- Professional visibility within the clinical community
- Credential verification (training, AP status)

### For Referring Clinicians (Users)
- Find verified, trained Authorised Prescribers for their patients
- Filter by location, conditions, availability, funding options
- Streamlined referral process

---

## Target Users

### Primary: Referring Clinicians
- General Practitioners (GPs)
- Psychologists
- Psychiatrists (non-AP)
- Mental health nurses
- Other allied health professionals

### Listed: Authorised Prescribers
- Psychiatrists with TGA Authorised Prescriber status
- Completed PI training (CPAT, PAT, or upcoming psychiatrist program)
- Optionally: other approved training pathways

---

## Core Features

### 1. Practitioner Directory
- Searchable database of Authorised Prescribers
- Filter by:
  - Location / State / Telehealth available
  - Conditions treated (TRD, PTSD)
  - Training credentials
  - Funding accepted (Medicare, DVA, NDIS, Private)
  - Waitlist status (accepting new patients Y/N)
  - Languages spoken

### 2. Practitioner Profiles
- Name, qualifications, clinic name
- Location(s) and contact details
- Training credentials (PI program completed, year)
- TGA AP status (verified)
- Conditions treated
- Treatment approach / philosophy (optional)
- Referral process instructions

### 3. Referral Pathway
- Clear instructions for how to refer a patient
- Downloadable referral form templates
- Direct contact or referral submission (optional)

### 4. Verification System
- AHPRA registration check
- PI training completion verification (automatic for PI graduates)
- TGA AP status verification

### 5. Access Control
- Option A: Open access, clearly framed as "for health professionals"
- Option B: Gated access requiring AHPRA number or professional registration
- Option C: Hybrid - basic directory open, detailed profiles/contact gated

---

## Integration with PI Training

### Psychiatrist Training Program (launching)
- Complete training → automatic eligibility for AP Connect listing
- Listing included as part of training package (or add-on)
- Profile setup as part of graduation process

### Existing Programs (CPAT, PAT)
- Graduates who become APs can apply for listing
- Training credential displayed on profile
- Alumni network integration

### Value Proposition
> "Complete your PI training and join Australia's premier Authorised Prescriber referral network"

---

## Data Model

### Practitioner Record
```
- practitioner_id
- name
- ahpra_number
- qualifications (MBBS, FRANZCP, etc.)
- clinic_name
- clinic_address
- state
- postcode
- phone
- email
- website
- telehealth_available (Y/N)
- conditions_treated (TRD, PTSD, etc.)
- funding_accepted (Medicare, DVA, NDIS, Private)
- accepting_new_patients (Y/N)
- waitlist_weeks (estimated)
- languages
- ap_status (verified Y/N)
- ap_tga_number
- pi_training_completed (program name, year)
- other_training
- bio (optional)
- referral_instructions
- created_at
- updated_at
- status (active, inactive, pending)
```

### Verification Record
```
- practitioner_id
- ahpra_verified (Y/N, date)
- ap_verified (Y/N, date)
- pi_training_verified (Y/N, date, program)
```

---

## Implementation Phases

### Phase 1: Foundation (MVP)
- [ ] Basic directory with search and filters
- [ ] Practitioner profile pages
- [ ] Manual listing management (admin adds practitioners)
- [ ] Simple access (open, with "for health professionals" framing)
- [ ] Integration with PI website

### Phase 2: Self-Service
- [ ] Practitioner self-registration portal
- [ ] Verification workflow (AHPRA, AP status, PI training)
- [ ] Profile edit/update functionality
- [ ] Dashboard for listed practitioners

### Phase 3: Enhanced Features
- [ ] Referral submission system
- [ ] Waitlist/availability real-time updates
- [ ] Analytics for practitioners (profile views, referrals)
- [ ] Integration with PI training graduation workflow

### Phase 4: Consumer Layer (Future)
- [ ] Condition-focused finder for patients
- [ ] "Request consultation" flow
- [ ] Same practitioner database, different front-end
- [ ] Additional TGA compliance review required

---

## Technical Considerations

### Platform Options
- Built into existing PI website (WordPress? Custom?)
- Standalone microsite (ap-connect.com.au or similar)
- Subdomain (connect.psychedelicinstitute.com.au)

### Tech Stack TBD
- Database: needs to be maintainable, searchable
- Front-end: clean, professional, mobile-responsive
- Admin: easy for PI staff to manage listings
- Future-proof: API-ready for potential integrations

---

## Compliance & Legal

### TGA Compliance
- ✅ B2B / clinician-to-clinician = advertising to health professionals allowed
- ✅ No consumer-facing promotion of prescription medicines
- ✅ Focus on service (consultations) not drugs
- ⚠️ Language review needed before launch

### AHPRA Considerations
- Practitioner profiles must comply with AHPRA advertising guidelines
- No testimonials or claims of superiority
- Qualifications accurately represented

### Privacy
- Practitioner consent for listing
- Clear terms for data use
- Consider what's publicly visible vs gated

---

## Decisions Made

1. **Access model:** Open access with "for clinicians" framing ✅
2. **Listing fee:** Free for all psychiatrists initially. PI graduates always free. Monetize later for other practitioners. ✅
3. **Non-PI trained practitioners:** Yes, include all qualified APs regardless of training source ✅
4. **Referral tracking:** TBD
5. **Domain:** apconnect.com.au ✅

## Open Questions

1. **Referral tracking:** Do we want to track referrals through the platform?
2. **Launch timing:** Align with psychiatrist training program launch?

---

## Project Structure

```
ap-connect/
├── PROJECT.md              ← This file (overview)
├── PRODUCT-SPEC.md         ← Features, flows, scope
├── DATABASE-SCHEMA.md      ← Supabase/PostgreSQL schema
├── app/                    ← Next.js application
│   ├── src/
│   ├── supabase/
│   └── ...
└── (future docs as needed)
```

## Relationship to Practitioner Index

- **findpat/** (Practitioner Index) = Future global consumer platform, kept intact
- **ap-connect/** = Focused Australian clinician-to-clinician MVP
- Shares: Tech stack (Next.js + Supabase), UI components (shadcn/ui)
- Different: Audience, scope, features, monetization

## Next Steps

1. [x] Define scope and decisions
2. [x] Create database schema
3. [x] Create product spec
4. [ ] Register domain (apconnect.com.au)
5. [ ] Set up Next.js project (copy structure from findpat)
6. [ ] Set up Supabase project
7. [ ] Build directory search + profiles
8. [ ] Build practitioner dashboard
9. [ ] Admin verification tools
10. [ ] Onboard first PI graduates
11. [ ] Launch

---

*Document created: 2026-02-17*
*Status: Planning → Ready to Build*
