CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  branch_id UUID NOT NULL REFERENCES public.brand_branch(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  position SERIAL NOT NULL,
  is_favourite BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER SEQUENCE public.campaigns_position_seq MINVALUE 0;
ALTER SEQUENCE public.campaigns_position_seq RESTART WITH 0;

ALTER TABLE "public"."campaigns" ENABLE ROW LEVEL SECURITY;

create policy "Enable ALL access for Branches based on id to campaigns table"
on "public"."campaigns"
to authenticated
using (
  (branch_id = auth.uid())
)with check (
  (branch_id = auth.uid())
);

CREATE POLICY "Enable read access for all users for campaigns table"
ON "public"."campaigns"
FOR SELECT
TO anon, authenticated
USING (
  true
);