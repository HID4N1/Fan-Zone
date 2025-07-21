import React from "react";
import { useLocation } from "react-router-dom";

const TransportRoute = () => {
  const location = useLocation();
  const eventId = location.state?.eventId ?? null;

  return (
    <div>
      <h1>Transport Route</h1>
      <p>This page will display the transport route.</p>
      {eventId && <p>Event ID: {eventId}</p>}
    </div>
  );
}

export default TransportRoute;
