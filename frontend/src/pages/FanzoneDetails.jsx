import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FanzoneDetails.css";

const FanzoneDetails = () => {
  const { fanzoneId } = useParams();
  const navigate = useNavigate();
  const [fanzone, setFanzone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "CFW | Fanzone Details";
    const fetchFanzone = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://127.0.0.1:8000/api/public-fanzones/${fanzoneId}/`);
        setFanzone(response.data);
        setError(null);
      } catch (err) {
        setError("Fanzone not found or failed to load.");
        setFanzone(null);
      } finally {
        setLoading(false);
      }
    };

    fetchFanzone();
  }, [fanzoneId]);

  if (loading) return <div className="loading">Loading fanzone details...</div>;
  if (error) return <div className="not-found">{error}</div>;
  if (!fanzone) return null;

  return (
    <div className="fanzones-page">
      <div className="fanzones-header">
        <h1>{fanzone.name}</h1>
        <p>{fanzone.description}</p>
        <p><strong>Location:</strong> {fanzone.adresse}</p>
        <p><strong>Capacity:</strong> {fanzone.capacity}</p>
        <p><strong>Features:</strong> {fanzone.features}</p>
        <p><strong>Opening Hours:</strong> {fanzone.openingHours}</p>
        {fanzone.image && <img src={fanzone.image} alt={fanzone.name} className="fanzone-image" />}
        <button
          className="direction-button"
          onClick={() => {
            // Navigate to transport selection with fanzoneId query param
            navigate(`/transport-selection?fanzoneId=${fanzoneId}`, {
              state: { fanzoneLocation: { lng: fanzone.longitude, lat: fanzone.latitude } },
            });
          }}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#c35100',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Show Directions
        </button>
      </div>
    </div>
  );
};

export default FanzoneDetails;
