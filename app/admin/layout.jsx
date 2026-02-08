'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import RoleGuard from '@/components/RoleGuard';

const adminMenuItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Add Company', href: '/admin/add-company' },
  { label: 'Applications', href: '/admin/applications' },
];

export default function AdminLayout({ children }) {
  return (
    <RoleGuard requiredRoles={['admin']}>
      <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar role="admin" menuItems={adminMenuItems} />
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="p-8">{children}</div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
