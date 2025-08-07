-- Create code_shares table for storing shared code snippets
CREATE TABLE public.code_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL,
  filename TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.code_shares ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read shared code (public sharing)
CREATE POLICY "Anyone can view shared code" 
ON public.code_shares 
FOR SELECT 
USING (true);

-- Create policy to allow anyone to create new shared code
CREATE POLICY "Anyone can create shared code" 
ON public.code_shares 
FOR INSERT 
WITH CHECK (true);