import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import events from '../data/events'; 

const EventQRGenerator = () => {

const EventQRGenerator = () => {
  // Crée une référence pour chaque QR
  const qrRefs = useRef({});


}
  return (
    <div className="qr-generator">
      <h2>Event QR Codes</h2>
      <div className="qr-codes-container">
        {events.map(event => (
          <div key={event.id} className="qr-card">
            <h3>{event.name}</h3>
            <p>{event.location}</p>
            
            <div className="qr-code-wrapper">
              <QRCodeSVG 


                ref={el => qrRefs.current[event.id] = el}

                value={`${window.location.origin}/event/${event.id}`}
                size={150}
                level="H"
                includeMargin={true}
              />
            </div>

            <button onClick={() => handleDownloadQR(event)} style={{ marginTop: 10, background: '#333', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 4, fontSize: '1rem', cursor: 'pointer' }}>Download QR</button>
            
            <div className="event-meta">
              <p>📅 {event.date} at {event.time}</p>
              <a 
                href={`${window.location.origin}/event/${event.id}`}
                className="qr-link"
              >
                {window.location.host}/event/{event.id}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventQRGenerator;