'use client';

import { useState, useMemo } from 'react';

export default function StudentManagement({ students, setStudents }) {
  const [filters, setFilters] = useState({
    department: '',
    cgpa: '',
  });

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesDepartment = !filters.department || student.department === filters.department;
      const matchesCgpa = !filters.cgpa || student.cgpa >= parseFloat(filters.cgpa);
      return matchesDepartment && matchesCgpa;
    });
  }, [students, filters]);

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/students', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setStudents(students.map(s => s.id === id ? { ...s, status } : s));
      }
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const departments = [...new Set(students.map(s => s.department))];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Student Management</h2>

      <div className="mb-4 flex space-x-4">
        <select
          value={filters.department}
          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          className="border rounded px-3 py-2"
        >
          <option value="">All Departments</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min CGPA"
          value={filters.cgpa}
          onChange={(e) => setFilters({ ...filters, cgpa: e.target.value })}
          className="border rounded px-3 py-2"
          step="0.1"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Department</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">CGPA</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Year</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Resume</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-200">
                <td className="px-6 py-4 text-sm font-600 text-gray-900">{student.user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{student.department}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{student.cgpa}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{student.passingYear}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {student.resume ? (
                    <a href={student.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      View
                    </a>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    student.status === 'approved' ? 'bg-green-100 text-green-800' :
                    student.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {student.status === 'pending' && (
                    <div className="space-x-2">
                      <button onClick={() => handleStatusChange(student.id, 'approved')} className="text-green-600 hover:text-green-800">Approve</button>
                      <button onClick={() => handleStatusChange(student.id, 'rejected')} className="text-red-600 hover:text-red-800">Reject</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}