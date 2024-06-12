create policy "Enable CRUD operations for branch 1pset0_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'menus'::text));


create policy "Enable CRUD operations for branch 1pset0_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'menus'::text));


create policy "Enable CRUD operations for branch 1pset0_2"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'menus'::text));


create policy "Enable CRUD operations for branch 1pset0_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'menus'::text));


create policy "Enable CRUD operations for branch 1ybsm03_0"
on "storage"."objects"
as permissive
for select
to authenticated
using ((bucket_id = 'campaigns'::text));


create policy "Enable CRUD operations for branch 1ybsm03_1"
on "storage"."objects"
as permissive
for insert
to authenticated
with check ((bucket_id = 'campaigns'::text));


create policy "Enable CRUD operations for branch 1ybsm03_2"
on "storage"."objects"
as permissive
for update
to authenticated
using ((bucket_id = 'campaigns'::text));


create policy "Enable CRUD operations for branch 1ybsm03_3"
on "storage"."objects"
as permissive
for delete
to authenticated
using ((bucket_id = 'campaigns'::text));


create policy "Public access to campaigns 1ybsm03_0"
on "storage"."objects"
as permissive
for select
to anon
using ((bucket_id = 'campaigns'::text));


create policy "Public access to menus 1pset0_0"
on "storage"."objects"
as permissive
for select
to anon
using ((bucket_id = 'menus'::text));



