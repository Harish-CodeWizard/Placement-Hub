'use client';

import { useState } from 'react';

export default function JobPostingManagement({ jobs, setJobs, companies }) {
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    companyId: '',
    title: '',
    description: '',
    requiredCGPA: '',
    allowedDepartments: '',
    year: '',
    ctc: '',
    positions: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const data = {
      ...formData,
      requiredCGPA: parseFloat(formData.requiredCGPA),
      allowedDepartments: formData.allowedDepartments.split(',').map(d => d.trim()),
      year: parseInt(formData.year),
      ctc: parseFloat(formData.ctc),
      positions: parseInt(formData.positions),
    };

    try {
      const response = await fetch('/api/jobs', {
        method: editingJob ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingJob ? { id: editingJob, ...data } : data),
      });

      if (response.ok) {
        const job = await response.json();
        if (editingJob) {
          setJobs(jobs.map(j => j.id === editingJob ? job : j));
        } else {
          setJobs([...jobs, job]);
        }
        setShowForm(false);
        setEditingJob(null);
        setFormData({
          companyId: '',
          title: '',
          description: '',
          requiredCGPA: '',
          allowedDepartments: '',
          year: '',
          ctc: '',
          positions: '',
        });
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job.id);
    setFormData({
      companyId: job.companyId,
      title: job.title,
      description: job.description,
      requiredCGPA: job.requiredCGPA.toString(),
      allowedDepartments: job.allowedDepartments ? JSON.parse(job.allowedDepartments).join(', ') : '',
      year: job.year.toString(),
      ctc: job.ctc.toString(),
      positions: job.positions.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    const token = localStorage.getItem('token');
    try {
      // Note: Need to add DELETE to API
      const response = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setJobs(jobs.filter(j => j.id !== id));
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Job Posting Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Job
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.companyId}
              onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
              className="border rounded px-3 py-2"
              required
            >
              <option value="">Select Company</option>
              {companies.filter(c => c.status === 'approved').map(c => (
                <option key={c.id} value={c.id}>{c.companyName}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Job Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Required CGPA"
              value={formData.requiredCGPA}
              onChange={(e) => setFormData({ ...formData, requiredCGPA: e.target.value })}
              className="border rounded px-3 py-2"
              step="0.1"
              required
            />
            <input
              type="text"
              placeholder="Allowed Departments (comma separated)"
              value={formData.allowedDepartments}
              onChange={(e) => setFormData({ ...formData, allowedDepartments: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Year"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="CTC (LPA)"
              value={formData.ctc}
              onChange={(e) => setFormData({ ...formData, ctc: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="number"
              placeholder="Positions"
              value={formData.positions}
              onChange={(e) => setFormData({ ...formData, positions: e.target.value })}
              className="border rounded px-3 py-2"
              required
            />
          </div>
          <textarea
            placeholder="Job Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="border rounded px-3 py-2 w-full mt-4"
            rows="3"
            required
          />
          <div className="mt-4 space-x-2">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              {editingJob ? 'Update' : 'Create'} Job
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingJob(null);
                setFormData({
                  companyId: '',
                  title: '',
                  description: '',
                  requiredCGPA: '',
                  allowedDepartments: '',
                  year: '',
                  ctc: '',
                  positions: '',
                });
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Job Role</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Company</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Eligibility CGPA</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Deadline</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-gray-200">
                <td className="px-6 py-4 text-sm font-600 text-gray-900">{job.title}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{job.company.companyName}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{job.requiredCGPA}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{job.year}</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="space-x-2">
                    <button onClick={() => handleEdit(job)} className="text-blue-600 hover:text-blue-800">Edit</button>
                    <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-800">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}