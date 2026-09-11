import { useEffect, useState } from 'react'

function getTimeLeft(targetDate) {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function Countdown({ event }) {
  const [timeLeft, setTimeLeft] = useState(() => event && getTimeLeft(event.event_date))

  useEffect(() => {
    if (!event) return
    const timer = setInterval(() => setTimeLeft(getTimeLeft(event.event_date)), 1000)
    return () => clearInterval(timer)
  }, [event])

  if (!event) {
    return (
      <div className="countdown-box">
        <div className="label">Next Event</div>
        <div className="event-title">No upcoming events scheduled yet</div>
      </div>
    )
  }

  if (!timeLeft) {
    return (
      <div className="countdown-box">
        <div className="label">Happening Now</div>
        <div className="event-title">🎉 {event.title}</div>
      </div>
    )
  }

  return (
    <div className="countdown-box">
      <div className="label">Next Event</div>
      <div className="event-title">{event.title}</div>
      <div className="countdown-grid">
        {[
          ['days', timeLeft.days],
          ['hours', timeLeft.hours],
          ['minutes', timeLeft.minutes],
          ['seconds', timeLeft.seconds],
        ].map(([unit, val]) => (
          <div className="countdown-unit" key={unit}>
            <div className="num">{String(val).padStart(2, '0')}</div>
            <div className="unit">{unit}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
