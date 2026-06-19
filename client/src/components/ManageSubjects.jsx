import React, { useState, useEffect } from "react";
import "./Feedback/Feedback.css"; // Reuse existing modal styling
import { useAuth } from "../context/AuthContext.jsx";
import { updateTutorSubjects } from "../api/tutors.js";


export default function ManageSubjects({ onClose }) {
  const { user, setUser } = useAuth();
  const [subjects, setSubjects] = useState(user?.subjects || []);

  const [isTutor, setIsTutor] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [role, setRole] = useState(null);

  // Keep local state in sync once the profile loads.
  useEffect(() => {
    if (!user) return;
    setSubjects(user.subjects || []);
    setRole(user.role);
    if (user.role === "tutor") {
      setIsTutor(true);
    }
  }, [user]);

  const handleAddSubject = () => {
    const trimmed = newSubject.trim();
    if (trimmed && !subjects.includes(trimmed)) {
      setSubjects(prev => [...prev, trimmed]);
      setNewSubject("");
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    setSubjects(prev => prev.filter(sub => sub !== subjectToRemove));
  };

  const handleSave = async () => {
    const tutorId = user?.id;

    if (!tutorId) {
      alert("User ID not found. Are you logged in?");
      return;
    }

    try {
      const updated = await updateTutorSubjects(tutorId, subjects);
      if (setUser) setUser(updated);
      alert("Subjects updated successfully!");
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error updating subjects:", err);
      alert("An error occurred while updating subjects.");
    }
  };
  
    

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <div className="form-step">
          <h2>Manage Subjects</h2>
          <div className="form-group">
            <label htmlFor="newSubject">Add a subject</label>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                id="newSubject"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="e.g. Math"
              />
              <button type="button" className="btn next-btn" onClick={handleAddSubject}>Add</button>
            </div>
          </div>

          {subjects.length > 0 && (
            <div className="checkbox-group">
              {subjects.map((subject, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked
                    onChange={() => handleRemoveSubject(subject)}
                  />
                  {subject}
                </label>
              ))}
            </div>
          )}

          <div className="button-group">
            <button className="btn back-btn" onClick={onClose}>Cancel</button>
            <button className="btn submit-btn" onClick={handleSave}>Save Subjects</button>
          </div>
        </div>
      </div>
    </div>
  );
}
