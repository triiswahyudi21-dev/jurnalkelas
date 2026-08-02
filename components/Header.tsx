export default function Header() {
  return (
    <header className="p-4 border-b">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="font-bold">Sistem Sekolah</div>
        <nav className="space-x-4">
          <a href="/">Home</a>
          <a href="/dashboard/parent">Parent</a>
          <a href="/dashboard/teacher">Teacher</a>
        </nav>
      </div>
    </header>
  )
}
