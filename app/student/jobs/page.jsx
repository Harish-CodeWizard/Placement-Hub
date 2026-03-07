'use client';

import { useEffect, useState } from 'react';
import JobListings from '@/components/student/JobListings';

export default function JobsPage() {
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

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Listings</h1>
        <p className="text-sm text-gray-600">Find and apply to job opportunities</p>
      </div>

      <JobListings
        jobs={jobs}
        student={student}
        applications={applications}
        setApplications={setApplications}
      />
    </div>
  );
}
