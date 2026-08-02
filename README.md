# Sistem Sekolah - Starter

Starter template: Next.js (TypeScript) + Supabase (Auth + Realtime) for multi-class school system.

What I included:
- SQL schema: sql/schema.sql
- Supabase client helper: lib/supabase.ts
- Basic pages: /login, /dashboard/parent, /dashboard/teacher
- Minimal components: Header, StudentList, AttendanceForm

Quick start
1. Create a Supabase project and copy the Project URL and anon key.
2. Fill .env.local with your keys (see .env.example).
3. Run the SQL in sql/schema.sql in your Supabase SQL editor.
4. Install and run:
   npm install
   npm run dev

Notes
- This is a starter scaffold. You still need to configure RLS policies in Supabase and map auth users to rows in `users` table.
- For production, store service_role key only on server (not in client).
