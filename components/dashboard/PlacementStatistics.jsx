'use client';

import { useMemo } from 'react';

export default function PlacementStatistics({ stats, applications, students }) {
  const departmentStats = useMemo(() => {
    const deptData = {};
    students.forEach(student => {
      if (!deptData[student.department]) {
        deptData[student.department] = { total: 0, placed: 0 };
      }
      deptData[student.department].total++;
    });

    applications.forEach(app => {
      if (app.status === 'Selected') {
        const dept = app.student.department;
        if (deptData[dept]) {
          deptData[dept].placed++;
        }
      }
    });

    return Object.entries(deptData).map(([dept, data]) => ({
      department: dept,
      total: data.total,
      placed: data.placed,
      percentage: data.total > 0 ? ((data.placed / data.total) * 100).toFixed(1) : 0,
    }));
  }, [applications, students]);

  const companyStats = useMemo(() => {
    const compData = {};
    applications.forEach(app => {
      const company = app.job.company.companyName;
      if (!compData[company]) {
        compData[company] = 0;
      }
      if (app.status === 'Selected') {
        compData[company]++;
      }
    });

    return Object.entries(compData)
      .map(([company, placed]) => ({ company, placed }))
      .sort((a, b) => b.placed - a.placed)
      .slice(0, 5);
  }, [applications]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Placement Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Placement by Department</h3>
          <div className="space-y-2">
            {departmentStats.map((stat) => (
              <div key={stat.department} className="flex items-center justify-between">
                <span className="text-sm font-medium">{stat.department}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stat.placed}/{stat.total} ({stat.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Top Companies by Placements</h3>
          <div className="space-y-2">
            {companyStats.map((stat) => (
              <div key={stat.company} className="flex items-center justify-between">
                <span className="text-sm font-medium">{stat.company}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(stat.placed / Math.max(...companyStats.map(s => s.placed))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600">{stat.placed}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}