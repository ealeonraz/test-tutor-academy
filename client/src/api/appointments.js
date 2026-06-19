import { supabase } from '../lib/supabase';
import { mapAppointment } from './_map';
import { logAction } from './actions';

const WITH_PEOPLE =
  '*, tutor:profiles!appointments_tutor_id_fkey(*), student:profiles!appointments_student_id_fkey(*)';

// Appointments where the current user is the student (old GET /api/appointments)
export async function getMyAppointments() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return [];
  const { data, error } = await supabase
    .from('appointments')
    .select(WITH_PEOPLE)
    .eq('student_id', auth.user.id)
    .order('start_time', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapAppointment);
}

// Appointments where the current user is student OR tutor (old GET /api/appointments/me)
export async function getAppointmentsForMe() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return [];
  const uid = auth.user.id;
  const { data, error } = await supabase
    .from('appointments')
    .select(WITH_PEOPLE)
    .or(`student_id.eq.${uid},tutor_id.eq.${uid}`)
    .order('start_time', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapAppointment);
}

// old POST /api/appointments/create
export async function createAppointment({ tutorId, start, end, subject, joinUrl, files }) {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      student_id: auth.user.id,
      tutor_id: tutorId,
      start_time: start,
      end_time: end,
      subject,
      join_url: joinUrl || '',
      files: files || [],
    })
    .select(WITH_PEOPLE)
    .single();
  if (error) throw error;

  await logAction('appointment_scheduled', auth.user.id, data.id, {
    tutor: tutorId,
    subject,
    start,
    end,
  });

  return mapAppointment(data);
}

// old PUT /api/appointments/:id
export async function updateAppointment(id, patch) {
  const row = {};
  if ('start' in patch) row.start_time = patch.start;
  if ('end' in patch) row.end_time = patch.end;
  if ('subject' in patch) row.subject = patch.subject;
  if ('joinUrl' in patch) row.join_url = patch.joinUrl;
  if ('files' in patch) row.files = patch.files;
  if ('feedback' in patch) row.feedback = patch.feedback;
  if ('feedbackSubmitted' in patch) row.feedback_submitted = patch.feedbackSubmitted;

  const { data, error } = await supabase
    .from('appointments')
    .update(row)
    .eq('id', id)
    .select(WITH_PEOPLE)
    .single();
  if (error) throw error;
  return mapAppointment(data);
}

// old DELETE /api/appointments/:id
export async function deleteAppointment(id) {
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}
