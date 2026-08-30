'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '@/components/FormInput';

const TEST_USERS = [
  { email: 'admin@placement.com', role: 'Admin' },
  { email: 'rahul@example.com', role: 'Student' },
  { email: 'hr@techcorp.com', role: 'Company' },
];

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fillTestUser = (email) => {
    setFormData({
      email,
      password: 'demo123',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter email and password');
      return;
    }

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
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

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Quick Access - Click to Fill:</p>
            <div className="space-y-2">
              {TEST_USERS.map((user) => (
                <button
                  key={user.email}
                  onClick={() => fillTestUser(user.email)}
                  className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-smooth text-sm"
                >
                  <div className="font-600 text-gray-900">{user.role}</div>
                  <div className="text-xs text-gray-600">{user.email}</div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">Password: <span className="font-semibold">demo123</span></p>
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
