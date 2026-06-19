import { supabase } from '../lib/supabase';

// Audit log. Best-effort: never let a logging failure break the user action.
export async function logAction(actionType, userId, relatedEntityId = null, metadata = {}) {
  try {
    await supabase.from('actions').insert({
      action_type: actionType,
      user_id: userId,
      related_entity_id: relatedEntityId,
      metadata,
    });
  } catch (err) {
    console.warn('logAction failed (non-fatal):', err);
  }
}
