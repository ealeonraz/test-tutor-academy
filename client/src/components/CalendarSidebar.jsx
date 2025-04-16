import React from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

export default function CalendarSidebar({ events = [], onSelectEvent = null }) {
  const now = new Date();
  const upcomingSessions = events
    .filter(ev => new Date(ev.start) >= now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 3);  // show the next 3 upcoming appointments

  return (
    <aside className="sidebar">
      <div className="widget upcoming-widget">
        <h2><FaCalendarAlt /> Upcoming Appointments</h2>
        <ul>
          {upcomingSessions.map(ev => (
            <li key={ev.id} onClick={() => onSelectEvent && onSelectEvent(ev)}>
              <strong>{ev.title}</strong>
              <br />
              <small>
                {new Date(ev.start).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </small>
            </li>
          ))}
          {upcomingSessions.length === 0 && <li>No upcoming sessions</li>}
        </ul>
      </div>
    </aside>
  );
}
