'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/shared/AppSideBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const authenticated = useAuthStore((state) => state.isAuthenticated());
  const router = useRouter();

  useEffect(() => {
    if (!authenticated) {
      router.replace('/login')
    }
  }, [authenticated, router])

  if (!authenticated) {
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
