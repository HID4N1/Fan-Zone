import React from "react";
import "../pages/Tickets.css";

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{marginRight: 8, minWidth: 20}} xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#FF8C00" fillOpacity="0.12"/>
    <path d="M6 10.5L9 13.5L14 8.5" stroke="#FF8C00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TicketCardPremium = ({ title, price, icon, details, color, badge, image, description, onClick, isUnitary }) => (
  <div className={`ticket-card-premium glass-card ${isUnitary ? 'unitary' : ''}`} style={{ borderTop: `5px solid ${color}` }} tabIndex={0} onClick={onClick}>
    <div className="ticket-card-header" style={{display: 'none'}}></div>
    {image && (
      <div className="ticket-card-img-wrapper">
        <img src={image} alt={title} className="ticket-card-img" />
        <div className="ticket-img-overlay-title" style={{ color: '#fff', background: 'transparent', left: 0, top: 0, border: 'none' }}>{badge}</div>
      </div>
    )}
    {/* Icône centrale supprimée */}
    <h3 className="ticket-title">{title}</h3>
    {description && <div className="ticket-desc">{description} <span className="ticket-desc-price">{price}</span></div>}
    <ul className="ticket-details-list">
      {details.map((d, i) => (
        <li key={i} className="ticket-detail-item">
          <CheckIcon />
          <span>{d}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default TicketCardPremium;