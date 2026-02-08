'use client';

import { useEffect, useState } from 'react';
import DashboardCards from '@/components/DashboardCards';
import { COMPANIES, APPLICATIONS } from '@/lib/constants';

export default function CompanyDashboard() {
  const [company, setCompany] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const currentCompany = COMPANIES.find((c) => c.id === userId);
    setCompany(currentCompany);
  }, []);

  if (!company) {
    return <div>Loading...</div>;
  }

  const companyApplications = APPLICATIONS.filter(
    (app) => app.companyId === company.id
  );
  const shortlistedCount = companyApplications.filter(
    (app) => app.status === 'Shortlisted'
  ).length;
  const selectedCount = companyApplications.filter(
    (app) => app.status === 'Selected'
  ).length;

  const cards = [
    {
      id: 1,
      title: 'Total Applicants',
      value: companyApplications.length,
      description: 'Received applications',
    },
    {
      id: 2,
      title: 'Shortlisted',
      value: shortlistedCount,
      description: 'Moving to interviews',
    },
    {
      id: 3,
      title: 'Selected',
      value: selectedCount,
      description: 'Offers sent',
    },
    {
      id: 4,
      title: 'CTC Offered',
      value: company.ctc,
      description: 'LPA',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {company.name}!
        </h1>
        <p className="text-sm text-gray-600">Manage your recruitment campaign</p>
      </div>

      <DashboardCards cards={cards} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Company Info */}
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
          <h2 className="text-base font-bold text-gray-900 mb-5">
            Company Information
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Name</span>
              <span className="font-600 text-gray-900">{company.name}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Email</span>
              <span className="font-600 text-gray-900 text-sm">{company.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Min. CGPA Required</span>
              <span className="font-600 text-gray-900">
                {company.requiredCGPA}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-sm text-gray-600">Allowed Departments</span>
              <span className="font-600 text-gray-900 text-right text-sm">
                {company.allowedDepartments.join(', ')}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-gray-600">CTC Offered</span>
              <span className="font-bold text-emerald-600">
                ₹{company.ctc} LPA
              </span>
            </div>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
          <h2 className="text-base font-bold text-gray-900 mb-5">
            Recent Applications
          </h2>
          <div className="space-y-3">
            {companyApplications.slice(0, 3).map((app) => (
              <div
                key={app.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-smooth"
              >
                <div>
                  <p className="font-600 text-gray-900 text-sm">
                    {app.studentName}
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
            {companyApplications.length === 0 && (
              <p className="text-gray-500 text-center py-4 text-sm">
                No applications received yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Application Status Overview */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6 mt-8">
        <h2 className="text-base font-bold text-gray-900 mb-5">
          Application Status Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900 font-bold uppercase tracking-widest">Applied</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {companyApplications.filter((a) => a.status === 'Applied').length}
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-xs text-amber-900 font-bold uppercase tracking-widest">
              Under Review
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-2">
              {companyApplications.filter((a) => a.status === 'Under Review').length}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-xs text-orange-900 font-bold uppercase tracking-widest">
              Shortlisted
            </p>
            <p className="text-2xl font-bold text-orange-600 mt-2">
              {shortlistedCount}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-900 font-bold uppercase tracking-widest">
              Selected
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{selectedCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
