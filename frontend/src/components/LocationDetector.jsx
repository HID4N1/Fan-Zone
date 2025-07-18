import { useEffect } from 'react';

const LocationDetector = ({ onLocationDetected, onError }) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      pos => {
        console.log('LocationDetector: position obtained', pos);
        const { latitude, longitude } = pos.coords;
        onLocationDetected({ lat: latitude, lng: longitude });
      },
      err => {
        console.error('LocationDetector: error obtaining position', err);
        onError(err.message);
      },
      { enableHighAccuracy: true }
    );

  }, [onLocationDetected, onError]);

  return null; 
};

export default LocationDetector;
