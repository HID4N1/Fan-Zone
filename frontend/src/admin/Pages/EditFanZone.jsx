import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import FanzoneForm from "../components/FanzoneForm";
import "./EditFanZone.css"; 

const EditFanZone = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFanzone = async () => {
      try {
        setLoading(true);
        const response = await api.get(`fanzones/${id}/`);
        setInitialData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch fanzone data.");
        setLoading(false);
      }
    };
    fetchFanzone();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await api.patch(`fanzones/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/admin/fanzones");
    } catch (err) {
      console.error("Update fanzone error:", err);
      alert("Failed to update fanzone.");
    }
  };

  if (loading) {
    return <p>Loading fanzone data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="edit-fanzone-container">
      <h2>Edit FanZone</h2>
      <FanzoneForm 
      initialData={initialData} 
      onSubmit={handleSubmit} 
      isEdit={true} />
    </div>
  );
};

export default EditFanZone;
