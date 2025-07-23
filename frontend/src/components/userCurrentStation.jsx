import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import WatchPosition from "./watchPosition"; 
import NotificationForm from "./NotificationForm";
import "../pages/TransportRoute.css"; // Import CSS for styling

const UserCurrentStation = ({ routeData = [], onArrival = () => {} }) => {
  const navigate = useNavigate();
  // console.log("UserCurrentStation routeData prop:", routeData);
  const [currentCoords, setCurrentCoords] = useState(null);
  const [currentStationIndex, setCurrentStationIndex] = useState(null);
  const [arrivedStationId, setArrivedStationId] = useState(null);
  const [showEndStationPopup, setShowEndStationPopup] = useState(false);
  const [showtransferStationPopup, setShowTransferStationPopup] = useState(false);

  // Auto detect transfer station: first station where line or transport_type changes
  const detectTransferStationId = () => {
    for (let i = 1; i < routeData.length; i++) {
      const prev = routeData[i - 1];
      const curr = routeData[i];
      // console.log(`Comparing stations ${prev.id} and ${curr.id}: line ${prev.line.id} vs ${curr.line.id}, transport_type ${prev.transport_type} vs ${curr.transport_type}`);
      if (
        prev.line.id !== curr.line.id ||
        prev.transport_type !== curr.transport_type
      ) {
        // console.log(`Transfer station detected at station id: ${prev.id}, station name: ${prev.name}`);
        return prev.id;
      }
    }
    return null;
  };

  // Auto detect end station: last station in routeData
  const detectEndStationId = () => {
    // console.log("Detecting end station ID from routeData length:", routeData.length);
    return routeData.length > 0 ? routeData[routeData.length - 1].id : null;
  };
  
  const transferStationId = detectTransferStationId();
  // console.log("Detected transferStationId:", transferStationId);
  const endStationId = detectEndStationId();

  // Receive location updates from watchPosition component
  const handlePositionUpdate = (coords) => {
    // console.log("handlePositionUpdate called with coords:", coords);
    setCurrentCoords({ lat: coords.lat, lng: coords.lng });
  };

  // Validate coordinates are numbers
  const isValidCoord = (val) => typeof val === 'number' && !isNaN(val);

  // Haversine distance calculation (meters)
  const getDistanceFromLatLng = (lat1, lng1, lat2, lng2) => {
    if (![lat1, lng1, lat2, lng2].every(isValidCoord)) {
      console.error("Invalid coordinates for distance calculation:", lat1, lng1, lat2, lng2);
      return NaN;
    }
    const R = 6371e3; // meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // On location update, find nearest station within threshold (e.g. 50m)
  useEffect(() => {
    // console.log("useEffect triggered with currentCoords and routeData");
    if (!currentCoords || routeData.length === 0) return;

    // console.log("Current Coords:", currentCoords);
    // console.log("Route Data:", routeData);

    let nearestIndex = null;
    let minDist = Infinity;
    const thresholdMeters = 50;

    routeData.forEach((station, index) => {
      // console.log("Station data:", station);
      // console.log("Current Coords lat:", currentCoords.lat, "lng:", currentCoords.lng);
      const dist = getDistanceFromLatLng(
        currentCoords.lat,
        currentCoords.lng,
        parseFloat(station.latitude),
        parseFloat(station.longitude)
      );
      // console.log(`Distance to station ${station.name}: ${dist} meters`);
      if (dist < thresholdMeters && dist < minDist) {
        minDist = dist;
        nearestIndex = index;
      }
    });

    if (nearestIndex !== currentStationIndex) {
      if (nearestIndex === null) {
        console.log("User moved away from all stations");
        setCurrentStationIndex(null);
        setArrivedStationId(null);
      } else {
        console.log(`Nearest station index: ${nearestIndex}, distance: ${minDist}`);
        setCurrentStationIndex(nearestIndex);
        const arrivedStation = routeData[nearestIndex];
        console.log("Current arrivedStationId state:", arrivedStationId, "New arrivedStation.id:", arrivedStation.id);
        if (arrivedStation.id !== arrivedStationId) {
          setArrivedStationId(arrivedStation.id);
          onArrival(arrivedStation);

          // console.log("Arrived at station id:", arrivedStation.id, "type:", typeof arrivedStation.id);
          // console.log("Transfer station id:", transferStationId, "type:", typeof transferStationId);
          if (String(arrivedStation.id) === String(transferStationId)) {
            // console.log("Showing transfer station popup");
            setShowTransferStationPopup(true);
          } else {
            console.log("Not transfer station");
          }
          console.log("End station id:", endStationId, "type:", typeof endStationId);
          if (String(arrivedStation.id) === String(endStationId)) {
            // console.log("Showing end station popup");
            setShowEndStationPopup(true);
          } else {
            console.log("Not end station");
          }
        }
      }
    }
  }, [
    currentCoords,
    routeData,
    currentStationIndex,
    arrivedStationId,
    transferStationId,
    endStationId,
    onArrival,
  ]);

  const currentStation = routeData[currentStationIndex] || null;
  const nextStation =
    currentStationIndex !== null && currentStationIndex + 1 < routeData.length
      ? routeData[currentStationIndex + 1]
      : null;

  // retrieve all the next stations
  const nextStations = routeData.slice(currentStationIndex + 1);


  return (
    <div className="user-current-station">
      <WatchPosition onLocationDetected={handlePositionUpdate} onError={(error) => { console.error("Geolocation error:", error); }} />

      <h3>Station :</h3>
      
      <div className="station-info-container">
          {currentStation ? (
            <div className="current-station fade-in ">
              <p>
                {currentStation.name} <span className="line-info">
                  <br />(Line: {currentStation.line.name})</span>
              </p>
            </div>
          ) : (
            <p className="in-transit">In Your Way</p>
          )}

          {/* {nextStation && (
            <div className="next-station">
              <p>
                {nextStation.name} <span className="line-info">(Line: {nextStation.line.name})</span>
              </p>
            </div>
          )} */}
      {nextStations.length > 0 && (
          <div className="next-stations">
            <ul className="next-stations-list">
              {nextStations.map((station, index) => (
                <li
                  key={index}
                  className="next-station-item ">
                  <span className="station-text">
                    {station.name} <span className="line-info">
                      <br /> (Line: {station.line.name})</span>
                  </span>
                  <span
                    className="line-bar"
                    style={{ backgroundColor: station.line.color }}
                  ></span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </div>


      {showtransferStationPopup && (
        <NotificationForm
          message={
            <>
              You’ve arrived at a transfer station: <strong>{currentStation.name}</strong> (you need to change lines here).<br />
              Your next station is: <strong>{nextStation ? nextStation.name : "unknown"}</strong>.
            </>
          }
          onClose={() => setShowTransferStationPopup(false)}
          style={{ backgroundColor: "#28a745", color: "white" }}
        />
      )}

      {showEndStationPopup && (
        <NotificationForm
          message={
            <>
              You’ve arrived at the final destination: <strong>{currentStation.name}</strong>.
            </>
          }
          onClose={() => { 
            setShowEndStationPopup(false)
            navigate("/fanzone-detect");
          }}
          onClick={() => {
            setShowEndStationPopup(false);
            navigate("/fanzone-detect");
          }}
          style={{ backgroundColor: "#007bff", color: "white" }}
        />
      )}
    </div>
  );
};

export default UserCurrentStation;
