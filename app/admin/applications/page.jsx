'use client';

import { useState, useEffect, useMemo } from 'react';
import ApplicationTable from '@/components/ApplicationTable';
import SearchFilter from '@/components/SearchFilter';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
  });

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

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch = !filters.searchTerm ||
        app.student.user.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        app.job.company.companyName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        app.job.title.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesStatus = !filters.status || app.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [applications, filters]);

  const transformedApplications = useMemo(() => {
    return filteredApplications.map((app) => ({
      id: app.id,
      studentName: app.student.user.name,
      companyName: app.job.company.companyName,
      position: app.job.title,
      appliedDate: app.appliedAt,
      status: app.status,
      resume: app.student.resume || 'resume.pdf',
    }));
  }, [filteredApplications]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewResume = (resumeName) => {
    alert(`Viewing: ${resumeName}`);
  };

  const statusStats = {
    applied: applications.filter((a) => a.status === 'Applied').length,
    underReview: applications.filter((a) => a.status === 'Under Review').length,
    shortlisted: applications.filter((a) => a.status === 'Shortlisted').length,
    interview: applications.filter((a) => a.status === 'Interview').length,
    selected: applications.filter((a) => a.status === 'Selected').length,
    rejected: applications.filter((a) => a.status === 'Rejected').length,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Applications Management
        </h1>
        <p className="text-gray-600">
          View and manage all student applications
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-900 uppercase">Applied</p>
          <p className="text-2xl font-bold text-blue-600">{statusStats.applied}</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-yellow-900 uppercase">
            Reviewing
          </p>
          <p className="text-2xl font-bold text-yellow-600">
            {statusStats.underReview}
          </p>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-purple-900 uppercase">
            Shortlisted
          </p>
          <p className="text-2xl font-bold text-purple-600">
            {statusStats.shortlisted}
          </p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-orange-900 uppercase">
            Interview
          </p>
          <p className="text-2xl font-bold text-orange-600">
            {statusStats.interview}
          </p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-green-900 uppercase">
            Selected
          </p>
          <p className="text-2xl font-bold text-green-600">
            {statusStats.selected}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-red-900 uppercase">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{statusStats.rejected}</p>
        </div>
      </div>

      <SearchFilter
        onFilterChange={handleFilterChange}
        filterType="applications"
      />

      <ApplicationTable
        applications={transformedApplications}
        onViewResume={handleViewResume}
        showStudentName={true}
      />

      {transformedApplications.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No applications found</p>
        </div>
      )}
    </div>
  );
}
