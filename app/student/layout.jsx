'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import RoleGuard from '@/components/RoleGuard';

const studentMenuItems = [
  { label: 'Dashboard', href: '/student/dashboard' },
  { label: 'Browse Jobs', href: '/student/jobs' },
  { label: 'Application Status', href: '/student/status' },
];

export default function StudentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard requiredRoles={['student']}>
      <div className="flex flex-col h-screen">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            role="student" 
            menuItems={studentMenuItems} 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="p-8">{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
