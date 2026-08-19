'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/shared/AppSideBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authenticated = useAuthStore((state) => state.isAuthenticated());
  const router = useRouter();

  // authenticated comes from a localStorage-backed store, which is unavailable during SSR.
  // Rendering off it directly means the server always sees `false` while the client can see
  // `true` on first paint, producing a hydration mismatch. Waiting for mount keeps the first
  // client render identical to the server's.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !authenticated) {
      router.replace('/login')
    }
  }, [mounted, authenticated, router])

  if (!mounted || !authenticated) {
    return null;
  };

  return (
    <div className='flex'>
      <SidebarProvider>
        <AppSidebar />
        <main className='flex flex-1 p-4'>
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
