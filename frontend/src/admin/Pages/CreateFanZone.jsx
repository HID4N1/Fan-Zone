import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../../services/api';
import './CreateFanZone.css';

// Fix default icon issue with leaflet in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

const CreateFanZone = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [position, setPosition] = useState(null);
  const [nearestStation, setNearestStation] = useState('');
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);

    React.useEffect(() => {
      const fetchStations = async () => {
        try {
          const response = await api.get('stations/');
          console.log('Stations data fetched in CreateFanZone:', response.data);
          setStations(response.data);
        } catch (error) {
          console.error('Failed to fetch stations:', error);
        }
      };
      fetchStations();
    }, []);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !image || !address || !position) {
      alert('Please fill all fields and select location on the map.');
      return;
    }
    setLoading(true);
    // Prepare form data for submission
    const formData = new FormData();
    formData.append('name', name);
    formData.append('image', image);
    formData.append('adresse', address);
    formData.append('description', description);
    formData.append('latitude', position.lat);
    formData.append('longitude', position.lng);
    formData.append('Nearest_Fanzone_station_id', nearestStation);

    try {
      await api.post('fanzones/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Reset form
      setName('');
      setImage(null);
      setAddress('');
      setDescription('');
      setPosition(null);
      setNearestStation('');
      navigate('/admin/fanzones');
    } catch (error) {
      console.error('Failed to create fanzone:', error);
      alert('Failed to create fanzone. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-fanzone-container">
      <h2>Create FanZone</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Image:</label><br />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Address:</label><br />
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label>Description:</label><br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            disabled={loading}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div>
          <label>Nearest Station:</label><br />
          <select
            value={nearestStation}
            onChange={(e) => setNearestStation(e.target.value)}
            disabled={loading}
          >
            <option value="">Select a station</option>
            {stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name} ({station.line_name})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Select Location on Map:</label>
          <MapContainer
            center={[33.5731, -7.5898]} // Default center (Casablanca)
            zoom={13}
            className="map-container"
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker position={position} setPosition={setPosition} />
          </MapContainer>
          {position && (
            <p>
              Selected Coordinates: Latitude: {position.lat.toFixed(5)}, Longitude: {position.lng.toFixed(5)}
            </p>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create FanZone'}
        </button>
      </form>
    </div>
  );
};

export default CreateFanZone;
