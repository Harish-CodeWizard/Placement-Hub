'use client';

import { useState } from 'react';
import FormInput from '@/components/FormInput';

export default function AddCompanyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    industry: '',
    description: '',
    requiredCGPA: '',
    allowedDepartments: '',
    ctc: '',
    positions: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          allowedDepartments: formData.allowedDepartments
            ? formData.allowedDepartments.split(',').map(d => d.trim())
            : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add company');
      }

      const data = await response.json();
      setSuccess('Company added successfully!');
      setFormData({
        name: '',
        email: '',
        password: '',
        companyName: '',
        industry: '',
        description: '',
        requiredCGPA: '',
        allowedDepartments: '',
        ctc: '',
        positions: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Add Company</h1>
        <p className="text-gray-600">Register a new company for placements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormInput
              label="Contact Person Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              required
            />

            <FormInput
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hr@company.com"
              required
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter a secure password"
              required
            />

            <FormInput
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g., Tech Solutions Inc."
              required
            />

            <FormInput
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              placeholder="e.g., Technology, Finance, Healthcare"
            />

            <FormInput
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the company"
            />

            <FormInput
              label="Required CGPA"
              name="requiredCGPA"
              type="number"
              value={formData.requiredCGPA}
              onChange={handleChange}
              placeholder="e.g., 7.5"
              step="0.1"
            />

            <FormInput
              label="Allowed Departments (comma-separated)"
              name="allowedDepartments"
              value={formData.allowedDepartments}
              onChange={handleChange}
              placeholder="e.g., Computer Science, Information Technology"
            />

            <FormInput
              label="CTC (LPA)"
              name="ctc"
              type="number"
              value={formData.ctc}
              onChange={handleChange}
              placeholder="e.g., 12"
            />

            <FormInput
              label="Number of Positions"
              name="positions"
              type="number"
              value={formData.positions}
              onChange={handleChange}
              placeholder="e.g., 10"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Adding Company...' : 'Add Company'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
