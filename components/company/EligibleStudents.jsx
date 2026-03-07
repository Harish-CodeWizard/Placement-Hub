'use client';

import { useState, useMemo } from 'react';

export default function EligibleStudents({ students, company }) {
  const [filters, setFilters] = useState({
    department: '',
    cgpa: '',
  });

  const eligibleStudents = useMemo(() => {
    return students.filter((student) => {
      if (student.status !== 'approved') return false;

      const meetsCgpa = !company.requiredCGPA || student.cgpa >= company.requiredCGPA;
      const meetsDepartment = !company.allowedDepartments ||
                             JSON.parse(company.allowedDepartments).includes(student.department);

      const matchesFilterDepartment = !filters.department || student.department === filters.department;
      const matchesFilterCgpa = !filters.cgpa || student.cgpa >= parseFloat(filters.cgpa);

      return meetsCgpa && meetsDepartment && matchesFilterDepartment && matchesFilterCgpa;
    });
  }, [students, company, filters]);

  const departments = [...new Set(students.map(s => s.department))];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Eligible Students</h2>

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
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Resume</th>
            </tr>
          </thead>
          <tbody>
            {eligibleStudents.map((student) => (
              <tr key={student.id} className="border-b border-gray-200">
                <td className="px-6 py-4 text-sm font-600 text-gray-900">{student.user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{student.department}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{student.cgpa}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {student.resume ? (
                    <a href={student.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
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

      {eligibleStudents.length === 0 && (
        <p className="text-gray-500 text-sm mt-4">No eligible students found.</p>
      )}
    </div>
  );
}