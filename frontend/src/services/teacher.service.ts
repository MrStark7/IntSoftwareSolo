import { api } from './api';
import type { TeacherCourse } from '../types';

export const teacherService = {
  getMyCourses: async (): Promise<TeacherCourse[]> => {
    const { data } = await api.get<TeacherCourse[]>('/teacher/my-courses');
    return data;
  },
};
