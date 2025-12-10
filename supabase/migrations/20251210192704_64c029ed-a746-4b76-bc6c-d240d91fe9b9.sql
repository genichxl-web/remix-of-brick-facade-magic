-- Add INSERT policy for gallery_photos (public access for admin panel)
CREATE POLICY "Anyone can insert gallery photos"
ON public.gallery_photos
FOR INSERT
WITH CHECK (true);

-- Add UPDATE policy for gallery_photos
CREATE POLICY "Anyone can update gallery photos"
ON public.gallery_photos
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Add DELETE policy for gallery_photos
CREATE POLICY "Anyone can delete gallery photos"
ON public.gallery_photos
FOR DELETE
USING (true);