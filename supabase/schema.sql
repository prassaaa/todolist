-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'code_review', 'done')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional, configure based on your needs)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your authentication needs)
-- For demo purposes, we'll allow public access. Remove or modify in production!

CREATE POLICY "Enable read access for all users"
    ON public.tasks FOR SELECT
    USING (true);

CREATE POLICY "Enable insert for all users"
    ON public.tasks FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Enable update for all users"
    ON public.tasks FOR UPDATE
    USING (true);

CREATE POLICY "Enable delete for all users"
    ON public.tasks FOR DELETE
    USING (true);

-- Create index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

-- Create index on priority for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);

-- Create index on is_archived for faster filtering
CREATE INDEX IF NOT EXISTS idx_tasks_is_archived ON public.tasks(is_archived);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(created_at DESC);
