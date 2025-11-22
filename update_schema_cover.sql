-- Add cover_image column for the main event image
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS cover_image text;
