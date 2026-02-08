'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '@/components/FormInput';
import { STUDENTS, COMPANIES } from '@/lib/constants';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || !formData.role) {
      setError('Please fill in all fields');
      return;
    }

    // Dummy authentication
    let user = null;

    if (formData.role === 'student') {
      user = STUDENTS.find((s) => s.email === formData.email);
    } else if (formData.role === 'company') {
      user = COMPANIES.find((c) => c.email === formData.email);
    } else if (formData.role === 'admin') {
      // Dummy admin credentials
      if (formData.email === 'admin@placement.com' && formData.password === 'admin123') {
        user = { id: 'ADMIN001', name: 'Admin User' };
      }
    }

    if (!user) {
      setError('Invalid credentials. Try demo credentials or register first.');
      return;
    }

    // Store user info in localStorage
    localStorage.setItem('userRole', formData.role);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userName', user.name);

    // Redirect based on role
    if (formData.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (formData.role === 'student') {
      router.push('/student/dashboard');
    } else if (formData.role === 'company') {
      router.push('/company/dashboard');
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
            <FormInput
              label="Select Role"
              name="role"
              type="select"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'company', label: 'Company / Recruiter' },
                { value: 'admin', label: 'Admin (Placement Officer)' },
              ]}
              required
            />

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
          <div className="space-y-3 text-sm text-blue-800">
            <div className="flex justify-between items-start">
              <span><strong>Student:</strong></span>
              <span className="text-right">rahul@example.com</span>
            </div>
            <div className="flex justify-between items-start">
              <span><strong>Company:</strong></span>
              <span className="text-right">hr@techcorp.com</span>
            </div>
            <div className="flex justify-between items-start">
              <span><strong>Admin:</strong></span>
              <span className="text-right">admin@placement.com</span>
            </div>
            <p className="text-xs text-blue-700 pt-2 border-t border-blue-200">Password: any value for demo users, "admin123" for admin</p>
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
