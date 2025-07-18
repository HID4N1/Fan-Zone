import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LocationDetector from '../components/LocationDetector';
import './TransportSelection.css';

const TransportSelection = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get('eventId');

  const [userLocation, setUserLocation] = useState(null);
  const [nearestStations, setNearestStations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasFetched, setHasFetched] = useState(false);

  const handleLocationDetected = (coords) => {
    console.log('TransportSelection: location detected', coords);
    setUserLocation(coords);
  };

  const handleLocationError = (msg) => {
    console.error('TransportSelection: location error', msg);
    setError(msg);
  };

  useEffect(() => {
    if (!eventId) {
      setError('Event ID is missing in URL.');
      return;
    }
  }, [eventId]);

  useEffect(() => {
    if (userLocation && eventId && !hasFetched) {
      setLoading(true);
      fetch(`http://127.0.0.1:8000/api/nearest-station/?latitude=${userLocation.lat}&longitude=${userLocation.lng}`)
        .then(res => {
          if (!res.ok) {
            throw new Error('Failed to fetch nearest stations');
          }
          return res.json();
        })
        .then(data => {
          // console.log('Nearest stations data:', data);
          setNearestStations(data);
          setLoading(false);
          setHasFetched(true);
        })
        .catch(err => {
          // console.error('Fetch error:', err);
          setError(err.message);
          setLoading(false);
        });
    }
  }, [userLocation, eventId, hasFetched]);

  const renderStations = () => {
    if (!nearestStations) return null;
    const entries = Object.entries(nearestStations);
    if (entries.length === 0) return <p>No stations found.</p>;

    return (
      <div className="transport-cards-container">
        {entries.map(([transportType, station], index) => (
          <div
            key={transportType}
            className={`transport-card${index === 0 ? ' bold' : ''}`}
            onClick={() => {
              // Placeholder for click handler
              console.log(`Clicked on ${transportType} card`);
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                console.log(`Clicked on ${transportType} card`);
              }
            }}
          >
            {index === 0 && <div className="recommended-badge">Recommended</div>}
            <h3>{transportType}</h3>
            <p>Station: {station.station_name}</p>
            <p>Line: {station.line_name}</p>
            <p>Walking time: {station.walking_time_minutes} minutes</p>
            <p>Distance: {station.distance_km} km</p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="transport-selection">
      <h1>Select Your Transport</h1>
      {!eventId && <p style={{ color: 'red' }}>Event ID is missing in URL.</p>}
      <LocationDetector onLocationDetected={handleLocationDetected} onError={handleLocationError} />
      {loading && <p>Loading nearest stations...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {renderStations()}
    </div>
  );
};

export default TransportSelection;
