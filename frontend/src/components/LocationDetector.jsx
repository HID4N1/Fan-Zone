import { useEffect } from 'react';

const LocationDetector = ({ onLocationDetected, onError }) => {
  useEffect(() => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      pos => {
        const { latitude, longitude } = pos.coords;
        onLocationDetected({ lat: latitude, lng: longitude });
      },
      err => onError(err.message),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [onLocationDetected, onError]);

  return null; 
};

export default LocationDetector;
