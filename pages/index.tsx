import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Sistem Sekolah - Starter</h1>
      <p className="mt-4">Starter scaffold for multi-class school system (Next.js + Supabase).</p>

      <div className="mt-6 space-x-4">
        <Link href="/login"><a className="text-blue-600">Login</a></Link>
        <Link href="/dashboard/parent"><a className="text-blue-600">Parent Dashboard (demo)</a></Link>
        <Link href="/dashboard/teacher"><a className="text-blue-600">Teacher Dashboard (demo)</a></Link>
      </div>
    </main>
  )
}
