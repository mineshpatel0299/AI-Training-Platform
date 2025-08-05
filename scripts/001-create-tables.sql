-- Create users table (Supabase auth handles this, but we need additional fields)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  company TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create training modules table
CREATE TABLE IF NOT EXISTS training_modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  ppt_url TEXT,
  video_url TEXT,
  content JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AI basics videos table
CREATE TABLE IF NOT EXISTS ai_basics_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES training_modules(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percentage INTEGER DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, module_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS certificates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  certificate_data JSONB,
  is_valid BOOLEAN DEFAULT true
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own progress" ON user_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own certificates" ON certificates FOR SELECT USING (auth.uid() = user_id);

-- Public read access for modules and videos
CREATE POLICY "Anyone can view active modules" ON training_modules FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active videos" ON ai_basics_videos FOR SELECT USING (is_active = true);
