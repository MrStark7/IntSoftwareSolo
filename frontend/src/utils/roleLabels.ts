import { Role } from '../types';

export const roleLabels: Record<Role, string> = {
  STUDENT: 'Student',
  TEACHING_ASSISTANT: 'Teaching Assistant',
  PROFESSOR: 'Professor',
  ADMIN: 'Administrator',
};

export const roleColors: Record<Role, string> = {
  STUDENT: 'bg-blue-100 text-blue-700',
  TEACHING_ASSISTANT: 'bg-green-100 text-green-700',
  PROFESSOR: 'bg-purple-100 text-purple-700',
  ADMIN: 'bg-red-100 text-red-700',
};
