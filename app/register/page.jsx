'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from '@/components/FormInput';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    cgpa: '',
    company: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    // Simulate registration success
    setSuccess('Registration successful! Redirecting to login...');
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl card-shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">PH</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              PlacementHub
            </h1>
            <p className="text-sm text-gray-600">
              Create your account
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm font-500">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm font-500">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
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
            </div>

            <FormInput
              label="Select Role"
              name="role"
              type="select"
              value={formData.role}
              onChange={handleChange}
              options={[
                { value: 'student', label: 'Student' },
                { value: 'company', label: 'Company / Recruiter' },
              ]}
              required
            />

            {formData.role === 'student' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    label="Department"
                    name="department"
                    type="select"
                    value={formData.department}
                    onChange={handleChange}
                    options={[
                      { value: 'CSE', label: 'Computer Science' },
                      { value: 'ECE', label: 'Electronics & Communication' },
                      { value: 'ME', label: 'Mechanical Engineering' },
                    ]}
                    required
                  />

                  <FormInput
                    label="CGPA"
                    name="cgpa"
                    type="number"
                    value={formData.cgpa}
                    onChange={handleChange}
                    placeholder="8.5"
                    step="0.1"
                    required
                  />
                </div>
              </>
            )}

            {formData.role === 'company' && (
              <FormInput
                label="Company Name"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Your Company Name"
                required
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />

              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-600 py-2.5 px-4 rounded-lg transition-smooth mt-6"
            >
              Create Account
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-slate-900 hover:text-slate-700 font-semibold transition-smooth">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
