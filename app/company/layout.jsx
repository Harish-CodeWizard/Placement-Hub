'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import RoleGuard from '@/components/RoleGuard';

const companyMenuItems = [
  { label: 'Dashboard', href: '/company/dashboard' },
  { label: 'View Candidates', href: '/company/candidates' },
];

export default function CompanyLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RoleGuard requiredRoles={['company']}>
      <div className="flex flex-col h-screen">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            role="company" 
            menuItems={companyMenuItems} 
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
