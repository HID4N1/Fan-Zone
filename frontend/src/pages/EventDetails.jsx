import React from "react";
import { useParams } from "react-router-dom";
import events from "../data/events";
import "./EventDetails.css";
import { useAppContext } from "../context/AppContext";

const EventDetails = () => {
  const { state } = useAppContext();
  const { eventId } = useParams();
  const event = events.find((e) => e.id === eventId);

  if (!event) return <div className="not-found">Event not found.</div>;

  return (
    <div className="event-details-container">
      {/* Hero Section */}
      <div className="event-hero"
         style={{
          backgroundImage: `linear-gradient(rgba(195, 81, 0, 0.9), rgba(0, 0, 0, 0.7)), url('/assets/images/CAN2025.png')`
         }}
        >
        <div className="hero-content">
          <h1 className="hero-title">EXPERIENCE THE MAGIC OF</h1>
          <h2 className="hero-subtitle">{event.name.toUpperCase()}</h2>
          <p className="hero-description">{event.description}</p>
          <button className="cta-button">GET TICKETS</button>
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