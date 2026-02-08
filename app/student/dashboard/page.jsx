'use client';

import { useEffect, useState } from 'react';
import DashboardCards from '@/components/DashboardCards';
import { STUDENTS, APPLICATIONS } from '@/lib/constants';

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const currentStudent = STUDENTS.find((s) => s.id === userId);
    setStudent(currentStudent);
  }, []);

  if (!student) {
    return <div>Loading...</div>;
  }

  const studentApplications = APPLICATIONS.filter(
    (app) => app.studentId === student.id
  );
  const shortlistedCount = studentApplications.filter(
    (app) => app.status === 'Shortlisted'
  ).length;
  const selectedCount = studentApplications.filter(
    (app) => app.status === 'Selected'
  ).length;

  const cards = [
    {
      id: 1,
      title: 'Applied Jobs',
      value: studentApplications.length,
      description: 'Total applications submitted',
    },
    {
      id: 2,
      title: 'Shortlisted',
      value: shortlistedCount,
      description: 'Pending interviews',
    },
    {
      id: 3,
      title: 'Offers Received',
      value: selectedCount,
      description: 'Job offers',
    },
    {
      id: 4,
      title: 'CGPA',
      value: student.cgpa,
      description: 'Your current CGPA',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {student.name}!
        </h1>
        <p className="text-sm text-gray-600">
          Here's your placement journey overview
        </p>
      </div>

      <DashboardCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Student Info */}
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
          <h2 className="text-base font-bold text-gray-900 mb-5">
            Your Profile
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Name</span>
              <span className="font-600 text-gray-900">{student.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Email</span>
              <span className="font-600 text-gray-900 text-sm">{student.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Department</span>
              <span className="font-600 text-gray-900">
                {student.department}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Passing Year</span>
              <span className="font-600 text-gray-900">
                {student.passingYear}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600">CGPA</span>
              <span className="font-bold text-blue-600">{student.cgpa}</span>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
          <h2 className="text-base font-bold text-gray-900 mb-5">
            Recent Applications
          </h2>
          <div className="space-y-3">
            {studentApplications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-smooth"
              >
                <div>
                  <p className="font-600 text-gray-900 text-sm">
                    {app.companyName}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(app.appliedDate).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                  {app.status}
                </span>
              </div>
            ))}
            {studentApplications.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">
                No applications yet
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
