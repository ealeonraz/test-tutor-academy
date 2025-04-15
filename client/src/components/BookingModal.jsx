import React, { useState } from 'react';

export default function BookingModal({ slot, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [recurring, setRecurring] = useState(false);

  const startTime = slot.start.toLocaleString(); 
  const endTime = slot.end.toLocaleString();

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(title.trim() || 'Tutoring Session', recurring);
    // Close will be handled in parent onSave (which calls setShowBookingModal(false))
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>Book a Session</h2>
        </div>
        <form onSubmit={handleSubmit} className="booking-form">
          <p><strong>Selected Time:</strong><br/>
             {startTime} &ndash; {endTime}
          </p>
          <div className="form-group">
            <label>Session Title/Subject:</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Math Tutoring" 
              required 
            />
          </div>
          <div className="form-group">
            <label>
              <input 
                type="checkbox" 
                checked={recurring} 
                onChange={(e) => setRecurring(e.target.checked)} 
              />
              {' '}Repeat weekly
            </label>
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Create Appointment</button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
