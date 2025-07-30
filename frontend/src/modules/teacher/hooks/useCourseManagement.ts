import { useState, useEffect } from 'react';
import { getTeacherCourses } from '../services/CourseManagement.server';

export default function useCourseManagement() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const data = await getTeacherCourses();
    setCourses(data);
  };

  return { courses, loadCourses };
}
