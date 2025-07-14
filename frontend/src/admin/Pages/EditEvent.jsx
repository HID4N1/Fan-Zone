import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import EventForm from '../components/EventForm';
import './EditEvent.css'; 

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the event details by ID
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await api.get(`events/${id}/`);
        setInitialData(res.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        alert('Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await api.put(`events/${id}/`, data);
      navigate('/admin/events');
    } catch (err) {
      console.error('Error updating event:', err);
      alert('Failed to update event');
    }
  };

  if (loading) return <p>Loading event data...</p>;
  if (!initialData) return <p>Event not found.</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Event</h2>
      <EventForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/events')}
        submitLabel="Save Changes"
        isEdit={true}
      />
    </div>
  );
};

export default EditEvent;
