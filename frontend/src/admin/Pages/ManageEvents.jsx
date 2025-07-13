import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import './ManageEvents.css'; 

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const res = await api.get('events/');
      setEvents(res.data);
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`events/${id}/`);
      fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleDownloadQR = async (qrId) => {
    try {
      const url = `https://api.qrserver.com/v1/create-qr-code/?data=${qrId}&size=200x200`;
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${qrId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="manage-events-container">
      <h2>Manage Events</h2>
      <button onClick={() => navigate('/admin/events/create')}>+ Create Event</button>

      <table className="manage-events-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Start Time</th>
            <th>Status</th>
            <th>FanZone</th>
            <th>QR Code ID</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr key={ev.id}>
              <td data-label="ID">{ev.id}</td>
              <td data-label="Name">{ev.name}</td>
              <td data-label="Date">{ev.date}</td>
              <td data-label="Start Time">{ev.start_time}</td>
              <td data-label="Status">{ev.status}</td>
              <td data-label="FanZone">{ev.fanzone?.name || ev.fanzone}</td>
              <td data-label="QR Code">{ev.qr_code_id}</td>
              <td data-label="Actions">
                <button onClick={() => navigate(`/admin/events/${ev.id}/edit`)}>Edit</button>
                <button onClick={() => handleDelete(ev.id)}>Delete</button>
                <button onClick={() => handleDownloadQR(ev.qr_code_id)}>Download QR</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageEvents;
