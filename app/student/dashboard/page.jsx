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

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [studentRes, applicationsRes, jobsRes] = await Promise.all([
          fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/applications', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const studentData = await studentRes.json();
        const applicationsData = await applicationsRes.json();
        const jobsData = await jobsRes.json();

        setStudent(studentData);
        setApplications(applicationsData);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !student) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const shortlistedCount = applications.filter((app) => app.status === 'Shortlisted').length;
  const selectedCount = applications.filter((app) => app.status === 'Selected').length;

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
          Welcome, {student.user.name}!
        </h1>
        <p className="text-sm text-gray-600">
          Here's your placement journey overview
        </p>
      </div>

      <DashboardCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileSection student={student} />
        <ApplicationStatus applications={applications} />
      </div>

      <JobListings jobs={jobs} student={student} applications={applications} setApplications={setApplications} />
    </div>
  );
}
