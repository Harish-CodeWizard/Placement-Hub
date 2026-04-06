'use client';

import { useEffect, useState } from 'react';
import CandidatesList from '@/components/company/CandidatesList';

export default function CandidatesPage() {
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const [companyRes, applicationsRes, jobsRes] = await Promise.all([
          fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/applications', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/jobs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!companyRes.ok || !applicationsRes.ok || !jobsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const companyData = await companyRes.json();
        const applicationsData = await applicationsRes.json();
        const jobsData = await jobsRes.json();

        setCompany(companyData);
        setApplications(applicationsData);
        setJobs(jobsData.filter(job => job.companyId === companyData.id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Company data not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">View Candidates</h1>
      <CandidatesList applications={applications} jobs={jobs} company={company} />
    </div>
  );
}
