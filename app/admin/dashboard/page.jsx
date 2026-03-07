'use client';

import { useState, useEffect } from 'react';
import DashboardCards from '@/components/DashboardCards';
import CompanyManagement from '@/components/dashboard/CompanyManagement';
import JobPostingManagement from '@/components/dashboard/JobPostingManagement';
import StudentManagement from '@/components/dashboard/StudentManagement';
import ApplicationMonitoring from '@/components/dashboard/ApplicationMonitoring';
import PlacementStatistics from '@/components/dashboard/PlacementStatistics';
import Notifications from '@/components/dashboard/Notifications';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    placedStudents: 0,
  });
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [studentsRes, companiesRes, applicationsRes, jobsRes] = await Promise.all([
          fetch('/api/students', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/companies', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/applications', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/jobs', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const studentsData = await studentsRes.json();
        const companiesData = await companiesRes.json();
        const applicationsData = await applicationsRes.json();
        const jobsData = await jobsRes.json();

        const placedStudents = new Set(
          applicationsData.filter((app) => app.status === 'Selected').map((app) => app.studentId)
        ).size;

        setStats({
          totalStudents: studentsData.length,
          totalCompanies: companiesData.length,
          totalJobs: jobsData.length,
          totalApplications: applicationsData.length,
          placedStudents,
        });

        setApplications(applicationsData);
        setCompanies(companiesData);
        setStudents(studentsData);
        setJobs(jobsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const cards = [
    {
      id: 1,
      title: 'Total Students',
      value: stats.totalStudents,
      description: 'Registered for placement',
    },
    {
      id: 2,
      title: 'Total Companies',
      value: stats.totalCompanies,
      description: 'Registered companies',
    },
    {
      id: 3,
      title: 'Total Job Postings',
      value: stats.totalJobs,
      description: 'Active job openings',
    },
    {
      id: 4,
      title: 'Total Applications',
      value: stats.totalApplications,
      description: 'Across all positions',
    },
    {
      id: 5,
      title: 'Placed Students',
      value: stats.placedStudents,
      description: 'Students with offers',
    },
  ];

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-600">
          Welcome back! Here's your placement system overview.
        </p>
      </div>

      <DashboardCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Applications
          </h2>
          <div className="space-y-3">
            {applications.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {app.student.user.name}
                  </p>
                  <p className="text-sm text-gray-600">{app.job.company.companyName}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Top Companies
          </h2>
          <div className="space-y-3">
            {companies.slice(0, 5).map((company) => (
              <div
                key={company.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">{company.companyName}</p>
                  <p className="text-sm text-gray-600">
                    Min CGPA: {company.requiredCGPA || 'N/A'}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  ₹{company.ctc || 'N/A'} LPA
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CompanyManagement companies={companies} setCompanies={setCompanies} />
      <JobPostingManagement jobs={jobs} setJobs={setJobs} companies={companies} />
      <StudentManagement students={students} setStudents={setStudents} />
      <ApplicationMonitoring applications={applications} setApplications={setApplications} />
      <PlacementStatistics stats={stats} applications={applications} students={students} />
      <Notifications />
    </div>
  );
}
