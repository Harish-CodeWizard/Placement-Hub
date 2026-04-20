'use client';

import { useState } from 'react';

export default function ProfileSection({ student }) {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    department: student?.department || '',
    cgpa: student?.cgpa?.toString?.() || '',
    resume: student?.resume || '',
  });

  if (!student) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
        <div className="text-center text-gray-500">Loading profile...</div>
      </div>
    );
  }

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('/api/students', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: student.id,
          department: formData.department,
          cgpa: parseFloat(formData.cgpa),
          resume: formData.resume,
        }),
      });

      if (response.ok) {
        setEditing(false);
        // Refresh page or update state
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 card-shadow p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-base font-bold text-gray-900">Your Profile</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {editing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Name</span>
          <span className="font-600 text-gray-900">{student?.user?.name || student?.name || 'Student'}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Email</span>
          <span className="font-600 text-gray-900 text-sm">{student?.user?.email || student?.email || 'Not available'}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Department</span>
          {editing ? (
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics & Communication</option>
              <option value="ME">Mechanical Engineering</option>
            </select>
          ) : (
            <span className="font-600 text-gray-900">{student.department}</span>
          )}
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">Passing Year</span>
          <span className="font-600 text-gray-900">{student.passingYear}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-sm text-gray-600">CGPA</span>
          {editing ? (
            <input
              type="number"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
              step="0.1"
            />
          ) : (
            <span className="font-bold text-blue-600">{student.cgpa}</span>
          )}
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-sm text-gray-600">Resume</span>
          {editing ? (
            <input
              type="text"
              value={formData.resume}
              onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
              className="border rounded px-2 py-1 text-sm"
              placeholder="Resume URL"
            />
          ) : (
            student.resume ? (
              <a href={student.resume} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                View Resume
              </a>
            ) : (
              <span className="text-gray-500">Not uploaded</span>
            )
          )}
        </div>
      </div>

      {editing && (
        <button
          onClick={handleSave}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      )}
    </div>
  );
}