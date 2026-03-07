'use client';

import { useEffect, useState } from 'react';
import DashboardCards from '@/components/DashboardCards';
import CompanyProfile from '@/components/company/CompanyProfile';
import JobPosting from '@/components/company/JobPosting';
import EligibleStudents from '@/components/company/EligibleStudents';
import ApplicationsReview from '@/components/company/ApplicationsReview';

export default function CompanyDashboard() {
  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [companyRes, applicationsRes, jobsRes, studentsRes] = await Promise.all([
          fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/applications', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/students', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const companyData = await companyRes.json();
        const applicationsData = await applicationsRes.json();
        const jobsData = await jobsRes.json();
        const studentsData = await studentsRes.json();

        setCompany(companyData);
        setApplications(applicationsData);
        setJobs(jobsData.filter(job => job.companyId === companyData.id));
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !company) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const companyApplications = applications.filter(app => app.job.companyId === company.id);
  const shortlistedCount = companyApplications.filter(app => app.status === 'Shortlisted').length;
  const selectedCount = companyApplications.filter(app => app.status === 'Selected').length;

  const cards = [
    {
      id: 1,
      title: 'Total Applicants',
      value: companyApplications.length,
      description: 'Received applications',
    },
    {
      id: 2,
      title: 'Shortlisted',
      value: shortlistedCount,
      description: 'Moving to interviews',
    },
    {
      id: 3,
      title: 'Selected',
      value: selectedCount,
      description: 'Offers sent',
    },
    {
      id: 4,
      title: 'Active Jobs',
      value: jobs.length,
      description: 'Current openings',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {company.companyName}!
        </h1>
        <p className="text-sm text-gray-600">Manage your recruitment campaign</p>
      </div>

      <DashboardCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompanyProfile company={company} setCompany={setCompany} />
        <JobPosting jobs={jobs} setJobs={setJobs} company={company} />
      </div>

      <EligibleStudents students={students} company={company} />
      <ApplicationsReview applications={companyApplications} setApplications={setApplications} />
    </div>
  );
}
