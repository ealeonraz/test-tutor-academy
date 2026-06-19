// Shape Supabase (snake_case Postgres) rows into the camelCase / `_id` objects
// the existing React components already expect, so component changes stay small.

export function mapProfile(p) {
  if (!p) return null;
  return {
    _id: p.id,
    id: p.id,
    firstName: p.first_name,
    lastName: p.last_name,
    email: p.email,
    role: p.role,
    roleName: p.role,
    subjects: p.subjects || [],
    profileLink: p.profile_link,
    bio: p.bio,
    payRate: p.pay_rate,
    availableHours: p.available_hours || [],
    availableSlots: p.available_hours || [],
    ratings: [], // not modeled in the DB yet; kept so the UI doesn't crash
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

function fullName(profile) {
  if (!profile) return '';
  return `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();
}

export function mapAppointment(a) {
  if (!a) return null;
  const tutor = a.tutor ? mapProfile(a.tutor) : null;
  const student = a.student ? mapProfile(a.student) : null;
  return {
    _id: a.id,
    id: a.id,
    title: a.subject,
    subject: a.subject,
    start: a.start_time,
    end: a.end_time,
    tutorId: a.tutor_id,
    studentId: a.student_id,
    tutor: tutor ? fullName(tutor) : a.tutor_id,
    tutorProfile: tutor,
    student: student ? fullName(student) : a.student_id,
    studentProfile: student,
    feedbackSubmitted: a.feedback_submitted,
    feedback: a.feedback,
    joinUrl: a.join_url,
    files: a.files || [],
    extendedProps: {
      feedbackSubmitted: a.feedback_submitted,
      feedback: a.feedback,
      joinUrl: a.join_url,
      files: a.files || [],
      subject: a.subject,
      tutor: tutor ? fullName(tutor) : a.tutor_id,
      student: student ? fullName(student) : a.student_id,
    },
  };
}

export function mapNote(n) {
  if (!n) return null;
  return {
    _id: n.id,
    id: n.id,
    tutorId: n.tutor_id,
    studentId: n.student_id,
    studentName: n.student_name,
    subject: n.subject,
    tutorNotes: n.note,
    note: n.note,
    date: n.date,
  };
}

export function mapSubject(s) {
  if (!s) return null;
  return { _id: s.id, id: s.id, name: s.name };
}

export function mapReview(r) {
  if (!r) return null;
  return {
    _id: r.id,
    id: r.id,
    name: r.name,
    role: r.role,
    message: r.message,
    avatarUrl: r.avatar_url,
  };
}
