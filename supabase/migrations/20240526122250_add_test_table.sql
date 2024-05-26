
create table
  public.test (
    id bigint generated always as identity,
    name text null,
    email text null,
    created_at timestamp with time zone null default now(),
    constraint test_pkey primary key (id)
  ) 