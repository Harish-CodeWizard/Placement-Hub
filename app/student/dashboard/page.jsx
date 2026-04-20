'use client';

import { useEffect, useState } from 'react';
import DashboardCards from '@/components/DashboardCards';
import JobListings from '@/components/student/JobListings';
import ApplicationStatus from '@/components/student/ApplicationStatus';
import ProfileSection from '@/components/student/ProfileSection';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setAuthError('Please login to continue.');
        setLoading(false);
        return;
      }

      try {
        const [studentRes, applicationsRes, jobsRes] = await Promise.all([
          fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/applications', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const studentData = await studentRes.json();
        const applicationsData = await applicationsRes.json();
        const jobsData = await jobsRes.json();

        if (!studentRes.ok || !studentData || studentData.error) {
          setAuthError('Unable to load your profile. Please login again.');
          setStudent(null);
        } else {
          setStudent(studentData);
        }

        setApplications(Array.isArray(applicationsData) ? applicationsData : []);
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAuthError('Unable to load dashboard data. Please refresh and try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !student) {
    if (!loading && authError) {
      return (
        <div className="flex items-center justify-center min-h-screen text-red-600">
          {authError}
        </div>
      );
    }
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const studentWithSafeUser = {
    ...student,
    user: {
      name: student?.user?.name || student?.name || 'Student',
      email: student?.user?.email || student?.email || 'Not available',
      ...(student?.user || {}),
    },
  };

  const shortlistedCount = (Array.isArray(applications) ? applications : []).filter((app) => app.status === 'Shortlisted').length;
  const selectedCount = (Array.isArray(applications) ? applications : []).filter((app) => app.status === 'Selected').length;

  const cards = [
    {
      id: 1,
      title: 'Jobs Available',
      value: jobs.length,
      description: 'Total job openings',
    },
    {
      id: 2,
      title: 'Applied Jobs',
      value: applications.length,
      description: 'Total applications submitted',
    },
    {
      id: 3,
      title: 'Shortlisted',
      value: shortlistedCount,
      description: 'Pending interviews',
    },
    {
      id: 4,
      title: 'Offers Received',
      value: selectedCount,
      description: 'Job offers',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {studentWithSafeUser.user.name}!
        </h1>
        <p className="text-sm text-gray-600">
          Here's your placement journey overview
        </p>
      </div>

      <DashboardCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileSection student={studentWithSafeUser} />
        <ApplicationStatus applications={applications} />
      </div>

      <JobListings jobs={jobs} student={studentWithSafeUser} applications={applications} setApplications={setApplications} />
    </div>
  );
}
