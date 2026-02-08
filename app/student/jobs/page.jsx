'use client';

import { useEffect, useState, useMemo } from 'react';
import JobCard from '@/components/JobCard';
import SearchFilter from '@/components/SearchFilter';
import { JOBS, STUDENTS, APPLICATIONS } from '@/lib/constants';

export default function JobsPage() {
  const [student, setStudent] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: '',
    minCGPA: '',
    maxPackage: '',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const currentStudent = STUDENTS.find((s) => s.id === userId);
    setStudent(currentStudent);
  }, []);

  const filteredJobs = useMemo(() => {
    if (!student) return [];

    return JOBS.filter((job) => {
      const matchesSearch =
        job.companyName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        job.title.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesCGPA =
        !filters.minCGPA || job.requiredCGPA <= parseFloat(filters.minCGPA);

      const matchesPackage =
        !filters.maxPackage || job.ctc <= parseFloat(filters.maxPackage);

      return matchesSearch && matchesCGPA && matchesPackage;
    });
  }, [filters, student]);

  const checkEligibility = (job) => {
    if (!student) return false;
    return (
      student.cgpa >= job.requiredCGPA &&
      job.allowedDepartments.includes(student.department) &&
      student.passingYear === job.year
    );
  };

  const hasApplied = (jobId) => {
    return APPLICATIONS.some(
      (app) => app.studentId === student?.id && app.jobId === jobId
    );
  };

  const handleApply = (jobId) => {
    alert(
      `Applied for job: ${JOBS.find((j) => j.id === jobId)?.title}. This is a demo application.`
    );
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Browse Job Opportunities
        </h1>
        <p className="text-gray-600">
          Find and apply for jobs that match your profile
        </p>
      </div>

      <SearchFilter onFilterChange={handleFilterChange} filterType="jobs" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            isEligible={checkEligibility(job)}
            onApply={() => handleApply(job.id)}
            hasApplied={hasApplied(job.id)}
            userRole="student"
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 text-lg">No jobs found matching your filters</p>
        </div>
      )}
    </div>
  );
}
