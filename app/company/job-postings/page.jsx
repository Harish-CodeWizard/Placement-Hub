'use client';

import { useEffect, useState } from 'react';
import JobPosting from '@/components/company/JobPosting';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function JobPostingsPage() {
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const [companyRes, jobsRes] = await Promise.all([
          fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } }),
          fetch('/api/jobs', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const companyData = await companyRes.json();
        const jobsData = await jobsRes.json();

        setCompany(companyData);
        setJobs(jobsData.filter(job => job.companyId === companyData.id));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !company) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Postings</h1>
        <p className="text-sm text-gray-600">Manage your job openings</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Active Job Postings</h2>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No job postings yet. Create your first job below.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Job Title</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Required CGPA</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Allowed Departments</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">CTC (LPA)</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Positions</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Applications</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-sm font-600 text-gray-900">{job.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{job.requiredCGPA}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {job.allowedDepartments ? (() => {
                        const depts = JSON.parse(job.allowedDepartments);
                        return depts.length === 1 && depts[0] === 'any' ? 'Any Department' : depts.join(', ');
                      })() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{job.ctc}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{job.positions}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {job.applications ? job.applications.length : 0} applications
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <JobPosting jobs={jobs} setJobs={setJobs} company={company} />

      {selectedJob && (
        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Applicants for {selectedJob.title}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedJob.applications && selectedJob.applications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Department</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">CGPA</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Resume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedJob.applications.map((application) => (
                        <tr key={application.id} className="border-b border-gray-200">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {application.student.user.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {application.student.user.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {application.student.department}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {application.student.cgpa}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {application.status}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {application.student.resume ? (
                              <a href={application.student.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                View
                              </a>
                            ) : (
                              'N/A'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No applications yet for this position.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}