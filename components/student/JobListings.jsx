'use client';

import { useState } from 'react';

export default function JobListings({ jobs, student, applications, setApplications }) {
  const [filters, setFilters] = useState({
    search: '',
    department: '',
  });

  // Add null checks
  if (!student || !jobs || !Array.isArray(applications)) {
    return <div className="bg-white rounded-lg shadow-md p-6">
      <div className="text-center text-gray-500">Loading job listings...</div>
    </div>;
  }

  const filteredJobs = jobs.filter((job) => {
    const jobTitle = job.title || '';
    const companyName = job.company?.companyName || '';

    const matchesSearch = jobTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
                         companyName.toLowerCase().includes(filters.search.toLowerCase());

    let matchesDepartment = true;
    if (filters.department) {
      try {
        const allowedDepts = job.allowedDepartments ? JSON.parse(job.allowedDepartments) : [];
        matchesDepartment = allowedDepts.includes(filters.department);
      } catch (error) {
        console.error('Error parsing allowed departments:', error);
        matchesDepartment = false;
      }
    }

    return matchesSearch && matchesDepartment;
  });

  const isEligible = (job) => {
    // Check if student is approved
    if (student.status !== 'approved') return false;

    const studentCgpa = parseFloat(student.cgpa) || 0;
    const jobRequiredCgpa = parseFloat(job.requiredCGPA) || 0;

    if (studentCgpa < jobRequiredCgpa) return false;

    if (!job.allowedDepartments) return true;

    // Check if "any" is specified (no department restrictions)
    if (job.allowedDepartments === '["any"]' || job.allowedDepartments === 'any') {
      return true;
    }

    try {
      const allowedDepts = JSON.parse(job.allowedDepartments);
      // Also check if the parsed array contains "any"
      if (allowedDepts.includes('any')) {
        return true;
      }
      return allowedDepts.includes(student.department);
    } catch (error) {
      console.error('Error parsing allowed departments in eligibility check:', error);
      return false;
    }
  };

  const hasApplied = (jobId) => {
    if (!applications || !Array.isArray(applications)) return false;
    return applications.some(app => app && app.jobId === jobId);
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId }),
      });

      if (response.ok) {
        const application = await response.json();
        setApplications([...applications, application]);
        alert('Application submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to apply');
      }
    } catch (error) {
      console.error('Error applying:', error);
      alert('Network error. Please try again.');
    }
  };

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical Engineering'
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Job Listings</h2>

      <div className="mb-4 flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by job title or company name..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="min-w-[200px]">
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        💡 Filter by department to see only jobs that accept your department
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Company</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Job Role</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Package</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Eligibility CGPA</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Deadline</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job) => (
              <tr key={job.id} className="border-b border-gray-200">
                <td className="px-6 py-4 text-sm font-600 text-gray-900">
                  {job.company?.companyName || 'Unknown Company'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{job.title || 'Untitled Job'}</td>
                <td className="px-6 py-4 text-sm text-gray-700">₹{job.ctc || 0} LPA</td>
                <td className="px-6 py-4 text-sm text-gray-700">{job.requiredCGPA || 0}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{job.year || 'N/A'}</td>
                <td className="px-6 py-4">
                  {hasApplied(job.id) ? (
                    <span className="text-green-600 font-semibold">Applied</span>
                  ) : isEligible(job) ? (
                    <button
                      onClick={() => handleApply(job.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Apply
                    </button>
                  ) : (
                    <span className="text-red-600 text-sm">Not Eligible</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredJobs.length === 0 && (
        <p className="text-gray-500 text-sm mt-4">No jobs found matching your criteria.</p>
      )}
    </div>
  );
}