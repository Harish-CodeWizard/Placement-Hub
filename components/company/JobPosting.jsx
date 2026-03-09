'use client';

import { useState } from 'react';

export default function JobPosting({ jobs, setJobs, company }) {
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
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
      companyId: company.id,
      title: formData.title,
      description: formData.description,
      requiredCGPA: parseFloat(formData.requiredCGPA),
      allowedDepartments: formData.allowedDepartments.toLowerCase().trim() === 'any' 
        ? ['any'] 
        : formData.allowedDepartments.split(',').map(d => d.trim()),
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
      title: job.title,
      description: job.description,
      requiredCGPA: job.requiredCGPA.toString(),
      allowedDepartments: job.allowedDepartments ? (() => {
        const depts = JSON.parse(job.allowedDepartments);
        return depts.length === 1 && depts[0] === 'any' ? 'any' : depts.join(', ');
      })() : '',
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
    <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-bold text-gray-900">Job Postings</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          Post New Job
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
          <div className="grid grid-cols-2 gap-4">
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
              placeholder="Allowed Departments (comma separated, or 'any' for no restrictions)"
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

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <p className="text-gray-500 text-sm">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="border rounded p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-600">CGPA: {job.requiredCGPA} | CTC: ₹{job.ctc} LPA</p>
                  <p className="text-sm text-gray-600">Positions: {job.positions}</p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEdit(job)} className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                  <button onClick={() => handleDelete(job.id)} className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}