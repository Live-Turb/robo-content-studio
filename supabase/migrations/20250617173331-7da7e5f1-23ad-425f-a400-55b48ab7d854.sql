
-- 1. USERS table with plan limits
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
    daily_generations INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CHARACTERS table (maximum 5 on free plan)
CREATE TABLE public.characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (LENGTH(name) BETWEEN 3 AND 50),
    visual_prompt TEXT NOT NULL CHECK (LENGTH(visual_prompt) <= 1000),
    personality TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_character_name_per_user UNIQUE(user_id, name)
);

-- 3. VIDEOS table with complete metadata
CREATE TABLE public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    character_id UUID REFERENCES public.characters(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration_seconds INT CHECK (duration_seconds IN (8,16,24,32,40,48,56,60)),
    blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
    hashtags JSONB NOT NULL DEFAULT '{"tiktok": [], "instagram": [], "youtube": []}'::jsonb,
    country_code TEXT DEFAULT 'BR',
    content_type TEXT CHECK (content_type IN ('trending','horror','comedy','custom')),
    trending_topic TEXT,
    total_views INT DEFAULT 0,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. METRICS table for performance analysis
CREATE TABLE public.metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
    screenshot_url TEXT NOT NULL,
    platform TEXT CHECK (platform IN ('tiktok','instagram','youtube','kwai')),
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    shares INT DEFAULT 0,
    comments INT DEFAULT 0,
    retention_rate DECIMAL(5,2) DEFAULT 0,
    ai_analysis JSONB DEFAULT '{"strengths": [], "improvements": [], "patterns": []}'::jsonb,
    improvements_applied BOOLEAN DEFAULT false,
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROMPT_TEMPLATES table for customization
CREATE TABLE public.prompt_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    template TEXT NOT NULL,
    variables JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    success_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for characters table
CREATE POLICY "Users can view their own characters" ON public.characters
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own characters" ON public.characters
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own characters" ON public.characters
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own characters" ON public.characters
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for videos table
CREATE POLICY "Users can view videos from their characters" ON public.videos
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.characters 
            WHERE characters.id = videos.character_id 
            AND characters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create videos for their characters" ON public.videos
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.characters 
            WHERE characters.id = videos.character_id 
            AND characters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update videos from their characters" ON public.videos
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.characters 
            WHERE characters.id = videos.character_id 
            AND characters.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete videos from their characters" ON public.videos
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.characters 
            WHERE characters.id = videos.character_id 
            AND characters.user_id = auth.uid()
        )
    );

-- RLS Policies for metrics table
CREATE POLICY "Users can view metrics from their videos" ON public.metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.videos v
            JOIN public.characters c ON c.id = v.character_id
            WHERE v.id = metrics.video_id 
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create metrics for their videos" ON public.metrics
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.videos v
            JOIN public.characters c ON c.id = v.character_id
            WHERE v.id = metrics.video_id 
            AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update metrics from their videos" ON public.metrics
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.videos v
            JOIN public.characters c ON c.id = v.character_id
            WHERE v.id = metrics.video_id 
            AND c.user_id = auth.uid()
        )
    );

-- RLS Policies for prompt_templates table
CREATE POLICY "Users can view their own templates" ON public.prompt_templates
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates" ON public.prompt_templates
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" ON public.prompt_templates
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" ON public.prompt_templates
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update updated_at on all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON public.characters
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prompt_templates_updated_at BEFORE UPDATE ON public.prompt_templates
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_characters_user_id ON public.characters(user_id);
CREATE INDEX idx_characters_active ON public.characters(user_id, is_active);
CREATE INDEX idx_videos_character_id ON public.videos(character_id);
CREATE INDEX idx_videos_status ON public.videos(character_id, status);
CREATE INDEX idx_metrics_video_id ON public.metrics(video_id);
CREATE INDEX idx_prompt_templates_user_id ON public.prompt_templates(user_id, is_active);
