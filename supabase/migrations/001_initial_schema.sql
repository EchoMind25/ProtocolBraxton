-- ═══════════════════════════════════════════════════════════════
-- PROTOCOL BRAXTON — Initial Schema
-- Run this in Supabase SQL Editor or via supabase db push
-- ═══════════════════════════════════════════════════════════════

-- Programs (top-level container)
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  description text,
  is_template boolean default false,
  meta jsonb default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Program days (Mon-Sun)
create table public.program_days (
  id uuid primary key default gen_random_uuid(),
  program_id uuid references public.programs(id) on delete cascade not null,
  day_number smallint not null check (day_number between 1 and 7),
  name text not null,
  subtitle text,
  day_type text not null check (day_type in ('push','pull','legs','rest','combat','custom')),
  tags text[] default '{}',
  duration_minutes smallint,
  science_notes jsonb default '[]',
  sort_order smallint not null,
  created_at timestamptz default now()
);

-- Program exercises
create table public.program_exercises (
  id uuid primary key default gen_random_uuid(),
  day_id uuid references public.program_days(id) on delete cascade not null,
  section_name text,
  section_range text,
  name text not null,
  targets text,
  sets_prescribed text not null,
  reps_prescribed text,
  rest_seconds smallint,
  tempo text,
  rir smallint,
  coach_notes text,
  coach_source text,
  technique_badge text,
  youtube_query text,
  is_primary boolean default false,
  sort_order smallint not null,
  created_at timestamptz default now()
);

-- Workout sessions (a logged day)
create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  program_day_id uuid references public.program_days(id) not null,
  date date not null default current_date,
  notes text,
  duration_minutes smallint,
  completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Set logs (individual set data)
create table public.set_logs (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.workout_sessions(id) on delete cascade not null,
  exercise_id uuid references public.program_exercises(id) not null,
  set_number smallint not null,
  weight_lbs numeric(6,2),
  reps smallint,
  rpe numeric(3,1),
  rir smallint,
  notes text,
  created_at timestamptz default now()
);

-- Exercise-level notes per session (form cues, pain, general notes)
create table public.exercise_notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.workout_sessions(id) on delete cascade not null,
  exercise_id uuid references public.program_exercises(id) not null,
  notes text not null,
  created_at timestamptz default now()
);

-- ═══════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════

create index idx_program_days_program on public.program_days(program_id);
create index idx_program_exercises_day on public.program_exercises(day_id);
create index idx_workout_sessions_user on public.workout_sessions(user_id);
create index idx_workout_sessions_date on public.workout_sessions(date);
create index idx_set_logs_session on public.set_logs(session_id);
create index idx_set_logs_exercise on public.set_logs(exercise_id);
create index idx_exercise_notes_session on public.exercise_notes(session_id);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ═══════════════════════════════════════════════════════════════

alter table public.programs enable row level security;
alter table public.program_days enable row level security;
alter table public.program_exercises enable row level security;
alter table public.workout_sessions enable row level security;
alter table public.set_logs enable row level security;
alter table public.exercise_notes enable row level security;

-- Programs: users see templates OR their own
create policy "Users can view templates and own programs"
  on public.programs for select
  using (is_template = true or auth.uid() = user_id);

create policy "Users can insert own programs"
  on public.programs for insert
  with check (auth.uid() = user_id);

create policy "Users can update own programs"
  on public.programs for update
  using (auth.uid() = user_id);

-- Program days: accessible if parent program is accessible
create policy "Users can view program days"
  on public.program_days for select
  using (
    exists (
      select 1 from public.programs
      where programs.id = program_days.program_id
      and (programs.is_template = true or programs.user_id = auth.uid())
    )
  );

create policy "Users can modify own program days"
  on public.program_days for all
  using (
    exists (
      select 1 from public.programs
      where programs.id = program_days.program_id
      and programs.user_id = auth.uid()
    )
  );

-- Program exercises: accessible if parent day is accessible
create policy "Users can view program exercises"
  on public.program_exercises for select
  using (
    exists (
      select 1 from public.program_days
      join public.programs on programs.id = program_days.program_id
      where program_days.id = program_exercises.day_id
      and (programs.is_template = true or programs.user_id = auth.uid())
    )
  );

create policy "Users can modify own program exercises"
  on public.program_exercises for all
  using (
    exists (
      select 1 from public.program_days
      join public.programs on programs.id = program_days.program_id
      where program_days.id = program_exercises.day_id
      and programs.user_id = auth.uid()
    )
  );

-- Workout sessions: user owns their data
create policy "Users can view own sessions"
  on public.workout_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own sessions"
  on public.workout_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on public.workout_sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on public.workout_sessions for delete
  using (auth.uid() = user_id);

-- Set logs: accessible if parent session is owned
create policy "Users can view own set logs"
  on public.set_logs for select
  using (
    exists (
      select 1 from public.workout_sessions
      where workout_sessions.id = set_logs.session_id
      and workout_sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert own set logs"
  on public.set_logs for insert
  with check (
    exists (
      select 1 from public.workout_sessions
      where workout_sessions.id = set_logs.session_id
      and workout_sessions.user_id = auth.uid()
    )
  );

create policy "Users can update own set logs"
  on public.set_logs for update
  using (
    exists (
      select 1 from public.workout_sessions
      where workout_sessions.id = set_logs.session_id
      and workout_sessions.user_id = auth.uid()
    )
  );

create policy "Users can delete own set logs"
  on public.set_logs for delete
  using (
    exists (
      select 1 from public.workout_sessions
      where workout_sessions.id = set_logs.session_id
      and workout_sessions.user_id = auth.uid()
    )
  );

-- Exercise notes: same pattern
create policy "Users can view own exercise notes"
  on public.exercise_notes for select
  using (
    exists (
      select 1 from public.workout_sessions
      where workout_sessions.id = exercise_notes.session_id
      and workout_sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert own exercise notes"
  on public.exercise_notes for insert
  with check (
    exists (
      select 1 from public.workout_sessions
      where workout_sessions.id = exercise_notes.session_id
      and workout_sessions.user_id = auth.uid()
    )
  );

create policy "Users can manage own exercise notes"
  on public.exercise_notes for all
  using (
    exists (
      select 1 from public.workout_sessions
      where workout_sessions.id = exercise_notes.session_id
      and workout_sessions.user_id = auth.uid()
    )
  );

-- ═══════════════════════════════════════════════════════════════
-- UPDATED_AT TRIGGER
-- ═══════════════════════════════════════════════════════════════

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_programs_updated
  before update on public.programs
  for each row execute function public.handle_updated_at();

create trigger on_workout_sessions_updated
  before update on public.workout_sessions
  for each row execute function public.handle_updated_at();
