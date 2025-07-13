import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import EventForm from '../components/EventForm';
import './CreateEvent.css'; 

const CreateEvent = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (data) => {
    try {
      await api.post('events/', data);
      navigate('/admin/events');
    } catch (err) {
      console.error('Error creating event:', err);
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object') {
          const messages = Object.entries(err.response.data)
            .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
            .join('; ');
          setErrorMessage(messages);
        } else {
          setErrorMessage(err.response.data);
        }
      } else {
        setErrorMessage('An error occurred while creating the event.');
      }
    }
  };

  return (
    <div className="create-event-container">
      <h2>Create Event</h2>
      {errorMessage && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{errorMessage}</div>}
      <div className="create-event-form">
        <EventForm onSubmit={handleSubmit} onCancel={() => navigate('/admin/events')} submitLabel="Create" />
      </div>
    </div>
  );
};

export default CreateEvent;
