'use client';

export default function ApplicationTable({
  applications,
  onViewResume,
  showStudentName = false,
}) {
  const getStatusColor = (status) => {
    const colors = {
      Applied: 'bg-slate-100 text-slate-800 font-600',
      'Under Review': 'bg-blue-100 text-blue-800 font-600',
      Shortlisted: 'bg-amber-100 text-amber-800 font-600',
      Interview: 'bg-orange-100 text-orange-800 font-600',
      Selected: 'bg-emerald-100 text-emerald-800 font-600',
      Rejected: 'bg-red-100 text-red-800 font-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 font-600';
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200 card-shadow">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            {showStudentName && (
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
                Student Name
              </th>
            )}
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
              Company
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
              Position
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
              Applied Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
              Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app, index) => (
            <tr key={app.id} className={`border-b border-gray-200 transition-smooth ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            } hover:bg-gray-100`}>
              {showStudentName && (
                <td className="px-6 py-4 text-sm font-600 text-gray-900">
                  {app.studentName}
                </td>
              )}
              <td className="px-6 py-4 text-sm text-gray-900 font-600">{app.companyName}</td>
              <td className="px-6 py-4 text-sm text-gray-700">
                {applications.find((a) => a.id === app.id)?.position || 'Position'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(app.appliedDate).toLocaleDateString('en-IN')}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-block px-3 py-1.5 rounded-lg text-xs ${getStatusColor(
                    app.status
                  )}`}
                >
                  {app.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => onViewResume(app.resume)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-600 transition-smooth"
                >
                  View Resume
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
