import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './Home.css';
import events from '../data/events';
import QRCodeScanner from '../components/QRCodeScanner';

const backgroundImage = process.env.PUBLIC_URL + '/assets/images/Fanzone_1.jpg';

const Home = () => {
  const [activeTab, setActiveTab] = useState('scan');
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState('');

// data hiya l event/eventID  link dyal l event
  const handleScan = data => {
    setScanResult(data);
    setShowScanner(false);
    // redirected to the url scanned
    const eventId = data.split('/').pop(); // Assuming the URL ends with the event ID
    if (eventId) {
      const event = events.find(e => e.id === eventId);
      if (event) {
        // Redirect to the event details page
        navigate(`/event/${eventId}`);
      } else {
        alert('Event not found for the scanned QR code.');
      }
    }
    else {
      alert('Invalid QR code scanned.');
    }
    
   
  };

  const handleError = err => {
    let message = 'Erreur inconnue';
    if (err?.message) message = err.message;
    else if (typeof err === 'string') message = err;
    else try { message = JSON.stringify(err); } catch {}
    alert('Camera error: ' + message + '\n\nVérifie que la caméra est autorisée, non utilisée ailleurs, et bien branchée.');
    setShowScanner(false);
  };
  const navigate = useNavigate();
  const goToFanZone = () => {
    navigate('/fanzone');
  };

  return (
    <div className="home-container">
      <div className="home-banner" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="overlay" />
        <div className="banner-content">
          <h1>Get to the Action</h1>
          <p>Find the fastest routes to all your
            <br />
          favorite sporting events</p>
          <button onClick={goToFanZone}>Explore FanZone</button>
        </div>
      </div>

      <div className="scan-title">
        <h2>Scan and enjoy your FanZone</h2>
      </div>

      <div className="scan-box">
        <div className="tab-bar">
          <div
            className={`tab ${activeTab === 'scan' ? 'active' : ''}`}
            onClick={() => { setActiveTab('scan');
            }}>

            <svg className="icon" viewBox="0 -0.09 122.88 122.88" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{width: '22px', height: '22px'}}>
              <g>
                <path fillRule="evenodd" clipRule="evenodd" d="M0.18,0h44.63v44.45H0.18V0L0.18,0z M111.5,111.5h11.38v11.2H111.5V111.5L111.5,111.5z M89.63,111.48h11.38 v10.67H89.63h-0.01H78.25v-21.82h11.02V89.27h11.21V67.22h11.38v10.84h10.84v11.2h-10.84v11.2h-11.21h-0.17H89.63V111.48 L89.63,111.48z M55.84,89.09h11.02v-11.2H56.2v-11.2h10.66v-11.2H56.02v11.2H44.63v-11.2h11.2V22.23h11.38v33.25h11.02v11.2h10.84 v-11.2h11.38v11.2H89.63v11.2H78.25v22.05H67.22v22.23H55.84V89.09L55.84,89.09z M111.31,55.48h11.38v11.2h-11.38V55.48 L111.31,55.48z M22.41,55.48h11.38v11.2H22.41V55.48L22.41,55.48z M0.18,55.48h11.38v11.2H0.18V55.48L0.18,55.48z M55.84,0h11.38 v11.2H55.84V0L55.84,0z M0,78.06h44.63v44.45H0V78.06L0,78.06z M10.84,88.86h22.95v22.86H10.84V88.86L10.84,88.86z M78.06,0h44.63 v44.45H78.06V0L78.06,0z M88.91,10.8h22.95v22.86H88.91V10.8L88.91,10.8z M11.02,10.8h22.95v22.86H11.02V10.8L11.02,10.8z"/>
              </g>
            </svg>
            Scan QR Code
          </div>
          <div
            className={`tab ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => { setActiveTab('manual');  }}>

            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" style={{width: '22px', height: '22px'}}>
              <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"/>
            </svg>
            Enter Manually
          </div>
        </div>

        {activeTab === 'scan' && (
          <>
            <div className="scanner-button">
              {!showScanner ? (
                <button onClick={() => setShowScanner(true)}>
                <svg className="icon" viewBox="0 -0.09 122.88 122.88" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{width: '22px', height: '22px'}}>
                    <g>
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.18,0h44.63v44.45H0.18V0L0.18,0z M111.5,111.5h11.38v11.2H111.5V111.5L111.5,111.5z M89.63,111.48h11.38 v10.67H89.63h-0.01H78.25v-21.82h11.02V89.27h11.21V67.22h11.38v10.84h10.84v11.2h-10.84v11.2h-11.21h-0.17H89.63V111.48 L89.63,111.48z M55.84,89.09h11.02v-11.2H56.2v-11.2h10.66v-11.2H56.02v11.2H44.63v-11.2h11.2V22.23h11.38v33.25h11.02v11.2h10.84 v-11.2h11.38v11.2H89.63v11.2H78.25v22.05H67.22v22.23H55.84V89.09L55.84,89.09z M111.31,55.48h11.38v11.2h-11.38V55.48 L111.31,55.48z M22.41,55.48h11.38v11.2H22.41V55.48L22.41,55.48z M0.18,55.48h11.38v11.2H0.18V55.48L0.18,55.48z M55.84,0h11.38 v11.2H55.84V0L55.84,0z M0,78.06h44.63v44.45H0V78.06L0,78.06z M10.84,88.86h22.95v22.86H10.84V88.86L10.84,88.86z M78.06,0h44.63 v44.45H78.06V0L78.06,0z M88.91,10.8h22.95v22.86H88.91V10.8L88.91,10.8z M11.02,10.8h22.95v22.86H11.02V10.8L11.02,10.8z"/>
                    </g>
                </svg>                  
                Open Camera to Scan
                </button>
              ) : (
                <QRCodeScanner onScan={handleScan} onError={handleError} onClose={() => setShowScanner(false)} />
              )}
            </div>
            {scanResult && <div className="scan-result">QR Code: {scanResult}</div>}
            <div className="scanner-info">Quickly access route information by scanning the QR code at any fan zone or event venue.</div>
          </>
        )}

        {activeTab === 'manual' && (
          <>
            <div className="manual-search">
              <input type="text" placeholder="Search for events or FanZones..." />
              <button>
                <svg className="icon" viewBox="0 0 192.906 192.906" xmlns="http://www.w3.org/2000/svg" style={{width: '22px', height: '22px', fill: 'currentColor'}}>
                  <g>
                    <path d="M190.709,180.102l-47.08-47.076c11.702-14.072,18.752-32.142,18.752-51.831c0-44.77-36.421-81.193-81.188-81.193
                      C36.423,0.001,0,36.424,0,81.194c0,44.767,36.423,81.188,81.193,81.188c19.688,0,37.758-7.049,51.829-18.75l47.081,47.077
                      c1.464,1.464,3.384,2.196,5.303,2.196c1.919,0,3.839-0.732,5.304-2.197C193.639,187.779,193.639,183.031,190.709,180.102z
                      M15,81.194c0-36.499,29.694-66.193,66.193-66.193c36.496,0,66.188,29.694,66.188,66.193c0,36.496-29.691,66.188-66.188,66.188
                      C44.694,147.382,15,117.69,15,81.194z"/>
                    <path d="M81.186,41.989c-15.79,0-28.637,12.845-28.637,28.634c0,23.968,22.381,46.622,23.334,47.575
                      c1.464,1.464,3.383,2.196,5.303,2.196c1.919,0,3.838-0.732,5.302-2.195c0.953-0.953,23.345-23.607,23.345-47.576
                      C109.832,54.835,96.981,41.989,81.186,41.989z M81.168,101.497c-6.045-7.682-13.619-19.864-13.619-30.873
                      c0-7.518,6.117-13.634,13.637-13.634c7.524,0,13.646,6.116,13.646,13.634C94.832,82.233,86.776,94.419,81.168,101.497z"/>
                  </g>
                </svg>
              Find Routes
              </button>
            </div>
          </>
        )}
      </div>


    <div className="event-list">
          <h2>Upcoming Events</h2>
          {events.map((event, idx) => (
            <div key={idx} className="event-item">
              <div className="event-details">
                <strong>{event.name}</strong>
                <p>📍 {event.location}</p>
                <p>📅 {event.date}</p>
              </div>
              <button onClick={() => navigate(`/event/${event.id}`)}>
                📍 Route</button>
            </div>
          ))}
    </div>
    </div>
  );
};

export default Home;
