-- Task Management App Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    bio TEXT,
    skills TEXT[] NOT NULL DEFAULT '{}',
    location VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    required_skills TEXT[] NOT NULL DEFAULT '{}',
    created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_by_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
CREATE INDEX IF NOT EXISTS idx_tasks_required_skills ON tasks USING GIN(required_skills);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles table
CREATE TRIGGER update_profiles_updated_at 
    BEFORE UPDATE ON profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO profiles (id, name, bio, skills, location) VALUES
    ('550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'Experienced mobile developer passionate about React Native and cross-platform development.', ARRAY['React Native', 'JavaScript', 'TypeScript', 'Mobile Development'], 'San Francisco, CA'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'UI/UX designer with a focus on mobile interfaces and user experience optimization.', ARRAY['UI/UX Design', 'Figma', 'Mobile Design', 'Prototyping'], 'New York, NY'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Mike Chen', 'Full-stack developer specializing in modern web technologies and API development.', ARRAY['Node.js', 'React', 'PostgreSQL', 'API Development'], 'Seattle, WA')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tasks (title, description, category, required_skills, created_by, created_by_name, status) VALUES
    ('React Native Mobile App Development', 'Looking for an experienced React Native developer to build a cross-platform mobile application with modern UI/UX design. The app should include user authentication, real-time features, and integration with REST APIs.', 'Development', ARRAY['React Native', 'JavaScript', 'TypeScript', 'Mobile UI/UX'], '550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'open'),
    ('Logo Design for Tech Startup', 'Need a creative logo designer to create a modern, professional logo for our new tech startup. The design should reflect innovation and reliability while being scalable across different platforms and media.', 'Design', ARRAY['Graphic Design', 'Logo Design', 'Adobe Illustrator', 'Branding'], '550e8400-e29b-41d4-a716-446655440002', 'Mike Chen', 'open'),
    ('Content Writing for Tech Blog', 'Seeking a skilled content writer to create engaging blog posts about technology trends, software development best practices, and industry insights. Must have experience in technical writing.', 'Writing', ARRAY['Content Writing', 'SEO', 'Technology Writing', 'Research'], '550e8400-e29b-41d4-a716-446655440000', 'John Doe', 'in_progress'),
    ('Social Media Marketing Campaign', 'Looking for a social media expert to develop and execute a comprehensive marketing campaign across multiple platforms including Instagram, Twitter, and LinkedIn.', 'Marketing', ARRAY['Social Media Marketing', 'Content Strategy', 'Analytics', 'Campaign Management'], '550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 'open'),
    ('API Development and Integration', 'Need a backend developer to create RESTful APIs and integrate third-party services for our mobile application. Experience with Node.js and PostgreSQL required.', 'Development', ARRAY['Node.js', 'API Development', 'PostgreSQL', 'REST APIs'], '550e8400-e29b-41d4-a716-446655440002', 'Mike Chen', 'completed');

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access on profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on profiles" ON profiles FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Allow public insert access on tasks" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access on tasks" ON tasks FOR UPDATE USING (true);