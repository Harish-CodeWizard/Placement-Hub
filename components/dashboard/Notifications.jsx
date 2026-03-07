'use client';

import { useState } from 'react';

export default function Notifications() {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  const handlePost = () => {
    if (!newAnnouncement.trim()) return;

    const announcement = {
      id: Date.now(),
      message: newAnnouncement,
      date: new Date().toLocaleDateString(),
    };

    setAnnouncements([announcement, ...announcements]);
    setNewAnnouncement('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications / Announcements</h2>

      <div className="mb-4">
        <textarea
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          placeholder="Post a new announcement..."
          className="w-full border rounded px-3 py-2"
          rows="3"
        />
        <button
          onClick={handlePost}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Announcement
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="border rounded p-3 bg-gray-50">
            <p className="text-sm text-gray-800">{announcement.message}</p>
            <p className="text-xs text-gray-500 mt-1">{announcement.date}</p>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        )}
      </div>
    </div>
  );
}