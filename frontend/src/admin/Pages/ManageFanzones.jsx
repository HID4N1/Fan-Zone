import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import "./ManageFanzones.css";

const ManageFanzones = () => {
  const [fanzones, setFanzones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFanzones();
  }, []);

  const fetchFanzones = async () => {
    try {
      setLoading(true);
      const response = await api.get("fanzones/");
      console.log("Fetched fanzones data:", response.data);
      setFanzones(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch fanzones.");
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/fanzones/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fanzone?")) {
      try {
        await api.delete(`fanzones/${id}/`);
        setFanzones(fanzones.filter((fanzone) => fanzone.id !== id));
      } catch (err) {
        alert("Failed to delete fanzone.");
      }
    }
  };

  if (loading) {
    return <p>Loading fanzones...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="manage-fanzones-container">
      <h2>Manage Fanzones</h2>
      <button
        onClick={() => navigate("/admin/fanzones/create")}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          padding: "10px 18px",
          fontSize: "1rem",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Create FanZone
      </button>
      <table className="fanzones-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Adresse</th>
            <th>Nearest Station</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fanzones.map((fanzone) => (
            <tr key={fanzone.id}>
              <td>{fanzone.id}</td>
              <td>{fanzone.name}</td>
              <td>{fanzone.adresse}</td>
              <td>{fanzone.Nearest_Fanzone_station ? `${fanzone.Nearest_Fanzone_station.name} (${fanzone.Nearest_Fanzone_station.line_name})` : ''}</td>
              <td>
                {fanzone.image ? (
                  <img
                    src={fanzone.image.startsWith('http') ? fanzone.image : `http://127.0.0.1:8000${fanzone.image}`}
                    alt={fanzone.name}
                    className="fanzone-image"
                    style={{ width: "100px", height: "auto" }}
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>
                <button onClick={() => handleEdit(fanzone.id)}>Edit</button>
                <button onClick={() => handleDelete(fanzone.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {fanzones.length === 0 && (
            <tr>
              <td colSpan="5">No fanzones found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageFanzones;
