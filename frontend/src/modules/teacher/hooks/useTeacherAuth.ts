import { useState } from 'react';
import { teacherLogin } from '../services/TeacherAuth.server';
import type { TTeacherProfileToken } from '../../types/User';

export default function useTeacherAuth() {
  const [profile, setProfile] = useState<TTeacherProfileToken | null>(null);

  const login = async (email: string, password: string) => {
    const data = await teacherLogin(email, password);
    setProfile(data);
  };

  return { profile, login };
}
