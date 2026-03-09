'use client';

import { useState } from 'react';

export default function ApplicationsReview({ applications, setApplications }) {
  const [statusFilter, setStatusFilter] = useState('');

  const filteredApplications = applications.filter(app =>
    !statusFilter || app.status === statusFilter
  );

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Session expired. Please login again.');
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('/api/applications', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setApplications(applications.map(a => a.id === id ? { ...a, status } : a));
      } else if (response.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        alert(`Failed to update status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Network error. Please try again.');
    }
  };

  const statusOptions = ['Applied', 'Shortlisted', 'Interviewed', 'Selected', 'Rejected'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Applications Review</h2>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="">All Statuses</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Student Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Job Role</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">CGPA</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Resume</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => (
              <tr key={app.id} className="border-b border-gray-200">
                <td className="px-6 py-4 text-sm font-600 text-gray-900">{app.student.user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{app.job.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{app.student.cgpa}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {app.student.resume ? (
                    <a href={app.student.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      View
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredApplications.length === 0 && (
        <p className="text-gray-500 text-sm mt-4">No applications to review.</p>
      )}
    </div>
  );
}