'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { loginUser } from '@/lib/api/auth';
import { LoginPayload, LoginPayloadSchema } from '@/types/auth/auth.types';
import { useForm, SubmitHandler } from "react-hook-form"
import { ChevronLeftIcon } from 'lucide-react';
import { useState } from 'react';
import { Spinner } from '../ui/spinner';
import { zodResolver } from '@hookform/resolvers/zod';

export default function LoginPage() {
  const router = useRouter();


  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(LoginPayloadSchema)
  });

  const setToken = useAuthStore((state) => state.setToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);


  const onSubmit: SubmitHandler<LoginPayload> = async (formData) => {
    try {
      setLoading(true);
      const data = await loginUser({ mobileNo: formData.mobileNo, password: formData.password });

      setToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      setUser(data.user);
      router.push('/dashboard');
    } catch (error) {
      setError('root', { message: (error as Error).message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-screen h-screen flex justify-center items-center bg-custom-background px-4'>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-background p-8 shadow-lg ring-1 ring-custom-gray0">
        <div className='flex items-center justify-center'>
          <button className='flex gap-0.5 text-custom-primary hover:text-custom-gray0 transition cursor-pointer' onClick={() => router.back()}>
            <ChevronLeftIcon />
          </button>
          <h1 className='text-center text-2xl font-bold text-custom-primary'>Login as Clerk</h1>
        </div>

        <input
          {...register("mobileNo", {
            required: "Mobile number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Mobile number must be 10 digits"
            }
          })}
          type="tel"
          placeholder="Mobile No."
          required
          className="rounded-lg border border-custom-gray0 px-3 py-2 text-sm outline-none focus:border-custom-primary"
        />
        {errors.mobileNo && <p className="text-sm text-red-500">{errors.mobileNo.message}</p>}
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters"
            }
          })}
          type="password"
          placeholder="Password"
          required
          className="rounded-lg border border-custom-gray0 px-3 py-2 text-sm outline-none focus:border-custom-primary"
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        <button
          type="submit"
          className="mt-2 cursor-pointer rounded-lg bg-custom-primary py-2 text-sm font-semibold text-custom-background transition hover:-translate-y-0.5 hover:shadow-md flex justify-center items-center"
        >
          {
            loading ? (<Spinner />) : "Login"
          }
        </button>
        {errors.root && <p className="text-sm text-red-500 w-full flex justify-center">{errors.root.message}</p>}
      </form>
    </div>
  );
}