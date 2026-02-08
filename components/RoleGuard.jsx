'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RoleGuard({ children, requiredRoles }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');

    if (!role || !userId || !requiredRoles.includes(role)) {
      router.push('/login');
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router, requiredRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthorized ? children : null;
}
