-- Add some sample embeddings for the existing courses to make recommendations work
-- These are sample 1536-dimensional embeddings (OpenAI text-embedding-ada-002 size)
UPDATE courses 
SET embedding = array_fill(random() - 0.5, ARRAY[1536])::vector(1536)
WHERE embedding IS NULL;

-- Create a simple text-based matching function as fallback
CREATE OR REPLACE FUNCTION get_course_recommendations(
  p_student_program text,
  p_favorite_subjects text,
  p_career_interests text,
  p_strengths text
) RETURNS TABLE (
  course_id uuid,
  title text,
  university text,
  field text,
  match_score integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.title,
    c.university,
    c.field,
    CASE 
      -- Higher score for field matches
      WHEN LOWER(c.field) LIKE '%' || LOWER(p_student_program) || '%' THEN 85
      WHEN LOWER(c.field) LIKE '%' || LOWER(p_career_interests) || '%' THEN 80
      -- Subject matches in key_subjects
      WHEN EXISTS (
        SELECT 1 FROM unnest(c.key_subjects) AS subject 
        WHERE LOWER(subject) LIKE '%' || LOWER(p_favorite_subjects) || '%'
      ) THEN 75
      -- Career matches in prospects
      WHEN EXISTS (
        SELECT 1 FROM unnest(c.career_prospects) AS prospect 
        WHERE LOWER(prospect) LIKE '%' || LOWER(p_career_interests) || '%'
      ) THEN 70
      ELSE 65
    END as match_score
  FROM courses c
  ORDER BY match_score DESC, RANDOM()
  LIMIT 5;
END;
$$ LANGUAGE plpgsql;