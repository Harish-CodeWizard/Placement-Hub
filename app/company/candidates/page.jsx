'use client';

import { useEffect, useState, useMemo } from 'react';
import ApplicationTable from '@/components/ApplicationTable';
import SearchFilter from '@/components/SearchFilter';
import { COMPANIES, APPLICATIONS } from '@/lib/constants';

export default function CandidatesPage() {
  const [company, setCompany] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const currentCompany = COMPANIES.find((c) => c.id === userId);
    setCompany(currentCompany);
  }, []);

  const companyApplications = useMemo(() => {
    if (!company) return [];
    return APPLICATIONS.filter((app) => app.companyId === company.id);
  }, [company]);

  const filteredApplications = useMemo(() => {
    return companyApplications.filter((app) => {
      const matchesSearch = app.studentName
        .toLowerCase()
        .includes(filters.searchTerm.toLowerCase());

      const matchesStatus = !filters.status || app.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [companyApplications, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewResume = (resumeName) => {
    alert(`Viewing resume: ${resumeName}`);
  };

  const handleUpdateStatus = (applicationId, newStatus) => {
    alert(
      `Updated status to ${newStatus} for application ${applicationId}. This is a demo action.`
    );
  };

  if (!company) {
    return <div>Loading...</div>;
  }

  const statusStats = {
    applied: companyApplications.filter((a) => a.status === 'Applied').length,
    underReview: companyApplications.filter((a) => a.status === 'Under Review')
      .length,
    shortlisted: companyApplications.filter((a) => a.status === 'Shortlisted')
      .length,
    interview: companyApplications.filter((a) => a.status === 'Interview').length,
    selected: companyApplications.filter((a) => a.status === 'Selected').length,
    rejected: companyApplications.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Candidate Management
        </h1>
        <p className="text-gray-600">
          Review and manage applications received for your positions
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
          <p className="text-2xl font-bold text-green-600">{statusStats.selected}</p>
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

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            All Applications ({filteredApplications.length})
          </h2>
        </div>
        <ApplicationTable
          applications={filteredApplications}
          onViewResume={handleViewResume}
          showStudentName={true}
        />

        {filteredApplications.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">No applications found</p>
          </div>
        )}
      </div>

      {/* Candidate Details Modal Placeholder */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Click on "View Resume" to review candidate
          resumes. Use the status filters to manage candidates through your
          recruitment pipeline.
        </p>
      </div>
    </div>
  );
}
