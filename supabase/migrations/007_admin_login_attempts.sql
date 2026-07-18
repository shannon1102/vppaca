-- Track failed admin login attempts for rate limiting (service role only).
create table if not exists public.admin_login_attempts (
  id bigint generated always as identity primary key,
  ip text not null,
  attempted_at timestamptz not null default now()
);

create index if not exists admin_login_attempts_ip_time_idx
  on public.admin_login_attempts (ip, attempted_at desc);
