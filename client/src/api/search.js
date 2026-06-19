import { supabase } from '../lib/supabase';
import { mapProfile } from './_map';

// old GET /api/search?q=&subjects=&ratings=&availability=
// Tutor search. Filtering is done in JS after fetching tutors — the dataset is
// small and this keeps the (jsonb) availability filter simple and correct.
export async function searchTutors({ q, subjects, availability } = {}) {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'tutor');
  if (error) throw error;

  let tutors = (data || []).map(mapProfile);

  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    tutors = tutors.filter((t) => {
      const name = `${t.firstName ?? ''} ${t.lastName ?? ''}`.toLowerCase();
      const subj = (t.subjects || []).join(' ').toLowerCase();
      return name.includes(needle) || subj.includes(needle);
    });
  }

  const subjectList = toArray(subjects);
  if (subjectList.length) {
    tutors = tutors.filter((t) =>
      (t.subjects || []).some((s) => subjectList.includes(s))
    );
  }

  const days = toArray(availability).map((d) => d.toLowerCase());
  if (days.length) {
    tutors = tutors.filter((t) =>
      (t.availableHours || []).some((d) => days.includes((d.day || '').toLowerCase()))
    );
  }

  return tutors;
}

function toArray(v) {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}
