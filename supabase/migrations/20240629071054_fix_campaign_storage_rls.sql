DROP POLICY "Enable CRUD operations for branch 1ybsm03_0" ON "storage"."objects";
DROP POLICY "Enable CRUD operations for branch 1ybsm03_1" ON "storage"."objects";
DROP POLICY "Enable CRUD operations for branch 1ybsm03_2" ON "storage"."objects";
DROP POLICY "Enable CRUD operations for branch 1ybsm03_3" ON "storage"."objects";

CREATE POLICY "Enable read access for branches"
ON "storage"."objects"
FOR SELECT
TO authenticated
USING (
    (bucket_id = 'campaigns'::text) 
  AND
    EXISTS (
      SELECT 1 FROM "public"."campaigns" 
      WHERE "branch_id" = (SELECT auth.uid())
    )
);


CREATE POLICY "Enable insert access for branches"
ON "storage"."objects"
FOR INSERT
TO authenticated
WITH CHECK (
    (bucket_id = 'campaigns'::text) 
  AND
    EXISTS (
      SELECT 1 FROM "public"."brand_branch" 
      WHERE "id" = (SELECT auth.uid())
    )
);


CREATE POLICY "Enable update operations for branches"
ON "storage"."objects"
FOR UPDATE
TO authenticated
USING (
    (bucket_id = 'campaigns'::text) 
  AND
    EXISTS (
      SELECT 1 FROM "public"."campaigns" 
      WHERE "branch_id" = (SELECT auth.uid())
    )
);


CREATE POLICY "Enable delete operations for branches"
ON "storage"."objects"
FOR DELETE
TO authenticated
USING (
    (bucket_id = 'campaigns'::text) 
  AND
    EXISTS (
      SELECT 1 FROM "public"."campaigns" 
      WHERE "branch_id" = (SELECT auth.uid())
    )
);