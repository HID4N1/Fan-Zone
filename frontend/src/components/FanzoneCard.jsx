import * as React from 'react';
import './FanzoneCard.css';

const FanzoneCard = ({ key, imageUrl, title, description, location, buttonText = "Learn More" }) => {
    return (
      <div className="card">
        {imageUrl && <img src={imageUrl} alt={title} className="card-image" />}
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <p className="card-location">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="location-icon"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {location}
        </p>         
 <button className="card-button">{buttonText}</button>
        </div>
      </div>
    );
  };
  
  export default FanzoneCard;