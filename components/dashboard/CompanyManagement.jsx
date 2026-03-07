'use client';

import { useState } from 'react';

export default function CompanyManagement({ companies, setCompanies }) {
  const [editingCompany, setEditingCompany] = useState(null);
  const [formData, setFormData] = useState({});

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/companies', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        setCompanies(companies.map(c => c.id === id ? { ...c, status } : c));
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company.id);
    setFormData({
      companyName: company.companyName,
      requiredCGPA: company.requiredCGPA || '',
      allowedDepartments: company.allowedDepartments ? JSON.parse(company.allowedDepartments).join(', ') : '',
      year: company.year || '',
      ctc: company.ctc || '',
    });
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/companies', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: editingCompany,
          ...formData,
          allowedDepartments: formData.allowedDepartments.split(',').map(d => d.trim()),
        }),
      });

      if (response.ok) {
        const updatedCompany = await response.json();
        setCompanies(companies.map(c => c.id === editingCompany ? updatedCompany : c));
        setEditingCompany(null);
      }
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this company?')) return;

    const token = localStorage.getItem('token');
    try {
      // Note: Need to add DELETE to API
      const response = await fetch(`/api/companies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setCompanies(companies.filter(c => c.id !== id));
      }
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Company Management</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Company Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Min CGPA</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">CTC</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-b border-gray-200">
                <td className="px-6 py-4 text-sm font-600 text-gray-900">
                  {editingCompany === company.id ? (
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    company.companyName
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    company.status === 'approved' ? 'bg-green-100 text-green-800' :
                    company.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editingCompany === company.id ? (
                    <input
                      type="number"
                      value={formData.requiredCGPA}
                      onChange={(e) => setFormData({ ...formData, requiredCGPA: e.target.value })}
                      className="border rounded px-2 py-1"
                      step="0.1"
                    />
                  ) : (
                    company.requiredCGPA || 'N/A'
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {editingCompany === company.id ? (
                    <input
                      type="number"
                      value={formData.ctc}
                      onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
                      className="border rounded px-2 py-1"
                    />
                  ) : (
                    company.ctc ? `₹${company.ctc} LPA` : 'N/A'
                  )}
                </td>
                <td className="px-6 py-4">
                  {editingCompany === company.id ? (
                    <div className="space-x-2">
                      <button onClick={handleSave} className="text-green-600 hover:text-green-800">Save</button>
                      <button onClick={() => setEditingCompany(null)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      {company.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatusChange(company.id, 'approved')} className="text-green-600 hover:text-green-800">Approve</button>
                          <button onClick={() => handleStatusChange(company.id, 'rejected')} className="text-red-600 hover:text-red-800">Reject</button>
                        </>
                      )}
                      <button onClick={() => handleEdit(company)} className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button onClick={() => handleDelete(company.id)} className="text-red-600 hover:text-red-800">Delete</button>
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