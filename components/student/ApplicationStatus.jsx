'use client';

import StatusTimeline from '../StatusTimeline';

export default function ApplicationStatus({ applications }) {
  // Define the complete application process steps
  const applicationSteps = [
    { label: 'Applied', description: 'Application submitted successfully', icon: '📝' },
    { label: 'Under Review', description: 'HR team reviewing your application', icon: '🔍' },
    { label: 'Shortlisted', description: 'Selected for further evaluation', icon: '✅' },
    { label: 'Technical Interview', description: 'Technical skills assessment', icon: '💻' },
    { label: 'HR Interview', description: 'Cultural fit and final discussion', icon: '👥' },
    { label: 'Final Selection', description: 'Decision pending from management', icon: '🎯' },
    { label: 'Offer Extended', description: 'Job offer sent to you', icon: '📋' },
    { label: 'Accepted', description: 'Offer accepted and joined the company', icon: '🎉' },
  ];

  // Map current status to step index
  const getStatusStep = (status) => {
    const statusMap = {
      'Applied': 0,
      'Shortlisted': 2,
      'Interviewed': 4, // Maps to HR Interview
      'Selected': 6,
      'Rejected': -1, // Special case - don't show timeline
    };
    return statusMap[status] !== undefined ? statusMap[status] : 0;
  };

  // Get the display status for the timeline
  const getTimelineStatus = (status) => {
    const statusMap = {
      'Applied': 'Applied',
      'Shortlisted': 'Shortlisted',
      'Interviewed': 'HR Interview',
      'Selected': 'Offer Extended',
    };
    return statusMap[status] || 'Applied';
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: 'bg-blue-100 text-blue-800 border-blue-200',
      Shortlisted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Interviewed: 'bg-orange-100 text-orange-800 border-orange-200',
      Selected: 'bg-green-100 text-green-800 border-green-200',
      Rejected: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Applied: '📝',
      Shortlisted: '✅',
      Interviewed: '🎯',
      Selected: '🎉',
      Rejected: '❌',
    };
    return icons[status] || '⏳';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
      <h2 className="text-base font-bold text-gray-900 mb-6">My Applications</h2>

      <div className="space-y-6">
        {applications.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📄</div>
            <p className="text-gray-500 text-sm">No applications yet.</p>
            <p className="text-gray-400 text-xs mt-1">Start applying to jobs to see your progress here!</p>
          </div>
        ) : (
          applications.map((app) => {
            const currentStep = getStatusStep(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div key={app.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Application Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{app.job.title}</h3>
                      <p className="text-xs text-gray-600 mt-1">{app.job.company.companyName}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applied on {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(app.status)}`}>
                      <span>{getStatusIcon(app.status)}</span>
                      <span>{app.status}</span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                {!isRejected && (
                  <div className="p-6 bg-gray-50">
                    <StatusTimeline
                      currentStatus={getTimelineStatus(app.status)}
                      statuses={applicationSteps}
                    />
                  </div>
                )}

                {/* Rejection Notice */}
                {isRejected && (
                  <div className="p-4 bg-red-50 border-t border-red-200">
                    <div className="flex items-center space-x-2 text-red-800">
                      <span className="text-lg">😔</span>
                      <div>
                        <p className="text-sm font-semibold">Application Not Successful</p>
                        <p className="text-xs text-red-600 mt-1">
                          We appreciate your interest. Unfortunately, we won't be moving forward with your application at this time.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}