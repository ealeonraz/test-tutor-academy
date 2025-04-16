import React, { useState } from 'react';
import StudentDashboardNavbar from '../components/DashboardNavbar.jsx';
import FullCalendar from '@fullcalendar/react';  // FullCalendar React component
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import CalendarSidebar from '../components/CalendarSidebar.jsx';
import EventDetailsModal from '../components/EventDetailsModal.jsx';
import AppointmentForm from '../components/CreateAppointmentModal.jsx';
import './StudentDashboardCalendar.css';

export default function StudentDashboardCalendar() {
  // Sample event data (normally from a server)
  const [events, setEvents] = useState([
    {
      id: '1',
      title: 'Math Tutoring Session',
      start: new Date(2025, 3, 13, 10, 0),  // Apr 13, 2025 10:00 AM
      end: new Date(2025, 3, 13, 11, 0),
      extendedProps: {
        subject: 'Math',
        tutor: 'Mr. Alan',
        feedbackSubmitted: false,
        feedback: '',
        joinUrl: 'https://zoom.example.com/abc123',
        files: []
      }
    },
    {
      id: '2',
      title: 'Science Tutoring Session',
      start: new Date(2025, 3, 14, 14, 0),  // Apr 14, 2025 2:00 PM
      end: new Date(2025, 3, 14, 15, 0),
      extendedProps: {
        subject: 'Science',
        tutor: 'Dr. Blake',
        feedbackSubmitted: true,
        feedback: 'Great session, I learned a lot!',
        joinUrl: 'https://zoom.example.com/def456',
        files: []
      }
    },
    {
      id: '3',
      title: 'Math Tutoring Session',
      start: new Date(2025, 3, 16, 9, 0),   // Apr 16, 2025 9:00 AM
      end: new Date(2025, 3, 16, 10, 0),
      extendedProps: {
        subject: 'Math',
        tutor: 'Mr. Alan',
        feedbackSubmitted: false,
        feedback: '',
        joinUrl: 'https://zoom.example.com/abc123',
        files: []
      }
    },
    {
      id: '4',
      title: 'English Tutoring Session',
      start: new Date(2025, 3, 18, 11, 0),  // Apr 18, 2025 11:00 AM
      end: new Date(2025, 3, 18, 12, 0),
      extendedProps: {
        subject: 'English',
        tutor: 'Ms. Chloe',
        feedbackSubmitted: false,
        feedback: '',
        joinUrl: 'https://zoom.example.com/ghi789',
        files: []
      }
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null); // for event detail view
  const [showCreateModal, setShowCreateModal] = useState(false); // for creating a new appointment
  const [newEventData, setNewEventData] = useState(null);

  // Handle clicking an existing event (from the calendar or sidebar)
  const handleSelectEvent = (eventInfo) => {
    let eventData = eventInfo;
    if (eventInfo.event) {
      // Extract data if coming from a FullCalendar API event object
      const ev = eventInfo.event;
      eventData = {
        id: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        extendedProps: { ...ev.extendedProps }
      };
    }
    setSelectedEvent(eventData);
  };

  // Update appointment (e.g. after feedback submission)
  const updateEvent = (eventId, newProps) => {
    setEvents(prevEvents =>
      prevEvents.map(ev =>
        ev.id === eventId
          ? { ...ev, ...newProps, extendedProps: { ...ev.extendedProps, ...newProps.extendedProps } }
          : ev
      )
    );
  };

  // Delete an appointment
  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(ev => ev.id !== eventId));
    setSelectedEvent(null);
  };

  // When a user selects a date range on the calendar, prepopulate new appointment data and show the create modal
  const handleDateSelect = (selectInfo) => {
    setNewEventData({
      title: '',
      start: selectInfo.start,
      end: selectInfo.end,
      extendedProps: {
        subject: '',
        tutor: '',
        feedbackSubmitted: false,
        feedback: '',
        joinUrl: '',
        files: []
      }
    });
    setShowCreateModal(true);
  };

  // Also allow appointment creation via a dedicated button
  const handleOpenCreateModal = () => {
    const now = new Date();
    setNewEventData({
      title: '',
      start: now,
      end: new Date(now.getTime() + 60 * 60 * 1000), // default 1-hour duration
      extendedProps: {
        subject: '',
        tutor: '',
        feedbackSubmitted: false,
        feedback: '',
        joinUrl: '',
        files: []
      }
    });
    setShowCreateModal(true);
  };

  // Save a new appointment from the creation modal
  const handleCreateAppointment = (appointmentData) => {
    // Generate a new id (for demo purposes; consider using a more robust approach in production)
    const newId = String(events.length + 1);
    setEvents(prevEvents => [
      ...prevEvents,
      { id: newId, ...appointmentData }
    ]);
    setShowCreateModal(false);
  };

  return (
    <div className="dashboard-page">
      <StudentDashboardNavbar />
      <div className="dashboard-content">
        {/* Header section with a New Appointment button */}
        <div className="header-section">
          <h1>Your Calendar</h1>
          <p>Manage your tutoring sessions and view upcoming appointments.</p>
          <button className="new-appointment-btn" onClick={handleOpenCreateModal}>
            + New Appointment
          </button>
        </div>

        {/* Main content area: Sidebar + Calendar */}
        <div className="main-content">
          <CalendarSidebar events={events} onSelectEvent={handleSelectEvent} />

          <div className="calendar-panel">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
              }}
              selectable={true}
              select={handleDateSelect}
              nowIndicator={true}
              allDaySlot={false}
              height="auto"
              events={events}
              eventClassNames={(info) => {
                const { subject, feedbackSubmitted } = info.event.extendedProps;
                const isPast = info.event.start < new Date();
                let classes = [];
                if (subject) classes.push(`event-${subject.toLowerCase()}`);
                if (isPast) classes.push('past-event');
                else classes.push('upcoming-event');
                if (isPast && !feedbackSubmitted) classes.push('feedback-pending');
                return classes;
              }}
              eventContent={(info) => {
                const { feedbackSubmitted } = info.event.extendedProps;
                const isPast = info.event.start < new Date();
                let statusIcon = null;
                if (isPast) {
                  statusIcon = feedbackSubmitted ? '✅' : '🕒';
                }
                return (
                  <div>
                    <b>{info.timeText}</b>{" "}
                    <span>{info.event.title}</span>
                    {statusIcon && <span style={{ marginLeft: 4 }}>{statusIcon}</span>}
                  </div>
                );
              }}
              eventClick={handleSelectEvent}
            />
          </div>
        </div>
      </div>

      {/* Event Details Modal: Pass onDeleteEvent for deletion functionality */}
      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          onUpdateEvent={updateEvent} 
          onDeleteEvent={deleteEvent}
        />
      )}

      {/* Create Appointment Modal */}
      {showCreateModal && (
        <AppointmentForm
          initialData={newEventData}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateAppointment}
        />
      )}
    </div>
  );
}
