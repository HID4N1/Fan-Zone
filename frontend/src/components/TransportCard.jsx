import React from 'react';
import './TransportCard.css';

const TransportCard = ({ transportType, station, isRecommended, onClick }) => {
  return (
    <div
      className={'transport-card' + (isRecommended ? ' bold' : '')}
      style={{
        backgroundImage: transportType.toLowerCase() === 'tram'
          ? 'url(/assets/images/tramway_1.jpg)'
          : transportType.toLowerCase() === 'bus'
          ? 'url(/assets/images/busway_1.jpeg)'
          : `url(/assets/images/${transportType.toLowerCase()}.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      onClick={onClick}
      role="button"
      tabIndex={0} 
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      {isRecommended && <div className="recommended-badge">Recommended</div>}
      <div className="card-info">
        <h3>{transportType.toUpperCase()}</h3>
        <p>Station: {station.station_name}</p>
        <p>Line: {station.line_name}</p>
        <p>Walking time: {station.walking_time_minutes} minutes</p>
        <p>Distance: {station.distance_km * 1000} meters</p>
      </div>
    </div>
  );
};

export default TransportCard;
