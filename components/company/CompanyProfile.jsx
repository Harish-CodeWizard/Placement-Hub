'use client';

import { useState } from 'react';

export default function CompanyProfile({ company, setCompany }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: company.companyName,
    requiredCGPA: company.requiredCGPA?.toString() || '',
    allowedDepartments: company.allowedDepartments ? JSON.parse(company.allowedDepartments).join(', ') : '',
    year: company.year?.toString() || '',
    ctc: company.ctc?.toString() || '',
  });

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/companies', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          requiredCGPA: formData.requiredCGPA ? parseFloat(formData.requiredCGPA) : null,
          allowedDepartments: formData.allowedDepartments.split(',').map(d => d.trim()),
          year: formData.year ? parseInt(formData.year) : null,
          ctc: formData.ctc ? parseFloat(formData.ctc) : null,
        }),
      });

      if (response.ok) {
        const updatedCompany = await response.json();
        setCompany(updatedCompany);
        setEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-bold text-gray-900">Company Profile</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Name</span>
          {editing ? (
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
            />
          ) : (
            <span className="font-600 text-gray-900">{company.companyName}</span>
          )}
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Email</span>
          <span className="font-600 text-gray-900 text-sm">{company.user.email}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Min. CGPA Required</span>
          {editing ? (
            <input
              type="number"
              value={formData.requiredCGPA}
              onChange={(e) => setFormData({ ...formData, requiredCGPA: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
              step="0.1"
            />
          ) : (
            <span className="font-600 text-gray-900">{company.requiredCGPA || 'N/A'}</span>
          )}
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Allowed Departments</span>
          {editing ? (
            <input
              type="text"
              value={formData.allowedDepartments}
              onChange={(e) => setFormData({ ...formData, allowedDepartments: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
              placeholder="CSE, ECE, ME"
            />
          ) : (
            <span className="font-600 text-gray-900 text-right text-sm">
              {company.allowedDepartments ? JSON.parse(company.allowedDepartments).join(', ') : 'All'}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Year</span>
          {editing ? (
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
            />
          ) : (
            <span className="font-600 text-gray-900">{company.year || 'N/A'}</span>
          )}
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-gray-600">CTC Offered</span>
          {editing ? (
            <input
              type="number"
              value={formData.ctc}
              onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
            />
          ) : (
            <span className="font-bold text-emerald-600">₹{company.ctc || 'N/A'} LPA</span>
          )}
        </div>
      </div>

      {editing && (
        <button
          onClick={handleSave}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      )}
    </div>
  );
}