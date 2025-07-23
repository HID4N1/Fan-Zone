import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import fetchRouteData from "../components/fetchRouteData";
import api from "../services/api";
import "./TransportRoute.css";
import UserCurrentStation from "../components/userCurrentStation";

const TransportRoute = () => {
  useEffect(() => {
    document.title = "CFW | Transport Route";
  }, []);
  const location = useLocation();
  const eventId = location.state?.eventId ?? null;
  const userStationFromPrev = location.state?.userStation ?? null;

  const [eventDetails, setEventDetails] = useState(null);
  const [destinationStation, setDestinationStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fix userStation to ensure it has id and other required fields
  const [userStation, setUserStation] = useState(() => {
    if (userStationFromPrev && userStationFromPrev.id) {
      return userStationFromPrev;
    }
    // If userStationFromPrev does not have id, try to map fields
    if (userStationFromPrev && userStationFromPrev.station_name && userStationFromPrev.line_name) {
      return {
        id: userStationFromPrev.id || undefined,
        station_name: userStationFromPrev.station_name,
        line_name: userStationFromPrev.line_name,
      };
    }
    return null;
  });


// fetch the route data based on userStation and destinationStation
const [routeData, setRouteData] = useState(null);
const [loadingRoute, setLoadingRoute] = useState(false);
const [routeError, setRouteError] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      if (!userStation || !destinationStation || !eventId) {
        setRouteError("Missing user station, destination station, or event ID.");
        return;
      }

      setLoadingRoute(true);
      setRouteError(null);

      try {
        // Send POST request to create/get the route
        const response = await api.post("/routes/", {
          user_station_id: userStation.id,           // If you don't have id, use user_station_name
          user_station_name: userStation.station_name,
          destination_station_id: destinationStation.id,
          event_id: eventId,
        });

        setRouteData(response.data.full_route); // assuming full_route is returned
      } catch (error) {
        console.error("Failed to fetch route:", error);
        setRouteError("Failed to fetch route data.");
      } finally {
        setLoadingRoute(false);
      }
    };

    fetchRoute();
  }, [userStation, destinationStation, eventId]);


  // Fetch event details by eventId (knakhdo mnha nearst fanzone station)
  useEffect(() => {
    if (!eventId) {
      console.error("Event ID is missing.");
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      try {
        console.log(`Fetching event details for event ID: ${eventId}`);
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'}/api/public-events/${eventId}/`
        );

        if (!response.ok) {
          console.error(`Failed to fetch event details. Status: ${response.status}`);
          const errorText = await response.text();
          console.error(`Error response: ${errorText}`);
          setError("Failed to fetch event details.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Fetched event details:", data);

        setEventDetails(data);
        if (data.fanzone && data.fanzone.Nearest_Fanzone_station) {
          setDestinationStation(data.fanzone.Nearest_Fanzone_station);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event details:", error);
        setError("Error fetching event details.");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  return (
  <div className="transport-route-container">

    <div className="image-overlay-container">
        <img
          src="../assets/images/tramway_2.jpeg"
          alt="Transport Route Banner"
          className="banner-image"
        />
        <div className="overlay">
        <h1 className="overlay-text">Transport Route</h1>
    </div>
  
  </div>
  

  {loading && <p>Loading event details...</p>}
  {error && <p className="error-text">{error}</p>}

  {!loading && !error && (
    <>
      {/* stations (depart-arrivee) */}
      <div className="section">

      <div className="departure-station">
            <h2>
              <span className="station-icon"></span>
              Departure Station
            </h2>
            {userStation ? (
              <div className="station-info">
                <p className="station-name">
                  <strong>{userStation.station_name}</strong>
                </p>
                <p className="station-line">
                  Line: <span>{userStation.line_name}</span>
                </p>
              </div>
            ) : (
              <p className="station-not-found">
                <i className="icon-warning"></i> No station found near your location
              </p>
            )}
        </div>


        <div className="destination-station">
            <h2>
              <span className="station-icon"></span>
              Destination Station
            </h2>
            {destinationStation ? (
              <div className="station-info ">
                <p className="station-name">
                  <strong>{destinationStation.name}</strong>
                </p>
                <p className="station-line">
                  Line: <span>{destinationStation.line_name}</span>
                </p>
              </div>
            ) : (
              <p className="station-not-found">
                <i className="icon-warning"></i> No destination station found for this event
              </p>
            )}
        </div>

      </div>
      {/* route */}
      <div className="section-1">

       <div className="live-tracking">

        {routeData && routeData.length > 0 && (
            <UserCurrentStation
              routeData={routeData}
              onArrival={(station) => {
                console.log("User arrived at:", station.name);
              }}
            />
          )}
       </div>

       
       
       {/* <div className="full-route">
          {routeData ? (
            <ul className="route-list">
              {routeData.map((station, index) => (
                <li
                  key={`${station.id}-${index}`}
                  className="route-item"
                  style={{ backgroundColor: station.line.color }}
                >
                  {station.name} — ({station.line.name})
                </li>
              ))}
            </ul>
          ) : (
            <p>Route not available yet.</p>
          )}
        </div> */}



      </div>
    </>
  )}
</div>


    
  );
};

export default TransportRoute;
