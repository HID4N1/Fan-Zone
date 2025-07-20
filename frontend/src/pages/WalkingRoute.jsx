import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WalkingRoute.css';
import L from 'leaflet';
import WatchPosition from '../components/watchPosition';
import axios from 'axios';

// Fix Leaflet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
});

const SetViewOnUserLocation = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, 30);
    }
  }, [coords, map]);
  return null;
};

const WalkingRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;

  const [userLocation, setUserLocation] = useState(state?.userLocation ?? null);
  const [locationError, setLocationError] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  const { station } = state || {};
  const userLat = userLocation?.lat ?? null;
  const userLng = userLocation?.lng ?? null;
  const stationLat = station?.latitude ?? null;
  const stationLng = station?.longitude ?? null;


  useEffect(() => {
    const fetchRoute = async () => {
      if (
        userLat === null ||
        userLng === null ||
        stationLat === null ||
        stationLng === null
      ) return;

      try {
        const response = await axios.post('http://localhost:8000/api/walking-route/', {
          user_location: [userLng, userLat],
          station_location: [stationLng, stationLat],
        });

        if (response.data?.features?.length > 0) {
          const coords = response.data.features[0].geometry.coordinates;
          const latLngCoords = coords.map(([lng, lat]) => [lat, lng]);
          setRouteCoords(latLngCoords);
        } else {
          setRouteCoords([[userLat, userLng], [stationLat, stationLng]]);
        }
      } catch (error) {
        console.error('Error fetching walking route:', error);
        setRouteCoords([[userLat, userLng], [stationLat, stationLng]]);
      }
    };

    fetchRoute();
  }, [userLat, userLng, stationLat, stationLng]);

  // These conditional returns come AFTER the hook calls
  if (!state || !station || !userLocation) {
    return (
      <div>
        <h2>Walking Route</h2>
        <p>Station or user location data is missing.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }
  if (
    userLat === null ||
    userLng === null ||
    stationLat === null ||
    stationLng === null
  ) {
    return (
      <div>
        <h2>Walking Route</h2>
        <p>Invalid or missing coordinates for user or station.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  const userCoords = [userLat, userLng];
  const stationCoords = [stationLat, stationLng];



  return (
    <div className="container">
      <h2 className="heading">Walking Route to {station.station_name}</h2>
      {locationError && <p className="error">Location error: {locationError}</p>}
      <MapContainer center={userCoords} zoom={15} className="mapContainer">
        <SetViewOnUserLocation coords={userCoords} />
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={userCoords}>
          <Popup>Your Location</Popup>
        </Marker>
        <Marker position={stationCoords}>
          <Popup>{station.station_name}</Popup>
        </Marker>
        <Polyline positions={routeCoords.length > 0 ? routeCoords : [userCoords, stationCoords]} color="blue" />
      </MapContainer>
      <WatchPosition
        onLocationDetected={setUserLocation}
        onError={setLocationError}
      />
    </div>
  );
};

export default WalkingRoute;
