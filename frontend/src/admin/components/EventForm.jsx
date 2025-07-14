import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const generateQrCodeId = () => {
  const randomString = Math.random().toString(36).substring(2, 10);
  return `event-${randomString}`;
};

const EventForm = ({ initialData = {}, onSubmit, onCancel, submitLabel = 'Submit', isEdit = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    start_time: '',
    fanzone: '', 
    qr_code_id: '', 
  });
  const [imageFile, setImageFile] = useState(null);
  const [fanZones, setFanZones] = useState([]);

  // Load FanZones for dropdown
  useEffect(() => {
    const fetchFanZones = async () => {
      try {
        const res = await api.get('fanzones/');
        setFanZones(res.data);
      } catch (err) {
        console.error('Error fetching FanZones:', err);
      }
    };
    fetchFanZones();
  }, []);

  // Load initial data for edit
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      // Extract time portion (HH:mm) if start_time is a datetime string
      let startTime = '';
      if (initialData.start_time) {
        // If start_time includes 'T', assume ISO datetime string
        if (initialData.start_time.includes('T')) {
          startTime = initialData.start_time.split('T')[1].substring(0,5); // HH:mm
        } else {
          startTime = initialData.start_time;
        }
      }
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        date: initialData.date || '',
        start_time: startTime,
        fanzone: initialData.fanzone?.id || initialData.fanzone || '',
        qr_code_id: initialData.qr_code_id || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let combinedStartTime = formData.start_time;

    // Generate QR Code ID ghir f new creation
    const { fanzone, name, description, date, start_time, qr_code_id } = formData;

    // Ensure qr_code_id is generated if empty
    const qrCodeIdToUse = isEdit ? qr_code_id : (qr_code_id || generateQrCodeId());

    // Use FormData to handle file upload
    const finalData = new FormData();
    finalData.append('start_time', combinedStartTime);
    finalData.append('qr_code_id', qrCodeIdToUse);
    finalData.append('fanzone_id', fanzone);
    finalData.append('name', name);
    finalData.append('description', description);
    finalData.append('date', date);
    if (imageFile) {
      finalData.append('image', imageFile);
    }

    // Debug: log FormData entries
    for (let pair of finalData.entries()) {
      console.log(pair[0]+ ': ' + pair[1]);
    }

    onSubmit(finalData);
  };

  const handleDownloadQR = () => {
    const url = `https://api.qrserver.com/v1/create-qr-code/?data=${formData.qr_code_id}&size=200x200`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `${formData.qr_code_id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        name="description"
        placeholder="Description (max 3 lines)"
        rows={3}
        maxLength={300}
        value={formData.description}
        onChange={handleChange}
      />

      <label htmlFor="date">Date</label>
      <input
        id="date"
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <label htmlFor="start_time">Start Time</label>
      <input
        id="start_time"
        name="start_time"
        type="time"
        value={formData.start_time}
        onChange={handleChange}
        required
      />

      <label htmlFor="fanzone">FanZone</label>
      <select
        id="fanzone"
        name="fanzone"
        value={formData.fanzone}
        onChange={handleChange}
        required
      >
        <option value="" disabled>
          Select FanZone
        </option>
        {fanZones.map((fz) => (
          <option key={fz.id} value={fz.id}>
            {fz.name}
          </option>
        ))}
      </select>

      <label htmlFor="image">Image</label>
      <input
        id="image"
        type="file"
        name="image"
        accept="image/*"
        onChange={handleFileChange}
        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc' }}
      />

      <button type="submit">{submitLabel}</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default EventForm;
