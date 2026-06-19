import { listByRole, getProfile, deleteProfile } from './profiles';

export function listStudents() {
  return listByRole('student');
}

export function getStudent(id) {
  return getProfile(id);
}

export function deleteStudent(id) {
  return deleteProfile(id);
}
