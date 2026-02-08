'use client';

import { useState } from 'react';
import FormInput from '@/components/FormInput';
import { COMPANIES } from '@/lib/constants';

export default function AddCompanyPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requiredCGPA: '',
    ctc: '',
    positions: '',
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (
      !formData.name ||
      !formData.email ||
      !formData.requiredCGPA ||
      !formData.ctc
    ) {
      setError('Please fill in all required fields');
      return;
    }

    // Dummy company addition
    setSuccess('Company added successfully!');
    setFormData({
      name: '',
      email: '',
      requiredCGPA: '',
      ctc: '',
      positions: '',
    });

    setTimeout(() => setSuccess(''), 3000);
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
              label="Company Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Tech Solutions Inc."
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
              label="Required CGPA"
              name="requiredCGPA"
              type="number"
              value={formData.requiredCGPA}
              onChange={handleChange}
              placeholder="e.g., 7.5"
              step="0.1"
              required
            />

            <FormInput
              label="CTC (LPA)"
              name="ctc"
              type="number"
              value={formData.ctc}
              onChange={handleChange}
              placeholder="e.g., 12"
              required
            />

            <FormInput
              label="Number of Positions"
              name="positions"
              type="number"
              value={formData.positions}
              onChange={handleChange}
              placeholder="e.g., 5"
            />

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Add Company
            </button>
          </form>
        </div>

        {/* Registered Companies */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Registered Companies
          </h2>
          <div className="space-y-3">
            {COMPANIES.map((company) => (
              <div
                key={company.id}
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <p className="font-semibold text-gray-900 text-sm">
                  {company.name}
                </p>
                <p className="text-xs text-gray-600 mt-1">{company.email}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">
                  CGPA: {company.requiredCGPA} | CTC: ₹{company.ctc} LPA
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
