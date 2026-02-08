'use client';

import { useState, useMemo } from 'react';
import ApplicationTable from '@/components/ApplicationTable';
import SearchFilter from '@/components/SearchFilter';
import { APPLICATIONS } from '@/lib/constants';

export default function ApplicationsPage() {
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: '',
  });

  const filteredApplications = useMemo(() => {
    return APPLICATIONS.filter((app) => {
      const matchesSearch =
        app.studentName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        app.companyName
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      const matchesStatus = !filters.status || app.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewResume = (resumeName) => {
    alert(`Viewing: ${resumeName}`);
  };

  const statusStats = {
    applied: APPLICATIONS.filter((a) => a.status === 'Applied').length,
    underReview: APPLICATIONS.filter((a) => a.status === 'Under Review').length,
    shortlisted: APPLICATIONS.filter((a) => a.status === 'Shortlisted').length,
    interview: APPLICATIONS.filter((a) => a.status === 'Interview').length,
    selected: APPLICATIONS.filter((a) => a.status === 'Selected').length,
    rejected: APPLICATIONS.filter((a) => a.status === 'Rejected').length,
  };

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
        applications={filteredApplications}
        onViewResume={handleViewResume}
        showStudentName={true}
      />

      {filteredApplications.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No applications found</p>
        </div>
      )}
    </div>
  );
}
