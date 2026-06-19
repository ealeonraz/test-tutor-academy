import { supabase } from '../lib/supabase';
import { mapAppointment } from './_map';

const WITH_PEOPLE =
  '*, tutor:profiles!appointments_tutor_id_fkey(*), student:profiles!appointments_student_id_fkey(*)';

// old GET /api/events/this-month — appointments starting within the current month
export async function getThisMonth() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const { data, error } = await supabase
    .from('appointments')
    .select(WITH_PEOPLE)
    .gte('start_time', start.toISOString())
    .lt('start_time', end.toISOString())
    .order('start_time', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapAppointment);
}

// old GET /api/events/upcoming — future appointments
export async function getUpcoming() {
  const { data, error } = await supabase
    .from('appointments')
    .select(WITH_PEOPLE)
    .gte('start_time', new Date().toISOString())
    .order('start_time', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapAppointment);
}
