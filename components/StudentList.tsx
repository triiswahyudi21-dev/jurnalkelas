import React from 'react'

export default function StudentList({ students }: { students: any[] }) {
  return (
    <ul>
      {students.map(s => (
        <li key={s.id}>{s.full_name} ({s.nis})</li>
      ))}
    </ul>
  )
}
