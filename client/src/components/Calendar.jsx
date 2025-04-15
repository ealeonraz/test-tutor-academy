import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import rrulePlugin from '@fullcalendar/rrule';

import BookingModal from './BookingModal.jsx';
import FeedbackModal from './FeedbackModal.jsx';

import './Calendar.css'
// (Assume these modals are implemented as shown later)

export default function Calendar() {
  // State for events and modal visibility
  const [currentEvents, setCurrentEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);     // { start: Date, end: Date, allDay: bool }
  const [selectedEvent, setSelectedEvent] = useState(null);   // Event object for cancel or feedback
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const eventIdCounter = useRef(0);  // to assign unique IDs to new events

  // Handle selection of a date/time range for new appointment
  const handleSelect = (selectInfo) => {
    const { start, end, allDay } = selectInfo;
    setSelectedSlot({ start, end, allDay });
    setShowBookingModal(true);
    selectInfo.view.calendar.unselect();  // clear the selection highlight
  };

  // Handle clicking an event (either cancel upcoming or feedback for past)
  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const isPast = event.start < new Date();  // event in past
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: { ...event.extendedProps }
    });
    if (isPast) {
      // Past event: open feedback modal if not already submitted
      if (!event.extendedProps.feedbackSubmitted) {
        setShowFeedbackModal(true);
      } else {
        alert('Feedback already submitted for this session.');
      }
    } else {
      // Upcoming event: confirm cancellation
      setShowCancelModal(true);
    }
  };

  // Handle drag-and-drop or resize event changes
  const handleEventChange = (changeInfo) => {
    // changeInfo.event holds the updated event
    const updated = changeInfo.event;
    setCurrentEvents(prevEvents => prevEvents.map(ev => {
      return ev.id === updated.id 
        ? { 
            ...ev, 
            start: updated.start, 
            end: updated.end,
            // If event is recurring with rrule, you may adjust rrule properties here if needed
          } 
        : ev;
    }));
  };

  // Add a new event after submitting the booking form
  const addNewEvent = (title, isRecurring) => {
    if (!selectedSlot) return;
    const { start, end, allDay } = selectedSlot;
    const newId = String(eventIdCounter.current++);
    // Prepare base event object
    const newEvent = {
      id: newId,
      title: title || 'Tutoring Session',
      extendedProps: { feedbackSubmitted: false }
    };
    if (isRecurring) {
      // Create recurring event (weekly recurrence using RRule plugin)
      newEvent.rrule = {
        freq: 'weekly',
        interval: 1,
        dtstart: start.toISOString().replace(/\.\d{3}Z$/, ''),  // use ISO date-time (without milliseconds/zone)
        count: 4  // for example, repeat 4 occurrences (or use until)
      };
      // Set duration of each occurrence (format "HH:MM")
      const diffMin = Math.floor((end - start) / (1000 * 60));
      const hours = Math.floor(diffMin / 60);
      const minutes = diffMin % 60;
      const pad = (n) => String(n).padStart(2, '0');
      newEvent.duration = `${pad(hours)}:${pad(minutes)}`;
      // (If you want all instances to move together when dragged, assign a groupId&#8203;:contentReference[oaicite:4]{index=4})
      newEvent.groupId = `grp_${newId}`;
    } else {
      // Single (non-recurring) event
      newEvent.start = start;
      newEvent.end = end;
      newEvent.allDay = allDay;
    }
    setCurrentEvents(prev => [...prev, newEvent]);
    setShowBookingModal(false);
    setSelectedSlot(null);
  };

  // Confirm cancellation of an upcoming event
  const cancelEvent = () => {
    if (!selectedEvent) return;
    setCurrentEvents(prevEvents => prevEvents.filter(ev => ev.id !== selectedEvent.id));
    setShowCancelModal(false);
    setSelectedEvent(null);
  };

  // Submit feedback for a past event
  const submitFeedback = (feedbackText) => {
    if (!selectedEvent) return;
    // Update feedback status (and optionally store feedback text)
    setCurrentEvents(prevEvents => prevEvents.map(ev => {
      if (ev.id === selectedEvent.id) {
        return {
          ...ev,
          extendedProps: {
            ...ev.extendedProps,
            feedbackSubmitted: true,
            feedback: feedbackText  // store the feedback (optional)
          }
        };
      }
      return ev;
    }));
    setShowFeedbackModal(false);
    setSelectedEvent(null);
    // (You could also send the feedbackText to a server API here)
  };

  return (
    <div className="calendar-section"> {/* container with styling */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, rrulePlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,dayGridMonth'
        }}
        allDaySlot={false}
        selectable={true}
        editable={true}
        eventResizableFromStart={true}
        selectMirror={true}
        dayMaxEvents={true}
        events={currentEvents}
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventChange}   
        eventResize={handleEventChange} 
      />

      {showBookingModal && (
        <BookingModal 
          slot={selectedSlot}
          onClose={() => { setShowBookingModal(false); setSelectedSlot(null); }}
          onSave={addNewEvent}
        />
      )}

      {/* Feedback Modal for past event feedback */}
      {showFeedbackModal && selectedEvent && (
        <FeedbackModal 
          event={selectedEvent}
          onClose={() => { setShowFeedbackModal(false); setSelectedEvent(null); }}
          onSubmit={submitFeedback}
        />
      )}

      {/* Cancel Confirmation Modal for upcoming event */}
      {showCancelModal && selectedEvent && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowCancelModal(false)}>
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowCancelModal(false)}>&times;</button>
            <div className="modal-header">
              <h2>Cancel Appointment</h2>
            </div>
            <p>Are you sure you want to cancel your appointment <strong>{selectedEvent.title}</strong> on {selectedEvent.start.toLocaleString()}?</p>
            <div className="modal-actions">
              <button className="btn btn-danger" onClick={cancelEvent}>Yes, Cancel</button>
              <button className="btn" onClick={() => setShowCancelModal(false)}>No, Keep</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
