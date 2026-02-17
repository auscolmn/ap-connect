# AP Connect — Database Schema

## Overview

PostgreSQL-based schema (Supabase) optimized for:
- Australian Authorised Prescriber directory
- Clinician-to-clinician referrals
- PI training integration
- Fast geographic/filter search

---

## Entity Relationship Diagram

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────────┐
│     Users       │       │   Practitioners  │       │    Training     │
│─────────────────│       │──────────────────│       │─────────────────│
│ id              │──────<│ user_id          │       │ id              │
│ email           │       │ id               │──────<│ practitioner_id │
│ role            │       │ name             │       │ provider        │
│ ahpra_verified  │       │ ahpra_number     │       │ program         │
│ created_at      │       │ ap_status        │       │ completed_at    │
└─────────────────┘       │ conditions[]     │       │ verified        │
                          │ funding[]        │       └─────────────────┘
                          │ locations[]      │
                          └──────────────────┘
```

---

## Core Tables

### users

Authentication and access control.

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    email_verified  BOOLEAN DEFAULT FALSE,
    role            VARCHAR(50) NOT NULL DEFAULT 'practitioner',
                    -- 'practitioner', 'admin', 'referrer'
    
    -- Verification
    ahpra_number    VARCHAR(50),
    ahpra_verified  BOOLEAN DEFAULT FALSE,
    ahpra_verified_at TIMESTAMPTZ,
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ,
    
    CONSTRAINT valid_role CHECK (role IN ('practitioner', 'admin', 'referrer'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_ahpra ON users(ahpra_number);
```

### practitioners

Authorised Prescriber profiles.

```sql
CREATE TABLE practitioners (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Identity
    slug                VARCHAR(100) NOT NULL UNIQUE,
    title               VARCHAR(20),  -- 'Dr', 'Prof', 'A/Prof'
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    photo_url           VARCHAR(500),
    bio                 TEXT,
    
    -- Professional
    ahpra_number        VARCHAR(50) NOT NULL,
    qualifications      TEXT[],  -- ['MBBS', 'FRANZCP', 'PhD']
    
    -- Authorised Prescriber Status
    ap_status           VARCHAR(50) DEFAULT 'pending',
                        -- 'pending', 'verified', 'inactive'
    ap_tga_number       VARCHAR(100),
    ap_verified_at      TIMESTAMPTZ,
    ap_conditions       TEXT[],  -- ['TRD', 'PTSD']
    ap_substances       TEXT[],  -- ['psilocybin', 'MDMA']
    
    -- Practice Details
    clinic_name         VARCHAR(255),
    website             VARCHAR(500),
    contact_email       VARCHAR(255),
    contact_phone       VARCHAR(50),
    
    -- Availability
    accepting_patients  BOOLEAN DEFAULT TRUE,
    waitlist_weeks      INTEGER,  -- estimated wait in weeks
    telehealth          BOOLEAN DEFAULT FALSE,
    
    -- Funding Accepted
    funding_medicare    BOOLEAN DEFAULT FALSE,
    funding_dva         BOOLEAN DEFAULT FALSE,
    funding_ndis        BOOLEAN DEFAULT FALSE,
    funding_private     BOOLEAN DEFAULT TRUE,
    funding_workcover   BOOLEAN DEFAULT FALSE,
    
    -- Referral Info
    referral_process    TEXT,  -- How to refer a patient
    referral_form_url   VARCHAR(500),
    referral_email      VARCHAR(255),
    referral_phone      VARCHAR(50),
    
    -- Profile Status
    profile_status      VARCHAR(50) DEFAULT 'draft',
                        -- 'draft', 'active', 'suspended'
    profile_completeness INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_ap_status CHECK (ap_status IN ('pending', 'verified', 'inactive')),
    CONSTRAINT valid_profile_status CHECK (profile_status IN ('draft', 'active', 'suspended')),
    CONSTRAINT unique_user UNIQUE (user_id)
);

CREATE INDEX idx_practitioners_slug ON practitioners(slug);
CREATE INDEX idx_practitioners_status ON practitioners(profile_status, ap_status);
CREATE INDEX idx_practitioners_conditions ON practitioners USING GIN(ap_conditions);
```

### practitioner_locations

Multiple practice locations per practitioner.

```sql
CREATE TABLE practitioner_locations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id     UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
    
    -- Location
    name                VARCHAR(255),  -- 'Main Practice', 'Tuesday Clinic'
    address             VARCHAR(500),
    suburb              VARCHAR(100),
    state               VARCHAR(10) NOT NULL,  -- 'VIC', 'NSW', 'QLD', etc.
    postcode            VARCHAR(10),
    
    -- Coordinates (for map/distance search)
    latitude            DECIMAL(10, 8),
    longitude           DECIMAL(11, 8),
    
    is_primary          BOOLEAN DEFAULT FALSE,
    
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_practitioner ON practitioner_locations(practitioner_id);
CREATE INDEX idx_locations_state ON practitioner_locations(state);
CREATE INDEX idx_locations_postcode ON practitioner_locations(postcode);
```

### training_records

Training credentials (PI and others).

```sql
CREATE TABLE training_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id     UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
    
    -- Training Details
    provider            VARCHAR(100) NOT NULL,  -- 'PI', 'Mind Medicine Australia', 'MAPS', etc.
    program             VARCHAR(255) NOT NULL,  -- 'PAT Program', 'CPAT', 'Psychiatrist Training'
    completed_at        DATE,
    certificate_id      VARCHAR(100),  -- External certificate reference
    
    -- Verification
    verified            BOOLEAN DEFAULT FALSE,
    verified_at         TIMESTAMPTZ,
    verified_by         UUID REFERENCES users(id),
    
    -- PI Integration
    is_pi_graduate      BOOLEAN DEFAULT FALSE,
    pi_student_id       VARCHAR(100),
    
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_practitioner ON training_records(practitioner_id);
CREATE INDEX idx_training_provider ON training_records(provider);
CREATE INDEX idx_training_pi ON training_records(is_pi_graduate) WHERE is_pi_graduate = TRUE;
```

### conditions_treated

Standardized conditions lookup.

```sql
CREATE TABLE conditions (
    id          VARCHAR(50) PRIMARY KEY,  -- 'trd', 'ptsd'
    name        VARCHAR(255) NOT NULL,    -- 'Treatment-Resistant Depression'
    description TEXT,
    display_order INTEGER DEFAULT 0
);

-- Seed data
INSERT INTO conditions (id, name, display_order) VALUES
('trd', 'Treatment-Resistant Depression', 1),
('ptsd', 'Post-Traumatic Stress Disorder', 2);
```

### states

Australian states lookup.

```sql
CREATE TABLE states (
    code        VARCHAR(10) PRIMARY KEY,  -- 'VIC', 'NSW'
    name        VARCHAR(100) NOT NULL,    -- 'Victoria', 'New South Wales'
    display_order INTEGER DEFAULT 0
);

-- Seed data
INSERT INTO states (code, name, display_order) VALUES
('ACT', 'Australian Capital Territory', 1),
('NSW', 'New South Wales', 2),
('NT', 'Northern Territory', 3),
('QLD', 'Queensland', 4),
('SA', 'South Australia', 5),
('TAS', 'Tasmania', 6),
('VIC', 'Victoria', 7),
('WA', 'Western Australia', 8);
```

---

## Views

### active_practitioners

Public-facing directory view.

```sql
CREATE VIEW active_practitioners AS
SELECT 
    p.id,
    p.slug,
    p.title,
    p.first_name,
    p.last_name,
    p.photo_url,
    p.clinic_name,
    p.ap_conditions,
    p.accepting_patients,
    p.waitlist_weeks,
    p.telehealth,
    p.funding_medicare,
    p.funding_dva,
    p.funding_ndis,
    p.funding_private,
    pl.state,
    pl.suburb,
    pl.postcode,
    array_agg(DISTINCT tr.provider) FILTER (WHERE tr.verified) as training_providers,
    EXISTS(SELECT 1 FROM training_records tr2 WHERE tr2.practitioner_id = p.id AND tr2.is_pi_graduate) as pi_trained
FROM practitioners p
LEFT JOIN practitioner_locations pl ON p.id = pl.practitioner_id AND pl.is_primary = TRUE
LEFT JOIN training_records tr ON p.id = tr.practitioner_id
WHERE p.profile_status = 'active'
  AND p.ap_status = 'verified'
GROUP BY p.id, pl.state, pl.suburb, pl.postcode;
```

---

## Row Level Security (Supabase)

```sql
-- Practitioners can edit their own profile
ALTER TABLE practitioners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Practitioners can view all active profiles"
ON practitioners FOR SELECT
USING (profile_status = 'active' AND ap_status = 'verified');

CREATE POLICY "Practitioners can edit own profile"
ON practitioners FOR UPDATE
USING (user_id = auth.uid());

-- Admins can do everything
CREATE POLICY "Admins full access"
ON practitioners FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.role = 'admin'
    )
);
```

---

## Migration: PI Training Sync

When PI graduates complete training, sync to AP Connect:

```sql
-- Function to add PI graduate
CREATE OR REPLACE FUNCTION add_pi_graduate(
    p_email VARCHAR,
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_ahpra_number VARCHAR,
    p_program VARCHAR,
    p_completed_at DATE,
    p_student_id VARCHAR
) RETURNS UUID AS $$
DECLARE
    v_user_id UUID;
    v_practitioner_id UUID;
BEGIN
    -- Create or get user
    INSERT INTO users (email, role)
    VALUES (p_email, 'practitioner')
    ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
    RETURNING id INTO v_user_id;
    
    -- Create or get practitioner
    INSERT INTO practitioners (
        user_id, first_name, last_name, ahpra_number,
        slug, profile_status
    )
    VALUES (
        v_user_id, p_first_name, p_last_name, p_ahpra_number,
        lower(p_first_name || '-' || p_last_name || '-' || substr(gen_random_uuid()::text, 1, 8)),
        'draft'
    )
    ON CONFLICT (user_id) DO UPDATE SET updated_at = NOW()
    RETURNING id INTO v_practitioner_id;
    
    -- Add training record
    INSERT INTO training_records (
        practitioner_id, provider, program, completed_at,
        is_pi_graduate, pi_student_id, verified, verified_at
    )
    VALUES (
        v_practitioner_id, 'Psychedelic Institute Australia', p_program, p_completed_at,
        TRUE, p_student_id, TRUE, NOW()
    );
    
    RETURN v_practitioner_id;
END;
$$ LANGUAGE plpgsql;
```

---

## Indexes for Search

```sql
-- Full-text search on practitioner names
CREATE INDEX idx_practitioners_search_name 
ON practitioners 
USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(clinic_name, '')));

-- Geographic search (if using PostGIS)
-- ALTER TABLE practitioner_locations ADD COLUMN location GEOGRAPHY(POINT, 4326);
-- CREATE INDEX idx_locations_geo ON practitioner_locations USING GIST(location);
```

---

*Schema version: 1.0*
*Adapted from Practitioner Index for Australian AP focus*
