'use client';

export default function JobCard({
  job,
  isEligible,
  onApply,
  hasApplied,
  userRole,
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 card-shadow hover:card-shadow-lg transition-smooth">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-gray-600 font-500">{job.companyName}</p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-lg whitespace-nowrap">
          ₹{job.ctc} LPA
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-5 leading-relaxed">{job.description}</p>

      <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Min. CGPA</p>
          <p className="text-gray-900 font-bold text-base">{job.requiredCGPA}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Openings</p>
          <p className="text-gray-900 font-bold text-base">{job.position}</p>
        </div>
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Departments</p>
          <p className="text-gray-900 font-bold text-sm">
            {job.allowedDepartments.join(', ')}
          </p>
        </div>
      </div>

      <div>
        {userRole === 'student' ? (
          <>
            {!isEligible ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm">
                <p className="font-bold text-red-900">Not Eligible</p>
                <p className="text-red-700 text-xs mt-1">
                  You do not meet the eligibility criteria for this position.
                </p>
              </div>
            ) : hasApplied ? (
              <button
                disabled
                className="w-full bg-gray-200 text-gray-600 py-2.5 rounded-lg font-600 cursor-not-allowed text-sm"
              >
                Already Applied
              </button>
            ) : (
              <button
                onClick={onApply}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-600 transition-smooth text-sm"
              >
                Apply Now
              </button>
            )}
          </>
        ) : (
          <button
            disabled
            className="w-full bg-gray-100 text-gray-600 py-2.5 rounded-lg font-600 cursor-not-allowed text-sm"
          >
            View Applications
          </button>
        )}
      </div>
    </div>
  );
}
