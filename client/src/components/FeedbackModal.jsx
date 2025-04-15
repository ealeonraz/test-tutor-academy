import React, { useState } from 'react';

export default function FeedbackModal({ event, onClose, onSubmit }) {
  const [feedback, setFeedback] = useState('');
  const { title, start } = event;
  const sessionTime = start.toLocaleString();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      alert("Please enter your feedback or click Cancel.");
      return;
    }
    onSubmit(feedback.trim());
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="modal-header">
          <h2>Session Feedback</h2>
          <p>Please share your feedback for <strong>{title}</strong><br/>held on {sessionTime}.</p>
        </div>
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="form-group">
            <label>Your Feedback:</label>
            <textarea 
              rows="4" 
              value={feedback} 
              onChange={(e) => setFeedback(e.target.value)} 
              placeholder="Write your comments about the session..." 
              required 
            />
          </div>
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary">Submit Feedback</button>
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
