import { supabase } from '../lib/supabase';
import { logAction } from './actions';

// old POST /api/feedback — the whole form payload is stored as JSON.
export async function submitFeedback(payload) {
  const { data: auth } = await supabase.auth.getUser();
  const studentId = payload.studentId || auth?.user?.id || null;

  const { data, error } = await supabase
    .from('feedback')
    .insert({
      student_id: studentId,
      tutor_id: payload.tutorId || null,
      data: payload,
    })
    .select('*')
    .single();
  if (error) throw error;

  if (auth?.user) {
    await logAction('feedback_left', auth.user.id, data.id, { tutor: payload.tutorId });
  }
  return { success: true, id: data.id };
}
