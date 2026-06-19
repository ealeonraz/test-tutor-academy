import { supabase } from '../lib/supabase';
import { mapSubject } from './_map';

export async function listSubjects() {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapSubject);
}

// Just the names (old GET /api/search/subjects)
export async function listSubjectNames() {
  const subjects = await listSubjects();
  return subjects.map((s) => s.name);
}

export async function createSubject(name) {
  const { data, error } = await supabase
    .from('subjects')
    .insert({ name })
    .select('*')
    .single();
  if (error) throw error;
  return mapSubject(data);
}

export async function updateSubject(id, name) {
  const { data, error } = await supabase
    .from('subjects')
    .update({ name })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return mapSubject(data);
}

export async function deleteSubject(id) {
  const { error } = await supabase.from('subjects').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}
