'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  Users,
  BedDouble,
  ReceiptText,
  FileText,
  LogOut,
} from 'lucide-react';

const navItems = [
  { label: 'Students', href: '/student', icon: Users },
  { label: 'Rooms', href: '/room', icon: BedDouble },
  { label: 'Bills', href: '/bill', icon: ReceiptText },
  { label: 'Receipts', href: '/receipt', icon: FileText },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <h2 className="text-lg font-semibold">Mess Panel</h2>
        <p className="text-xs text-muted-foreground">Clerk Dashboard</p>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href} className='flex flex-row gap-2 w-full'>
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-destructive">
              <LogOut size={16} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
