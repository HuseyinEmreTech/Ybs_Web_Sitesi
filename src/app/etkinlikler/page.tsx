import { getEvents } from '@/lib/data'
import EventsClient from './EventsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Etkinlikler',
  description: 'YBS Kulübü etkinlikleri',
}

export default async function EventsPage() {
  const allEvents = await getEvents()
  const now = new Date()

  const upcomingEvents = allEvents
    .filter(e => new Date(e.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastEvents = allEvents
    .filter(e => new Date(e.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <EventsClient
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
      allEvents={allEvents}
    />
  )
}
