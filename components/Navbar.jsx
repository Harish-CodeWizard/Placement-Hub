'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState('User');
  const [userRole, setUserRole] = useState('Guest');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setUserName(localStorage.getItem('userName') || 'User');
    setUserRole(localStorage.getItem('userRole') || 'Guest');
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    router.push('/login');
  };

  const roleColors = {
    admin: { bg: 'bg-slate-900', text: 'text-slate-700', badge: 'bg-slate-100' },
    student: { bg: 'bg-blue-900', text: 'text-blue-700', badge: 'bg-blue-100' },
    company: { bg: 'bg-emerald-900', text: 'text-emerald-700', badge: 'bg-emerald-100' },
  };

  const colors = roleColors[userRole] || roleColors.student;

  if (!mounted) {
    return (
      <nav className="bg-white border-b border-gray-200 card-shadow sticky top-0 z-40">
        <div className="px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${colors.bg} rounded-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">PH</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900">PlacementHub</h1>
          </div>
          <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white border-b border-gray-200 card-shadow sticky top-0 z-40">
      <div className="px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${colors.bg} rounded-lg flex items-center justify-center transition-smooth`}>
            <span className="text-white font-bold text-sm">PH</span>
          </div>
          <h1 className="text-lg font-bold text-gray-900">PlacementHub</h1>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-sm font-600 text-gray-900">{userName}</p>
            <p className={`text-xs font-medium capitalize ${colors.text}`}>{userRole}</p>
          </div>

          <div className="w-px h-8 bg-gray-200"></div>

          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-smooth"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
