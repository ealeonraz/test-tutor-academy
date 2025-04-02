import React from 'react';
import './SubjectsAnimated.css';

const subjects = [
  { name: 'Math', tagline: 'Clear, logical problem solving.', icon: '/assets/icons/math.svg' },
  { name: 'Science', tagline: 'Discover the wonders of the world.', icon: '/assets/icons/science.svg' },
  { name: 'English', tagline: 'Master language and literature.', icon: '/assets/icons/english.svg' },
  { name: 'History', tagline: 'Learn from the past.', icon: '/assets/icons/history.svg' },
  { name: 'Art', tagline: 'Unleash your creativity.', icon: '/assets/icons/art.svg' },
  { name: 'Music', tagline: 'Explore rhythm and melody.', icon: '/assets/icons/music.svg' },
];

export default function SubjectsAnimated() {
  return (
    <div className="subjects-animated">
      <div className="subjects-bg">
        <svg viewBox="0 0 800 200" preserveAspectRatio="none">
          <path d="M0,100 C200,200 600,0 800,100 L800,200 L0,200 Z" fill="#ffffff" opacity="0.1">
            <animateTransform 
              attributeName="transform" 
              attributeType="XML" 
              type="translate" 
              from="0 0" 
              to="50 0" 
              dur="10s" 
              repeatCount="indefinite" />
          </path>
        </svg>
      </div>
      <ul className="subjects-grid">
        {subjects.map((subject, index) => (
          <li key={index} className="subject-item">
            <img src={subject.icon} alt={`${subject.name} icon`} />
            <h4>{subject.name}</h4>
            <p>{subject.tagline}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
