CREATE TABLE public.menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES public.brand_branch(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  image_url TEXT,
  category TEXT NOT NULL,
  position INT NOT NULL
);

ALTER TABLE "public"."menus" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL access for Branches based on id to menus table"
ON "public"."menus"
TO authenticated
USING ( (SELECT auth.uid()) = branch_id ) 
WITH CHECK ( (SELECT auth.uid()) = branch_id );

CREATE POLICY "Enable read access for all users for menus table"
ON "public"."menus"
FOR SELECT
TO anon, authenticated
USING (
  true
);