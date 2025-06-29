
-- Enable the vector extension for embedding support
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for university courses with their embeddings
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  university TEXT NOT NULL,
  field TEXT NOT NULL,
  description TEXT NOT NULL,
  key_subjects TEXT[] NOT NULL,
  career_prospects TEXT[] NOT NULL,
  entry_requirements TEXT NOT NULL,
  duration TEXT NOT NULL,
  location TEXT NOT NULL,
  average_salary TEXT NOT NULL,
  employment_rate TEXT NOT NULL,
  embedding VECTOR(3072), -- OpenAI text-embedding-3-large produces 3072-dimensional vectors
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for student questionnaire responses
CREATE TABLE public.student_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  current_program TEXT NOT NULL,
  favorite_subjects TEXT NOT NULL,
  difficult_subjects TEXT NOT NULL,
  strengths TEXT NOT NULL,
  task_preference TEXT NOT NULL,
  career_interests TEXT NOT NULL,
  embedding VECTOR(3072),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for course recommendations
CREATE TABLE public.recommendations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_response_id UUID REFERENCES public.student_responses(id) NOT NULL,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  similarity_score FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (making these tables public for now since no auth is implemented)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (you may want to restrict these later)
CREATE POLICY "Public can view courses" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public can insert courses" ON public.courses FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view student responses" ON public.student_responses FOR SELECT USING (true);
CREATE POLICY "Public can insert student responses" ON public.student_responses FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can view recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Public can insert recommendations" ON public.recommendations FOR INSERT WITH CHECK (true);

-- Insert sample course data
INSERT INTO public.courses (title, university, field, description, key_subjects, career_prospects, entry_requirements, duration, location, average_salary, employment_rate) VALUES
('Computer Science', 'University of Technology', 'Technology', 'Comprehensive program covering software development, algorithms, data structures, and emerging technologies.', ARRAY['Programming', 'Data Structures', 'Machine Learning', 'Software Engineering'], ARRAY['Software Developer', 'Data Scientist', 'AI Engineer', 'System Architect'], 'Mathematics, Physics, English', '4 years', 'City Campus', '$75,000 - $120,000', '92%'),
('Business Administration', 'Metropolitan University', 'Business', 'Strategic business management program with focus on leadership, finance, and entrepreneurship.', ARRAY['Management', 'Finance', 'Marketing', 'Business Strategy'], ARRAY['Business Manager', 'Consultant', 'Entrepreneur', 'Financial Analyst'], 'Mathematics, English, Economics', '3 years', 'Downtown Campus', '$60,000 - $95,000', '87%'),
('Biomedical Engineering', 'Science & Technology Institute', 'Engineering', 'Interdisciplinary program combining engineering principles with biological sciences.', ARRAY['Biology', 'Engineering Design', 'Medical Devices', 'Biotechnology'], ARRAY['Biomedical Engineer', 'Medical Device Designer', 'Research Scientist'], 'Mathematics, Physics, Biology, Chemistry', '4 years', 'Research Campus', '$70,000 - $110,000', '89%'),
('Digital Marketing', 'Creative Arts University', 'Marketing', 'Modern marketing program focusing on digital strategies, social media, and brand management.', ARRAY['Digital Marketing', 'Social Media Strategy', 'Analytics', 'Brand Management'], ARRAY['Digital Marketer', 'Social Media Manager', 'Brand Strategist', 'Marketing Analyst'], 'English, Mathematics, Art/Design (preferred)', '3 years', 'Creative Campus', '$45,000 - $80,000', '85%'),
('Psychology', 'Liberal Arts College', 'Social Sciences', 'Study of human behavior, mental processes, and therapeutic approaches.', ARRAY['Cognitive Psychology', 'Clinical Psychology', 'Research Methods', 'Statistics'], ARRAY['Clinical Psychologist', 'Counselor', 'Research Psychologist', 'HR Specialist'], 'English, Biology, Mathematics', '4 years', 'Main Campus', '$50,000 - $85,000', '78%');
