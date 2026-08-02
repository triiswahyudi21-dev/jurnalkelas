#!/usr/bin/env node

// scripts/import-data.js
// Simple CSV import script for the starter scaffold.
// It uses the SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
// to perform server-side inserts into the public tables (users, students, parents, classes, enrollments, subjects).

const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment. See .env.example')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function readCsv(filePath) {
  const csv = fs.readFileSync(path.join(__dirname, '..', filePath), 'utf8')
  return parse(csv, { columns: true, skip_empty_lines: true })
}

async function upsertSubject(row) {
  const { code, name } = row
  const { data: existing } = await supabase.from('subjects').select('*').eq('code', code).limit(1).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from('subjects').insert({ code, name }).select().single()
  if (error) throw error
  return data
}

async function getOrCreateSchool(name) {
  const { data: existing } = await supabase.from('schools').select('*').eq('name', name).limit(1).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from('schools').insert({ name }).select().single()
  if (error) throw error
  return data
}

async function getOrCreateGradeLevel(name) {
  const { data: existing } = await supabase.from('grade_levels').select('*').eq('name', name).limit(1).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from('grade_levels').insert({ name }).select().single()
  if (error) throw error
  return data
}

async function getOrCreateAcademicYear(name) {
  const { data: existing } = await supabase.from('academic_years').select('*').eq('name', name).limit(1).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from('academic_years').insert({ name }).select().single()
  if (error) throw error
  return data
}

async function getOrCreateClass(school_id, grade_level_id, name, academic_year_id) {
  const { data: existing } = await supabase.from('classes').select('*').match({ school_id, grade_level_id, name, academic_year_id }).limit(1).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from('classes').insert({ school_id, grade_level_id, name, academic_year_id }).select().single()
  if (error) throw error
  return data
}

async function getOrCreateUser(email, full_name, role = 'parent', phone = null) {
  const { data: existing } = await supabase.from('users').select('*').eq('email', email).limit(1).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from('users').insert({ email, full_name, role, phone }).select().single()
  if (error) throw error
  return data
}

async function createStudentRecord(user_id, nis, full_name, birthdate, gender) {
  const { data: existing } = await supabase.from('students').select('*').eq('nis', nis).limit(1).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from('students').insert({ user_id, nis, full_name, birthdate, gender }).select().single()
  if (error) throw error
  return data
}

async function createParentRecord(user_id) {
  const { data: existing } = await supabase.from('parents').select('*').eq('user_id', user_id).limit(1).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from('parents').insert({ user_id }).select().single()
  if (error) throw error
  return data
}

async function createParentStudent(parent_id, student_id, relation) {
  const { data: existing } = await supabase.from('parent_student').select('*').match({ parent_id, student_id }).limit(1).maybeSingle()
  if (existing) return existing
  const { data, error } = await supabase.from('parent_student').insert({ parent_id, student_id, relation }).select().single()
  if (error) throw error
  return data
}

async function createEnrollment(student_id, class_id, section) {
  const { data: existing } = await supabase.from('enrollments').select('*').match({ student_id, class_id }).limit(1).maybeSingle()
  if (existing) return existing
  const payload = { student_id, class_id }
  if (section) payload.section_id = null // sections not implemented in sample
  const { data, error } = await supabase.from('enrollments').insert(payload).select().single()
  if (error) throw error
  return data
}

async function main() {
  try {
    console.log('Reading CSVs...')
    const students = await readCsv('data/students.csv')
    const parents = await readCsv('data/parents.csv')
    const classes = await readCsv('data/classes.csv')
    const subjects = await readCsv('data/subjects.csv')
    const enrollments = await readCsv('data/enrollments.csv')

    console.log('Creating school/grade/academic year/classes...')
    for (const row of classes) {
      const school = await getOrCreateSchool(row.school_name)
      const grade = await getOrCreateGradeLevel(row.grade_level)
      const ay = await getOrCreateAcademicYear(row.academic_year)
      const cls = await getOrCreateClass(school.id, grade.id, row.name, ay.id)
      console.log('Ensured class:', cls.name)
    }

    console.log('Creating subjects...')
    for (const row of subjects) {
      const s = await upsertSubject(row)
      console.log('Subject:', s.code, s.name)
    }

    console.log('Creating student and parent users...')
    // create students
    for (const row of students) {
      const user = await getOrCreateUser(row.email || `student+${row.nis}@example.com`, row.full_name, 'student')
      const student = await createStudentRecord(user.id, row.nis, row.full_name, row.birthdate || null, row.gender || null)
      console.log('Student:', student.nis, student.full_name)
    }

    // create parents and relations
    for (const row of parents) {
      const user = await getOrCreateUser(row.email, row.full_name, 'parent', row.phone || null)
      const parent = await createParentRecord(user.id)
      // find student by nis
      const { data: student } = await supabase.from('students').select('*').eq('nis', row.student_nis).limit(1).maybeSingle()
      if (!student) {
        console.warn('Student not found for parent row:', row)
        continue
      }
      await createParentStudent(parent.id, student.id, row.relation || null)
      console.log('Parent relation:', user.email, '->', student.nis)
    }

    console.log('Creating enrollments...')
    for (const row of enrollments) {
      const { data: student } = await supabase.from('students').select('*').eq('nis', row.student_nis).limit(1).maybeSingle()
      if (!student) { console.warn('Student not found for enrollment:', row); continue }
      // find class by name & academic year
      const { data: ay } = await supabase.from('academic_years').select('*').eq('name', row.academic_year).limit(1).maybeSingle()
      const { data: cls } = await supabase.from('classes').select('*').eq('name', row.class_name).eq('academic_year_id', ay.id).limit(1).maybeSingle()
      if (!cls) { console.warn('Class not found:', row.class_name, row.academic_year); continue }
      await createEnrollment(student.id, cls.id, row.section || null)
      console.log('Enrolled:', student.nis, '->', cls.name)
    }

    console.log('Import complete.')
  } catch (err) {
    console.error('Import failed', err)
  }
}

main()
