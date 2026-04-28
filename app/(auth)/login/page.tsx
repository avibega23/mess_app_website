'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { loginUser } from '@/lib/api/auth';

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const [error, setError] = useState('');


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    try {
      const data = await loginUser({ mobileNo: form.get('email') as string, password: form.get('password') as string });
      setToken(data.token);
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      }
      else {
        setError("An unexpected error occurred, Please try again!")
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
}