import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const FanzoneForm = ({ initialData = {}, onSubmit, isEdit = false }) => {
  const [name, setName] = useState(initialData.name || '');
  const [adresse, setAdresse] = useState(initialData.adresse || '');
  const [latitude, setLatitude] = useState(initialData.latitude || '');
  const [longitude, setLongitude] = useState(initialData.longitude || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(initialData.image || null);
  const [nearestStation, setNearestStation] = useState(initialData.Nearest_Fanzone_station ? initialData.Nearest_Fanzone_station.id : '');
  const [stations, setStations] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(initialData.name || '');
    setAdresse(initialData.adresse || '');
    setLatitude(initialData.latitude || '');
    setLongitude(initialData.longitude || '');
    setDescription(initialData.description || '');
    setPreviewImage(initialData.image || null);
    setNearestStation(initialData.Nearest_Fanzone_station ? initialData.Nearest_Fanzone_station.id : '');
  }, [initialData]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.get('stations/');
        console.log('Stations data fetched in FanzoneForm:', response.data);
        setStations(response.data);
      } catch (error) {
        console.error('Failed to fetch stations:', error);
      }
    };
    fetchStations();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!adresse.trim()) newErrors.adresse = 'Adresse is required';
    if (!latitude || isNaN(latitude)) newErrors.latitude = 'Valid latitude is required';
    if (!longitude || isNaN(longitude)) newErrors.longitude = 'Valid longitude is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('adresse', adresse);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }
    formData.append('Nearest_Fanzone_station_id', nearestStation);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="fanzone-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <span className="error">{errors.name}</span>}
      </div>

      <div>
        <label>Adresse:</label>
        <input
          type="text"
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
        {errors.adresse && <span className="error">{errors.adresse}</span>}
      </div>

      <div>
        <label>Latitude:</label>
        <input
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        {errors.latitude && <span className="error">{errors.latitude}</span>}
      </div>

      <div>
        <label>Longitude:</label>
        <input
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        {errors.longitude && <span className="error">{errors.longitude}</span>}
      </div>

      <div>
        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label>Nearest Station:</label><br />
        <select
          value={nearestStation}
          onChange={(e) => setNearestStation(e.target.value)}
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
        <label>Image:</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            style={{ width: '150px', marginTop: '10px' }}
          />
        )}
      </div>

      <button type="submit">{isEdit ? 'Update' : 'Create'} FanZone</button>
    </form>
  );
};

export default FanzoneForm;
