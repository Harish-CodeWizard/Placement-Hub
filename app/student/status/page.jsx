'use client';

import { useEffect, useState } from 'react';
import ApplicationStatus from '@/components/student/ApplicationStatus';

export default function StatusPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('/api/applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Status</h1>
        <p className="text-sm text-gray-600">Track your job applications and their current status</p>
      </div>

      <ApplicationStatus applications={applications} />
    </div>
  );
}
