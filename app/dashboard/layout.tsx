'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore'
import { SidebarProvider,SidebarTrigger} from '@/components/ui/sidebar';
import AppSidebar from '@/components/shared/AppSideBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
    }
  }, []);

  if (!isAuthenticated()) return null; // prevent flash of protected content

  return (
    <div style={{ display: 'flex' }}>
      <SidebarProvider>
      <AppSidebar />
      <main style={{ flex: 1, padding: '24px' }}>
        <SidebarTrigger/>
        {children}
      </main>
      </SidebarProvider>
    </div>
  );
}