-- Add image_url column to tasks table
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN public.tasks.image_url IS 'Base64 encoded image data or URL to task image';
