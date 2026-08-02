import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function ParentDashboard() {
  const [notifications, setNotifications] = useState<any[]>([])

  useEffect(() => {
    // fetch recent notifications
    async function load() {
      const user = supabase.auth.getUser()
      // NOTE: in this starter we don't map auth -> users table automatically.
      const { data } = await supabase.from('notifications').select('*').limit(20).order('created_at', { ascending: false })
      setNotifications(data || [])
    }
    load()

    // subscribe to realtime notifications
    const channel = supabase
      .channel('public:notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications(prev => [payload.new, ...prev])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Parent Dashboard (demo)</h1>
      <section className="mt-6">
        <h2 className="font-semibold">Realtime Notifications</h2>
        <ul className="mt-2 space-y-2">
          {notifications.map(n => (
            <li key={n.id} className="p-2 border rounded">
              <div className="text-sm text-gray-600">{new Date(n.created_at).toLocaleString()}</div>
              <div>{JSON.stringify(n.payload)}</div>
            </li>
          ))}
          {notifications.length === 0 && <li className="text-gray-500">No notifications yet.</li>}
        </ul>
      </section>
    </main>
  )
}
