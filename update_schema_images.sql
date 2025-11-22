-- Migration to support multiple images per event

-- 1. Add the new 'images' column as an array of text
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS images text[];

-- 2. Migrate existing data: move 'image_url' content to the first element of 'images' array
-- This ensures we don't lose any images already set
UPDATE public.events 
SET images = ARRAY[image_url] 
WHERE image_url IS NOT NULL AND images IS NULL;

-- 3. Drop the old 'image_url' column
ALTER TABLE public.events DROP COLUMN IF EXISTS image_url;
