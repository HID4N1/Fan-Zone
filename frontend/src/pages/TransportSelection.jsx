import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LocationDetector from '../components/LocationDetector';
import './TransportSelection.css';

const TransportSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
          const enrichedData = {};
          for (const [key, station] of Object.entries(data)) {
            enrichedData[key] = {
              ...station,
              latitude: station.latitude || station.lat || null,
              longitude: station.longitude || station.lng || null,
            };
          }
          console.log('Enriched nearest stations data:', enrichedData);
          setNearestStations(enrichedData);
          setLoading(false);
          setHasFetched(true);
        })
        .catch(err => {
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
              console.log('Station clicked:', station);
                navigate('/walking-route', 
                { state: {
                   station, userLocation, eventId, userStation: station } });
            }}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/walking-route',
                   { state: { 
                    station, userLocation, eventId } });
              }
            }}
          >
            {index === 0 && <div className="recommended-badge">Recommended</div>}
            {/* <img src="#" alt="transport type image" /> */}
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
