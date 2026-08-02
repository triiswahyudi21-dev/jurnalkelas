import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function TeacherDashboard() {
  const [students, setStudents] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      // For demo: fetch first 20 students
      const { data } = await supabase.from('students').select('*').limit(50)
      setStudents(data || [])
    }
    load()
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Teacher Dashboard (demo)</h1>
      <section className="mt-6">
        <h2 className="font-semibold">Students (sample)</h2>
        <ul className="mt-2 space-y-2">
          {students.map(s => (
            <li key={s.id} className="p-2 border rounded">
              <div className="font-medium">{s.full_name}</div>
              <div className="text-sm text-gray-600">NIS: {s.nis}</div>
            </li>
          ))}
          {students.length === 0 && <li className="text-gray-500">No students found (run SQL import).</li>}
        </ul>
      </section>
    </main>
  )
}
