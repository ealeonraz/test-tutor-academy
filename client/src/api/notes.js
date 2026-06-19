import { supabase } from '../lib/supabase';
import { mapNote } from './_map';

// old GET /api/tutor-notes with optional filters: { search, subject, date, studentName }
export async function listNotes({ search, subject, date, studentName } = {}) {
  let query = supabase.from('notes').select('*').order('date', { ascending: false });

  if (subject) query = query.eq('subject', subject);
  if (search) query = query.ilike('note', `%${search}%`);
  if (studentName) query = query.ilike('student_name', `%${studentName}%`);
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    query = query.gte('date', start.toISOString()).lte('date', end.toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapNote);
}

// old POST /api/tutor-notes
export async function createNote({ studentId, studentName, subject, note, date }) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('notes')
    .insert({
      tutor_id: auth.user.id,
      student_id: studentId || null,
      student_name: studentName,
      subject,
      note,
      date: date || new Date().toISOString(),
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapNote(data);
}
