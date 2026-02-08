'use client';

import { useEffect, useState } from 'react';
import ApplicationTable from '@/components/ApplicationTable';
import StatusTimeline from '@/components/StatusTimeline';
import { APPLICATIONS, STUDENTS, STATUS_TIMELINE } from '@/lib/constants';

export default function StatusPage() {
  const [student, setStudent] = useState(null);
  const [studentApplications, setStudentApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const currentStudent = STUDENTS.find((s) => s.id === userId);
    setStudent(currentStudent);

    if (userId) {
      const applications = APPLICATIONS.filter((app) => app.studentId === userId);
      setStudentApplications(applications);

      if (applications.length > 0) {
        setSelectedApplication(applications[0]);
      }
    }
  }, []);

  const handleViewResume = (resumeName) => {
    alert(`Viewing resume: ${resumeName}`);
  };

  if (!student || !selectedApplication) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-600 text-lg">You haven't applied to any positions yet</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Application Status
        </h1>
        <p className="text-gray-600">
          Track your job applications and their current status
        </p>
      </div>

      {/* Status Timeline */}
      <div className="mb-8">
        <StatusTimeline
          currentStatus={selectedApplication.status}
          statuses={STATUS_TIMELINE}
        />
      </div>

      {/* Application Selection */}
      {studentApplications.length > 1 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Your Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {studentApplications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApplication(app)}
                className={`p-4 rounded-lg border-2 transition text-left ${
                  selectedApplication.id === app.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-semibold text-gray-900">{app.companyName}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(app.appliedDate).toLocaleDateString('en-IN')}
                </p>
                <span className="inline-block mt-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                  {app.status}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Application Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {selectedApplication.companyName} - Application Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Company</span>
              <span className="font-semibold text-gray-900">
                {selectedApplication.companyName}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Position</span>
              <span className="font-semibold text-gray-900">Software Engineer</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Applied On</span>
              <span className="font-semibold text-gray-900">
                {new Date(selectedApplication.appliedDate).toLocaleDateString(
                  'en-IN'
                )}
              </span>
            </div>
            <div className="flex justify-between items-center py-3 border-b">
              <span className="text-gray-600">Current Status</span>
              <span className="font-semibold text-blue-600">
                {selectedApplication.status}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-gray-600">Resume</span>
              <button
                onClick={() => handleViewResume(selectedApplication.resume)}
                className="text-blue-600 hover:text-blue-800 font-semibold transition"
              >
                Download Resume
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Application Summary
          </h2>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600 uppercase font-semibold">
                Total Applications
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {studentApplications.length}
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <p className="text-xs text-purple-900 uppercase font-semibold">
                Shortlisted
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {
                  studentApplications.filter((app) => app.status === 'Shortlisted')
                    .length
                }
              </p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
              <p className="text-xs text-green-900 uppercase font-semibold">
                Selected
              </p>
              <p className="text-2xl font-bold text-green-600">
                {studentApplications.filter((app) => app.status === 'Selected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* All Applications Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">All Applications</h2>
        </div>
        <ApplicationTable
          applications={studentApplications}
          onViewResume={handleViewResume}
        />
      </div>
    </div>
  );
}
