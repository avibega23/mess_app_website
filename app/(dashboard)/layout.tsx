'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore'
import { SidebarProvider,SidebarTrigger} from '@/components/ui/sidebar';
import AppSidebar from '@/components/shared/AppSideBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  const [mounted,setMounted] = useState(false);
  useEffect(()=>{
    setMounted(true);
  },[])
  if(!mounted) return null;


  if (!isAuthenticated()){
    router.replace('/login');
    return null;
  };

  return (
    <div style={{ display: 'flex' }}>
      <SidebarProvider>
      <AppSidebar />
      <main style={{ flex: 1, padding: '16px' }}>
        <SidebarTrigger/>
        {children}
      </main>
      </SidebarProvider>
    </div>
  );
}