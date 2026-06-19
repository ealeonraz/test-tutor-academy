import { supabase } from '../lib/supabase';
import { mapProfile } from './_map';

// Sign up a new user. first/last/role are stored in auth metadata and copied
// into public.profiles by the handle_new_user() trigger.
export async function signUp({ first, last, email, password, role = 'student' }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: first, last_name: last, role },
    },
  });
  if (error) throw error;
  return data;
}

// Sign in. Returns the auth session plus the user's profile (already mapped).
export async function signIn({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  const profile = await getMyProfile();
  return { session: data.session, user: data.user, profile };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Fetch the profile row for the currently signed-in user.
export async function getMyProfile() {
  const { data: auth } = await supabase.auth.getUser();
  if (!auth?.user) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', auth.user.id)
    .single();
  if (error) throw error;
  return mapProfile(data);
}

// Send a password-reset email. Supabase sends the email; the link returns the
// user to /reset-password where updatePassword() is called.
export async function requestPasswordReset(email) {
  const redirectTo = `${window.location.origin}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  if (error) throw error;
  return { message: 'If that email exists, a reset link has been sent.' };
}

// Set a new password (called after the user clicks the reset link and is in a
// recovery session, or while logged in).
export async function updatePassword(newPassword) {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
  return { message: 'Password updated successfully.' };
}
