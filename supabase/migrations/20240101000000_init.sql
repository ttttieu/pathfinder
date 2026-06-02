-- PathFinder MVP — initial schema
-- Run: supabase db push  OR  paste into Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ─── students ────────────────────────────────────────────────────────────────
create table if not exists students (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  email       text not null unique,
  name        text,
  phone       text,
  grade       text not null,
  school      text,
  province    text
);

-- ─── assessments ─────────────────────────────────────────────────────────────
create table if not exists assessments (
  id                  uuid primary key default gen_random_uuid(),
  created_at          timestamptz not null default now(),
  student_id          uuid not null references students(id) on delete cascade,
  competency_scores   jsonb not null default '{}',
  subject_scores      jsonb not null default '{}',
  selected_electives  text[] not null default '{}',
  open_paths          text[] not null default '{}',
  restricted_paths    text[] not null default '{}',
  strengths           text[] not null default '{}',
  insights            text[] not null default '{}'
);

create index if not exists assessments_student_id_idx on assessments(student_id);
create index if not exists assessments_created_at_idx on assessments(created_at desc);

-- ─── Row-Level Security ───────────────────────────────────────────────────────
-- Public: no direct read (all access via service role in API routes)
alter table students    enable row level security;
alter table assessments enable row level security;

-- Deny everything via anon key
create policy "deny_all_students"    on students    for all to anon using (false);
create policy "deny_all_assessments" on assessments for all to anon using (false);

-- ─── Optional: majors & subjects (for admin panel edits) ─────────────────────
create table if not exists majors (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null unique,
  description         text,
  required_subjects   text[] not null default '{}',
  bonus_subjects      text[] not null default '{}',
  active              boolean not null default true,
  created_at          timestamptz not null default now()
);

-- Seed initial majors from knowledge graph
insert into majors (name, description, required_subjects, bonus_subjects) values
  ('Khoa học máy tính / CNTT',        'Lập trình, phần mềm, hệ thống',            '{INFORMATICS}',            '{PHYSICS,MATH,TECHNOLOGY}'),
  ('AI / Khoa học dữ liệu',           'Machine learning, phân tích dữ liệu',       '{INFORMATICS}',            '{PHYSICS,MATH}'),
  ('Kỹ thuật điện / Tự động hóa',     'Điện tử, robot, hệ thống nhúng',           '{PHYSICS}',                '{INFORMATICS,TECHNOLOGY,MATH}'),
  ('Kiến trúc / Xây dựng',            'Thiết kế công trình, kết cấu',              '{PHYSICS}',                '{MATH,ARTS}'),
  ('Kinh tế / Quản trị kinh doanh',   'Tài chính, marketing, quản lý',            '{CIVICS}',                 '{MATH,ENGLISH,GEOGRAPHY}'),
  ('Luật',                             'Pháp lý, tư vấn, hành chính',              '{CIVICS}',                 '{HISTORY,LITERATURE,ENGLISH}'),
  ('Y khoa',                           'Bác sĩ đa khoa, chuyên khoa',              '{BIOLOGY,CHEMISTRY}',      '{PHYSICS,MATH}'),
  ('Dược học',                         'Dược sĩ, nghiên cứu thuốc',                '{CHEMISTRY,BIOLOGY}',      '{MATH}'),
  ('Công nghệ sinh học',               'Di truyền, sinh học phân tử',              '{BIOLOGY,CHEMISTRY}',      '{INFORMATICS,MATH}'),
  ('Du lịch / Địa lý học',            'Quản lý du lịch, quy hoạch vùng',          '{GEOGRAPHY}',              '{HISTORY,ENGLISH,CIVICS}'),
  ('Âm nhạc / Nghệ thuật biểu diễn',  'Thanh nhạc, nhạc cụ, sáng tác',            '{MUSIC}',                  '{ARTS}'),
  ('Mỹ thuật / Thiết kế đồ họa',      'UX/UI, truyền thông thị giác',             '{ARTS}',                   '{MUSIC,INFORMATICS}'),
  ('Nông nghiệp / Môi trường',         'Nông nghiệp công nghệ cao, môi trường',    '{BIOLOGY}',                '{CHEMISTRY,GEOGRAPHY}'),
  ('Công nghệ thực phẩm',             'Chế biến, kiểm soát chất lượng thực phẩm', '{CHEMISTRY,BIOLOGY}',      '{TECHNOLOGY,MATH}')
on conflict (name) do nothing;
