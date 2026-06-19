import { supabase } from '../lib/supabase';
import { mapProfile, mapAppointment } from './_map';
import { listByRole, getProfile, updateProfile, deleteProfile } from './profiles';

export function listTutors() {
  return listByRole('tutor');
}

export function getTutor(id) {
  return getProfile(id);
}

// Old endpoint: GET /api/tutors/:id/info
export function getTutorInfo(id) {
  return getProfile(id);
}

export function deleteTutor(id) {
  return deleteProfile(id);
}

export function updateTutorSubjects(id, subjects) {
  return updateProfile(id, { subjects });
}

export function updateTutorAvailableHours(id, availableHours) {
  return updateProfile(id, { availableHours });
}

// Appointments where the current user is the tutor (old GET /api/tutors/appointments)
export async function getTutorAppointments() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return [];
  const { data, error } = await supabase
    .from('appointments')
    .select('*, student:profiles!appointments_student_id_fkey(*)')
    .eq('tutor_id', auth.user.id)
    .order('start_time', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapAppointment);
}

export { mapProfile };
