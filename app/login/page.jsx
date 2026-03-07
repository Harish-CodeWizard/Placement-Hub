'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '@/components/FormInput';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.role) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token and user info
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('userName', data.user.name);

        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (data.user.role === 'student') {
          router.push('/student/dashboard');
        } else if (data.user.role === 'company') {
          router.push('/company/dashboard');
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl card-shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">PH</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              PlacementHub
            </h1>
            <p className="text-sm text-gray-600">
              Placement Management System
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-1">
            <div className="mb-6">
              <label className="block text-sm font-600 text-gray-700 mb-3">
                Select Your Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-smooth">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleChange}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-600 text-gray-900">Student</div>
                    <div className="text-sm text-gray-600">Apply for jobs and track applications</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-smooth">
                  <input
                    type="radio"
                    name="role"
                    value="company"
                    checked={formData.role === 'company'}
                    onChange={handleChange}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-600 text-gray-900">Company / Recruiter</div>
                    <div className="text-sm text-gray-600">Post jobs and review applications</div>
                  </div>
                </label>
                <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-smooth">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={handleChange}
                    className="mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-600 text-gray-900">Admin (Placement Officer)</div>
                    <div className="text-sm text-gray-600">Manage placements and oversee system</div>
                  </div>
                </label>
              </div>
            </div>

            <FormInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@company.com"
              required
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-600 py-2.5 px-4 rounded-lg transition-smooth mt-6"
            >
              Sign In
            </button>
          </form>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <p className="text-sm font-bold text-blue-900 mb-4">Demo Credentials:</p>
          <div className="space-y-4 text-sm text-blue-800">
            <div>
              <p className="font-semibold mb-2">Admins:</p>
              <div className="space-y-1 ml-2">
                <div>admin@placement.com</div>
                <div>placement@college.edu</div>
                <div>coordinator@placement.edu</div>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">Students:</p>
              <div className="space-y-1 ml-2">
                <div>rahul@example.com (CS, 8.5 CGPA)</div>
                <div>priya.singh@email.com (IT, 8.2 CGPA)</div>
                <div>amit.patel@email.com (CS, 7.8 CGPA)</div>
                <div>sneha.reddy@email.com (Electronics, 8.7 CGPA)</div>
              </div>
            </div>
            <div>
              <p className="font-semibold mb-2">Companies:</p>
              <div className="space-y-1 ml-2">
                <div>hr@techcorp.com (TechCorp Solutions)</div>
                <div>recruitment@infosys.com (Infosys)</div>
                <div>talent@wipro.com (Wipro)</div>
                <div>hr@tcs.com (TCS)</div>
              </div>
            </div>
            <p className="text-xs text-blue-700 pt-2 border-t border-blue-200">Password: demo123 for all accounts</p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-slate-900 hover:text-slate-700 font-semibold transition-smooth">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}
