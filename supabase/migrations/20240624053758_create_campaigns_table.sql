CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID REFERENCES public.brand_branch(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  position INT NOT NULL,
  is_favourite BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE "public"."campaigns" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable ALL access for Branches based on id to campaigns table"
ON "public"."campaigns"
TO authenticated
USING ( (SELECT auth.uid()) = branch_id ) 
WITH CHECK ( (SELECT auth.uid()) = branch_id );

CREATE POLICY "Enable read access for all users for campaigns table"
ON "public"."campaigns"
FOR SELECT
TO anon, authenticated
USING (
  true
);