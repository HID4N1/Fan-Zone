import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import events from '../data/events'; 

const EventQRGenerator = () => {

const EventQRGenerator = () => {
  // Crée une référence pour chaque QR
  const qrRefs = useRef({});

  // Fonction de téléchargement QR fiable
  const handleDownloadQR = (event) => {
    const svg = qrRefs.current[event.id];
    if (!svg) return;
    const serializer = new window.XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const img = new window.Image();
    const svg64 = window.btoa(unescape(encodeURIComponent(svgString)));
    const image64 = 'data:image/svg+xml;base64,' + svg64;
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = 150;
      canvas.height = 150;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, 150, 150);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngFile;
      downloadLink.download = `${event.name.replace(/\s+/g, '_')}_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    img.src = image64;
  };
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