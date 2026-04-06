'use client';

import { useState, useMemo } from 'react';

export default function CandidatesList({ applications, jobs, company }) {
  const [filters, setFilters] = useState({
    jobId: '',
    status: '',
    department: '',
  });

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesJob = !filters.jobId || application.jobId === parseInt(filters.jobId);
      const matchesStatus = !filters.status || application.status === filters.status;
      const matchesDepartment = !filters.department || application.student.department === filters.department;

      return matchesJob && matchesStatus && matchesDepartment;
    });
  }, [applications, filters]);

  const jobOptions = jobs.map(job => ({ id: job.id, title: job.title }));
  const statusOptions = ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'];
  const departmentOptions = [...new Set(applications.map(app => app.student.department))];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Applied Candidates</h2>

      <div className="mb-4 flex flex-wrap gap-4">
        <select
          value={filters.jobId}
          onChange={(e) => setFilters({ ...filters, jobId: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Job Roles</option>
          {jobOptions.map(job => (
            <option key={job.id} value={job.id}>{job.title}</option>
          ))}
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Departments</option>
          {departmentOptions.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Job Role</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Department</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">CGPA</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Resume</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((application) => (
              <tr key={application.id} className="border-b border-gray-200">
                <td className="px-6 py-4 text-sm font-600 text-gray-900">{application.student.user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{application.job.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{application.student.department}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{application.student.cgpa}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    application.status === 'Selected' ? 'bg-green-100 text-green-800' :
                    application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    application.status === 'Shortlisted' ? 'bg-blue-100 text-blue-800' :
                    application.status === 'Interviewed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {application.student.resume ? (
                    <a href={application.student.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      View
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredApplications.length === 0 && (
        <p className="text-gray-500 text-sm mt-4">
          {applications.length === 0 ? 'No candidates have applied yet.' : 'No candidates match the selected filters.'}
        </p>
      )}
    </div>
  );
}