import { supabase } from '../lib/supabase';
import { mapReview } from './_map';

export async function listReviews() {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map(mapReview);
}
