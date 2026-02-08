'use client';

import DashboardCards from '@/components/DashboardCards';
import { STUDENTS, COMPANIES, APPLICATIONS } from '@/lib/constants';

export default function AdminDashboard() {
  const placedStudents = APPLICATIONS.filter((app) => app.status === 'Selected').length;
  const uniquePlacedStudents = new Set(
    APPLICATIONS.filter((app) => app.status === 'Selected').map((app) => app.studentId)
  ).size;

  const cards = [
    {
      id: 1,
      title: 'Total Students',
      value: STUDENTS.length,
      description: 'Registered for placement',
    },
    {
      id: 2,
      title: 'Total Companies',
      value: COMPANIES.length,
      description: 'Registered companies',
    },
    {
      id: 3,
      title: 'Placed Students',
      value: uniquePlacedStudents,
      description: 'Students with offers',
    },
    {
      id: 4,
      title: 'Total Applications',
      value: APPLICATIONS.length,
      description: 'Across all positions',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-600">
          Welcome back! Here's your placement system overview.
        </p>
      </div>

      <DashboardCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Recent Applications
          </h2>
          <div className="space-y-3">
            {APPLICATIONS.slice(0, 5).map((app) => (
              <div
                key={app.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {app.studentName}
                  </p>
                  <p className="text-sm text-gray-600">{app.companyName}</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Top Companies
          </h2>
          <div className="space-y-3">
            {COMPANIES.map((company) => (
              <div
                key={company.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-semibold text-gray-900">{company.name}</p>
                  <p className="text-sm text-gray-600">
                    Min CGPA: {company.requiredCGPA}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                  ₹{company.ctc} LPA
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
