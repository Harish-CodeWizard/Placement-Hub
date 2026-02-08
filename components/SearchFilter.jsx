'use client';

import { useState } from 'react';

export default function SearchFilter({
  onFilterChange,
  filterType = 'jobs',
}) {
  const [filters, setFilters] = useState({
    searchTerm: '',
    minCGPA: '',
    maxPackage: '',
    status: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 mb-6">
      <h3 className="text-base font-bold text-gray-900 mb-5">Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Search term */}
        <div>
          <label className="block text-sm font-600 text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleChange}
            placeholder={
              filterType === 'jobs' ? 'Company name...' : 'Student name...'
            }
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-400 text-gray-900 placeholder-gray-500 transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Min CGPA */}
        {filterType === 'jobs' && (
          <div>
            <label className="block text-sm font-600 text-gray-700 mb-2">
              Min CGPA
            </label>
            <input
              type="number"
              name="minCGPA"
              value={filters.minCGPA}
              onChange={handleChange}
              placeholder="e.g., 7.5"
              step="0.1"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-400 text-gray-900 placeholder-gray-500 transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Max Package */}
        {filterType === 'jobs' && (
          <div>
            <label className="block text-sm font-600 text-gray-700 mb-2">
              Max Package (LPA)
            </label>
            <input
              type="number"
              name="maxPackage"
              value={filters.maxPackage}
              onChange={handleChange}
              placeholder="e.g., 20"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-400 text-gray-900 placeholder-gray-500 transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Status Filter (for admin) */}
        {filterType === 'applications' && (
          <div>
            <label className="block text-sm font-600 text-gray-700 mb-2">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-400 text-gray-900 transition-smooth focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview">Interview</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      <button
        onClick={() => {
          setFilters({
            searchTerm: '',
            minCGPA: '',
            maxPackage: '',
            status: '',
          });
          onFilterChange({
            searchTerm: '',
            minCGPA: '',
            maxPackage: '',
            status: '',
          });
        }}
        className="mt-5 text-sm text-blue-600 hover:text-blue-800 font-600 transition-smooth"
      >
        Clear Filters
      </button>
    </div>
  );
}
