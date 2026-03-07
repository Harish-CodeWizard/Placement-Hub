'use client';

import { useEffect, useState } from 'react';
import EligibleStudents from '@/components/company/EligibleStudents';

export default function CandidatesPage() {
  const [company, setCompany] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const [companyRes, studentsRes] = await Promise.all([
          fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('/api/students', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!companyRes.ok || !studentsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const companyData = await companyRes.json();
        const studentsData = await studentsRes.json();

        setCompany(companyData);
        setStudents(studentsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Company data not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Eligible Candidates</h1>
      <EligibleStudents students={students} company={company} />
    </div>
  );
}
