import { supabase } from '../lib/supabase';
import { mapProfile } from './_map';

export async function listAll() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('first_name', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapProfile);
}

export async function listByRole(role) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
    .order('first_name', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapProfile);
}

export async function getProfile(id) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return mapProfile(data);
}

// Update arbitrary profile fields. Accepts camelCase keys and translates them.
export async function updateProfile(id, patch) {
  const row = {};
  if ('firstName' in patch) row.first_name = patch.firstName;
  if ('lastName' in patch) row.last_name = patch.lastName;
  if ('subjects' in patch) row.subjects = patch.subjects;
  if ('profileLink' in patch) row.profile_link = patch.profileLink;
  if ('bio' in patch) row.bio = patch.bio;
  if ('payRate' in patch) row.pay_rate = patch.payRate;
  if ('availableHours' in patch) row.available_hours = patch.availableHours;
  if ('role' in patch) row.role = patch.role;

  const { data, error } = await supabase
    .from('profiles')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return mapProfile(data);
}

export async function deleteProfile(id) {
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}
