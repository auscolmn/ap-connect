-- AP Connect Initial Database Schema
-- Version: 1.0

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- CORE TABLES
-- ===========================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email           VARCHAR(255) NOT NULL UNIQUE,
    email_verified  BOOLEAN DEFAULT FALSE,
    role            VARCHAR(50) NOT NULL DEFAULT 'practitioner',
    
    -- AHPRA Verification
    ahpra_number    VARCHAR(50),
    ahpra_verified  BOOLEAN DEFAULT FALSE,
    ahpra_verified_at TIMESTAMPTZ,
    
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ,
    
    CONSTRAINT valid_role CHECK (role IN ('practitioner', 'admin', 'referrer'))
);

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_ahpra ON public.users(ahpra_number);
CREATE INDEX idx_users_role ON public.users(role);

-- Practitioners table
CREATE TABLE public.practitioners (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    
    -- Identity
    slug                VARCHAR(100) NOT NULL UNIQUE,
    title               VARCHAR(20),  -- 'Dr', 'Prof', 'A/Prof'
    first_name          VARCHAR(100) NOT NULL,
    last_name           VARCHAR(100) NOT NULL,
    photo_url           VARCHAR(500),
    bio                 TEXT,
    
    -- Professional
    ahpra_number        VARCHAR(50) NOT NULL,
    qualifications      TEXT[] DEFAULT '{}',
    
    -- Authorised Prescriber Status
    ap_status           VARCHAR(50) DEFAULT 'pending',
    ap_tga_number       VARCHAR(100),
    ap_verified_at      TIMESTAMPTZ,
    ap_conditions       TEXT[] DEFAULT '{}',
    ap_substances       TEXT[] DEFAULT '{}',
    
    -- Practice Details
    clinic_name         VARCHAR(255),
    website             VARCHAR(500),
    contact_email       VARCHAR(255),
    contact_phone       VARCHAR(50),
    
    -- Availability
    accepting_patients  BOOLEAN DEFAULT TRUE,
    waitlist_weeks      INTEGER,
    telehealth          BOOLEAN DEFAULT FALSE,
    
    -- Funding Accepted
    funding_medicare    BOOLEAN DEFAULT FALSE,
    funding_dva         BOOLEAN DEFAULT FALSE,
    funding_ndis        BOOLEAN DEFAULT FALSE,
    funding_private     BOOLEAN DEFAULT TRUE,
    funding_workcover   BOOLEAN DEFAULT FALSE,
    
    -- Referral Info
    referral_process    TEXT,
    referral_form_url   VARCHAR(500),
    referral_email      VARCHAR(255),
    referral_phone      VARCHAR(50),
    
    -- Profile Status
    profile_status      VARCHAR(50) DEFAULT 'draft',
    profile_completeness INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_ap_status CHECK (ap_status IN ('pending', 'verified', 'inactive')),
    CONSTRAINT valid_profile_status CHECK (profile_status IN ('draft', 'active', 'suspended')),
    CONSTRAINT unique_user UNIQUE (user_id)
);

CREATE INDEX idx_practitioners_slug ON public.practitioners(slug);
CREATE INDEX idx_practitioners_user ON public.practitioners(user_id);
CREATE INDEX idx_practitioners_status ON public.practitioners(profile_status, ap_status);
CREATE INDEX idx_practitioners_conditions ON public.practitioners USING GIN(ap_conditions);
CREATE INDEX idx_practitioners_search_name ON public.practitioners 
    USING GIN(to_tsvector('english', first_name || ' ' || last_name || ' ' || COALESCE(clinic_name, '')));

-- Practitioner Locations
CREATE TABLE public.practitioner_locations (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id     UUID NOT NULL REFERENCES public.practitioners(id) ON DELETE CASCADE,
    
    name                VARCHAR(255),
    address             VARCHAR(500),
    suburb              VARCHAR(100),
    state               VARCHAR(10) NOT NULL,
    postcode            VARCHAR(10),
    
    latitude            DECIMAL(10, 8),
    longitude           DECIMAL(11, 8),
    
    is_primary          BOOLEAN DEFAULT FALSE,
    
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_locations_practitioner ON public.practitioner_locations(practitioner_id);
CREATE INDEX idx_locations_state ON public.practitioner_locations(state);
CREATE INDEX idx_locations_postcode ON public.practitioner_locations(postcode);

-- Training Records
CREATE TABLE public.training_records (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    practitioner_id     UUID NOT NULL REFERENCES public.practitioners(id) ON DELETE CASCADE,
    
    provider            VARCHAR(100) NOT NULL,
    program             VARCHAR(255) NOT NULL,
    completed_at        DATE,
    certificate_id      VARCHAR(100),
    
    verified            BOOLEAN DEFAULT FALSE,
    verified_at         TIMESTAMPTZ,
    verified_by         UUID REFERENCES public.users(id),
    
    is_pi_graduate      BOOLEAN DEFAULT FALSE,
    pi_student_id       VARCHAR(100),
    
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_training_practitioner ON public.training_records(practitioner_id);
CREATE INDEX idx_training_provider ON public.training_records(provider);
CREATE INDEX idx_training_pi ON public.training_records(is_pi_graduate) WHERE is_pi_graduate = TRUE;

-- Lookup Tables
CREATE TABLE public.conditions (
    id              VARCHAR(50) PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    display_order   INTEGER DEFAULT 0
);

CREATE TABLE public.states (
    code            VARCHAR(10) PRIMARY KEY,
    name            VARCHAR(100) NOT NULL,
    display_order   INTEGER DEFAULT 0
);

-- ===========================================
-- SEED DATA
-- ===========================================

INSERT INTO public.conditions (id, name, description, display_order) VALUES
('trd', 'Treatment-Resistant Depression', 'For patients who have not responded adequately to at least two different antidepressant treatments.', 1),
('ptsd', 'Post-Traumatic Stress Disorder', 'For patients with PTSD who have not responded adequately to standard evidence-based treatments.', 2);

INSERT INTO public.states (code, name, display_order) VALUES
('ACT', 'Australian Capital Territory', 1),
('NSW', 'New South Wales', 2),
('NT', 'Northern Territory', 3),
('QLD', 'Queensland', 4),
('SA', 'South Australia', 5),
('TAS', 'Tasmania', 6),
('VIC', 'Victoria', 7),
('WA', 'Western Australia', 8);

-- ===========================================
-- VIEWS
-- ===========================================

CREATE OR REPLACE VIEW public.active_practitioners AS
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
    p.qualifications,
    pl.state,
    pl.suburb,
    pl.postcode,
    array_agg(DISTINCT tr.provider) FILTER (WHERE tr.verified) as training_providers,
    EXISTS(SELECT 1 FROM public.training_records tr2 WHERE tr2.practitioner_id = p.id AND tr2.is_pi_graduate AND tr2.verified) as pi_trained
FROM public.practitioners p
LEFT JOIN public.practitioner_locations pl ON p.id = pl.practitioner_id AND pl.is_primary = TRUE
LEFT JOIN public.training_records tr ON p.id = tr.practitioner_id
WHERE p.profile_status = 'active'
  AND p.ap_status = 'verified'
GROUP BY p.id, pl.state, pl.suburb, pl.postcode;

-- ===========================================
-- FUNCTIONS
-- ===========================================

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, role)
    VALUES (NEW.id, NEW.email, 'practitioner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_practitioners_updated_at
    BEFORE UPDATE ON public.practitioners
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Generate unique slug from name
CREATE OR REPLACE FUNCTION public.generate_practitioner_slug(p_first_name VARCHAR, p_last_name VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
    base_slug VARCHAR;
    final_slug VARCHAR;
    counter INTEGER := 0;
BEGIN
    base_slug := lower(regexp_replace(p_first_name || '-' || p_last_name, '[^a-zA-Z0-9-]', '', 'g'));
    final_slug := base_slug;
    
    WHILE EXISTS(SELECT 1 FROM public.practitioners WHERE slug = final_slug) LOOP
        counter := counter + 1;
        final_slug := base_slug || '-' || counter;
    END LOOP;
    
    RETURN final_slug;
END;
$$ LANGUAGE plpgsql;

-- Add PI graduate (for integration with PI training system)
CREATE OR REPLACE FUNCTION public.add_pi_graduate(
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
    -- Get existing user or return error (they must sign up first)
    SELECT id INTO v_user_id FROM public.users WHERE email = p_email;
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User with email % not found. User must sign up first.', p_email;
    END IF;
    
    -- Create or update practitioner
    INSERT INTO public.practitioners (
        user_id, first_name, last_name, ahpra_number,
        slug, profile_status
    )
    VALUES (
        v_user_id, p_first_name, p_last_name, p_ahpra_number,
        public.generate_practitioner_slug(p_first_name, p_last_name),
        'draft'
    )
    ON CONFLICT (user_id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = NOW()
    RETURNING id INTO v_practitioner_id;
    
    -- Add training record (auto-verified for PI graduates)
    INSERT INTO public.training_records (
        practitioner_id, provider, program, completed_at,
        is_pi_graduate, pi_student_id, verified, verified_at
    )
    VALUES (
        v_practitioner_id, 'Psychedelic Institute Australia', p_program, p_completed_at,
        TRUE, p_student_id, TRUE, NOW()
    )
    ON CONFLICT DO NOTHING;
    
    RETURN v_practitioner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate profile completeness
CREATE OR REPLACE FUNCTION public.calculate_profile_completeness(p_practitioner_id UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    total INTEGER := 0;
    p RECORD;
    has_location BOOLEAN;
    has_training BOOLEAN;
BEGIN
    SELECT * INTO p FROM public.practitioners WHERE id = p_practitioner_id;
    
    IF p IS NULL THEN RETURN 0; END IF;
    
    -- Check each field and add to score
    total := 14; -- Number of fields we check
    
    IF p.first_name IS NOT NULL AND p.first_name != '' THEN score := score + 1; END IF;
    IF p.last_name IS NOT NULL AND p.last_name != '' THEN score := score + 1; END IF;
    IF p.ahpra_number IS NOT NULL AND p.ahpra_number != '' THEN score := score + 1; END IF;
    IF p.title IS NOT NULL THEN score := score + 1; END IF;
    IF p.bio IS NOT NULL AND length(p.bio) > 50 THEN score := score + 1; END IF;
    IF p.clinic_name IS NOT NULL THEN score := score + 1; END IF;
    IF p.contact_email IS NOT NULL THEN score := score + 1; END IF;
    IF p.contact_phone IS NOT NULL THEN score := score + 1; END IF;
    IF array_length(p.ap_conditions, 1) > 0 THEN score := score + 1; END IF;
    IF array_length(p.qualifications, 1) > 0 THEN score := score + 1; END IF;
    IF p.referral_process IS NOT NULL AND length(p.referral_process) > 20 THEN score := score + 1; END IF;
    
    -- Check for locations
    SELECT EXISTS(SELECT 1 FROM public.practitioner_locations WHERE practitioner_id = p_practitioner_id) INTO has_location;
    IF has_location THEN score := score + 1; END IF;
    
    -- Check for training
    SELECT EXISTS(SELECT 1 FROM public.training_records WHERE practitioner_id = p_practitioner_id) INTO has_training;
    IF has_training THEN score := score + 1; END IF;
    
    -- AP verification counts double
    IF p.ap_status = 'verified' THEN score := score + 1; END IF;
    
    RETURN ROUND((score::FLOAT / total::FLOAT) * 100)::INTEGER;
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practitioner_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_records ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid() = id);

-- Practitioners policies (public viewing of active profiles)
CREATE POLICY "Anyone can view active practitioners"
    ON public.practitioners FOR SELECT
    USING (profile_status = 'active' AND ap_status = 'verified');

CREATE POLICY "Practitioners can view own profile"
    ON public.practitioners FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Practitioners can insert own profile"
    ON public.practitioners FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Practitioners can update own profile"
    ON public.practitioners FOR UPDATE
    USING (user_id = auth.uid());

-- Admin full access
CREATE POLICY "Admins have full access to users"
    ON public.users FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins have full access to practitioners"
    ON public.practitioners FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Locations policies
CREATE POLICY "Anyone can view locations of active practitioners"
    ON public.practitioner_locations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.practitioners p
            WHERE p.id = practitioner_id
            AND (p.profile_status = 'active' OR p.user_id = auth.uid())
        )
    );

CREATE POLICY "Practitioners can manage own locations"
    ON public.practitioner_locations FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.practitioners
            WHERE id = practitioner_id AND user_id = auth.uid()
        )
    );

-- Training policies
CREATE POLICY "Anyone can view verified training of active practitioners"
    ON public.training_records FOR SELECT
    USING (
        verified = TRUE OR
        EXISTS (
            SELECT 1 FROM public.practitioners
            WHERE id = practitioner_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Practitioners can view own training"
    ON public.training_records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.practitioners
            WHERE id = practitioner_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Practitioners can add training records"
    ON public.training_records FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.practitioners
            WHERE id = practitioner_id AND user_id = auth.uid()
        )
    );

-- Admins can manage training verification
CREATE POLICY "Admins can manage all training records"
    ON public.training_records FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Lookup tables are publicly readable
ALTER TABLE public.conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view conditions"
    ON public.conditions FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view states"
    ON public.states FOR SELECT
    USING (true);

-- ===========================================
-- STORAGE
-- ===========================================

-- Create storage bucket for profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('practitioner-photos', 'practitioner-photos', true)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Practitioners can upload own photos"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'practitioner-photos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view photos"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'practitioner-photos');

CREATE POLICY "Practitioners can update own photos"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'practitioner-photos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Practitioners can delete own photos"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'practitioner-photos' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );
