import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import './WalkingRoute.css';
import WatchPosition from '../components/watchPosition';
import axios from 'axios';

const MapDisplay = ({ mapHtml }) => {
  return (
    <div
      className="map-container"
      dangerouslySetInnerHTML={{ __html: mapHtml }}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

MapDisplay.propTypes = {
  mapHtml: PropTypes.string.isRequired,
};

const WalkingRoute = () => {
  useEffect(() => {
    document.title = 'CFW | Walking Route';
  }, []);
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const eventId = state?.eventId ?? null;

  const [userLocation, setUserLocation] = useState(state?.userLocation ?? null);
  const [userStation, setUserStation] = useState(() => {
    const us = state?.userStation ?? null;
    return us && !us.id && us.station_name
      ? { ...us, id: null } // placeholder, triggers useEffect
      : us;
  });

  // Fetch station id by station_name and line_name if id is missing
  useEffect(() => {
    const fetchStationId = async () => {
      if (userStation && !userStation.id && userStation.station_name) {
        try {
          console.log("Fetching station id for:", userStation.station_name);
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/stations/?search=${encodeURIComponent(userStation.station_name)}`
          );

          if (!response.ok) {
            console.error(`Failed to fetch station data. Status: ${response.status}`);
            return;
          }

          const data = await response.json();
          console.log("Station search response data:", data);

          if (data && data.length > 0) {
            console.log("Inspecting station data for line matching:", data);

            // Correctly access line_name for comparison
            const matchedStation = data.find(
              (station) => station.line_name && station.line_name.toLowerCase() === userStation.line_name.toLowerCase()
            );

            console.log("Matched station:", matchedStation);

            if (matchedStation) {
              setUserStation((prev) => ({ ...prev, id: matchedStation.id }));
            } else {
              console.error("No station matched the line name:", userStation.line_name);
            }
          } else {
            console.error("No stations found for the search query:", userStation.station_name);
          }
        } catch (error) {
          console.error("Error fetching station id:", error);
        }
      }
    };
    fetchStationId();
  }, [userStation]);

  // Debug log to check userStation content
  useEffect(() => {
    console.log("WalkingRoute userStation:", userStation);
  }, [userStation]);
  const [locationError, setLocationError] = useState(null);
  const [mapHtml, setMapHtml] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [arrivalConfirmed, setArrivalConfirmed] = useState(false);
  const [distanceMeters, setDistanceMeters] = useState(null);
  const [showArrivalModal, setShowArrivalModal] = useState(false);

  const { station } = state || {};
  const userLat = userLocation?.lat ?? null;
  const userLng = userLocation?.lng ?? null;
  const stationLat = station?.latitude ?? null;
  const stationLng = station?.longitude ?? null;

  // Function to fetch walking route map HTML from backend API
  const fetchRoute = async () => {
    if (
      userLat === null ||
      userLng === null ||
      stationLat === null ||
      stationLng === null
    ) {
      return;
    }
    setLoading(true);
    setFetchError(null);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/walking-route/`,
        {
          user_location: [userLng, userLat],
          station_location: [stationLng, stationLat],
        }
      );

      if (response.data?.map_html) {
        setMapHtml(response.data.map_html);
      } else {
        setMapHtml(null);
        setFetchError('No map data received.');
      }
    } catch (error) {
      console.error('Error fetching walking route:', error);
      setMapHtml(null);
      setFetchError('Failed to fetch walking route. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [userLat, userLng, stationLat, stationLng]);

  // Helper function to calculate distance between two lat/lng points in meters
  const getDistanceMeters = (lat1, lng1, lat2, lng2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // Earth radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    if (
      userLat === null ||
      userLng === null ||
      stationLat === null ||
      stationLng === null
    )
      return;

    if (arrivalConfirmed) return;

    const distance = getDistanceMeters(userLat, userLng, stationLat, stationLng);
    setDistanceMeters(distance);

    const threshold = 20; // meters

    if (distance <= threshold) {
      setShowArrivalModal(true);
    }
  }, [userLat, userLng, stationLat, stationLng, arrivalConfirmed]);

  const handleConfirmArrival = () => {
    setArrivalConfirmed(true);
    setShowArrivalModal(false);
      navigate('/transport-route', {
        state: {
          userLocation: {
            lat: userLat,
            lng: userLng,
          },
          eventId,
          userStation: {
            station_name: userStation.station_name,
            line_name: userStation.line_name,
          },
        },
      });
  };

  const handleCancelArrival = () => {
    setShowArrivalModal(false);
    
  };

  useEffect(() => {
    if (!mapHtml || !userLat || !userLng) return;

    const timeoutId = setTimeout(() => {
      const mapContainer = document.querySelector('.map-container');
      if (!mapContainer) return;

      if (window.L && window.L.map) {
        // If map instance is accessible, add marker via Leaflet API
        // This requires map instance reference, which we don't have here
        // So fallback to DOM overlay
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [mapHtml, userLat, userLng]);

  // Error handling for missing or invalid coordinates
  if (!state || !station || !userLocation) {
    return (
      <div>
        <h2>Walking Route</h2>
        <p>Station or user location data is missing.</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }
  if (
    userLat === null ||
    userLng === null ||
    stationLat === null ||
    stationLng === null
  ) 
  {
  return (
      <div>
        <h2>Walking Route</h2>
        <p>Invalid or missing coordinates for user or station.</p>
        <button className="back-button" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="heading">Walking Route to {station.station_name}</h2>
      {locationError && <p className="error">Location error: {locationError}</p>}
      {fetchError && <p className="error">{fetchError}</p>}
      {distanceMeters !== null && (
        <div className="distance-display">
          Distance to station: {distanceMeters.toFixed(1)} meters
        </div>
      )}
      {loading ? (
        <p>Loading map...</p>
      ) : mapHtml ? (
        <MapDisplay mapHtml={mapHtml} />
      ) : (
        <p>No map available.</p>
      )}
      <WatchPosition onLocationDetected={setUserLocation} onError={setLocationError} />

      {showArrivalModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Arrival Confirmation</h3>
            <p>You have arrived at {station.station_name}. Do you want to confirm your arrival?</p>
            <button onClick={handleConfirmArrival}>Confirm</button>
          </div>
        </div>
      )}
    </div>
  );
};

WalkingRoute.propTypes = {};

export default WalkingRoute;
