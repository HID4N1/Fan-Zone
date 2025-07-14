import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventDetails.css";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/public-events/${eventId}/`);
        setEvent(response.data);
        setError(null);
      } catch (err) {
        setError("Event not found or failed to load.");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="loading">Loading event details...</div>;
  if (error) return <div className="not-found">{error}</div>;
  if (!event) return null;

  return (
    <div className="event-details-container">
      {/* Hero Section */}
      <div
        className="event-hero"
        style={{
          backgroundImage: `linear-gradient(rgba(195, 81, 0, 0.9), rgba(0, 0, 0, 0.7)), url('/assets/images/CAN2025.png')`,
        }}
      >
        <div className="hero-content">
          <h1 className="hero-title">EXPERIENCE THE MAGIC OF</h1>
          <h2 className="hero-subtitle">{event.name.toUpperCase()}</h2>
          <p className="hero-description">{event.description}</p>
          <button className="cta-button">Find Your Way</button>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="event-highlights">
        <div className="highlight-content">
          <div className="highlight-title-container">
            <h2 className="highlight-title">{event.location}</h2>
          </div>

          <div className="highlight-grid">
            <div className="highlight-text-items">
              <div className="highlight-item">
                <h3>PREMIUM EXPERIENCE</h3>
                <p>World-class performances and production quality</p>
              </div>
              <div className="highlight-item">
                <h3>EXCLUSIVE ACCESS</h3>
                <p>VIP packages available for dedicated fans</p>
              </div>
              <div className="highlight-item">
                <h3>MEMORABLE MOMENTS</h3>
                <p>Create lasting memories with friends and family</p>
              </div>
              <div className="highlight-item">
                <h3>EVENT DATES</h3>
                <p>
                  Start: {event.date} {event.start_time}<br />
                  End: {event.end_date ? event.end_date : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="highlight-image">
          <img src={event.image} alt={event.name} />
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
